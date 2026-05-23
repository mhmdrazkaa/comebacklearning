/* ============================================================
   PORTFOLIO — script.js
   Berisi:
   1. Navbar — scroll effect + active link
   2. Hamburger menu — mobile
   3. Typewriter — ketik & hapus kata secara bergantian
   4. Carousel — slide dengan auto-play & manual controls
   5. Skill bar animation — saat section terlihat (IntersectionObserver)
   6. Smooth form feedback
   ============================================================ */


/* ============================================================
   1. NAVBAR — tambah class 'scrolled' saat di-scroll
   ============================================================ */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {

  /* Tambah background solid saat scroll lebih dari 50px */
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  /* Active link berdasarkan section yang terlihat */
  const sections = document.querySelectorAll('section[id]');
  let currentId = '';

  sections.forEach(sec => {
    const top = sec.getBoundingClientRect().top;
    /* Section dianggap aktif kalau posisi atasnya < 120px dari viewport atas */
    if (top < 120) currentId = sec.id;
  });

  navLinks.forEach(link => {
    const href = link.getAttribute('href').replace('#', '');
    link.classList.toggle('active', href === currentId);
  });
});


/* ============================================================
   2. HAMBURGER MENU — toggle nav di mobile
   ============================================================ */
const hamburger = document.getElementById('hamburger');
const navMenu   = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', isOpen);
});

/* Tutup menu saat link diklik */
navMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});


/* ============================================================
   3. TYPEWRITER
   ============================================================ */
/*
   Cara kerja:
   - Ambil kata dari array 'words'
   - Ketik karakter satu per satu (setTimeout rekursif)
   - Setelah selesai, tunggu sebentar, lalu hapus satu per satu
   - Ganti ke kata berikutnya dan ulangi
*/
const typewriterEl = document.getElementById('typewriter');

const words = [
  'Frontend Developer',
  'UI Enthusiast',
  'Problem Solver',
  'Lifelong Learner',
];

let wordIndex   = 0;   // kata ke berapa yang sedang diketik
let charIndex   = 0;   // karakter ke berapa yang sedang diproses
let isDeleting  = false;

/* Kecepatan dalam milidetik */
const SPEED_TYPE   = 80;   // kecepatan mengetik per karakter
const SPEED_DELETE = 45;   // kecepatan menghapus (lebih cepat)
const DELAY_AFTER  = 1800; // jeda setelah kata selesai diketik
const DELAY_BEFORE = 400;  // jeda setelah kata habis dihapus

function typeWriter() {
  const currentWord = words[wordIndex];

  if (!isDeleting) {
    /* Sedang MENGETIK — tambah satu karakter */
    charIndex++;
    typewriterEl.textContent = currentWord.slice(0, charIndex);

    if (charIndex === currentWord.length) {
      /* Kata selesai diketik — tunggu lalu mulai menghapus */
      isDeleting = true;
      setTimeout(typeWriter, DELAY_AFTER);
      return;
    }

    setTimeout(typeWriter, SPEED_TYPE);

  } else {
    /* Sedang MENGHAPUS — kurangi satu karakter */
    charIndex--;
    typewriterEl.textContent = currentWord.slice(0, charIndex);

    if (charIndex === 0) {
      /* Kata habis dihapus — pindah ke kata berikutnya */
      isDeleting = false;
      wordIndex  = (wordIndex + 1) % words.length;
      setTimeout(typeWriter, DELAY_BEFORE);
      return;
    }

    setTimeout(typeWriter, SPEED_DELETE);
  }
}

/* Mulai typewriter setelah 1 detik (supaya hero animation selesai dulu) */
setTimeout(typeWriter, 1000);


/* ============================================================
   4. CAROUSEL
   ============================================================ */
/*
   Cara kerja:
   - Carousel track berisi semua slide berderet horizontal (display: flex)
   - Untuk pindah slide: geser track dengan translateX
   - translateX = -(currentIndex * 100%)
   - Dots dibuat secara dinamis sesuai jumlah slide
   - Auto-play tiap 5 detik, berhenti saat user hover
*/
const track     = document.getElementById('carouselTrack');
const prevBtn   = document.getElementById('prevBtn');
const nextBtn   = document.getElementById('nextBtn');
const dotsWrap  = document.getElementById('carouselDots');
const slides    = track.querySelectorAll('.slide');

