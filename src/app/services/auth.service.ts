import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

export interface UserProfile {
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);

  async signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async updateUserProfile(uid: string, profile: UserProfile) {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return setDoc(userDocRef, profile);
  }
}
