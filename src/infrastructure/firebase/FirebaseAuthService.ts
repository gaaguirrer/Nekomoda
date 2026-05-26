import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { IAuthService, AuthUser } from "@/domain/ports/IAuthService";
import { getFirebaseAuth } from "./firebaseClient";

function mapFirebaseUser(u: FirebaseUser): AuthUser {
  return {
    uid: u.uid,
    email: u.email,
    displayName: u.displayName,
    photoURL: u.photoURL,
  };
}

export class FirebaseAuthService implements IAuthService {
  async register(email: string, password: string, displayName: string): Promise<AuthUser> {
    const auth = getFirebaseAuth();
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName });
    return mapFirebaseUser(cred.user);
  }

  async login(email: string, password: string): Promise<AuthUser> {
    const auth = getFirebaseAuth();
    const cred = await signInWithEmailAndPassword(auth, email, password);
    return mapFirebaseUser(cred.user);
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    const auth = getFirebaseAuth();
    return new Promise(resolve => {
      const unsub = onAuthStateChanged(auth, user => {
        unsub();
        resolve(user ? mapFirebaseUser(user) : null);
      });
    });
  }

  async logout(): Promise<void> {
    const auth = getFirebaseAuth();
    await signOut(auth);
  }
}
