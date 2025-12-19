import { Injectable } from '@angular/core';
import {
  and,
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  or,
  query,
  orderBy,
  setDoc,
  updateDoc,
  where,
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
  uploadBytesResumable
} from '@angular/fire/storage';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  constructor(
    private firestore: Firestore,
    private storage: Storage,
    private http: HttpClient
  ) {}

  // Login Firestore
  async login(user: string, pass: string) {
    const colRef = collection(this.firestore, `usuarios`);
    const q = query(colRef, and(where("correo", "==", user),where("password", "==", pass)));
    return collectionData(q);
  }

  // ABM Firestore
  async guardarEnFirebase(elemento: any, coleccion: string): Promise<any> {
    let uidGenerada = this.generateUniqueFirestoreId();
    elemento.uid = uidGenerada;
    const docRef = doc(this.firestore, `${coleccion}/${elemento.uid}`);
    return setDoc(docRef, Object.assign({}, elemento), { merge: true });
  }

  async update(collection: string, elemento: any) {
    const docRef = doc(this.firestore, `${collection}/${elemento.uid}`);
    return updateDoc(docRef, elemento);
  }

  traerColeccion(coleccion: string, queryFilter: any) {
    const colRef = collection(this.firestore, `${coleccion}`);
    const q = query(colRef, queryFilter);
    return collectionData(q);
  }

  async borrar(collection: string, elemento: any) {
    const docRef = doc(this.firestore, `${collection}/${elemento.uid}`);
    return deleteDoc(docRef);
  }

  generateUniqueFirestoreId() {
    // Simulo una UID como las de Firebase
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
  enviarPush(titulo:string,mensaje:string, token:string) {
    //let url = 'https://cdmcomanda.adaptable.app/send-mail';
    let url = 'https://us-central1-pps-sp-b0c30.cloudfunctions.net/app/notify';
    let body = {
      title: titulo,
      body: mensaje,
      token: token
    };
    this.http
      .post<any>(url, body)
      .subscribe((data) => {
        console.info(data);
      });
  }

  
  enviarPushRol(titulo:string,mensaje:string, rol:string) {
    //let url = 'https://cdmcomanda.adaptable.app/send-mail';
    let url = 'https://us-central1-pps-sp-b0c30.cloudfunctions.net/app/notify-role';
    let body = {
      title: titulo,
      body: mensaje,
      role: rol
    };
    this.http
      .post<any>(url, body)
      .subscribe((data) => {
        console.info(data);
      });
  }
  //
}
