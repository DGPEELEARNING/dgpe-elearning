/* =====================================================
   ✅ CONNEXION À SUPABASE
===================================================== */
const supabaseUrl = "https://hrriedjmpwjfmfimqlmx.supabase.co";
const supabaseKey = "sb_publishable_1AnZMUSy3A4X8xIrKJOKQw_cOX40j9V";
const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey);

/* =====================================================
   ✅ INSCRIPTION
===================================================== */
async function register() {
  const email = document.querySelector('input[type="email"]').value;
  const password = document.querySelector('input[type="password"]').value;

  if (!email || !password) {
    alert("❌ Veuillez remplir tous les champs.");
    return;
  }

  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
  });

  if (error) {
    alert("❌ Erreur inscription : " + error.message);
  } else {
    alert("✅ Compte créé ! Vérifiez votre email.");
  }
}

/* =====================================================
   ✅ CONNEXION
===================================================== */
async function login() {
  const email = document.querySelector('input[type="email"]').value;
  const password = document.querySelector('input[type="password"]').value;

  if (!email || !password) {
    alert("❌ Veuillez remplir tous les champs.");
    return;
  }

  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    alert("❌ Erreur connexion : " + error.message);
  } else {
    window.location.href = "dashboard.html";
  }
}

/* =====================================================
   ✅ MENU MOBILE / OFFCANVAS
===================================================== */
const burger = document.querySelector('.burger');
const offcanvas = document.querySelector('.offcanvas');
const closeBtn = document.querySelector('.offcanvas .close');

if (burger && offcanvas) {
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    offcanvas.classList.toggle('open');
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      burger.classList.remove('active');
      offcanvas.classList.remove('open');
    });
  }
}

/* =====================================================
   ✅ ANIMATION REVEAL
===================================================== */
function reveal() {
  document.querySelectorAll('.card, .panel').forEach(el => {
    const top = el.getBoundingClientRect().top;
    if (top < window.innerHeight - 60) {
      el.style.opacity = 1;
      el.style.transform = 'none';
    }
  });
}
window.addEventListener('scroll', reveal);
window.addEventListener('load', reveal);

/* =====================================================
   ✅ CATALOGUE DYNAMIQUE
===================================================== */
async function loadCatalogue() {
  const grid = document.querySelector('.modules-grid');
  if (!grid) return;

  try {
    const res = await fetch('./assets/data/modules.json');
    const data = await res.json();

    grid.innerHTML = data.modules.map(m => `
      <a href="module.html?id=${m.id}" class="card">
        <h3>${m.titre}</h3>
        <p style="color:#a7b1bd">${m.domaine} • ${m.duree}</p>
        <p>${m.resume}</p>
      </a>
    `).join('');
  } catch (e) {
    grid.innerHTML = `<div class="panel">❌ Erreur lors du chargement.</div>`;
  }
}
loadCatalogue();
