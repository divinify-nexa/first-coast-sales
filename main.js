/* ============================================
   FIRST COAST SALES GROUP — MAIN JS
   ============================================ */

// ----- Sticky Nav -----
(function initNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;
  const onScroll = () => {
    if (window.scrollY > 30) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile toggle
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('open');
      links.classList.toggle('open');
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        toggle.classList.remove('open');
        links.classList.remove('open');
      });
    });
  }
})();

// ----- Scroll-triggered fade-in -----
(function initFadeUp() {
  const els = document.querySelectorAll('.fade-up');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => io.observe(el));
})();

// ----- Ocean wave canvas -----
function initWaveCanvas(canvas, opts = {}) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  let width, height, t = 0;

  const layers = opts.layers || [
    { amp: 26, freq: 0.0028, speed: 0.018, y: 0.55, color: 'rgba(180, 220, 240, 0.10)', thickness: 1.5 },
    { amp: 34, freq: 0.0022, speed: 0.012, y: 0.62, color: 'rgba(140, 200, 230, 0.14)', thickness: 1.5 },
    { amp: 44, freq: 0.0018, speed: 0.009, y: 0.70, color: 'rgba(100, 180, 220, 0.20)', thickness: 1.5 },
    { amp: 56, freq: 0.0014, speed: 0.006, y: 0.80, color: 'rgba(60, 140, 190, 0.32)', thickness: 0 },
    { amp: 70, freq: 0.0011, speed: 0.004, y: 0.92, color: 'rgba(20, 80, 130, 0.55)', thickness: 0 },
  ];

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function drawLayer(layer, time) {
    const yBase = height * layer.y;
    ctx.beginPath();
    ctx.moveTo(0, height);
    ctx.lineTo(0, yBase);

    const step = 4;
    for (let x = 0; x <= width; x += step) {
      // combine two sine waves for organic look
      const y = yBase
        + Math.sin(x * layer.freq + time * layer.speed) * layer.amp
        + Math.sin(x * layer.freq * 1.7 + time * layer.speed * 1.3) * (layer.amp * 0.35);
      ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = layer.color;
    ctx.fill();

    if (layer.thickness > 0) {
      // crest highlight
      ctx.beginPath();
      for (let x = 0; x <= width; x += step) {
        const y = yBase
          + Math.sin(x * layer.freq + time * layer.speed) * layer.amp
          + Math.sin(x * layer.freq * 1.7 + time * layer.speed * 1.3) * (layer.amp * 0.35);
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(220, 240, 255, 0.18)';
      ctx.lineWidth = layer.thickness;
      ctx.stroke();
    }
  }

  function tick() {
    ctx.clearRect(0, 0, width, height);

    // background gradient
    const g = ctx.createLinearGradient(0, 0, 0, height);
    g.addColorStop(0, '#0A1628');
    g.addColorStop(0.55, '#0D2238');
    g.addColorStop(1, '#0D2E3E');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    // distant glow (subtle horizon)
    const glow = ctx.createRadialGradient(width * 0.5, height * 0.42, 50, width * 0.5, height * 0.42, width * 0.6);
    glow.addColorStop(0, 'rgba(80, 160, 200, 0.10)');
    glow.addColorStop(1, 'rgba(80, 160, 200, 0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, width, height);

    layers.forEach(l => drawLayer(l, t));
    t += 1;
    rafId = requestAnimationFrame(tick);
  }

  let rafId = null;
  resize();
  tick();
  window.addEventListener('resize', resize);

  // pause when hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(rafId);
    else rafId = requestAnimationFrame(tick);
  });
}

document.querySelectorAll('canvas[data-wave]').forEach(c => initWaveCanvas(c));

// ----- Form handling (no backend — show success) -----
(function initForms() {
  document.querySelectorAll('form[data-form]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = form.querySelector('.form-msg');
      if (msg) {
        msg.textContent = form.dataset.successMessage || 'Thanks — we\'ll be in touch soon.';
        msg.classList.add('show', 'success');
      }
      form.reset();
    });
  });
})();

// ----- Active nav link -----
(function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a[data-page]').forEach(a => {
    if (a.dataset.page === path) a.classList.add('active');
  });
})();
