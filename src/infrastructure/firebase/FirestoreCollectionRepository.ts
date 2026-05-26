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
  orderBy,
  limit,
} from "firebase/firestore";
import { ICollectionRepository } from "@/domain/ports/ICollectionRepository";
import { Collection } from "@/domain/entities/Collection";
import { getFirestoreDB } from "./firebaseClient";

const COLLECTION_NAME = "collections";

function docToCollection(id: string, data: Record<string, unknown>): Collection {
  return {
    id,
    userId: data.userId as string,
    userDisplayName: data.userDisplayName as string | undefined,
    name: data.name as string,
    description: data.description as string | undefined,
    coverImage: data.coverImage as string | undefined,
    outfitIds: (data.outfitIds as string[]) ?? [],
    privacy: (data.privacy as Collection["privacy"]) ?? "public",
    likes: (data.likes as number) ?? 0,
    createdAt: (data.createdAt as string) ?? new Date().toISOString(),
    updatedAt: (data.updatedAt as string) ?? new Date().toISOString(),
  };
}

export class FirestoreCollectionRepository implements ICollectionRepository {
  async getAll(): Promise<Collection[]> {
    try {
      const db = getFirestoreDB();
      const snap = await getDocs(collection(db, COLLECTION_NAME));
      return snap.docs.map(d => docToCollection(d.id, d.data() as Record<string, unknown>));
    } catch (e) {
      console.error("FirestoreCollectionRepository.getAll failed:", e);
      return [];
    }
  }

  async getById(id: string): Promise<Collection | null> {
    try {
      const db = getFirestoreDB();
      const snap = await getDoc(doc(db, COLLECTION_NAME, id));
      if (!snap.exists()) return null;
      return docToCollection(snap.id, snap.data() as Record<string, unknown>);
    } catch (e) {
      console.error(`FirestoreCollectionRepository.getById failed for id ${id}:`, e);
      return null;
    }
  }

  async getByUserId(userId: string): Promise<Collection[]> {
    try {
      const db = getFirestoreDB();
      const q = query(collection(db, COLLECTION_NAME), where("userId", "==", userId));
      const snap = await getDocs(q);
      return snap.docs.map(d => docToCollection(d.id, d.data() as Record<string, unknown>));
    } catch (e) {
      console.error(`FirestoreCollectionRepository.getByUserId failed for user ${userId}:`, e);
      return [];
    }
  }

  async getPublic(): Promise<Collection[]> {
    try {
      const db = getFirestoreDB();
      const q = query(
        collection(db, COLLECTION_NAME),
        where("privacy", "==", "public"),
        orderBy("createdAt", "desc"),
        limit(50)
      );
      const snap = await getDocs(q);
      return snap.docs.map(d => docToCollection(d.id, d.data() as Record<string, unknown>));
    } catch (e) {
      console.error("FirestoreCollectionRepository.getPublic failed:", e);
      return [];
    }
  }

  async save(collection: Collection): Promise<void> {
    try {
      const db = getFirestoreDB();
      const { id, ...data } = collection;
      await setDoc(doc(db, COLLECTION_NAME, id), {
        ...data,
        createdAt: data.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error(`FirestoreCollectionRepository.save failed for collection ${collection.id}:`, e);
    }
  }

  async update(id: string, data: Partial<Collection>): Promise<void> {
    try {
      const db = getFirestoreDB();
      await updateDoc(doc(db, COLLECTION_NAME, id), {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.error(`FirestoreCollectionRepository.update failed for collection ${id}:`, e);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const db = getFirestoreDB();
      await deleteDoc(doc(db, COLLECTION_NAME, id));
    } catch (e) {
      console.error(`FirestoreCollectionRepository.delete failed for collection ${id}:`, e);
    }
  }
}
