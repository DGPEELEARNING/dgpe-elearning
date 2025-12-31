// ==============================
// AUTH DGPE – GESTION DE SESSION
// ==============================

// LOGIN
function login(matricule, role) {
  sessionStorage.setItem("dgpe_auth", "true");
  sessionStorage.setItem("dgpe_matricule", matricule);
  sessionStorage.setItem("dgpe_role", role);
}

// LOGOUT
function logout() {
  sessionStorage.clear();
  window.location.href = "login.html";
}

// VERIFIER CONNEXION
function isAuthenticated() {
  return sessionStorage.getItem("dgpe_auth") === "true";
}

// VERIFIER ROLE
function isAdmin() {
  return sessionStorage.getItem("dgpe_role") === "admin";
}

// PROTEGER PAGE UTILISATEUR
function protectPage() {
  if (!isAuthenticated()) {
    window.location.href = "login.html";
  }
}

// PROTEGER PAGE ADMIN
function protectAdminPage() {
  if (!isAuthenticated() || !isAdmin()) {
    window.location.href = "dashboard.html";
  }
}
