import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { IFollowRepository } from "@/domain/ports/IFollowRepository";
import { Follow } from "@/domain/entities/Follow";
import { getFirestoreDB } from "./firebaseClient";

const COLLECTION_NAME = "follows";

export class FirestoreFollowRepository implements IFollowRepository {
  async getById(id: string): Promise<Follow | null> {
    const db = getFirestoreDB();
    const snap = await getDoc(doc(db, COLLECTION_NAME, id));
    if (!snap.exists()) return null;
    const d = snap.data() as Record<string, unknown>;
    return { id: snap.id, followerId: d.followerId as string, followingId: d.followingId as string, createdAt: d.createdAt as string };
  }

  async getFollowByPair(followerId: string, followingId: string): Promise<Follow | null> {
    const db = getFirestoreDB();
    const q = query(
      collection(db, COLLECTION_NAME),
      where("followerId", "==", followerId),
      where("followingId", "==", followingId)
    );
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0].data() as Record<string, unknown>;
    return { id: snap.docs[0].id, followerId: d.followerId as string, followingId: d.followingId as string, createdAt: d.createdAt as string };
  }

  async getFollowers(userId: string): Promise<Follow[]> {
    const db = getFirestoreDB();
    const q = query(collection(db, COLLECTION_NAME), where("followingId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map(d => {
      const data = d.data() as Record<string, unknown>;
      return { id: d.id, followerId: data.followerId as string, followingId: data.followingId as string, createdAt: data.createdAt as string };
    });
  }

  async getFollowing(userId: string): Promise<Follow[]> {
    const db = getFirestoreDB();
    const q = query(collection(db, COLLECTION_NAME), where("followerId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map(d => {
      const data = d.data() as Record<string, unknown>;
      return { id: d.id, followerId: data.followerId as string, followingId: data.followingId as string, createdAt: data.createdAt as string };
    });
  }

  async getFollowingIds(userId: string): Promise<string[]> {
    const follows = await this.getFollowing(userId);
    return follows.map(f => f.followingId);
  }

  async save(follow: Follow): Promise<void> {
    const db = getFirestoreDB();
    const { id, ...data } = follow;
    await setDoc(doc(db, COLLECTION_NAME, id), data);
  }

  async delete(id: string): Promise<void> {
    const db = getFirestoreDB();
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  }
}
