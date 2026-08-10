/* =========================================================
   Lina Bilal — Portfolio Scripts
   Organized as small, independent modules (IIFE pattern).
   Each module owns one behavior and can be reused or removed
   without touching the others.
   ========================================================= */

/* ---------- Preloader ---------- */
const Preloader = (() => {
  function init(){
    const el = document.getElementById('preloader');
    if(!el) return;
    window.addEventListener('load', () => {
      setTimeout(() => el.classList.add('hide'), 350);
    });
  }
  return { init };
})();

/* ---------- Footer year ---------- */
const FooterYear = (() => {
  function init(){
    const el = document.getElementById('year');
    if(el) el.textContent = new Date().getFullYear();
  }
  return { init };
})();

/* ---------- Mobile navigation ---------- */
const MobileNav = (() => {
  function init(){
    const btn = document.getElementById('navToggleBtn');
    const links = document.getElementById('navLinks');
    if(!btn || !links) return;

    btn.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      btn.setAttribute('aria-expanded', isOpen);
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
      });
    });
  }
  return { init };
})();

/* ---------- Theme toggle (dark / light) ----------
   Note: state is kept in memory only (no localStorage/sessionStorage),
   since this file may run inside a sandboxed preview. Wire up
   localStorage yourself if hosting this outside that constraint. */
const ThemeToggle = (() => {
  let current = 'dark';
  function init(){
    const btn = document.getElementById('themeToggle');
    if(!btn) return;
    btn.addEventListener('click', () => {
      current = current === 'dark' ? 'light' : 'dark';
      document.body.setAttribute('data-theme', current);
      btn.textContent = current === 'dark' ? '🌙' : '☀️';
    });
  }
  return { init };
})();

/* ---------- Typing role animation ---------- */
const RoleTyper = (() => {
  const roles = [
    'Full Stack Web Developer',
    'React & Python Developer',
    'Odoo ERP Developer',
    'PostgreSQL & Database Design'
  ];
  function init(){
    const el = document.getElementById('roleText');
    if(!el) return;
    let rIndex = 0, cIndex = 0, deleting = false;

    function tick(){
      const word = roles[rIndex];
      if(!deleting){
        cIndex++;
        el.textContent = word.slice(0, cIndex);
        if(cIndex === word.length){
          deleting = true;
          setTimeout(tick, 1600);
          return;
        }
      } else {
        cIndex--;
        el.textContent = word.slice(0, cIndex);
        if(cIndex === 0){
          deleting = false;
          rIndex = (rIndex + 1) % roles.length;
        }
      }
      setTimeout(tick, deleting ? 35 : 55);
    }
    tick();
  }
  return { init };
})();

/* ---------- Scroll reveal ---------- */
const ScrollReveal = (() => {
  function init(){
    const els = document.querySelectorAll('.reveal');
    if(!els.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => io.observe(el));
  }
  return { init };
})();

/* ---------- Active nav link on scroll ---------- */
const ActiveNav = (() => {
  function init(){
    const sections = document.querySelectorAll('main section, .hero');
    const anchors = document.querySelectorAll('.nav-links a');
    if(!sections.length || !anchors.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          const id = entry.target.getAttribute('id');
          anchors.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { threshold: 0.4, rootMargin: '-72px 0px -50% 0px' });

    sections.forEach(s => io.observe(s));
  }
  return { init };
})();

/* ---------- Testimonial slider ---------- */
const TestimonialSlider = (() => {
  function init(){
    const track = document.getElementById('testimonialTrack');
    const dotsWrap = document.getElementById('testimonialDots');
    if(!track || !dotsWrap) return;

    const slides = track.children.length;
    let index = 0;
    let timer = null;

    for(let i = 0; i < slides; i++){
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Go to testimonial ' + (i + 1));
      if(i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(dot);
    }

    function goTo(i){
      index = (i + slides) % slides;
      track.style.transform = 'translateX(-' + (index * 100) + '%)';
      [...dotsWrap.children].forEach((d, di) => d.classList.toggle('active', di === index));
    }

    function next(){ goTo(index + 1); }

    function startAuto(){
      timer = setInterval(next, 5500);
    }
    function stopAuto(){
      clearInterval(timer);
    }

    track.closest('.testimonial-slider').addEventListener('mouseenter', stopAuto);
    track.closest('.testimonial-slider').addEventListener('mouseleave', startAuto);

    startAuto();
  }
  return { init };
})();

/* ---------- Contact form validation ---------- */
const ContactForm = (() => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function setError(id, msg){
    const el = document.getElementById(id);
    if(el) el.textContent = msg || '';
  }

  function validate(fields){
    let valid = true;

    if(!fields.name){ setError('errName', 'Please enter your name.'); valid = false; }
    else setError('errName', '');

    if(!fields.email){ setError('errEmail', 'Please enter your email.'); valid = false; }
    else if(!emailPattern.test(fields.email)){ setError('errEmail', 'Please enter a valid email.'); valid = false; }
    else setError('errEmail', '');

    if(!fields.message){ setError('errMessage', 'Please add a short message.'); valid = false; }
    else setError('errMessage', '');

    return valid;
  }

  function init(){
    const form = document.getElementById('contactForm');
    if(!form) return;
    const submitBtn = document.getElementById('submitBtn');
    const successBox = document.getElementById('formSuccess');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      successBox.classList.remove('show');

      const fields = {
        name: document.getElementById('fname').value.trim(),
        email: document.getElementById('femail').value.trim(),
        message: document.getElementById('fmessage').value.trim()
      };

      if(!validate(fields)) return;

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      // Simulated network call — replace with a real fetch() to your
      // Flask endpoint, e.g. POST /api/contact, when wiring up the backend.
      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send message →';
        successBox.classList.add('show');
        form.reset();
      }, 900);
    });
  }
  return { init };
})();

/* ---------- Boot ---------- */
document.addEventListener('DOMContentLoaded', () => {
  Preloader.init();
  FooterYear.init();
  MobileNav.init();
  ThemeToggle.init();
  RoleTyper.init();
  ScrollReveal.init();
  ActiveNav.init();
  TestimonialSlider.init();
  ContactForm.init();
});
