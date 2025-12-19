import { Injectable, OnInit, EventEmitter } from '@angular/core';
import {
  and,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  onSnapshot,
  doc,
  Firestore,
  or,
  query,
  orderBy,
  setDoc,
  updateDoc,
  where,
  DocumentData,
  Timestamp,
} from '@angular/fire/firestore';
import {
  Camera,
  CameraResultType,
  CameraSource,
  Photo,
} from '@capacitor/camera';
import {
  Storage,
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from '@angular/fire/storage';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  private _usuarioActual: DocumentData | undefined;
  private _pedidoActual$ = new BehaviorSubject<any>(null);

  get pedido$() {
    return this._pedidoActual$.asObservable();
  }

  obsPedido(coleccion: string, uid: string) {
    return onSnapshot(doc(this.firestore, coleccion, uid), (doc) => {
      this._pedidoActual$.next(doc.data());
    });
}

  unsub: any;

  onSignOut: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private firestore: Firestore,
    private storage: Storage,
    private http: HttpClient,
    private loadingCtrl: LoadingController
  ) {}

  checkUser() {
    if (localStorage.getItem('user') !== null) {
      this.showLoading().then(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user.esAnonimo) {
          this.obsUsuario('usuariosAnonimos', user.uid);
        } else {
          this.obsUsuario('usuarios', user.uid);
        }
      });
      setTimeout(() => {
        this.loadingCtrl.dismiss();
      }, 5000);
    }
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Espere por favor...',
    });
    loading.present();
  }

  get usuario() {
    return this._usuarioActual;
  }

    get pedidoActual() {
    return this._pedidoActual$;
  }

  set usuario(user) {
    this._usuarioActual = user;
    //localStorage.setItem('user', JSON.stringify(user));
  }

  // Login Firestore
  async login(user: string, pass: string) {
    const colRef = collection(this.firestore, `usuarios`);
    const q = query(
      colRef,
      and(where('correo', '==', user), where('password', '==', pass))
    );
    return collectionData(q);
  }

  async obsUsuario(coleccion: string, uid: string) {
    this.unsub = onSnapshot(doc(this.firestore, coleccion, uid), (doc) => {
      this._usuarioActual = doc.data();
      //console.log('Current data: ', doc.data());
    });
  }

  // async obsPedido(coleccion: string, uid: string) {
  //   this.unsub = onSnapshot(doc(this.firestore, coleccion, uid), (doc) => {
  //     this._pedidoActual = doc.data();
  //     //console.log('Current data: ', doc.data());
  //   });
  // }

  verUsuario() {
    console.info(this._usuarioActual);
  }

  async logOut(uid: string) {
    if (!this.usuario['esAnonimo']) {
      const res = await this.updateToken(uid, '');
    }
    localStorage.removeItem('user');
    this.usuario = null;
    this.onSignOut.emit();
  }

  updateToken(uid: any, token: any) {
    const docRef = doc(this.firestore, `usuarios/${uid}`);
    return updateDoc(docRef, { token: token });
  }

  // ABM Firestore
  async guardarEnFirebase(elemento: any, coleccion: string): Promise<any> {
    let uidGenerada = this.generateUniqueFirestoreId();
    elemento.uid = uidGenerada;
    const docRef = doc(this.firestore, `${coleccion}/${elemento.uid}`);
    return setDoc(docRef, Object.assign({}, elemento), { merge: true });
  }

  async guardarEnFirebaseAnonimo(elemento: any): Promise<any> {
    const docRef = doc(this.firestore, `usuariosAnonimos/${elemento.uid}`);
    return setDoc(docRef, Object.assign({}, elemento), { merge: true });
  }

    async guardarPedidoEnFirebase(elemento: any): Promise<any> {
    const docRef = doc(this.firestore, `pedidos/${elemento.uid}`);
    return setDoc(docRef, Object.assign({}, elemento), { merge: true });
  }

    guardarEncuesta(elemento: any) {
    const elementoAGuardar = elemento;
    const userRef = collection(this.firestore, `encuestas`);
    return addDoc(userRef, elementoAGuardar);
  }

  async update(collection: string, elemento: any) {
    const docRef = doc(this.firestore, `${collection}/${elemento.uid}`);
    return updateDoc(docRef, elemento);
  }

  cambiarAcceso(uid: any, valor: string) {
    const docRef = doc(this.firestore, `usuarios/${uid}`);
    return updateDoc(docRef, { estado: valor });
  }

  traerColeccion(coleccion: string, queryFilter: any, order = null) {
    let q;
    const colRef = collection(this.firestore, `${coleccion}`);
    if (order !== null) {
      q = query(colRef, queryFilter, order);
    } else {
      q = query(colRef, queryFilter);
    }
    return collectionData(q);
  }

  traerTodosLosMensajes() { 
    const colRef = collection(this.firestore, 'mensajes');
    //return collectionData(colRef, { idField: 'id' });
    const q = query(colRef, orderBy('fechaLocal', 'asc'));
    return collectionData(q, { idField: 'id' });
    // const q = query(colRef, orderBy('fecha'));
    // return collectionData(q);
  }

    guardarMensaje(elementoAGuardar: any) {
    //const elementoAGuardar = elemento;
    const userRef = collection(this.firestore, 'mensajes');
    return addDoc(userRef, elementoAGuardar);
  }

  async borrar(collection: string, elemento: any) {
    const docRef = doc(this.firestore, `${collection}/${elemento.uid}`);
    return deleteDoc(docRef);
  }

  generateUniqueFirestoreId() {
    const chars =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let autoId = '';
    for (let i = 0; i < 20; i++) {
      autoId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return autoId;
  }

  // Storage

  async subirImagenes(file: any, folder: string, nombre: string) {
    let path = folder + '/' + nombre;
    const imageRef = ref(this.storage, path);
    //return await uploadBytesResumable(imageRef, file);
    return await uploadBytes(imageRef, file);
  }

  subirImagenEspecialidad(file: File, folder: string, nombre: string) {
    let path = 'especialidades' + '/' + folder + '/' + nombre;
    const imageRef = ref(this.storage, path);
    return uploadBytes(imageRef, file);
  }

  async traerImagen(folder: string, nombre: string) {
    let path = folder + '/' + nombre;
    const imageRef = ref(this.storage, path);
    return await getDownloadURL(imageRef);
  }

  //Camara
  async tomarFoto(): Promise<Photo> {
    return await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
      webUseInput: true,
    });
  }

  async readAsBase64(foto: Photo) {
    // Fetch the photo, read as a blob, then convert to base64 format
    const response = await fetch(foto.webPath!);
    return (await response.blob()) as File;
  }

  //http request mail
  enviarMail(mail: string, user: string, aceptacion: boolean) {
    //let url = 'https://cdmcomanda.adaptable.app/send-mail';
    let url = 'https://us-central1-pps-sp-b0c30.cloudfunctions.net/app/send-mail';

    let body = {
      aceptacion: aceptacion,
      nombreUsuario: user,
      mail: mail,
    };
    this.http
      .post<any>(url, body, {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json; charset=utf-8',
        },
      })
      .subscribe((data) => {
        console.info(data);
      });
  }
  //

  //http request push
  enviarPush(titulo: string, mensaje: string, token: string) {
    //let url = 'https://cdmcomanda.adaptable.app/send-mail';
    let url = 'https://us-central1-pps-sp-b0c30.cloudfunctions.net/app/notify';
    let body = {
      title: titulo,
      body: mensaje,
      token: token,
    };
    this.http.post<any>(url, body).subscribe((data) => {
      console.info(data);
    });
  }
  //
}
