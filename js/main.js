/* GCBC — interactions: nav, reveal, lightbox, panels, stats, form */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- scroll progress bar ---------- */
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  document.body.appendChild(progress);
  const updateProgress = () => {
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progress.style.width = (scrolled || 0) + '%';
  };
  document.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();

  /* ---------- hero countdown (flip clock, live to the second) ---------- */
  const countdownEl = document.getElementById('heroCountdown');
  if (countdownEl) {
    const target = new Date(countdownEl.dataset.target);

    const makeGroup = (numDigits, label) => {
      const group = document.createElement('div');
      group.className = 'countdown-group';
      const digitsRow = document.createElement('div');
      digitsRow.className = 'countdown-digits';
      const cards = [];
      for (let i = 0; i < numDigits; i++) {
        const card = document.createElement('div');
        card.className = 'flip-card';
        const span = document.createElement('span');
        span.textContent = '0';
        card.appendChild(span);
        digitsRow.appendChild(card);
        cards.push(span);
      }
      const labelEl = document.createElement('div');
      labelEl.className = 'countdown-label';
      labelEl.textContent = label;
      group.appendChild(digitsRow);
      group.appendChild(labelEl);
      return { group, cards };
    };
    const makeColon = () => {
      const c = document.createElement('div');
      c.className = 'countdown-colon';
      c.textContent = ':';
      return c;
    };

    const daysGroup = makeGroup(3, 'Days');
    const hoursGroup = makeGroup(2, 'Hours');
    const minsGroup = makeGroup(2, 'Min');
    const secsGroup = makeGroup(2, 'Sec');

    countdownEl.appendChild(daysGroup.group);
    countdownEl.appendChild(makeColon());
    countdownEl.appendChild(hoursGroup.group);
    countdownEl.appendChild(makeColon());
    countdownEl.appendChild(minsGroup.group);
    countdownEl.appendChild(makeColon());
    countdownEl.appendChild(secsGroup.group);

    const setDigits = (cards, valueStr) => {
      cards.forEach((span, i) => {
        const newChar = valueStr[i];
        if (span.textContent !== newChar) {
          const card = span.parentElement;
          card.classList.remove('flipping');
          void card.offsetWidth;
          card.classList.add('flipping');
          setTimeout(() => { span.textContent = newChar; }, 250);
        }
      });
    };

    let timer = null;
    const tick = () => {
      const diff = target - new Date();
      if (diff <= 0) {
        clearInterval(timer);
        countdownEl.classList.add('is-done');
        countdownEl.innerHTML = '<div class="countdown-message">Happening Now</div>';
        return;
      }
      const totalSeconds = Math.floor(diff / 1000);
      const days = Math.floor(totalSeconds / 86400);
      const hours = Math.floor((totalSeconds % 86400) / 3600);
      const mins = Math.floor((totalSeconds % 3600) / 60);
      const secs = totalSeconds % 60;
      setDigits(daysGroup.cards, String(days).padStart(3, '0'));
      setDigits(hoursGroup.cards, String(hours).padStart(2, '0'));
      setDigits(minsGroup.cards, String(mins).padStart(2, '0'));
      setDigits(secsGroup.cards, String(secs).padStart(2, '0'));
    };
    tick();
    timer = setInterval(tick, 1000);
  }

  /* ---------- nav scroll state + mobile toggle ---------- */
  const nav = document.querySelector('.site-nav');
  const onScroll = () => {
    if (window.scrollY > 40) nav?.classList.add('scrolled');
    else nav?.classList.remove('scrolled');

    const backBtn = document.querySelector('.back-to-top');
    if (backBtn) backBtn.classList.toggle('show', window.scrollY > 700);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  toggle?.addEventListener('click', () => {
    toggle.classList.toggle('open');
    links.classList.toggle('open');
  });
  links?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    toggle?.classList.remove('open');
    links.classList.remove('open');
  }));

  /* mark active nav link */
  const here = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const target = a.getAttribute('href');
    if (target === here || (here === '' && target === 'index.html')) a.classList.add('active');
  });

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal, .reveal-scale');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => io.observe(el));

  /* stagger children automatically within [data-stagger] containers */
  document.querySelectorAll('[data-stagger]').forEach(container => {
    Array.from(container.children).forEach((child, i) => {
      child.style.transitionDelay = (i * 80) + 'ms';
    });
  });

  /* ---------- animated stat counters ---------- */
  document.querySelectorAll('.stat-num[data-count]').forEach(el => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const counterIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        counterIO.unobserve(entry.target);
        const duration = 1400;
        const start = performance.now();
        const tick = (now) => {
          const p = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    }, { threshold: 0.4 });
    counterIO.observe(el);
  });

  /* ---------- accordion panels (recap sessions) ---------- */
  document.querySelectorAll('.panel-card').forEach(card => {
    const head = card.querySelector('.panel-head');
    const body = card.querySelector('.panel-body');
    head?.addEventListener('click', () => {
      const isOpen = card.classList.contains('open');
      document.querySelectorAll('.panel-card.open').forEach(other => {
        if (other !== card) {
          other.classList.remove('open');
          other.querySelector('.panel-body').style.maxHeight = null;
        }
      });
      card.classList.toggle('open', !isOpen);
      body.style.maxHeight = !isOpen ? body.scrollHeight + 'px' : null;
    });
  });

  /* ---------- lightbox gallery ---------- */
  const galleryImgs = Array.from(document.querySelectorAll('[data-lightbox] img'));
  if (galleryImgs.length) {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `
      <div class="lb-close" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg></div>
      <div class="lb-nav lb-prev" aria-label="Previous"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></div>
      <div class="lb-nav lb-next" aria-label="Next"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 6l6 6-6 6"/></svg></div>
      <img src="" alt="">
    `;
    document.body.appendChild(lb);
    const lbImg = lb.querySelector('img');
    let current = 0;

    const show = (i) => {
      current = (i + galleryImgs.length) % galleryImgs.length;
      lbImg.src = galleryImgs[current].currentSrc || galleryImgs[current].src;
      lbImg.alt = galleryImgs[current].alt || '';
    };
    const open = (i) => { show(i); lb.classList.add('open'); document.body.style.overflow = 'hidden'; };
    const close = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };

    galleryImgs.forEach((img, i) => {
      const trigger = img.closest('.gallery-item') || img.closest('.panel-thumb') || img.closest('.recap-banner-media') || img;
      trigger.addEventListener('click', (e) => { e.stopPropagation(); open(i); });
    });
    lb.querySelector('.lb-close').addEventListener('click', close);
    lb.querySelector('.lb-prev').addEventListener('click', () => show(current - 1));
    lb.querySelector('.lb-next').addEventListener('click', () => show(current + 1));
    lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') show(current + 1);
      if (e.key === 'ArrowLeft') show(current - 1);
    });
  }

  /* ---------- back to top ---------- */
  const back = document.createElement('div');
  back.className = 'back-to-top';
  back.setAttribute('role', 'button');
  back.setAttribute('aria-label', 'Back to top');
  back.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 19V5M5 12l7-7 7 7"/></svg>';
  document.body.appendChild(back);
  back.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- contact form (Formspree) ---------- */
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mljgylny';

  document.querySelectorAll('.gcbc-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const success = form.querySelector('.form-success');
      const error = form.querySelector('.form-error');
      const submitBtn = form.querySelector('button[type="submit"]');

      const data = new FormData(form);
      data.set('submitted_at', new Date().toLocaleString('en-US', { timeZone: 'America/Chicago', dateStyle: 'medium', timeStyle: 'short' }) + ' Central Time');

      if (submitBtn) submitBtn.disabled = true;
      if (error) error.classList.remove('show');

      try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (res.ok) {
          if (success) success.classList.add('show');
          form.reset();
        } else if (error) {
          error.classList.add('show');
        }
      } catch (err) {
        if (error) error.classList.add('show');
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  });

  /* ---------- timeline scroll progress (2026 recap) ---------- */
  const timeline = document.querySelector('.timeline');
  if (timeline) {
    const progressEl = document.createElement('div');
    progressEl.className = 'timeline-progress';
    timeline.prepend(progressEl);
    const items = Array.from(timeline.querySelectorAll('.panel-item'));

    const updateTimelineProgress = () => {
      const rect = timeline.getBoundingClientRect();
      const triggerY = window.innerHeight * 0.4;
      const pct = Math.max(0, Math.min(1, (triggerY - rect.top) / rect.height));
      progressEl.style.height = (pct * 100) + '%';
      items.forEach(item => {
        const itemRect = item.getBoundingClientRect();
        item.classList.toggle('is-passed', itemRect.top < triggerY);
      });
    };
    document.addEventListener('scroll', updateTimelineProgress, { passive: true });
    window.addEventListener('resize', updateTimelineProgress);
    updateTimelineProgress();
  }

  /* ---------- donate page: tier tabs + donor type toggle ---------- */
  const donateTabs = document.querySelectorAll('.donate-tab');
  if (donateTabs.length) {
    donateTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        donateTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        document.querySelectorAll('.donate-panel').forEach(panel => {
          panel.hidden = panel.dataset.panel !== target;
        });
      });
    });
  }

  const donorTypeBtns = document.querySelectorAll('.donor-type-btn');
  if (donorTypeBtns.length) {
    const nameLabel = document.getElementById('donate-name-label');
    const nameInput = document.getElementById('donate-name');
    const tierOptionsEl = document.getElementById('donate-tier-options');
    const tierInput = document.getElementById('donate-tier');
    const donorTypeField = document.querySelector('input[name="donor_type"]');
    const tiers = {
      individual: [
        { value: '$300', label: '$300' },
        { value: '$500', label: '$500' },
        { value: '$1,000', label: '$1,000' }
      ],
      corporate: [
        { value: 'Bronze ($1,000)', label: 'Bronze — $1,000' },
        { value: 'Silver ($3,000)', label: 'Silver — $3,000' },
        { value: 'Gold ($5,000)', label: 'Gold — $5,000' },
        { value: 'Platinum ($8,000)', label: 'Platinum — $8,000' }
      ]
    };
    const renderTiers = (type) => {
      if (!tierOptionsEl) return;
      tierOptionsEl.innerHTML = tiers[type].map((t, i) =>
        `<button type="button" class="tier-chip${i === 0 ? ' active' : ''}" data-value="${t.value}">${t.label}</button>`
      ).join('');
      if (tierInput) tierInput.value = tiers[type][0].value;
      tierOptionsEl.querySelectorAll('.tier-chip').forEach(chip => {
        chip.addEventListener('click', () => {
          tierOptionsEl.querySelectorAll('.tier-chip').forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          if (tierInput) tierInput.value = chip.dataset.value;
        });
      });
    };
    const applyDonorType = (type) => {
      donorTypeBtns.forEach(b => b.classList.toggle('active', b.dataset.donorType === type));
      if (donorTypeField) donorTypeField.value = type === 'individual' ? 'Individual' : 'Corporate';
      if (nameLabel) nameLabel.textContent = type === 'individual' ? 'Donor Name' : 'Company Name';
      if (nameInput) nameInput.placeholder = type === 'individual' ? 'Your full name' : 'Company name';
      renderTiers(type);
    };
    donorTypeBtns.forEach(btn => {
      btn.addEventListener('click', () => applyDonorType(btn.dataset.donorType));
    });
    applyDonorType('corporate');
  }

  /* ---------- page transitions ---------- */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    document.querySelectorAll('a[href]').forEach(a => {
      a.addEventListener('click', (e) => {
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        if (a.target === '_blank' || a.hasAttribute('download')) return;
        const href = a.getAttribute('href') || '';
        if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return;
        if (a.origin !== window.location.origin) return;
        e.preventDefault();
        document.body.classList.add('page-out');
        setTimeout(() => { window.location.href = a.href; }, 280);
      });
    });
  }

});
