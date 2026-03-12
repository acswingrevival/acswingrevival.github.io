/* ============================================
   ACSR — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Loader ----
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 1200);
  });
  // Fallback if load already fired
  setTimeout(() => loader.classList.add('hidden'), 3000);

  // ---- Typewriter ----
  const typewriterEl = document.getElementById('typewriter');
  const phrases = [
    'It don\'t mean a thing if it ain\'t got that swing.',
    'Dance is the hidden language of the soul. - Martha Graham',
    'I\'ve never seen a lindy hopper who wasn\'t smiling. - Frankie Manning',
    'I\'m happy to say, SWING is here to stay. - Norma Miller',
    'If you play a tune and a person don\'t tap their feet, don\'t play the tune.'
  ];
  let phraseIdx = 0;
  let charIdx = 0;
  let deleting = false;

  function typewrite() {
    const current = phrases[phraseIdx];
    if (!deleting) {
      charIdx++;
      typewriterEl.innerHTML = current.substring(0, charIdx) + '<span class="cursor"></span>';
      if (charIdx === current.length) {
        setTimeout(() => { deleting = true; typewrite(); }, 2500);
        return;
      }
      setTimeout(typewrite, 50 + Math.random() * 40);
    } else {
      charIdx--;
      typewriterEl.innerHTML = current.substring(0, charIdx) + '<span class="cursor"></span>';
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(typewrite, 400);
        return;
      }
      setTimeout(typewrite, 25);
    }
  }
  setTimeout(typewrite, 2000);

  // ---- Hero CTA pulse ----
  setTimeout(() => {
    document.getElementById('hero-cta').classList.add('pulse');
  }, 3000);

  // ---- Navbar scroll ----
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 50);
    lastScroll = scrollY;
  }, { passive: true });

  // ---- Mobile nav toggle ----
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  // Close on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // ---- Scroll reveal (Intersection Observer) ----
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  let revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.delay || 0);
        setTimeout(() => entry.target.classList.add('revealed'), delay);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ---- Colorize images on scroll ----
  const colorizeEls = document.querySelectorAll('[data-colorize]');
  const colorizeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('colorized'), 400);
        colorizeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  colorizeEls.forEach(el => colorizeObserver.observe(el));

  // ---- Counter animation ----
  const counters = document.querySelectorAll('[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.count);
        const duration = 2000;
        const start = performance.now();

        function updateCounter(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(target * eased);
          if (progress < 1) requestAnimationFrame(updateCounter);
          else el.textContent = target;
        }
        requestAnimationFrame(updateCounter);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  // ---- Gallery Lightbox ----
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  let currentGalleryIdx = 0;
  let galleryImages = [];

  function initLightbox() {
    const items = document.querySelectorAll('.gallery-item');
    galleryImages = Array.from(items).map(item => {
      const img = item.querySelector('img');
      return img ? img.src : '';
    });
    items.forEach((item, idx) => {
      item.addEventListener('click', () => {
        currentGalleryIdx = idx;
        lightboxImg.src = galleryImages[idx];
        lightbox.classList.add('active');
      });
    });
  }

  lightbox.querySelector('.lightbox-close').addEventListener('click', () => {
    lightbox.classList.remove('active');
  });

  lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
    currentGalleryIdx = (currentGalleryIdx - 1 + galleryImages.length) % galleryImages.length;
    lightboxImg.src = galleryImages[currentGalleryIdx];
  });

  lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
    currentGalleryIdx = (currentGalleryIdx + 1) % galleryImages.length;
    lightboxImg.src = galleryImages[currentGalleryIdx];
  });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) lightbox.classList.remove('active');
  });

  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') lightbox.classList.remove('active');
    if (e.key === 'ArrowLeft') lightbox.querySelector('.lightbox-prev').click();
    if (e.key === 'ArrowRight') lightbox.querySelector('.lightbox-next').click();
  });

  // ---- Load Gallery from images/manifest.json ----
  async function loadGallery() {
    const container = document.getElementById('gallery-masonry');
    try {
      const res = await fetch('images/manifest.json');
      const images = await res.json();

      if (!images.length) {
        container.innerHTML = '<p class="events-loading">No photos available yet.</p>';
        return;
      }

      container.innerHTML = images.map((filename, i) => {
        const delay = (i % 6) * 50;
        return `
          <div class="gallery-item reveal-up" data-delay="${delay}">
            <img src="images/${filename}" alt="Dance photo ${i + 1}" loading="lazy">
            <div class="gallery-overlay"><span></span></div>
          </div>`;
      }).join('');

      container.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));
      initLightbox();
    } catch {
      container.innerHTML = '<p class="events-loading">Could not load gallery.</p>';
    }
  }

  loadGallery();

  // ---- Jukebox / Track Selection ----
  const tracks = document.querySelectorAll('.track');
  const vinylRecord = document.getElementById('vinyl-record');
  const vinylArm = document.getElementById('vinyl-arm');

  // Start playing on load
  setTimeout(() => {
    vinylRecord.classList.add('spinning');
    vinylArm.classList.add('active');
  }, 2000);

  tracks.forEach(track => {
    track.addEventListener('click', () => {
      tracks.forEach(t => t.classList.remove('active'));
      track.classList.add('active');

      // Vinyl animation
      vinylRecord.classList.remove('spinning');
      vinylArm.classList.remove('active');

      setTimeout(() => {
        vinylArm.classList.add('active');
        setTimeout(() => vinylRecord.classList.add('spinning'), 300);
      }, 400);
    });
  });

  // ---- Smooth anchor scroll ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Load Events from Google Sheet ----
  const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQeLZjUqbn64AyDm_fqQvMM1Vio6NbXPERnL3xBci5pY3vgUV0uq8uOEb342lkBLeOKVQDJIADWqCXA/pub?gid=0&single=true&output=csv';

  function parseCSV(text) {
    const [headerLine, ...rows] = text.trim().split('\n');
    const headers = headerLine.split(',').map(h => h.trim());
    return rows.map(row => {
      const values = row.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
    });
  }

  function buildEventCard(event, delay) {
    const date = new Date(event.Date);
    const month = date.toLocaleString('default', { month: 'short' }).toUpperCase();
    const day = date.getDate();
    return `
      <div class="event-card sway-card reveal-up" data-delay="${delay}">
        <div class="event-date">
          <span class="event-month">${month}</span>
          <span class="event-day">${day}</span>
        </div>
        <div class="event-details">
          <h3>${event.Title}</h3>
          <p>${event.Description}</p>
          <div class="event-meta">
            <span>${event['Start Time']} – ${event['End Time']}</span>
            <span>${event.Venue}</span>
          </div>
        </div>
      </div>`;
  }

  async function loadEvents() {
    const grid = document.getElementById('events-grid');
    try {
      const res = await fetch(SHEET_CSV_URL);
      const text = await res.text();
      const events = parseCSV(text)
        .filter(e => e.Date && e.Title)
        .filter(e => new Date(e.Date) >= new Date(new Date().toDateString()))
        .sort((a, b) => new Date(a.Date) - new Date(b.Date));

      if (events.length === 0) {
        grid.innerHTML = '<p class="events-loading">No upcoming events — check back soon!</p>';
        return;
      }

      grid.innerHTML = events.map((e, i) => buildEventCard(e, i * 100)).join('');

      // Re-run scroll observer on new cards
      grid.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));
    } catch {
      grid.innerHTML = '<p class="events-loading">Could not load events. Please try again later.</p>';
    }
  }

  loadEvents();

  // ---- Load Lessons from Google Sheet ----
  const LESSONS_CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQeLZjUqbn64AyDm_fqQvMM1Vio6NbXPERnL3xBci5pY3vgUV0uq8uOEb342lkBLeOKVQDJIADWqCXA/pub?gid=1314345131&single=true&output=csv';

  function buildLessonCard(lesson, index, delay) {
    return `
      <div class="step-card reveal-up" data-delay="${delay}">
        <div class="step-icon">${index + 1}</div>
        <h3>${lesson.Title}</h3>
        <p>${lesson.Description}</p>
        <div class="step-meta">
          <span class="step-time">${lesson.Day} &bull; ${lesson.Time}</span>
          <span class="step-instructor">${lesson.Instructor}</span>
        </div>
        <span class="step-level">${lesson.Level}</span>
      </div>`;
  }

  async function loadLessons() {
    const grid = document.getElementById('steps-grid');
    try {
      const res = await fetch(LESSONS_CSV_URL);
      const text = await res.text();
      const lessons = parseCSV(text).filter(l => l.Title);

      if (lessons.length === 0) {
        grid.innerHTML = '<p class="events-loading">No classes listed — check back soon!</p>';
        return;
      }

      grid.innerHTML = lessons.map((l, i) => buildLessonCard(l, i, i * 100)).join('');
      grid.querySelectorAll('.reveal-up').forEach(el => revealObserver.observe(el));
    } catch {
      grid.innerHTML = '<p class="events-loading">Could not load classes. Please try again later.</p>';
    }
  }

  loadLessons();

});
