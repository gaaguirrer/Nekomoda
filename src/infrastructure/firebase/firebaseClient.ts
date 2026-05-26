import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

function env(key: string): string {
  const raw = process.env[key] ?? "";
  return raw.replace(/^["']|["']$/g, "").trim();
}

function getFirebaseConfig() {
  return {
    apiKey: env("NEXT_PUBLIC_FIREBASE_API_KEY"),
    authDomain: env("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    projectId: env("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: env("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: env("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
    appId: env("NEXT_PUBLIC_FIREBASE_APP_ID"),
  };
}

export function validateFirebaseConfig(): string | null {
  const cfg = getFirebaseConfig();
  if (!cfg.apiKey) return "Missing NEXT_PUBLIC_FIREBASE_API_KEY";
  if (!cfg.authDomain) return "Missing NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN";
  if (!cfg.projectId) return "Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID";
  if (!cfg.appId) return "Missing NEXT_PUBLIC_FIREBASE_APP_ID";
  if (!cfg.apiKey.startsWith("AIza")) return "NEXT_PUBLIC_FIREBASE_API_KEY does not look like a valid Firebase key";
  return null;
}

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

export function getFirebaseApp(): FirebaseApp {
  if (!app) {
    if (getApps().length === 0) {
      const cfg = getFirebaseConfig();
      app = initializeApp(cfg);
    } else {
      app = getApps()[0];
    }
  }
  return app;
}

export function getFirebaseAuth(): Auth {
  if (!auth) {
    auth = getAuth(getFirebaseApp());
  }
  return auth;
}

export function getFirestoreDB(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp());
  }
  return db;
}
