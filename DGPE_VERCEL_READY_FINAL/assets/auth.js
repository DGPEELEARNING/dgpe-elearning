/* =====================================================
   🔐 AUTH FIREBASE – DGPE (VERSION OFFICIELLE)
===================================================== */

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

/* ================= CONFIG FIREBASE ================= */
const firebaseConfig = {
  apiKey: "AIzaSyDLeMFoRoclFnfubLqhJBvwtySxLttyHqs",
  authDomain: "dgpe-elearning.firebaseapp.com",
  projectId: "dgpe-elearning"
};

const app  = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db   = getFirestore(app);

/* =====================================================
   🔒 PROTÉGER LES PAGES (Dashboard, Catalogue, etc.)
===================================================== */
window.protectPage = function () {
  onAuthStateChanged(auth, async (user) => {

    if (!user) {
      window.location.replace("login.html");
      return;
    }

    try {
      const ref  = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      // ❌ Utilisateur non enregistré DGPE
      if (!snap.exists()) {
        await signOut(auth);
        window.location.replace("login.html");
        return;
      }

      // ❌ Compte non activé
      if (snap.data().status !== "ACTIF") {
        await signOut(auth);
        window.location.replace("login.html");
        return;
      }

      // ✅ Accès autorisé
      console.log("✅ Utilisateur DGPE connecté :", snap.data().email);

    } catch (e) {
      await signOut(auth);
      window.location.replace("login.html");
    }
  });
};

/* =====================================================
   🛡️ PROTÉGER LES PAGES ADMIN
===================================================== */
window.protectAdminPage = function () {
  onAuthStateChanged(auth, async (user) => {

    if (!user) {
      window.location.replace("login.html");
      return;
    }

    const ref  = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists() || snap.data().role !== "ADMIN") {
      window.location.replace("dashboard.html");
      return;
    }

    // ✅ ADMIN autorisé
    console.log("🛡️ ADMIN connecté :", snap.data().email);
  });
};

/* =====================================================
   🔓 DÉCONNEXION
===================================================== */
window.logout = async function () {
  await signOut(auth);
  window.location.replace("login.html");
};
