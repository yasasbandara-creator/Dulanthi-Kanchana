// ── CURSOR ──
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
function animateCursor() {
  rx += (mx - rx) * 0.14;
  ry += (my - ry) * 0.14;
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('a, button, .service-card, .t-dot').forEach(el => {
  el.addEventListener('mouseenter', () => { cursor.classList.add('hover'); ring.classList.add('hover'); });
  el.addEventListener('mouseleave', () => { cursor.classList.remove('hover'); ring.classList.remove('hover'); });
});

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  const prog = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
  document.getElementById('progressLine').style.width = prog + '%';
});

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal, .reveal-left').forEach(el => observer.observe(el));

// ── COUNTER ANIMATION ──
function animateCount(el, target, duration = 1800) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const progress = Math.min((ts - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}
const counterObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = parseInt(e.target.dataset.target);
      animateCount(e.target, target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

// ── TESTIMONIALS ──
const testimonials = [
  { quote: '"Highly professional and helped me plan my financial future perfectly! Dulanthi made everything clear and understandable."', author: 'Priya Jayawardena' },
  { quote: '"Thanks to Dulanthi, my family is now fully protected. Her advice on life insurance was exactly what we needed."', author: 'Kasun Perera' },
  { quote: '"The retirement plan she designed for me gives me complete peace of mind. Truly a world-class wealth planner."', author: 'Nirosha Fernando' }
];
let currentT = 0;
const qEl = document.getElementById('tQuote');
const aEl = document.getElementById('tAuthor');
const dots = document.querySelectorAll('.t-dot');

function switchTestimonial(idx) {
  qEl.style.opacity = 0; aEl.style.opacity = 0;
  setTimeout(() => {
    currentT = idx;
    qEl.textContent = testimonials[idx].quote;
    aEl.textContent = testimonials[idx].author;
    qEl.style.opacity = 1; aEl.style.opacity = 1;
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));
  }, 300);
}

dots.forEach(d => d.addEventListener('click', () => switchTestimonial(+d.dataset.idx)));
qEl.style.transition = 'opacity 0.3s'; aEl.style.transition = 'opacity 0.3s';
setInterval(() => switchTestimonial((currentT + 1) % testimonials.length), 5000);

// ── CONTACT FORM (Formspree) ──
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');
const submitText  = document.getElementById('submitBtnText');
const formSuccess = document.getElementById('formSuccess');
const formError   = document.getElementById('formError');

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    formSuccess.classList.remove('visible');
    formError.classList.remove('visible');

    // Loading state
    submitBtn.disabled = true;
    submitText.textContent = 'Sending\u2026';
    submitBtn.classList.add('loading');

    try {
      const res = await fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { 'Accept': 'application/json' }
      });

      if (res.ok) {
        submitText.textContent = 'Message Sent \u2713';
        formSuccess.classList.add('visible');
        contactForm.reset();
        setTimeout(() => {
          submitText.textContent = 'Send Message';
          submitBtn.disabled = false;
          submitBtn.classList.remove('loading');
        }, 4000);
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      console.error(err);
      submitText.textContent = 'Send Message';
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      formError.classList.add('visible');
    }
  });
}