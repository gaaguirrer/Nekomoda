import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { IUserRepository } from "@/domain/ports/IUserRepository";
import { User } from "@/domain/entities/User";
import { getFirestoreDB } from "./firebaseClient";

const COLLECTION_NAME = "users";

function docToUser(id: string, data: Record<string, unknown>): User {
  return {
    id,
    email: data.email as string | undefined,
    displayName: data.displayName as string | undefined,
    photoURL: data.photoURL as string | undefined,
    bio: data.bio as string | undefined,
    tasteProfile: data.tasteProfile as User["tasteProfile"],
    followerCount: (data.followerCount as number) ?? 0,
    followingCount: (data.followingCount as number) ?? 0,
    outfitCount: (data.outfitCount as number) ?? 0,
    createdAt: (data.createdAt as string) ?? "",
    lastActivity: (data.lastActivity as string) ?? "",
  };
}

export class FirestoreUserRepository implements IUserRepository {
  async getById(id: string): Promise<User | null> {
    try {
      const db = getFirestoreDB();
      const snap = await getDoc(doc(db, COLLECTION_NAME, id));
      if (!snap.exists()) return null;
      return docToUser(snap.id, snap.data() as Record<string, unknown>);
    } catch (e) {
      console.error(`FirestoreUserRepository.getById failed for id ${id}:`, e);
      return null;
    }
  }

  async getByEmail(email: string): Promise<User | null> {
    try {
      const db = getFirestoreDB();
      const q = query(collection(db, COLLECTION_NAME), where("email", "==", email));
      const snap = await getDocs(q);
      if (snap.empty) return null;
      return docToUser(snap.docs[0].id, snap.docs[0].data() as Record<string, unknown>);
    } catch (e) {
      console.error(`FirestoreUserRepository.getByEmail failed for email ${email}:`, e);
      return null;
    }
  }

  async getAll(): Promise<User[]> {
    try {
      const db = getFirestoreDB();
      const snap = await getDocs(collection(db, COLLECTION_NAME));
      return snap.docs.map(d => docToUser(d.id, d.data() as Record<string, unknown>));
    } catch (e) {
      console.error("FirestoreUserRepository.getAll failed:", e);
      return [];
    }
  }

  async save(user: User): Promise<void> {
    try {
      const db = getFirestoreDB();
      const { id, ...data } = user;
      await setDoc(doc(db, COLLECTION_NAME, id), {
        ...data,
        createdAt: data.createdAt ?? new Date().toISOString(),
        lastActivity: new Date().toISOString(),
      });
    } catch (e) {
      console.error(`FirestoreUserRepository.save failed for user ${user.id}:`, e);
    }
  }

  async update(id: string, data: Partial<User>): Promise<void> {
    try {
      const db = getFirestoreDB();
      await updateDoc(doc(db, COLLECTION_NAME, id), {
        ...data,
        lastActivity: new Date().toISOString(),
      });
    } catch (e) {
      console.error(`FirestoreUserRepository.update failed for user ${id}:`, e);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const db = getFirestoreDB();
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (e) {
      console.error(`FirestoreUserRepository.delete failed for user ${id}:`, e);
    }
  }
}
