/* ─── Neural Network Canvas ──────────────────────────────────────── */
const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

let W, H, particles, mouse = { x: null, y: null };
const PARTICLE_COUNT = 90;
const CONNECT_DIST = 140;
const MOUSE_REPEL = 120;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function Particle() {
  this.x  = Math.random() * W;
  this.y  = Math.random() * H;
  this.vx = (Math.random() - 0.5) * 0.4;
  this.vy = (Math.random() - 0.5) * 0.4;
  this.r  = Math.random() * 1.5 + 0.5;
  this.hue = 240 + Math.random() * 60; // violet to blue range
}

Particle.prototype.update = function () {
  // Mouse repulsion
  if (mouse.x !== null) {
    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < MOUSE_REPEL) {
      const force = (MOUSE_REPEL - dist) / MOUSE_REPEL;
      this.vx += (dx / dist) * force * 0.6;
      this.vy += (dy / dist) * force * 0.6;
    }
  }

  // Damping
  this.vx *= 0.98;
  this.vy *= 0.98;

  this.x += this.vx;
  this.y += this.vy;

  // Wrap edges
  if (this.x < 0)  this.x = W;
  if (this.x > W)  this.x = 0;
  if (this.y < 0)  this.y = H;
  if (this.y > H)  this.y = 0;
};

Particle.prototype.draw = function () {
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
  ctx.fillStyle = `hsla(${this.hue}, 80%, 75%, 0.8)`;
  ctx.fill();
};

function init() {
  resize();
  particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
}

function animate() {
  ctx.clearRect(0, 0, W, H);

  // Draw connections
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a = particles[i], b = particles[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < CONNECT_DIST) {
        const alpha = (1 - dist / CONNECT_DIST) * 0.35;
        const hue = (a.hue + b.hue) / 2;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `hsla(${hue}, 75%, 70%, ${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }

  // Update & draw particles
  particles.forEach(p => { p.update(); p.draw(); });

  requestAnimationFrame(animate);
}

window.addEventListener('resize', () => {
  resize();
  particles.forEach(p => {
    p.x = Math.min(p.x, W);
    p.y = Math.min(p.y, H);
  });
});

window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

init();
animate();

/* ─── Nav scroll ─────────────────────────────────────────────────── */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

/* ─── Typewriter ─────────────────────────────────────────────────── */
const phrases = [
  'AI & deep learning.',
  'quant finance.',
  'LLM engineering.',
  'ML research.',
  'markets & models.',
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typeEl = document.getElementById('typewriter');

function type() {
  const phrase = phrases[phraseIdx];
  if (!deleting) {
    typeEl.textContent = phrase.slice(0, ++charIdx);
    if (charIdx === phrase.length) {
      deleting = true;
      setTimeout(type, 1800);
      return;
    }
    setTimeout(type, 65);
  } else {
    typeEl.textContent = phrase.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(type, 400);
      return;
    }
    setTimeout(type, 35);
  }
}
setTimeout(type, 800);

/* ─── Scroll reveal ──────────────────────────────────────────────── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

const revealTargets = [
  '.malloc-card',
  '.about-grid',
  '.card',
  '.contact-container h2',
  '.contact-sub',
  '.contact-links',
];

revealTargets.forEach(sel => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add('reveal');
    if (i > 0) el.classList.add(`reveal-delay-${Math.min(i, 3)}`);
    revealObserver.observe(el);
  });
});
