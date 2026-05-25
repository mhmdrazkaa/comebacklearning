/* ============================================================
   rszkaa — Portfolio Script
   1. Navbar — scroll compact + active link
   2. Hamburger menu — mobile toggle
   3. Typewriter — ketik & hapus bergantian
   4. Skill bars — animasi saat section masuk viewport
   5. Contact form — validasi & feedback  
   ============================================================ */


/* ============================================================
   1. NAVBAR — compact saat di-scroll + active link
   ============================================================ */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {

  /* Tambah class .scrolled saat scroll > 60px */
  navbar.classList.toggle('scrolled', window.scrollY > 60);

}, { passive: true });

/*
  IntersectionObserver untuk active link —
  highlight nav link sesuai section yang sedang dilihat.
*/
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    navLinks.forEach(link => {
      const match = link.getAttribute('href') === '#' + entry.target.id;
      link.classList.toggle('active', match);
    });
  });
}, {
  /* Trigger ketika section berada di 30–70% tengah viewport */
  rootMargin: '-30% 0px -65% 0px',
});

sections.forEach(sec => navObserver.observe(sec));


/* ============================================================
   2. HAMBURGER MENU — mobile
   ============================================================ */
const navToggle = document.getElementById('nav-toggle');
const navMenu   = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

/* Tutup menu saat salah satu link diklik */
navMenu.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* Tutup menu saat klik di luar area navbar/menu */
document.addEventListener('click', (e) => {
  const clickedOutside =
    !navbar.contains(e.target) && !navMenu.contains(e.target);

  if (clickedOutside && navMenu.classList.contains('open')) {
    navMenu.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});


/* ============================================================
   3. TYPEWRITER
   ============================================================ */
/*
  Cara kerja:
  - Array 'words' berisi kata-kata yang akan diketik bergantian
  - Setiap 'tick':
    * isDeleting = false → tambah 1 karakter (mengetik)
    * isDeleting = true  → kurangi 1 karakter (menghapus)
  - Setelah kata selesai diketik → tunggu DELAY_AFTER → mulai hapus
  - Setelah kata habis dihapus   → pindah ke kata berikutnya
*/
const typewriterEl = document.getElementById('typewriter');

const words = [
  'Frontend Developer',
  'UI Enthusiast',
  'Problem Solver',
  'Lifelong Learner',
  'Digital Creator',
];

const SPEED_TYPE   = 85;    /* ms per karakter saat mengetik */
const SPEED_DELETE = 48;    /* ms per karakter saat menghapus (lebih cepat) */
const DELAY_AFTER  = 1800;  /* ms jeda setelah kata selesai diketik */
const DELAY_NEXT   = 380;   /* ms jeda setelah kata habis dihapus */

let wordIdx    = 0;
let charIdx    = 0;
let isDeleting = false;

function tick() {
  const word = words[wordIdx];

  if (!isDeleting) {
    /* Mengetik: tambah satu karakter */
    charIdx++;
    typewriterEl.textContent = word.slice(0, charIdx);

    if (charIdx === word.length) {
      /* Kata selesai — tunggu lalu mulai hapus */
      isDeleting = true;
      setTimeout(tick, DELAY_AFTER);
      return;
    }

    setTimeout(tick, SPEED_TYPE);

  } else {
    /* Menghapus: kurangi satu karakter */
    charIdx--;
    typewriterEl.textContent = word.slice(0, charIdx);

    if (charIdx === 0) {
      /* Kata habis — pindah ke kata berikutnya */
      isDeleting = false;
      wordIdx    = (wordIdx + 1) % words.length;
      setTimeout(tick, DELAY_NEXT);
      return;
    }

    setTimeout(tick, SPEED_DELETE);
  }
}

/* Mulai typewriter setelah halaman selesai load — delay 900ms */
setTimeout(tick, 900);


/* ============================================================
   4. SKILL BARS — animasi saat section masuk viewport
   ============================================================ */
/*
  Tanpa ini, animasi progress bar sudah selesai sebelum
  user scroll ke section Skills.

  IntersectionObserver memantau tiap .sk-fill:
  - Saat elemen masuk viewport → tambah class 'animate'
  - CSS transition di .sk-fill.animate → width tumbuh dari 0 ke --w
  - Setelah dianimasikan sekali, berhenti mengamati
*/
const skillFills = document.querySelectorAll('.sk-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add('animate');
    skillObserver.unobserve(entry.target); /* cukup sekali */
  });
}, {
  threshold: 0.4, /* trigger saat 40% elemen terlihat */
});

skillFills.forEach(fill => skillObserver.observe(fill));


/* ============================================================
   5. CONTACT FORM — validasi & feedback tombol
   ============================================================ */
const sendBtn = document.getElementById('send-btn');

sendBtn.addEventListener('click', () => {
  const name  = document.getElementById('c-name').value.trim();
  const email = document.getElementById('c-email').value.trim();
  const msg   = document.getElementById('c-msg').value.trim();

  /* --- Validasi sederhana --- */
  if (!name || !email || !msg) {
    setBtn('⚠ Lengkapi semua field', '#b45309', false);
    setTimeout(() => resetBtn(), 2200);
    return;
  }

  /* Validasi format email */
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    setBtn('⚠ Format email tidak valid', '#b45309', false);
    setTimeout(() => resetBtn(), 2200);
    return;
  }

  /* --- Simulasi kirim (di production: ganti dengan fetch ke API) --- */
  setBtn('Mengirim…', var_primary(), true);

  setTimeout(() => {
    setBtn('✓ Pesan Terkirim!', '#1a7a4a', false);
    /* Kosongkan form */
    document.getElementById('c-name').value  = '';
    document.getElementById('c-email').value = '';
    document.getElementById('c-msg').value   = '';

    setTimeout(() => resetBtn(), 3000);
  }, 1600);
});

/* Helper: ambil warna primary dari CSS variable */
function var_primary() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--clr-primary').trim() || '#1591DC';
}

function setBtn(text, bg, disabled) {
  sendBtn.textContent      = text;
  sendBtn.style.background = bg;
  sendBtn.disabled         = disabled;
}

function resetBtn() {
  sendBtn.textContent      = 'Kirim Pesan';
  sendBtn.style.background = '';
  sendBtn.disabled         = false;
}