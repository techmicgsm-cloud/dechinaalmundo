import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

// 1. La configuración será inyectada aquí. Usamos variables de entorno por seguridad,
// pero por ahora preparamos la estructura a la espera de los valores.
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "TU_API_KEY",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "dechinaalmundo-b676c.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dechinaalmundo-b676c",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "dechinaalmundo-b676c.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "TU_MESSAGING_SENDER_ID",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "TU_APP_ID"
};

// 2. Inicializar Firebase App correctamente para Next.js (SSR friendly)
// Comprobamos si ya existe una instancia para evitar el error "Firebase App already exists" en modo desarrollo
const app: FirebaseApp = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// 3. Configurar servicios exportados
const db: Firestore = getFirestore(app);
const storage: FirebaseStorage = getStorage(app);

// Exportamos los servicios para que puedan ser usados a lo largo de toda la app
export { app, db, storage };
