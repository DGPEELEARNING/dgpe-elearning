import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getFirestore, collection, getDocs, doc, updateDoc
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";
import {
  getAuth, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

/* CONFIG */
const firebaseConfig = {
  apiKey: "AIzaSyDLeMFoRoclFnfubLqhJBvwtySxLttyHqs",
  authDomain: "dgpe-elearning.firebaseapp.com",
  projectId: "dgpe-elearning"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const tbody = document.getElementById("pendingUsers");

/* SÉCURITÉ : ADMIN ONLY */
onAuthStateChanged(auth, async user => {
  if (!user) {
    location.href = "login.html";
    return;
  }

  const snap = await getDocs(collection(db, "users"));
  const me = snap.docs.find(d => d.id === user.uid)?.data();

  if (!me || me.role !== "ADMIN") {
    alert("Accès refusé");
    location.href = "dashboard.html";
    return;
  }

  loadPending();
});

/* CHARGEMENT DES DEMANDES */
async function loadPending() {
  tbody.innerHTML = "";
  const snap = await getDocs(collection(db, "users"));

  snap.forEach(docSnap => {
    const u = docSnap.data();
    if (u.status === "PENDING") {
      tbody.innerHTML += `
        <tr>
          <td>${u.prenom} ${u.nom}</td>
          <td>${u.email}</td>
          <td>${u.service || "-"}</td>
          <td>
            <button class="btn" onclick="validateUser('${docSnap.id}')">Valider</button>
            <button class="btn btn-danger" onclick="refuseUser('${docSnap.id}')">Refuser</button>
          </td>
        </tr>
      `;
    }
  });
}

/* ACTIONS */
window.validateUser = async (uid) => {
  await updateDoc(doc(db, "users", uid), { status: "ACTIF" });
  loadPending();
};

window.refuseUser = async (uid) => {
  await updateDoc(doc(db, "users", uid), { status: "REFUSE" });
  loadPending();
};
