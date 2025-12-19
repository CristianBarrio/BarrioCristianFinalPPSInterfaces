import { Injectable, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user.model';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(
    private auth: AngularFireAuth,
    private firestore: AngularFirestore,
    private utilsSvc: UtilsService
  ) {}

  onSignOut: EventEmitter<void> = new EventEmitter<void>();

  async signIn(user: User): Promise<void> {
    try {
      const credential = await this.auth.signInWithEmailAndPassword(
        user.email,
        user.password
      );
      console.log('User signed in:', credential.user);
    } catch (error) {
      console.error('Sign-in error:', error);
      throw error;
    }
  }

  async signUp(user: User): Promise<void> {
    try {
      const credential = await this.auth.createUserWithEmailAndPassword(
        user.email,
        user.password
      );
      console.log('User signed up:', credential.user);
    } catch (error) {
      console.error('Sign-up error:', error);
      throw error;
    }
  }

  async updateUser(displayName: string): Promise<void> {
    const currentUser = await this.auth.currentUser;
    if (currentUser) {
      await currentUser.updateProfile({ displayName });
      console.log('User profile updated');
    }
  }

  async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
      localStorage.removeItem('user');
      this.utilsSvc.routerLink('/auth');
      this.onSignOut.emit(); 
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  }

  async setDocument(path: string, data: any): Promise<void> {
    try {
      await this.firestore.doc(path).set(data);
      console.log('Document set at path:', path);
    } catch (error) {
      console.error('Error setting document:', error);
      throw error;
    }
  }
}
