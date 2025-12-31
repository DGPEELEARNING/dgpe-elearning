/* =========================================================
   DGPE – NORMALISATION & CORRECTION DES DURÉES DES MODULES
   Version finale – stable – production ready
========================================================= */

/* ================= FIREBASE ================= */
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  updateDoc,
  doc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

/* ================= CONFIG FIREBASE ================= */
const firebaseConfig = {
  apiKey: "AIzaSyDLeMFoRoclFnfubLqhJBvwtySxLttyHqs",
  authDomain: "dgpe-elearning.firebaseapp.com",
  projectId: "dgpe-elearning",
  storageBucket: "dgpe-elearning.appspot.com",
  messagingSenderId: "564422941000",
  appId: "1:564422941000:web:f523cd0cebafb6aaf7b7d"
};

/* ================= INIT ================= */
const app = initializeApp(firebaseConfig);
const db  = getFirestore(app);

/* ================= LOG UI ================= */
const logBox = document.getElementById("log");

function log(msg) {
  console.log(msg);
  if (logBox) {
    logBox.textContent += msg + "\n";
  }
}

/* ================= NORMALISATION TEXTE ================= */
function normalize(txt = "") {
  return txt
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " et ")
    .replace(/[:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/* ================= RÈGLES OFFICIELLES DGPE ================= */
const REGLES_DGPE = [
  { k: "gouvernance", d: "4 j" },
  { k: "pilotage", d: "4 j" },
  { k: "audit", d: "3 j" },
  { k: "conformite", d: "3 j" },
  { k: "performance", d: "2 j" },
  { k: "kpi", d: "2 j" },
  { k: "transformation digitale", d: "3 j" },
  { k: "digital", d: "3 j" },
  { k: "ia", d: "2 j" },
  { k: "intelligence artificielle", d: "2 j" },
  { k: "leadership", d: "2 j" },
  { k: "communication de crise", d: "2 j" },
  { k: "rse", d: "3 j" },
  { k: "responsabilite sociale", d: "3 j" },
  { k: "changement", d: "2 j" }
];

function trouverDuree(titre) {
  const t = normalize(titre);
  for (const r of REGLES_DGPE) {
    if (t.includes(r.k)) {
      return r.d;
    }
  }
  return null;
}

/* ================= EXECUTION PRINCIPALE ================= */
async function run() {
  log("⏳ Connexion à Firestore…");

  try {
    const snapshot = await getDocs(collection(db, "modules"));
    log(`📦 Modules trouvés : ${snapshot.size}`);

    let corriges = 0;

    for (const docSnap of snapshot.docs) {
      const data = docSnap.data();
      const titre = data.titre || "";

      const nouvelleDuree = trouverDuree(titre);
      if (!nouvelleDuree) continue;

      await updateDoc(doc(db, "modules", docSnap.id), {
        duree: nouvelleDuree,
        nbHeures: null,
        heures: null,
        updatedAt: new Date()
      });

      corriges++;
      log(`✔ ${titre} → ${nouvelleDuree}`);
    }

    log("=================================");
    log(`✅ Modules corrigés : ${corriges}`);
    log("🎉 TRAITEMENT TERMINÉ");

  } catch (error) {
    console.error(error);
    log("❌ ERREUR FIRESTORE");
    log(error.message);
  }
}

/* ================= LANCEMENT ================= */
run();
