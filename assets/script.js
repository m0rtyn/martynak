// Translations object
const translations = {
  ru: {
    title: 'Мартынак — оптимизированная клавиатурная раскладка',
    heroTitle: 'Мартынак',
    heroSubtitle: 'Оптимизированная клавиатурная раскладка для русского и английского языков',
    nav: {
      about: 'О раскладке',
      features: 'Особенности',
      layouts: 'Раскладки',
      stats: 'Статистика',
      download: 'Скачать',
      gettingStarted: 'Как начать',
      contact: 'Контакты'
    },
    footer: {
      copyright: '&copy; 2018-2025 Мартынак. Разработано с ❤️ для эффективной печати.',
      basedOn: 'Основано на',
      research: 'исследовании оптимизации',
      title: 'Мартынак 2025',
      description: 'Оптимизированная раскладка для эффективной печати',
      tagline: 'Создано с ❤️ для программистов и писателей'
    }
  },
  en: {
    title: 'Martynak — Optimized Keyboard Layout',
    heroTitle: 'Martynak',
    heroSubtitle: 'Optimized keyboard layout for Russian and English languages',
    nav: {
      about: 'About',
      features: 'Features',
      layouts: 'Layouts',
      stats: 'Statistics',
      download: 'Download',
      gettingStarted: 'Getting Started',
      contact: 'Contact'
    },
    footer: {
      copyright: '&copy; 2018-2025 Martynak. Developed with ❤️ for efficient typing.',
      basedOn: 'Based on',
      research: 'optimization research',
      title: 'Martynak 2025',
      description: 'Optimized layout for efficient typing',
      tagline: 'Created with ❤️ for programmers and writers'
    }
  }
};

// Function to update navigation
function updateNavigation(lang) {
  const t = translations[lang];
  const navLinks = document.querySelectorAll('nav .nav-links a');

  // Define section names for href attributes
  const sections = ['about', 'features', 'layouts', 'stats', 'download', 'getting-started', 'contact'];

  navLinks.forEach((link, index) => {
    if (index < sections.length) {
      // Update href to include language suffix
      const sectionId = lang === 'ru' ? sections[index] : `${sections[index]}-${lang}`;
      link.href = `#${sectionId}`;
    }
  });

  navLinks[0].textContent = t.nav.about;
  navLinks[1].textContent = t.nav.features;
  navLinks[2].textContent = t.nav.layouts;
  navLinks[3].textContent = t.nav.stats;
  navLinks[4].textContent = t.nav.download;
  navLinks[5].textContent = t.nav.gettingStarted;
  navLinks[6].textContent = t.nav.contact;
}

// Function to update footer
function updateFooter(lang) {
  const t = translations[lang];
  const footers = document.querySelectorAll('footer');

  // Update first footer
  if (footers[0]) {
    const copyrightP = footers[0].querySelector('p:first-child');
    const basedOnSpan = footers[0].querySelector('[data-text="basedOn"]');
    const researchSpan = footers[0].querySelector('[data-text="research"]');

    if (copyrightP) {
      copyrightP.innerHTML = t.footer.copyright;
    }
    if (basedOnSpan) {
      basedOnSpan.textContent = t.footer.basedOn;
    }
    if (researchSpan) {
      researchSpan.textContent = t.footer.research;
    }
  }

  // Update second footer
  if (footers[1]) {
    const titleH3 = footers[1].querySelector('h3');
    const descriptionP = footers[1].querySelector('p:first-of-type');
    const taglineP = footers[1].querySelector('p:last-of-type');

    if (titleH3) titleH3.textContent = t.footer.title;
    if (descriptionP) descriptionP.textContent = t.footer.description;
    if (taglineP) taglineP.textContent = t.footer.tagline;
  }
}

/** @type {NodeListOf<HTMLButtonElement>} */
const langButtons = document.querySelectorAll('.lang-btn');
/** @type {NodeListOf<HTMLDivElement>} */
const langContents = document.querySelectorAll('.lang-content');

langButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const lang = btn.dataset.lang;
    const t = translations[lang];

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

    // Update title and hero section
    document.title = t.title;
    document.querySelector('.hero h1').textContent = t.heroTitle;
    document.querySelector('.hero .subtitle').textContent = t.heroSubtitle;

    // Update navigation
    updateNavigation(lang);

    // Update footer
    updateFooter(lang);

    // Save language preference
    localStorage.setItem('martynak-lang', lang);
  });
});

// Initialize language on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('martynak-lang') || 'ru';
  const langButton = document.querySelector(`[data-lang="${savedLang}"]`);
  if (langButton && !langButton.classList.contains('active')) {
    langButton.click();
  }
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