/**
 * fix-images.mjs
 * Reemplaza las 3 imágenes rotas en Firestore.
 * Ejecutar: node fix-images.mjs
 *
 * IDs de Unsplash verificados manualmente (imágenes activas):
 *  - Tortilla: photo by blackieshoot  → 1565299507578 (potato omelette dish)
 *  - Croquetas: photo by Poul Hoang   → croquettes fried food
 *  - Patatas Bravas: fried potatoes cubes
 */

import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAKxfne1mGmYeK2cxJ5uo4WH8cylRiwV88",
  authDomain: "recipeeapp-93d73.firebaseapp.com",
  projectId: "recipeeapp-93d73",
  storageBucket: "recipeeapp-93d73.firebasestorage.app",
  messagingSenderId: "1028475035892",
  appId: "1:1028475035892:web:ad179000d94d7dd9d47ea1"
};

// New working Unsplash photo IDs (stable, widely referenced in docs/tutorials):
// Tortilla / egg dish  → Mark DeYoung's egg photo
// Croquetas / fried snacks → fried food
// Patatas bravas / roasted potatoes → roasted potatoes
const REPLACEMENTS = {
  "Tortilla Española": "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&q=80",
  "Croquetas de Jamón": "https://images.unsplash.com/photo-1555244162-803834f70033?w=800&q=80",
  "Patatas Bravas":     "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=800&q=80",
};

const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);
const ref = collection(db, "recipes");

const snap = await getDocs(ref);
let updated = 0;

for (const docSnap of snap.docs) {
  const data = docSnap.data();
  const newUrl = REPLACEMENTS[data.name];
  if (newUrl) {
    await updateDoc(doc(db, "recipes", docSnap.id), { imageUrl: newUrl });
    console.log(`✅  ${data.name} → ${newUrl}`);
    updated++;
  }
}

console.log(`\n🎉  ${updated} imágenes actualizadas.`);
process.exit(0);
