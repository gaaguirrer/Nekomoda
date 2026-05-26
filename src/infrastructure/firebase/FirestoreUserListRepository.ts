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
import { IUserListRepository } from "@/domain/ports/IUserListRepository";
import { UserList } from "@/domain/entities/UserList";
import { getFirestoreDB } from "./firebaseClient";

const COLLECTION_NAME = "userLists";

export class FirestoreUserListRepository implements IUserListRepository {
  async getByUserId(userId: string): Promise<UserList[]> {
    const db = getFirestoreDB();
    const q = query(collection(db, COLLECTION_NAME), where("userId", "==", userId));
    const snap = await getDocs(q);
    return snap.docs.map(d => {
      const data = d.data() as Record<string, unknown>;
      return {
        id: d.id,
        userId: data.userId as string,
        name: data.name as string,
        type: data.type as UserList["type"],
        itemIds: (data.itemIds as string[]) ?? [],
        createdAt: (data.createdAt as string) ?? "",
        updatedAt: (data.updatedAt as string) ?? "",
      };
    });
  }

  async getById(id: string): Promise<UserList | null> {
    const db = getFirestoreDB();
    const snap = await getDoc(doc(db, COLLECTION_NAME, id));
    if (!snap.exists()) return null;
    const data = snap.data() as Record<string, unknown>;
    return {
      id: snap.id,
      userId: data.userId as string,
      name: data.name as string,
      type: data.type as UserList["type"],
      itemIds: (data.itemIds as string[]) ?? [],
      createdAt: (data.createdAt as string) ?? "",
      updatedAt: (data.updatedAt as string) ?? "",
    };
  }

  async save(list: UserList): Promise<void> {
    const db = getFirestoreDB();
    const { id, ...data } = list;
    await setDoc(doc(db, COLLECTION_NAME, id), {
      ...data,
      createdAt: data.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  async update(id: string, data: Partial<UserList>): Promise<void> {
    const db = getFirestoreDB();
    await updateDoc(doc(db, COLLECTION_NAME, id), { ...data, updatedAt: new Date().toISOString() });
  }

  async delete(id: string): Promise<void> {
    const db = getFirestoreDB();
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  }

  async addItem(listId: string, itemId: string): Promise<void> {
    const db = getFirestoreDB();
    const ref = doc(db, COLLECTION_NAME, listId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const items = (snap.data().itemIds as string[]) ?? [];
    if (!items.includes(itemId)) {
      await updateDoc(ref, { itemIds: [...items, itemId], updatedAt: new Date().toISOString() });
    }
  }

  async removeItem(listId: string, itemId: string): Promise<void> {
    const db = getFirestoreDB();
    const ref = doc(db, COLLECTION_NAME, listId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return;
    const items = (snap.data().itemIds as string[]) ?? [];
    await updateDoc(ref, { itemIds: items.filter(i => i !== itemId), updatedAt: new Date().toISOString() });
  }
}
