/* =========================================================
   DEL SOARES — main.js
   ========================================================= */

'use strict';

/* ----- Navbar scroll ----- */
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ----- Mobile menu ----- */
(function initMobileMenu() {
  const toggle   = document.getElementById('menuToggle');
  const closeBtn = document.getElementById('menuClose');
  const menu     = document.getElementById('mobileMenu');
  const mobileLinks = menu ? menu.querySelectorAll('.ds-mobile-link, .ds-mobile-cta') : [];

  if (!toggle || !menu) return;

  const open  = () => {
    const scrollY = window.scrollY;
    document.body.style.position = 'fixed';
    document.body.style.top      = `-${scrollY}px`;
    document.body.style.width    = '100%';
    menu.classList.add('open');
    toggle.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
  };

  const close = () => {
    const scrollY = Math.abs(parseInt(document.body.style.top || '0', 10));
    document.body.style.position = '';
    document.body.style.top      = '';
    document.body.style.width    = '';
    window.scrollTo(0, scrollY);
    menu.classList.remove('open');
    toggle.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', open);
  if (closeBtn) closeBtn.addEventListener('click', close);

  mobileLinks.forEach(link => link.addEventListener('click', close));

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });
})();

/* ----- Scroll reveal ----- */
(function initReveal() {
  const targets = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!targets.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    targets.forEach(el => observer.observe(el));
  } else {
    targets.forEach(el => el.classList.add('visible'));
  }
})();

/* ----- Smooth active nav link ----- */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.ds-navbar__links a');
  if (!sections.length || !navLinks.length) return;

  const setActive = () => {
    let current = '';
    sections.forEach(section => {
      if (window.scrollY >= section.offsetTop - 140) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.removeAttribute('aria-current');
      if (link.getAttribute('href') === `#${current}`) {
        link.setAttribute('aria-current', 'page');
      }
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
})();

/* ----- Parallax hero orbs ----- */
(function initParallax() {
  const orb1 = document.querySelector('.ds-hero__orb--1');
  const orb2 = document.querySelector('.ds-hero__orb--2');
  if (!orb1 || !orb2) return;

  const onScroll = () => {
    const y = window.scrollY;
    orb1.style.transform = `translateY(${y * 0.15}px)`;
    orb2.style.transform = `translateY(${y * -0.1}px)`;
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ----- Parallax hero image ----- */
(function initHeroParallax() {
  const heroImg = document.querySelector('.ds-hero__img');
  if (!heroImg) return;

  const onScroll = () => {
    const y = window.scrollY;
    if (y < window.innerHeight * 1.5) {
      heroImg.style.transform = `translateY(${y * 0.06}px) scale(1.02)`;
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
})();

/* ----- Phone mask ----- */
(function initPhoneMask() {
  const phoneInput = document.getElementById('telefone');
  if (!phoneInput) return;

  phoneInput.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').substring(0, 11);
    if (v.length >= 11) {
      v = v.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (v.length >= 7) {
      v = v.replace(/^(\d{2})(\d{4,5})(\d{0,4})$/, '($1) $2-$3');
    } else if (v.length >= 3) {
      v = v.replace(/^(\d{2})(\d+)$/, '($1) $2');
    } else if (v.length >= 1) {
      v = v.replace(/^(\d+)$/, '($1');
    }
    this.value = v;
  });
})();

/* ----- Contact form → WhatsApp ----- */
(function initContactForm() {
  const form = document.getElementById('contatoForm');
  if (!form) return;

  const WHATSAPP_NUMBER = '553484279165';

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const nome     = (form.nome.value     || '').trim();
    const telefone = (form.telefone.value || '').trim();
    const servico  = (form.servico.value  || '').trim();
    const mensagem = (form.mensagem.value || '').trim();

    // Basic validation
    if (!nome || !telefone || !servico) {
      showToast('Por favor, preencha os campos obrigatórios.', 'error');
      return;
    }

    const servicoLabel = form.servico.options[form.servico.selectedIndex].text;

    let text = `Olá! Vim pelo site e gostaria de agendar uma avaliação.\n\n`;
    text += `*Nome:* ${nome}\n`;
    text += `*Telefone:* ${telefone}\n`;
    text += `*Serviço:* ${servicoLabel}`;
    if (mensagem) text += `\n*Mensagem:* ${mensagem}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'noopener,noreferrer');

    form.reset();
    showToast('Redirecionando para o WhatsApp...', 'success');
  });
})();

/* ----- Toast notification ----- */
function showToast(message, type = 'success') {
  const existing = document.getElementById('ds-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.id = 'ds-toast';
  toast.setAttribute('role', 'alert');
  toast.setAttribute('aria-live', 'polite');
  toast.textContent = message;

  Object.assign(toast.style, {
    position:      'fixed',
    bottom:        '6rem',
    left:          '50%',
    transform:     'translateX(-50%) translateY(10px)',
    background:    type === 'success' ? '#1a1a1a' : '#6B1E2A',
    color:         '#fff',
    padding:       '0.8rem 1.8rem',
    borderRadius:  '999px',
    fontSize:      '0.82rem',
    fontFamily:    'Manrope, sans-serif',
    fontWeight:    '500',
    letterSpacing: '0.04em',
    boxShadow:     '0 8px 30px rgba(0,0,0,0.2)',
    zIndex:        '9999',
    opacity:       '0',
    transition:    'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
    whiteSpace:    'nowrap',
  });

  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity   = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity   = '0';
    toast.style.transform = 'translateX(-50%) translateY(10px)';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

/* ----- Animate stats counter ----- */
(function initCounters() {
  const counters = document.querySelectorAll('.ds-sobre__stat-num');
  if (!counters.length) return;

  const animateCount = (el, target, suffix) => {
    const duration = 1800;
    const start    = performance.now();
    const num      = parseInt(target, 10);

    const step = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3);
      const current  = Math.round(ease * num);
      el.textContent = `+${current}${suffix}`;
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const el   = entry.target;
            const text = el.textContent;
            const num  = text.replace(/\D/g, '');
            const suf  = text.replace(/[\d+]/g, '');
            animateCount(el, num, suf);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(el => observer.observe(el));
  }
})();

/* ----- Lazy load images with fade ----- */
(function initLazyImages() {
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  if (!imgs.length) return;

  imgs.forEach(img => {
    img.style.transition = 'opacity 0.6s ease';
    if (!img.complete) {
      img.style.opacity = '0';
      img.addEventListener('load', () => { img.style.opacity = '1'; });
    }
  });
})();
