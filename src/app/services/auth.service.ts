import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';

export interface UserProfile {
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
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


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private firestore = inject(Firestore);
  private storage = inject(Storage);

  async signUp(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }

  async updateUserProfile(uid: string, profile: UserProfile) {
    const userDocRef = doc(this.firestore, `users/${uid}`);
    return setDoc(userDocRef, profile);
  }

  async uploadProfilePicture(uid: string, file: File): Promise<string> {
    const filePath = `profile-pictures/${uid}`;
    const storageRef = ref(this.storage, filePath);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  }
}
