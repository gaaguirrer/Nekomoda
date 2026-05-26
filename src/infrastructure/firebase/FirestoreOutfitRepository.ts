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
  arrayUnion,
  arrayRemove,
  orderBy,
  limit,
} from "firebase/firestore";
import { IOutfitRepository } from "@/domain/ports/IOutfitRepository";
import { Outfit } from "@/domain/entities/Outfit";
import { getFirestoreDB } from "./firebaseClient";

const COLLECTION = "outfits";

function docToOutfit(id: string, data: Record<string, unknown>): Outfit {
  return {
    id,
    userId: data.userId as string,
    userDisplayName: data.userDisplayName as string | undefined,
    userPhotoURL: data.userPhotoURL as string | undefined,
    name: data.name as string,
    description: data.description as string | undefined,
    items: (data.items as Outfit["items"]) ?? [],
    featureVector: (data.featureVector as number[]) ?? [],
    privacy: (data.privacy as Outfit["privacy"]) ?? "public",
    likes: (data.likes as number) ?? 0,
    likedBy: (data.likedBy as string[]) ?? [],
    commentCount: (data.commentCount as number) ?? 0,
    collectionId: data.collectionId as string | undefined,
    createdAt: (data.createdAt as string) ?? new Date().toISOString(),
    updatedAt: (data.updatedAt as string) ?? new Date().toISOString(),
  };
}

export class FirestoreOutfitRepository implements IOutfitRepository {
  async getAll(): Promise<Outfit[]> {
    const db = getFirestoreDB();
    const snap = await getDocs(collection(db, COLLECTION));
    return snap.docs.map(d => docToOutfit(d.id, d.data() as Record<string, unknown>));
  }

  async getById(id: string): Promise<Outfit | null> {
    const db = getFirestoreDB();
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (!snap.exists()) return null;
    return docToOutfit(snap.id, snap.data() as Record<string, unknown>);
  }

  async getByUserId(userId: string): Promise<Outfit[]> {
    const db = getFirestoreDB();
    const q = query(collection(db, COLLECTION), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map(d => docToOutfit(d.id, d.data() as Record<string, unknown>));
  }

  async getPublic(): Promise<Outfit[]> {
    const db = getFirestoreDB();
    const q = query(
      collection(db, COLLECTION),
      where("privacy", "==", "public"),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => docToOutfit(d.id, d.data() as Record<string, unknown>));
  }

  async getFeed(userId: string, followingIds: string[]): Promise<Outfit[]> {
    const db = getFirestoreDB();
    if (followingIds.length === 0) return [];
    const q = query(
      collection(db, COLLECTION),
      where("userId", "in", followingIds.slice(0, 10)),
      orderBy("createdAt", "desc"),
      limit(50)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => docToOutfit(d.id, d.data() as Record<string, unknown>));
  }

  async save(outfit: Outfit): Promise<void> {
    const db = getFirestoreDB();
    const { id, ...data } = outfit;
    await setDoc(doc(db, COLLECTION, id), {
      ...data,
      createdAt: data.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  async update(id: string, data: Partial<Outfit>): Promise<void> {
    const db = getFirestoreDB();
    await updateDoc(doc(db, COLLECTION, id), {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  }

  async delete(id: string): Promise<void> {
    const db = getFirestoreDB();
    await deleteDoc(doc(db, COLLECTION, id));
  }

  async like(outfitId: string, userId: string): Promise<void> {
    const db = getFirestoreDB();
    const ref = doc(db, COLLECTION, outfitId);
    await updateDoc(ref, {
      likedBy: arrayUnion(userId),
      likes: (await getDoc(ref)).data()?.likes + 1 || 1,
      updatedAt: new Date().toISOString(),
    });
  }

  async unlike(outfitId: string, userId: string): Promise<void> {
    const db = getFirestoreDB();
    const ref = doc(db, COLLECTION, outfitId);
    const snap = await getDoc(ref);
    const data = snap.data();
    if (!data) return;
    await updateDoc(ref, {
      likedBy: arrayRemove(userId),
      likes: Math.max(0, (data.likes as number) - 1),
      updatedAt: new Date().toISOString(),
    });
  }
}
