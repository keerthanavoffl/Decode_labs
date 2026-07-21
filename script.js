// ============================================
// MOBILE NAV TOGGLE
// ============================================
const navToggle = document.getElementById('navToggle');
const primaryNav = document.getElementById('primaryNav');

navToggle.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// Close mobile menu after clicking a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    primaryNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

// ============================================
// SCROLL REVEAL (IntersectionObserver)
// ============================================
const revealItems = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealItems.forEach(item => revealObserver.observe(item));

// ============================================
// LEARNING PROGRESS BARS (animate on view)
// ============================================
const progressFills = document.querySelectorAll('.progress-fill');

const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const target = entry.target.getAttribute('data-progress');
      entry.target.style.width = target + '%';
      progressObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

progressFills.forEach(fill => progressObserver.observe(fill));

// ============================================
// ACTIVE NAV LINK ON SCROLL
// ============================================
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        if (link.getAttribute('href') === `#${id}`) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });

sections.forEach(section => navObserver.observe(section));

// ============================================
// CONTACT FORM VALIDATION
// ============================================
const form = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

const fields = {
  name: {
    input: document.getElementById('name'),
    error: document.getElementById('nameError'),
    validate: (v) => v.trim().length >= 2,
    message: 'Please enter your name (min. 2 characters).'
  },
  email: {
    input: document.getElementById('email'),
    error: document.getElementById('emailError'),
    validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    message: 'Please enter a valid email address.'
  },
  message: {
    input: document.getElementById('message'),
    error: document.getElementById('messageError'),
    validate: (v) => v.trim().length >= 10,
    message: 'Message should be at least 10 characters.'
  }
};

function validateField(field) {
  const { input, error, validate, message } = field;
  const valid = validate(input.value);
  input.closest('.form-row').classList.toggle('invalid', !valid);
  error.textContent = valid ? '' : message;
  return valid;
}

Object.values(fields).forEach(field => {
  field.input.addEventListener('blur', () => validateField(field));
  field.input.addEventListener('input', () => {
    if (field.input.closest('.form-row').classList.contains('invalid')) {
      validateField(field);
    }
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const results = Object.values(fields).map(validateField);
  const allValid = results.every(Boolean);

  if (!allValid) {
    formStatus.textContent = 'Please fix the errors above before sending.';
    formStatus.className = 'form-status error';
    return;
  }

  // No backend is connected — this simulates a successful submission.
  formStatus.textContent = `Thanks, ${fields.name.input.value.trim()}! Your message has been noted.`;
  formStatus.className = 'form-status success';
  form.reset();
  Object.values(fields).forEach(f => f.input.closest('.form-row').classList.remove('invalid'));
});

// ============================================
// FOOTER YEAR
// ============================================
document.getElementById('year').textContent = new Date().getFullYear();