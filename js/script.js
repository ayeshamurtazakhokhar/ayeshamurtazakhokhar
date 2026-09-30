// Ayesha Murtaza — Portfolio site scripts

document.addEventListener('DOMContentLoaded', () => {
  /* Mobile nav toggle */
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      document.body.classList.toggle('nav-open', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        document.body.classList.remove('nav-open');
      });
    });
  }

  /* Cursor glow follows pointer (desktop only, respects reduced motion) */
  const glow = document.querySelector('.cursor-glow');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (glow && !prefersReduced && window.matchMedia('(pointer: fine)').matches) {
    window.addEventListener('pointermove', (e) => {
      glow.style.setProperty('--x', e.clientX + 'px');
      glow.style.setProperty('--y', e.clientY + 'px');
    });
  } else if (glow) {
    glow.style.display = 'none';
  }

  /* Build the animated waveform bars in the hero timeline visual */
  document.querySelectorAll('.tl-track').forEach(track => {
    const barCount = 42;
    for (let i = 0; i < barCount; i++) {
      const bar = document.createElement('span');
      const delay = (Math.random() * 2.4).toFixed(2);
      const height = 20 + Math.random() * 80;
      bar.style.animationDelay = `${delay}s`;
      bar.style.setProperty('height', `${height}%`);
      track.appendChild(bar);
    }
  });

  /* Portfolio filter (only present on portfolio.html) */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');
  if (filterBtns.length && workCards.length) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.dataset.filter;
        workCards.forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;
          card.style.display = match ? '' : 'none';
        });
      });
    });
  }

  /* Contact form: builds a mailto so it works with zero backend on GitHub Pages */
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const project = form.project.value;
      const message = form.message.value.trim();
      const subject = encodeURIComponent(`Project inquiry from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\nProject type: ${project}\n\n${message}`
      );
      window.location.href = `mailto:ayeshamurtaza088@gmail.com?subject=${subject}&body=${body}`;
    });
  }
});

/* ---- v2 additions: scroll reveal, animated counters, timeline dots ---- */
document.addEventListener('DOMContentLoaded', () => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Generic reveal-on-scroll for .reveal items (skill cards, work cards, timeline steps) */
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    if (prefersReduced || !('IntersectionObserver' in window)) {
      revealEls.forEach(el => el.classList.add('in-view'));
    } else {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      revealEls.forEach(el => io.observe(el));
    }
  }

  /* Timeline dots light up as each step scrolls into view */
  const steps = document.querySelectorAll('.vstep');
  if (steps.length) {
    if (prefersReduced || !('IntersectionObserver' in window)) {
      steps.forEach(el => el.classList.add('in-view'));
    } else {
      const stepIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('in-view');
        });
      }, { threshold: 0.4 });
      steps.forEach(el => stepIO.observe(el));
    }
  }

  /* Animated number counters */
  const counters = document.querySelectorAll('.count[data-target]');
  if (counters.length) {
    const animateCount = (el) => {
      const target = el.dataset.target;
      const numeric = parseFloat(target.replace(/[^\d.]/g, ''));
      const suffix = target.replace(/^[\d.]+/, '');
      if (isNaN(numeric) || prefersReduced) { el.textContent = target; return; }
      const duration = 1200;
      const start = performance.now();
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        el.textContent = Math.floor(progress * numeric) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
    };
    if (!('IntersectionObserver' in window)) {
      counters.forEach(animateCount);
    } else {
      const countIO = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countIO.unobserve(entry.target);
          }
        });
      }, { threshold: 0.6 });
      counters.forEach(el => countIO.observe(el));
    }
  }
});

/* ---- Inline YouTube playback for any element with data-video (work-card tiles + featured spotlight) ---- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-video]').forEach(el => {
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-label', 'Play video');

    const playVideo = () => {
      if (el.classList.contains('is-playing')) return;
      const videoId = el.dataset.video;
      const iframe = document.createElement('iframe');
      iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      iframe.title = 'YouTube video player';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;
      el.innerHTML = '';
      el.appendChild(iframe);
      el.classList.add('is-playing');
    };

    el.addEventListener('click', playVideo);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        playVideo();
      }
    });
  });
});