let currentSlide = 0;
let autoPlayTimer;

const SLIDE_COUNT    = slides.length;
const AUTO_INTERVAL  = 5000; // 5 detik

/* --- Buat dots secara dinamis --- */
slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className   = 'dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('role', 'tab');
  dot.setAttribute('aria-label', `Pilih slide ${i + 1}`);
  dot.setAttribute('aria-selected', i === 0);

  dot.addEventListener('click', () => goToSlide(i));
  dotsWrap.appendChild(dot);
});

/* --- Fungsi utama: pindah ke slide tertentu --- */
function goToSlide(index) {
  /* Clamp index — pastikan tidak keluar batas */
  currentSlide = (index + SLIDE_COUNT) % SLIDE_COUNT;

  /* Geser carousel track */
  track.style.transform = `translateX(-${currentSlide * 100}%)`;

  /* Update dots */
  const dots = dotsWrap.querySelectorAll('.dot');
  dots.forEach((dot, i) => {
    const isActive = i === currentSlide;
    dot.classList.toggle('active', isActive);
    dot.setAttribute('aria-selected', isActive);
  });
}

/* --- Tombol prev/next --- */
prevBtn.addEventListener('click', () => {
  goToSlide(currentSlide - 1);
  resetAutoPlay(); // reset timer agar tidak langsung loncat
});

nextBtn.addEventListener('click', () => {
  goToSlide(currentSlide + 1);
  resetAutoPlay();
});

/* --- Auto-play --- */
function startAutoPlay() {
  autoPlayTimer = setInterval(() => {
    goToSlide(currentSlide + 1);
  }, AUTO_INTERVAL);
}

function stopAutoPlay() {
  clearInterval(autoPlayTimer);
}

function resetAutoPlay() {
  stopAutoPlay();
  startAutoPlay();
}

startAutoPlay();

/* Pause auto-play saat mouse hover di carousel */
const carousel = document.getElementById('carousel');
carousel.addEventListener('mouseenter', stopAutoPlay);
carousel.addEventListener('mouseleave', startAutoPlay);

/* Keyboard navigation — arrow key untuk akses keyboard */
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft')  { goToSlide(currentSlide - 1); resetAutoPlay(); }
  if (e.key === 'ArrowRight') { goToSlide(currentSlide + 1); resetAutoPlay(); }
});


/* ============================================================
   5. SKILL BAR ANIMATION — IntersectionObserver
   ============================================================ */
/*
   IntersectionObserver memantau apakah sebuah elemen
   sudah masuk ke area pandang (viewport).
   Saat skill section terlihat, class 'animated' ditambahkan
   ke .skill-fill sehingga CSS animation berjalan.

   Tanpa ini, animasi sudah selesai sebelum user scroll ke section skills.
*/
const skillFills = document.querySelectorAll('.skill-fill');

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animated');
      /* Setelah dijalankan sekali, berhenti mengamati */
      skillObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.3, // trigger saat 30% elemen terlihat
});

skillFills.forEach(fill => skillObserver.observe(fill));


/* ============================================================
   6. CONTACT FORM — feedback sederhana
   ============================================================ */
const sendBtn = document.getElementById('sendBtn');

sendBtn.addEventListener('click', () => {
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  /* Validasi sederhana */
  if (!name || !email || !message) {
    sendBtn.textContent = '⚠ Lengkapi semua field dulu';
    sendBtn.style.background = '#b45309';
    setTimeout(() => {
      sendBtn.textContent = 'Kirim Pesan';
      sendBtn.style.background = '';
    }, 2000);
    return;
  }

  /* Simulasi pengiriman (di production: fetch ke API) */
  sendBtn.textContent  = 'Mengirim...';
  sendBtn.disabled     = true;

  setTimeout(() => {
    sendBtn.textContent  = '✓ Pesan Terkirim!';
    sendBtn.style.background = '#1a7a4a';
    sendBtn.disabled = false;

    /* Reset form */
    document.getElementById('name').value    = '';
    document.getElementById('email').value   = '';
    document.getElementById('message').value = '';

    setTimeout(() => {
      sendBtn.textContent   = 'Kirim Pesan';
      sendBtn.style.background = '';
    }, 3000);
  }, 1500);
});