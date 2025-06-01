/** @type {NodeListOf<HTMLButtonElement>} */
const langButtons = document.querySelectorAll('.lang-btn');
/** @type {NodeListOf<HTMLDivElement>} */
const langContents = document.querySelectorAll('.lang-content');
langButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const lang = btn.dataset.lang;

    // Update active button
    langButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Update content
    langContents.forEach(content => {
      content.classList.remove('active');
    });
    document.getElementById(`content-${lang}`).classList.add('active');

    // Update page language
    document.documentElement.lang = lang;

    // Update title
    if (lang === 'en') {
      document.title = 'Martynak — Optimized Keyboard Layout';
      document.querySelector('.hero h1').textContent = 'Martynak';
      document.querySelector('.hero .subtitle').textContent = 'Optimized keyboard layout for Russian and English languages';
    } else {
      document.title = 'Мартынак — оптимизированная клавиатурная раскладка';
      document.querySelector('.hero h1').textContent = 'Мартынак';
      document.querySelector('.hero .subtitle').textContent = 'Оптимизированная клавиатурная раскладка для русского и английского языков';
    }
  });
});

/** @type {NodeListOf<HTMLDivElement>} */
const keyboardDemos = document.querySelectorAll('div.keyboard-demo');

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    if (this.getAttribute('href') !== '#' && !this.dataset.lang) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  });
});

// Add scroll animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
    }
  });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
  observer.observe(section);
});

// Keyboard demo interactivity
document.querySelectorAll('.key').forEach(key => {
  key.addEventListener('click', () => {
    key.style.transform = 'scale(0.95)';
    setTimeout(() => {
      key.style.transform = '';
    }, 150);
  });
});


document.addEventListener('modifier-changed', (e) => {
  console.log('Modifier changed:', e?.detail);
  // You can add additional logic here if needed
});