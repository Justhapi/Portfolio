document.addEventListener('DOMContentLoaded', () => {

  // ── 0. SCRIBBLES — apply scale-in via class after animation ends ──
  document.querySelectorAll('.scrib').forEach(el => {
    el.addEventListener('animationend', () => el.classList.add('scrib-visible'), { once: true });
  });

  // ── 1. NAVIGATION ── (visible once hero is 80% scrolled past)
  const heroSection = document.getElementById('hero');
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => {
      const threshold = heroSection ? heroSection.offsetHeight * 0.8 : 80;
      nav.classList.toggle('nav-visible', window.scrollY > threshold);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── 1b. HERO CURSOR GLOW ──
  const glowEl = document.getElementById('hero-cursor-glow');
  if (heroSection && glowEl) {
    heroSection.addEventListener('mousemove', e => {
      const r = heroSection.getBoundingClientRect();
      glowEl.style.left = (e.clientX - r.left) + 'px';
      glowEl.style.top  = (e.clientY - r.top)  + 'px';
      heroSection.classList.add('glow-active');
    });
    heroSection.addEventListener('mouseleave', () => {
      heroSection.classList.remove('glow-active');
    });
  }


  // ── 2. CUSTOM CURSOR ──
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (dot && ring) {
    let ringX = 0, ringY = 0, dotX = 0, dotY = 0;

    document.addEventListener('mousemove', e => {
      dotX = e.clientX; dotY = e.clientY;
      dot.style.left = dotX + 'px';
      dot.style.top  = dotY + 'px';
    });

    // Lagged ring follows dot
    (function animateRing() {
      ringX += (dotX - ringX) * 0.14;
      ringY += (dotY - ringY) * 0.14;
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
      requestAnimationFrame(animateRing);
    })();

    const hoverEls = document.querySelectorAll(
      'a, button, .hero-chip, .desktop-icon, .footer-links a'
    );
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        dot.classList.add('hovering');
        ring.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        dot.classList.remove('hovering');
        ring.classList.remove('hovering');
      });
    });
  }

  // ── 3. CHIP TOOLTIPS ──
  function setupChipTooltip(chipId, tooltipId) {
    const chip = document.getElementById(chipId);
    const tip  = document.getElementById(tooltipId);
    if (!chip || !tip) return;
    chip.addEventListener('mouseenter', () => tip.classList.add('visible'));
    chip.addEventListener('mouseleave', () => tip.classList.remove('visible'));
    chip.addEventListener('mousemove', e => {
      tip.style.left = (e.clientX + 18) + 'px';
      tip.style.top  = (e.clientY + 18) + 'px';
    });
  }
  setupChipTooltip('chip-artist',   'tooltip-artist');
  setupChipTooltip('chip-designer', 'tooltip-designer');

  // ── 4. SCROLL REVEAL (.reveal) ──
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  // ── 5. PROJECTS CAROUSEL ──
  const projectsSection = document.querySelector('.projects');
  const projectsSticky  = document.querySelector('.projects-sticky');
  const glanceRows      = Array.from(document.querySelectorAll('.glance-row'));
  const cDots           = Array.from(document.querySelectorAll('.c-dot'));
  const COUNT           = glanceRows.length;

  let activeIdx = 0;
  let autoTimer = null;
  const PX_PER_SLIDE = window.innerHeight * 1.1;

  function applyPeek() {
    glanceRows.forEach(r => r.classList.remove('peek-left', 'peek-right'));
    const prevIdx = ((activeIdx - 1) + COUNT) % COUNT;
    const nextIdx = (activeIdx + 1) % COUNT;
    if (prevIdx !== activeIdx) glanceRows[prevIdx].classList.add('peek-left');
    if (nextIdx !== activeIdx) glanceRows[nextIdx].classList.add('peek-right');
  }

  function setActive(next, dir = 1) {
    next = ((next % COUNT) + COUNT) % COUNT;
    if (next === activeIdx) return;

    const prev = activeIdx;
    activeIdx  = next;

    glanceRows[prev].classList.remove('active', 'peek-left', 'peek-right');
    glanceRows[prev].classList.add(dir >= 0 ? 'exit-left' : 'exit-right');
    setTimeout(() => {
      glanceRows[prev].classList.remove('exit-left', 'exit-right');
      applyPeek();
    }, 1200);

    glanceRows[activeIdx].classList.remove('peek-left', 'peek-right');
    glanceRows[activeIdx].classList.add('active');
    applyPeek();

    cDots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => setActive(activeIdx + 1, 1), 7000);
  }

  // Boot
  glanceRows[0].classList.add('active');
  cDots[0]?.classList.add('active');
  applyPeek();
  resetAuto();

  // Dot clicks
  cDots.forEach((dot, i) => {
    dot.addEventListener('click', () => { setActive(i, i > activeIdx ? 1 : -1); resetAuto(); });
  });

  // Helper: fraction of viewport covered by a rect
  function vpOverlap(rect) {
    const top    = Math.max(rect.top, 0);
    const bottom = Math.min(rect.bottom, window.innerHeight);
    return bottom > top ? (bottom - top) / window.innerHeight : 0;
  }

  // Horizontal swipe/trackpad drives carousel when sticky panel is in view
  let hWheelAcc = 0;
  let hWheelTimer = null;
  const H_THRESHOLD = 400;

  window.addEventListener('wheel', (e) => {
    if (!projectsSection) return;
    const rect = projectsSection.getBoundingClientRect();
    // Only intercept when the projects section is pinned (visible in viewport)
    if (rect.top > window.innerHeight || rect.bottom < 0) return;

    const dx = Math.abs(e.deltaX);
    const dy = Math.abs(e.deltaY);
    // Only act on predominantly horizontal swipes
    if (dx <= dy * 0.5) return;

    // Yield to the fan carousel if it is more visible
    if (fanEl) {
      const fanRect = fanEl.getBoundingClientRect();
      if (vpOverlap(fanRect) > vpOverlap(rect)) return;
    }

    e.preventDefault();
    hWheelAcc += e.deltaX;

    clearTimeout(hWheelTimer);
    hWheelTimer = setTimeout(() => { hWheelAcc = 0; }, 300);

    if (hWheelAcc > H_THRESHOLD) {
      hWheelAcc = 0;
      setActive(activeIdx + 1, 1);
      resetAuto();
    } else if (hWheelAcc < -H_THRESHOLD) {
      hWheelAcc = 0;
      setActive(activeIdx - 1, -1);
      resetAuto();
    }
  }, { passive: false });

  // ── 5b. BEYOND DESIGN FAN CAROUSEL ──
  const fanEl       = document.getElementById('agFan');
  const fanSection  = document.getElementById('art-gallery');
  const fanCards    = fanEl ? Array.from(fanEl.querySelectorAll('.ag-fan-card')) : [];
  const fanLabelEl  = document.querySelector('.ag-fan-label');
  const fanTitleEl  = document.querySelector('.ag-fan-title');
  const fanSubEl    = document.querySelector('.ag-fan-sub');
  const FAN_COUNT   = fanCards.length;
  const FAN_DATA    = [
    { title: 'Pixel Illustration',      sub: 'Drawing since before I could spell "design" — character sprites are my comfort zone' },
    { title: 'Analog Sketchbook',        sub: 'Every project starts on paper. Messy, honest, and surprisingly effective' },
    { title: 'UX Knowledge Graph',       sub: 'Every time I learn something new UX related, I store it in my Obsidian notes' },
    { title: 'Street Photography',       sub: 'A camera is just another way to compose — light, framing, negative space' },
    { title: 'Annotated Reading',        sub: 'I dog-ear, highlight, and argue with every design book I pick up' },
  ];

  let fanActive = 2; // start centered on Obsidian card

  function getFanTransform(offset) {
    const abs = Math.abs(offset);
    return {
      tx:      offset * 210,
      ty:      0,
      rot:     offset * 10,
      scale:   1 - abs * 0.06,
      opacity: 1 - abs * 0.18,
      zIndex:  10 - abs * 3,
    };
  }

  let fanRevealed = false;

  function renderFan(animate) {
    fanCards.forEach((card, i) => {
      let offset = i - fanActive;
      if (offset >  FAN_COUNT / 2) offset -= FAN_COUNT;
      if (offset < -FAN_COUNT / 2) offset += FAN_COUNT;
      const { tx, ty, rot, scale, opacity, zIndex } = getFanTransform(offset);
      if (!animate) card.style.transition = 'none';
      card.style.transform = `translateX(${tx}px) translateY(${ty}px) rotate(${rot}deg) scale(${scale})`;
      card.style.opacity   = fanRevealed ? opacity : 0;
      card.style.zIndex    = zIndex;
      card.style.cursor    = offset === 0 ? 'default' : 'pointer';
      if (!animate) requestAnimationFrame(() => { card.style.transition = ''; });
    });
  }

  function setFanLabel() {
    if (!fanLabelEl) return;
    fanLabelEl.classList.add('changing');
    setTimeout(() => {
      if (fanTitleEl) fanTitleEl.textContent = FAN_DATA[fanActive].title;
      if (fanSubEl)   fanSubEl.textContent   = FAN_DATA[fanActive].sub;
      fanLabelEl.classList.remove('changing');
    }, 200);
  }

  function advanceFan(dir) {
    fanActive = ((fanActive + dir) % FAN_COUNT + FAN_COUNT) % FAN_COUNT;
    renderFan(true);
    setFanLabel();
  }

  if (fanEl && FAN_COUNT > 0) {
    renderFan(false);
    setFanLabel();

    // Gather in when 70% of the section is visible
    const fanObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          fanRevealed = true;

          // Step 1: place all cards at pushed-out start positions instantly
          fanCards.forEach((card, i) => {
            let offset = i - fanActive;
            if (offset >  FAN_COUNT / 2) offset -= FAN_COUNT;
            if (offset < -FAN_COUNT / 2) offset += FAN_COUNT;
            const { tx, ty, rot, scale, zIndex } = getFanTransform(offset);
            const gatherX = offset * 180;
            card.style.transition = 'none';
            card.style.transform  = `translateX(${tx + gatherX}px) translateY(${ty}px) rotate(${rot}deg) scale(${scale})`;
            card.style.opacity    = 0;
            card.style.zIndex     = zIndex;
          });

          // Step 2: animate each card in one by one with staggered delays
          fanCards.forEach((card, i) => {
            setTimeout(() => {
              let offset = i - fanActive;
              if (offset >  FAN_COUNT / 2) offset -= FAN_COUNT;
              if (offset < -FAN_COUNT / 2) offset += FAN_COUNT;
              const { tx, ty, rot, scale, opacity } = getFanTransform(offset);
              card.style.transition = '';
              card.style.transform  = `translateX(${tx}px) translateY(${ty}px) rotate(${rot}deg) scale(${scale})`;
              card.style.opacity    = opacity;
            }, i * 220);
          });

          fanObserver.disconnect();
        }
      });
    }, { threshold: 0.7 });
    if (fanSection) fanObserver.observe(fanSection);

    // Click side cards to navigate
    fanCards.forEach((card, i) => {
      card.addEventListener('click', () => {
        let offset = i - fanActive;
        if (offset >  FAN_COUNT / 2) offset -= FAN_COUNT;
        if (offset < -FAN_COUNT / 2) offset += FAN_COUNT;
        if (offset !== 0) advanceFan(Math.sign(offset));
      });
    });

    // Horizontal wheel / trackpad swipe
    let fanWheelAcc = 0;
    let fanWheelTimer = null;
    const FAN_H_THRESHOLD = 400;

    window.addEventListener('wheel', (e) => {
      const rect = fanEl.getBoundingClientRect();
      if (rect.top > window.innerHeight || rect.bottom < 0) return;
      const dx = Math.abs(e.deltaX), dy = Math.abs(e.deltaY);
      if (dx <= dy * 0.5) return;
      // Yield to the projects carousel if it is more visible
      if (projectsSection) {
        const projRect = projectsSection.getBoundingClientRect();
        if (vpOverlap(projRect) > vpOverlap(rect)) return;
      }
      e.preventDefault();
      fanWheelAcc += e.deltaX;
      clearTimeout(fanWheelTimer);
      fanWheelTimer = setTimeout(() => { fanWheelAcc = 0; }, 300);
      if (fanWheelAcc >  FAN_H_THRESHOLD) { fanWheelAcc = 0; advanceFan(1); }
      else if (fanWheelAcc < -FAN_H_THRESHOLD) { fanWheelAcc = 0; advanceFan(-1); }
    }, { passive: false });

    // Touch / drag support
    let fanTouchX = null;
    fanEl.addEventListener('touchstart', e => { fanTouchX = e.touches[0].clientX; }, { passive: true });
    fanEl.addEventListener('touchend',   e => {
      if (fanTouchX === null) return;
      const diff = fanTouchX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) advanceFan(diff > 0 ? 1 : -1);
      fanTouchX = null;
    }, { passive: true });
  }

  // ── 5c. PARALLAX SYSTEM ──
  // Uses the CSS `translate` standalone property so it stacks on top of any existing `transform`.

  // glance-img-card and glance-text parallax removed — they're now in a sticky
  // carousel with absolute stacking; viewport-relative parallax doesn't apply.
  const heroChar      = document.querySelector('.hero-char-col');
  const heroContent   = document.querySelector('.hero-content');
  const heroStatement = document.querySelector('.hero-statement');

  const imacScene     = document.querySelector('.workspace');

  const scribLayers = [
    { sel: '.scrib-hero-ul',     rate:  0.045 },
    { sel: '.scrib-proj-pencil', rate:  0.07  },
    { sel: '.scrib-proj-wave',   rate: -0.05  },
    { sel: '.scrib-ws-dashes',   rate:  0.06  },
    { sel: '.scrib-footer-wm',   rate:  0.03  },
  ].map(({ sel, rate }) => ({ el: document.querySelector(sel), rate }))
   .filter(({ el }) => el);

  // Fan card parallax: each card drifts at a different rate as the section scrolls through
  const fanParallaxRates = [-0.05, 0.05, 0, 0.05, -0.05];

  function updateParallax() {
    const scrollY = window.scrollY;
    const vh      = window.innerHeight;

    // Hero — char and statement move together (strong parallax depth layer)
    if (scrollY < vh * 1.4) {
      if (heroChar)       heroChar.style.translate      = `0 ${(scrollY * 0.38).toFixed(1)}px`;
      if (heroStatement)  heroStatement.style.translate = `0 ${(scrollY * 0.38).toFixed(1)}px`;
      if (heroContent)    heroContent.style.translate   = `0 ${(scrollY * 0.07).toFixed(1)}px`;
    }

    // iMac — drifts DOWN as you scroll past, partially tucking behind footer
    if (imacScene) {
      const rect = imacScene.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < vh) {
        const scrolledPast = Math.max(0, vh - rect.top) / (vh + rect.height);
        imacScene.style.translate = `0 ${(scrolledPast * rect.height * 0.08).toFixed(1)}px`;
      }
    }

    // Beyond Design fan cards — each drifts vertically at a different rate
    if (fanSection && fanCards.length) {
      const rect   = fanSection.getBoundingClientRect();
      const offset = (rect.top + rect.height / 2) - vh / 2;
      fanCards.forEach((card, i) => {
        const dy = (offset * fanParallaxRates[i] ?? 0).toFixed(1);
        card.style.translate = `0 ${dy}px`;
      });
    }

    scribLayers.forEach(({ el, rate }) => {
      el.style.translate = `0 ${(scrollY * rate).toFixed(1)}px`;
    });
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();

  // ── 5d. FOOTER BORDER — mouse reactive gradient ──
  const footerEl = document.querySelector('footer');
  if (footerEl) {
    footerEl.addEventListener('mousemove', (e) => {
      const rect = footerEl.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
      footerEl.style.setProperty('--ft-x', x + '%');
    });
    footerEl.addEventListener('mouseleave', () => {
      footerEl.style.setProperty('--ft-x', '50%');
    });
  }

  // ── 6. EMAIL COPY ──
  const emailBtn = document.getElementById('emailCopyBtn');
  if (emailBtn) {
    emailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText('likathleen094@gmail.com').then(() => {
        emailBtn.classList.add('copied');
        setTimeout(() => emailBtn.classList.remove('copied'), 1800);
      });
    });
  }

  // ── 7. DESKTOP ICON DRAG — single shared window listeners ──
  let activeIconDrag = null; // { icon, startX, startY, origLeft, origTop }

  document.querySelectorAll('.desktop-icon').forEach(icon => {
    icon.addEventListener('mousedown', e => {
      e.preventDefault();
      const rect   = icon.getBoundingClientRect();
      const parent = icon.offsetParent.getBoundingClientRect();
      const origLeft = rect.left - parent.left;
      const origTop  = rect.top  - parent.top;
      icon.style.left = origLeft + 'px'; icon.style.top = origTop + 'px';
      icon.style.right = 'auto'; icon.style.bottom = 'auto';
      icon.classList.add('is-dragging');
      activeIconDrag = { icon, startX: e.clientX, startY: e.clientY, origLeft, origTop };
    });

    icon.addEventListener('touchstart', e => {
      const t = e.touches[0];
      const rect   = icon.getBoundingClientRect();
      const parent = icon.offsetParent.getBoundingClientRect();
      const origLeft = rect.left - parent.left;
      const origTop  = rect.top  - parent.top;
      icon.style.left = origLeft + 'px'; icon.style.top = origTop + 'px';
      icon.style.right = 'auto'; icon.style.bottom = 'auto';
      icon.classList.add('is-dragging');
      activeIconDrag = { icon, startX: t.clientX, startY: t.clientY, origLeft, origTop };
    }, { passive: true });
  });

  window.addEventListener('mousemove', e => {
    if (!activeIconDrag) return;
    const { icon, startX, startY, origLeft, origTop } = activeIconDrag;
    icon.style.left = (origLeft + e.clientX - startX) + 'px';
    icon.style.top  = (origTop  + e.clientY - startY) + 'px';
  });

  window.addEventListener('mouseup', e => {
    if (!activeIconDrag) return;
    const { icon, origLeft, origTop } = activeIconDrag;
    icon.classList.remove('is-dragging');
    const movedX = Math.abs(parseFloat(icon.style.left) - origLeft);
    const movedY = Math.abs(parseFloat(icon.style.top)  - origTop);
    if (movedX >= 5 || movedY >= 5) e.stopPropagation();
    activeIconDrag = null;
  });

  window.addEventListener('touchmove', e => {
    if (!activeIconDrag) return;
    const t = e.touches[0];
    const { icon, startX, startY, origLeft, origTop } = activeIconDrag;
    icon.style.left = (origLeft + t.clientX - startX) + 'px';
    icon.style.top  = (origTop  + t.clientY - startY) + 'px';
  }, { passive: true });

  window.addEventListener('touchend', () => {
    if (!activeIconDrag) return;
    activeIconDrag.icon.classList.remove('is-dragging');
    activeIconDrag = null;
  });

  // ── 9. ICON BROWSER WINDOWS (multiple, draggable, no overlay) ──
  const imacScreen       = document.querySelector('.workspace');
  const workspaceSection = document.querySelector('.workspace');
  let   winZTop          = 30; // stacking counter
  let   lastWinSection   = -1; // 0=left, 1=middle, 2=right — tracks last spawn zone

  const iconContent = {
    'icon-about': {
      title: 'About — Kathleen Li',
      html: `
        <div class="icon-modal-img"><div class="icon-modal-img-placeholder caveat">Add photo — img/about.jpg</div></div>
        <h2>Kathleen Li</h2>
        <p>Digital artist turned UX/UI designer. I translate artistic vision into interaction systems — from visual thinking to structured design.</p>
        <p><em>Purdue University · 2025</em></p>
      `,
    },
    'icon-tools': {
      title: 'Design Tools',
      html: `
        <h2>Design Tools</h2>
        <ul>
          <li>Figma</li>
          <li>ProtoPie</li>
          <li>Adobe Creative Suite</li>
          <li>Miro · Notion</li>
          <li>VS Code · HTML / CSS / JS</li>
        </ul>
      `,
    },
    'icon-wip': {
      title: 'Works in Progress',
      html: `
        <h2>WIPs</h2>
        <ul>
          <li>JourneyTrack UI system</li>
          <li>Purdue Stack prototype</li>
          <li>CorpusKey interaction flows</li>
          <li>Personal illustration series</li>
        </ul>
      `,
    },
    'icon-camera': {
      title: 'Inspirations',
      html: `
        <h2>Inspo</h2>
        <ul>
          <li>Refik Anadol — data as material</li>
          <li>Hiroshi Ishii — tangible bits</li>
          <li>Dieter Rams — less but better</li>
          <li>Studio Ghibli — world-building</li>
          <li>Sagmeister &amp; Walsh — risk-taking design</li>
        </ul>
      `,
    },
  };

  function placeWin(win, section, posRand, posRand2, above) {
    const wsr  = workspaceSection.getBoundingClientRect();
    const sr   = imacScreen.getBoundingClientRect();
    const winW = win.offsetWidth  || parseInt(win.style.width)  || 280;
    const winH = win.offsetHeight || 300;

    const wsW = wsr.width;
    const wsH = wsr.height;

    // iMac screen rect in workspace-relative coords
    const sL = sr.left - wsr.left;
    const sT = sr.top  - wsr.top;
    const sR = sL + sr.width;
    const sB = sT + sr.height;

    // Each section is the full open zone around the screen.
    // posRand  = normalised x within that zone
    // posRand2 = normalised y within that zone
    let x, y;
    if (section === 0) {
      // Full left strip: x in [0 … sL-winW], y in [0 … wsH-winH]
      x = posRand  * Math.max(0, sL - winW);
      y = posRand2 * Math.max(0, wsH - winH);
    } else if (section === 1) {
      // Top or bottom strip: full width, y above sT or below sB
      if (above) {
        x = posRand  * Math.max(0, wsW - winW);
        y = posRand2 * Math.max(0, sT - winH);
      } else {
        x = posRand  * Math.max(0, wsW - winW);
        y = sB + posRand2 * Math.max(0, wsH - sB - winH);
      }
    } else {
      // Full right strip: x in [sR … wsW-winW], y in [0 … wsH-winH]
      x = sR + posRand  * Math.max(0, wsW - sR - winW);
      y = posRand2 * Math.max(0, wsH - winH);
    }

    win.style.left = Math.round(x) + 'px';
    win.style.top  = Math.round(y) + 'px';
  }

  // Reposition all live windows when the browser is resized
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      workspaceSection.querySelectorAll('.icon-win').forEach(win => {
        if (win.dataset.userMoved) return; // skip manually dragged notes
        placeWin(
          win,
          parseInt(win.dataset.section),
          parseFloat(win.dataset.posRand),
          parseFloat(win.dataset.posRand2),
          win.dataset.above === '1'
        );
      });
    }, 80);
  });

  function spawnWindow(iconId) {
    if (!imacScreen || !workspaceSection) return;
    const data = iconContent[iconId];
    if (!data) return;

    winZTop++;
    const win = document.createElement('div');
    win.className = 'icon-win';
    win.style.zIndex = winZTop;

    // Spawn as a sticky note outside the iMac screen, section-aware
    const wsr  = workspaceSection.getBoundingClientRect();
    const sr   = imacScreen.getBoundingClientRect();
    const winW = Math.min(280, sr.width  * 0.6);
    const winH = Math.min(300, sr.height * 0.55);

    // Screen rect in workspace-relative coords
    const sL = sr.left - wsr.left;
    const sT = sr.top  - wsr.top;
    const sR = sL + sr.width;
    const sB = sT + sr.height;
    const GAP = 8;

    // Pick a section (0=left, 1=middle, 2=right) different from the last one
    const available = [0, 1, 2].filter(s => s !== lastWinSection);
    const section   = available[Math.floor(Math.random() * available.length)];
    lastWinSection  = section;

    // Two independent seeds for both axes — gives scattered, non-grid placement
    const posRand  = Math.random(); // position along the edge
    const posRand2 = Math.random(); // depth offset away from screen
    const above    = Math.random() < 0.5; // for middle section only

    // Store layout data so resize can recalculate
    win.dataset.section  = section;
    win.dataset.posRand  = posRand;
    win.dataset.posRand2 = posRand2;
    win.dataset.above    = above ? '1' : '0';

    win.style.width          = winW + 'px';
    win.style.transformOrigin = 'center center';

    placeWin(win, section, posRand, posRand2, above);

    win.innerHTML = `
      <div class="icon-win-bar">
        <div class="icon-win-dots">
          <span class="modal-dot modal-dot-red  icon-win-close"></span>
          <span class="modal-dot modal-dot-yellow"></span>
          <span class="modal-dot modal-dot-green"></span>
        </div>
        <span class="icon-modal-title">${data.title}</span>
        <div class="icon-modal-bar-right"></div>
      </div>
      <div class="icon-modal-body">${data.html}</div>
    `;

    workspaceSection.appendChild(win);

    // Close on red dot
    win.querySelector('.icon-win-close').addEventListener('click', e => {
      e.stopPropagation();
      win.remove();
    });

    // Bring to front on click
    win.addEventListener('mousedown', () => {
      winZTop++;
      win.style.zIndex = winZTop;
    });

    // Drag the window by its bar — bounds are the whole workspace section
    const bar = win.querySelector('.icon-win-bar');
    let dx = 0, dy = 0, draggingWin = false;

    bar.addEventListener('mousedown', e => {
      e.preventDefault();
      draggingWin = true;
      dx = e.clientX - win.offsetLeft;
      dy = e.clientY - win.offsetTop;
      winZTop++;
      win.style.zIndex = winZTop;
      win.style.transform = 'scale(1)'; // ensure no leftover transform when grabbed
      win.classList.add('is-dragging');
    });
    window.addEventListener('mousemove', e => {
      if (!draggingWin) return;
      const wsr  = workspaceSection.getBoundingClientRect();
      // Bounds extend to full page, converted to workspace-relative coords
      const minX = -wsr.left;
      const minY = -wsr.top;
      const maxX = document.documentElement.clientWidth  - wsr.left - win.offsetWidth;
      const maxY = document.documentElement.scrollHeight - wsr.top  - win.offsetHeight;
      win.style.left = Math.max(minX, Math.min(e.clientX - dx, maxX)) + 'px';
      win.style.top  = Math.max(minY, Math.min(e.clientY - dy, maxY)) + 'px';
    });
    window.addEventListener('mouseup', () => {
      if (draggingWin) win.dataset.userMoved = '1';
      draggingWin = false;
      win.classList.remove('is-dragging');
    });
  }


  Object.keys(iconContent).forEach(iconId => {
    document.getElementById(iconId)?.addEventListener('click', e => {
      e.stopPropagation();
      spawnWindow(iconId);
    });
  });

  // ── 10. ART GALLERY LIGHTBOX ──
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightboxImg');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const lightboxClose = document.getElementById('lightboxClose');

  function openLightbox(src, title) {
    lightboxImg.src = src;
    lightboxImg.alt = title;
    lightboxTitle.textContent = title;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    // Clear src after transition so image doesn't flash on reopen
    setTimeout(() => { lightboxImg.src = ''; }, 350);
  }

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      openLightbox(item.dataset.src, item.dataset.title);
    });
  });

  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && lightbox?.classList.contains('open')) closeLightbox();
  });


  // ── 12. LINE-REVEAL — watch .reveal-lines containers ──
  const lineRevObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        lineRevObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal-lines').forEach(el => lineRevObs.observe(el));

  // ── 11c. ART GALLERY — scattered card spread ──
  const agSection = document.querySelector('.art-gallery-section');
  const agCards   = Array.from(document.querySelectorAll('.ag-card'));

  // Set base positions
  agCards.forEach(card => {
    card.style.left = `calc(50% + ${parseFloat(card.dataset.x || 0)}%)`;
    card.style.top  = '50%';
  });

  // Parallax — each card uses its own data-speed for independent vertical drift
  function updateAgParallax() {
    if (!agSection) return;
    const rect = agSection.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    // offset: px distance of section center from viewport center
    const offset = (rect.top + rect.height / 2) - window.innerHeight / 2;
    agCards.forEach(card => {
      const rot   = parseFloat(card.dataset.rotate || 0);
      const x     = parseFloat(card.dataset.x || 0);
      const baseY = parseFloat(card.dataset.y || 0);
      const speed = parseFloat(card.dataset.speed || 0);
      const parallaxY = baseY + offset * speed;
      card.style.left      = `calc(50% + ${x}%)`;
      card.style.top       = '50%';
      card.style.transform = `translate(-50%, -50%) rotate(${rot}deg) translateY(${parallaxY.toFixed(2)}px)`;
    });
  }
  window.addEventListener('scroll', updateAgParallax, { passive: true });
  requestAnimationFrame(updateAgParallax);


  // ── 12. MAGNETIC HOVER on .magnetic elements ──
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r   = el.getBoundingClientRect();
      const cx  = r.left + r.width  / 2;
      const cy  = r.top  + r.height / 2;
      const dx  = (e.clientX - cx) * 0.35;
      const dy  = (e.clientY - cy) * 0.35;
      el.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = '';
    });
  });

  // ── 14. HOVER cursor update for footer nav links ──
  document.querySelectorAll('.footer-nav-link, .footer-nav').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot?.classList.add('hovering');
      ring?.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      dot?.classList.remove('hovering');
      ring?.classList.remove('hovering');
    });
  });

});

// ── 7. CHARACTER SPRITE ──
(function () {
  const scene = document.querySelector('.workspace');
  const char  = document.getElementById('char');
  const img   = document.getElementById('charImg');
  if (!scene || !char || !img) return;

  const CHAR_W = 64, CHAR_H = 64;
  const WALK_SPEED = 50, GRAVITY = 900;
  const STAND_MIN = 1.2, STAND_RAND = 1.5;
  const WALK_FRAME_INTERVAL = 0.3;
  const WALK_FRAMES = ['img/walk1.png', 'img/walk2.png'];
  const FRAMES = {
    standing:   'img/stand.png',
    grabbed:    'img/hanging.png',
    falling:    'img/falling.png',
    recovering: 'img/getting-up.png',
  };

  let state = 'standing', x = 140, y = 140;
  let targetX = x, targetY = y;
  let vy = 0, fallLimit = 0;
  let facingRight = true, stateTimer = 0;
  let grabbed = false, lastTime = null;
  let walkFrameTimer = 0, walkFrameIndex = 0;
  let standPause = 0;
  let lean = 0, prevXLean = 140;

  const W = () => scene.clientWidth;
  const H = () => scene.clientHeight;
  const clampX = v => Math.max(0, Math.min(W() - CHAR_W, v));
  const clampY = v => Math.max(0, Math.min(H() - CHAR_H, v));
  const rndPause = () => STAND_MIN + Math.random() * STAND_RAND;
  const pickTarget = () => ({
    x: 20 + Math.random() * (W() - CHAR_W - 40),
    y: 20 + Math.random() * (H() - CHAR_H - 40),
  });

  function setState(s) {
    state = s; stateTimer = 0;
    if (s === 'standing')  { standPause = rndPause(); img.src = FRAMES.standing; }
    else if (s === 'walking') { walkFrameTimer = 0; walkFrameIndex = 0; img.src = WALK_FRAMES[0]; }
    else img.src = FRAMES[s] || FRAMES.standing;
  }

  function loop(ts) {
    if (!lastTime) lastTime = ts;
    const dt = Math.min((ts - lastTime) / 1000, 0.05);
    lastTime = ts;

    if (!grabbed) {
      stateTimer += dt;

      if (state === 'standing' && stateTimer > standPause) {
        const t = pickTarget();
        targetX = t.x; targetY = t.y;
        facingRight = targetX > x;
        setState('walking');

      } else if (state === 'walking') {
        walkFrameTimer += dt;
        if (walkFrameTimer >= WALK_FRAME_INTERVAL) {
          walkFrameTimer = 0;
          walkFrameIndex = (walkFrameIndex + 1) % WALK_FRAMES.length;
          img.src = WALK_FRAMES[walkFrameIndex];
        }
        const dx = targetX - x, dy = targetY - y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        facingRight = dx > 0;
        if (dist < 3) { x = targetX; y = targetY; setState('standing'); }
        else { x += (dx / dist) * WALK_SPEED * dt; y += (dy / dist) * WALK_SPEED * dt; }

      } else if (state === 'falling') {
        vy += GRAVITY * dt;
        y  += vy * dt;
        if (y >= fallLimit) { y = fallLimit; vy = 0; setState('recovering'); }

      } else if (state === 'recovering' && stateTimer > 0.9) {
        setState('standing');
      }

      x = clampX(x); y = clampY(y);
    }

    // Lean: tilt based on horizontal drag velocity when grabbed, spring back otherwise
    const vxFrame    = (x - prevXLean) / dt;
    prevXLean        = x;
    const leanTarget = grabbed ? Math.max(-18, Math.min(18, vxFrame * 0.28)) : 0;
    lean += (leanTarget - lean) * Math.min(1, dt * (grabbed ? 10 : 6));

    char.style.left      = x + 'px';
    char.style.top       = y + 'px';
    char.style.transform = `rotate(${lean.toFixed(2)}deg)`;
    img.style.transform  = facingRight ? 'scaleX(-1)' : '';
    requestAnimationFrame(loop);
  }

  function startGrab() {
    grabbed = true;
    char.classList.add('is-grabbed');
    setState('grabbed');
    vy = 0;
  }
  function moveGrab(cx, cy) {
    if (!grabbed) return;
    const sr = scene.getBoundingClientRect();
    x = clampX(cx - sr.left - CHAR_W / 2);
    y = clampY(cy - sr.top  - CHAR_H / 2);
    char.style.left = x + 'px';
    char.style.top  = y + 'px';
  }
  function endGrab() {
    if (!grabbed) return;
    grabbed = false;
    char.classList.remove('is-grabbed');
    vy = 0;
    fallLimit = Math.min(y + 100, H() - CHAR_H);
    setState('falling');
  }

  standPause = rndPause();

  char.addEventListener('mousedown', e => { e.preventDefault(); e.stopPropagation(); startGrab(); });
  window.addEventListener('mousemove', e => { if (grabbed) moveGrab(e.clientX, e.clientY); });
  window.addEventListener('mouseup',   ()  => { if (grabbed) endGrab(); });

  char.addEventListener('touchstart', e  => { e.preventDefault(); startGrab(); }, { passive: false });
  window.addEventListener('touchmove', e => {
    if (!grabbed) return;
    e.preventDefault();
    moveGrab(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: false });
  window.addEventListener('touchend', () => { if (grabbed) endGrab(); });

  setState('standing');
  requestAnimationFrame(loop);
})();

// ── FLOATING SVG DOODLES (hero-left + footer) ──
(function () {
  // Raw SVG strings — colors applied via colorize() below
  const RAW_STARS = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="116" height="121" viewBox="0 0 116 121" fill="none"><path d="M56.5 5C59 5 72 43 72 43C72 43 110.5 55 110.5 58C110.5 61 75.1365 70.5 75.1365 70.5C75.1365 70.5 59 116 56.5 115.5C54 115 41.1366 70.5 41.1366 70.5C41.1366 70.5 5 59.5 5 57C5 54.5 41.1366 44 41.1366 44C41.1366 44 54 5 56.5 5Z" fill="white"/><path d="M56.6562 2.50391C57.421 2.54684 57.9747 2.89589 58.2441 3.09375C58.5669 3.33078 58.8211 3.60428 59.0049 3.82422C59.3767 4.26937 59.7299 4.82486 60.0537 5.39062C60.7145 6.54509 61.4695 8.1249 62.2646 9.92871C63.8642 13.5575 65.743 18.3611 67.5283 23.1221C69.3172 27.8925 71.0262 32.6593 72.2871 36.2305C72.9177 38.0166 73.4372 39.5051 73.7988 40.5479C73.854 40.707 73.9044 40.8563 73.9521 40.9941C74.0936 41.0389 74.2465 41.0868 74.4102 41.1387C75.4674 41.4741 76.9773 41.956 78.7881 42.5439C82.4079 43.7192 87.24 45.3195 92.0771 47.0156C96.9029 48.7078 101.78 50.5117 105.469 52.0928C107.301 52.8782 108.919 53.6415 110.107 54.3359C110.691 54.6768 111.271 55.0585 111.736 55.4756C111.969 55.6842 112.245 55.9648 112.478 56.3184C112.702 56.6597 113 57.2416 113 58C113 59.3359 112.106 60.1932 111.78 60.4883C111.322 60.9027 110.76 61.2639 110.211 61.5742C109.092 62.2068 107.584 62.8741 105.895 63.543C102.489 64.8911 97.9961 66.382 93.5605 67.7617C89.1124 69.1453 84.6699 70.4332 81.3428 71.374C79.6782 71.8447 78.2904 72.2301 77.3184 72.4971C77.2258 72.5225 77.1367 72.5461 77.0518 72.5693C76.9741 72.7865 76.8873 73.0306 76.791 73.2988C76.3437 74.5453 75.7023 76.3249 74.9248 78.458C73.3702 82.7233 71.2701 88.4097 69.0898 94.084C66.9129 99.7496 64.6423 105.439 62.751 109.695C61.8104 111.812 60.9347 113.64 60.1914 114.946C59.8284 115.584 59.4399 116.201 59.04 116.68C58.8462 116.912 58.5617 117.219 58.1904 117.475C57.8676 117.697 57.0661 118.162 56.0098 117.951C55.1871 117.787 54.6612 117.291 54.457 117.084C54.1962 116.82 53.9858 116.529 53.8242 116.282C53.4961 115.781 53.1712 115.153 52.8574 114.481C52.2206 113.119 51.4841 111.26 50.6982 109.119C49.1202 104.821 47.2632 99.1675 45.4961 93.5645C43.7265 87.9537 42.0372 82.3617 40.79 78.1748C40.1663 76.0807 39.6525 74.3361 39.2949 73.1152C39.2289 72.8897 39.1684 72.6819 39.1133 72.4932C39.0277 72.4667 38.9379 72.4399 38.8447 72.4111C37.8526 72.1042 36.4365 71.6628 34.7373 71.126C31.3401 70.0527 26.805 68.5935 22.2656 67.0547C17.7367 65.5194 13.1612 63.8908 9.70117 62.4785C7.98273 61.7771 6.46712 61.0998 5.35352 60.4912C4.80856 60.1934 4.26041 59.8597 3.81641 59.4941C3.59619 59.3128 3.32066 59.0574 3.08105 58.7275C2.85875 58.4214 2.5 57.8209 2.5 57C2.5 56.1758 2.86098 55.5729 3.08789 55.2637C3.33099 54.9324 3.61097 54.6788 3.83301 54.499C4.28061 54.1367 4.83126 53.8083 5.37695 53.5176C6.49277 52.9232 8.01061 52.2657 9.72949 51.5879C13.1905 50.2231 17.766 48.6572 22.2949 47.1846C26.8345 45.7085 31.3703 44.3124 34.7676 43.2861C36.4666 42.7729 37.8829 42.3518 38.875 42.0586C38.9803 42.0275 39.0812 41.9979 39.1768 41.9697C39.2222 41.8336 39.2711 41.6873 39.3232 41.5312C39.6811 40.4612 40.1952 38.9336 40.8193 37.1006C42.0672 33.4358 43.7588 28.5446 45.5303 23.6494C47.2983 18.7637 49.1597 13.8361 50.7451 10.1143C51.5334 8.26388 52.2808 6.64524 52.9355 5.46387C53.2564 4.88484 53.6057 4.3172 53.9736 3.86328C54.155 3.63954 54.4067 3.36039 54.7285 3.11719C55.013 2.90222 55.6333 2.5 56.5 2.5L56.6562 2.50391Z" stroke="#76678D" stroke-opacity="0.54" stroke-width="5"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="116" height="121" viewBox="0 0 116 121" fill="none"><path d="M56.5 5C59 5 60.3253 31.5123 72 43C83.4422 54.2589 110.5 55 110.5 58C110.5 61 86.5263 61.1942 75.1365 70.5C60.4068 82.5348 59 116 56.5 115.5C54 115 55.046 82.8027 41.1366 70.5C29.2043 59.9461 5 59.5 5 57C5 54.5 29.7707 54.0893 41.1366 44C54.214 32.3913 54 5 56.5 5Z" fill="white"/><path d="M56.7451 2.50977C57.941 2.60836 58.6609 3.41075 58.9473 3.78711C59.3004 4.25132 59.5477 4.78711 59.7266 5.23535C60.0951 6.15876 60.4323 7.38889 60.7617 8.72266C61.4644 11.5677 62.167 14.9914 63.2285 19.0615C65.3323 27.1278 68.4544 36.0032 73.7539 41.2178C78.9235 46.3044 87.8936 49.1898 96.124 51.166C98.143 51.6508 100.078 52.073 101.865 52.4609C103.638 52.8458 105.292 53.2022 106.69 53.5459C108.059 53.8822 109.337 54.2422 110.307 54.6611C110.782 54.8665 111.344 55.1529 111.824 55.5664C112.298 55.9744 113 56.7834 113 58C113 59.106 112.426 59.895 111.944 60.3496C111.481 60.787 110.939 61.0828 110.489 61.2891C109.578 61.7068 108.396 62.0421 107.163 62.3398C104.717 62.9304 101.172 63.5686 97.6123 64.3301C90.1553 65.9254 81.8881 68.2122 76.7188 72.4355C73.4411 75.1135 70.7879 79.0898 68.6289 83.7324C66.4783 88.3571 64.8884 93.488 63.6543 98.3193C62.4155 103.169 61.5677 107.574 60.8369 110.907C60.4827 112.523 60.1383 113.97 59.7783 115.017C59.6069 115.515 59.3692 116.116 59.0215 116.623C58.7754 116.982 57.7646 118.302 56.0098 117.951C54.6089 117.671 53.9995 116.5 53.832 116.165C53.5763 115.653 53.3998 115.066 53.2666 114.533C52.9937 113.44 52.7605 111.974 52.5264 110.343C52.0459 106.994 51.5211 102.64 50.6387 97.8818C49.7585 93.1363 48.5434 88.1202 46.7314 83.5771C44.9135 79.0189 42.5555 75.093 39.4805 72.373C34.0298 67.552 25.5592 64.9061 18.0303 63.166C16.1767 62.7376 14.4093 62.3691 12.7852 62.0361C11.1755 61.7062 9.6753 61.4049 8.41406 61.1182C7.18085 60.8378 6.022 60.5385 5.14062 60.1885C4.71217 60.0183 4.18259 59.773 3.71973 59.4053C3.27984 59.0558 2.5 58.2646 2.5 57C2.5 55.7099 3.31148 54.9164 3.74902 54.5771C4.2166 54.2147 4.75146 53.9734 5.18555 53.8057C6.07963 53.4603 7.25657 53.1658 8.5127 52.8906C9.7971 52.6092 11.3211 52.3154 12.9561 51.9951C14.6049 51.6721 16.3955 51.3167 18.2686 50.9043C25.8972 49.2246 34.3309 46.6976 39.4766 42.1299C45.3738 36.895 48.4612 27.8578 50.3477 19.5908C51.2838 15.4883 51.8738 11.8358 52.4297 8.9834C52.6962 7.61569 52.9705 6.35063 53.2881 5.4043C53.4415 4.94707 53.6614 4.38905 53.9951 3.90039C54.2832 3.47873 55.0819 2.5 56.5 2.5L56.7451 2.50977Z" stroke="#76678D" stroke-opacity="0.54" stroke-width="5"/></svg>`,
  ];
  // [0,1] = swoosh (yellow+diag), [2] = dash/line (lilac), [3,4] = cloud/wave (lilac), [5] = sparkle+swoosh (yellow+diag)
  const RAW_SHAPES = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="258" height="159" viewBox="0 0 258 159" fill="none"><path d="M28.2714 44.2982C28.2714 44.2982 31.4681 44.2984 60.8697 44.2984C90.2713 44.2984 95.5806 46.2183 95.5806 52.7787C95.5806 59.339 86.7714 60.8389 72.2714 60.8389C53.2714 60.8389 49.5961 62.8789 49.695 70.3389C49.7938 77.7988 53.8201 79.8936 149.61 81.2423C247.908 82.6264 255.271 87.1045 255.271 99.339C255.271 111.574 246.897 116.339 143.271 116.339C24.2586 116.339 17.1439 120.248 17.271 129.839C17.3982 139.431 30.6373 140.071 49.695 140.339C64.2502 140.544 87.2713 140.339 87.2713 140.339" stroke="#76678D" stroke-opacity="0.54" stroke-width="5" stroke-linecap="round"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="203" height="159" viewBox="0 0 203 159" fill="none"><path d="M139.031 40.1843C139.031 40.1843 123.031 40.1834 101.031 40.1839C84.0306 40.1843 73.5305 41.6834 73.5305 47.6836C73.5305 53.6837 78.5305 56.6836 91.5305 56.6836C107.53 56.6836 111.53 59.1829 111.53 64.6836C111.53 70.1843 105.53 72.1836 56.0305 72.1836C18.0304 72.1836 3.03046 74.6836 3.03046 87.6836C3.03046 100.684 24.0305 102.184 96.5305 102.184C172.03 102.184 182.531 104.183 182.531 114.184C182.531 124.184 177.03 126.684 147.531 126.684C118.031 126.684 100.03 126.684 100.03 126.684" stroke="#76678D" stroke-opacity="0.54" stroke-width="5" stroke-linecap="round"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="153" height="100" viewBox="0 0 153 100" fill="none"><path d="M49.6598 24.0465C49.6598 24.0465 59.0002 24.0467 74.0003 24.0467C96.5002 24.0466 99.5003 25.5203 99.5003 32.5205C99.5003 39.5208 94.5004 40.5203 49.6598 40.5203C12.5003 40.5203 2.50004 41.5201 2.50004 50.5203C2.50005 61.5201 24.5003 58.5201 68.5003 58.5201C103.918 58.5201 147.5 58.5201 147.5 58.5201" stroke="#76678D" stroke-opacity="0.54" stroke-width="5" stroke-linecap="round"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="221" height="132" viewBox="0 0 221 132" fill="none"><path d="M75.8401 20.0209C66.92 18.7067 60.2114 11.2452 52.9988 16.6557C48.4583 20.0617 45.727 24.0323 46.4988 29.6557C47.1101 34.1092 48.524 38.727 52.9988 39.1557C56.6425 39.5047 59.7034 37.5003 60.8401 34.0209M76.6367 19.1751C88.1123 4.6957 103.618 -0.49546 121.499 4.15609C140.027 8.97613 151.467 22.1538 153.637 41.1751M154.815 41.269C154.815 41.269 162.999 32.6557 170.999 38.6553C182.499 47.2797 173.999 58.6556 173.999 58.6556M174 58.6561C182.206 58.8043 189.499 59.1551 199.999 61.6551C210.673 64.1964 218 72.5378 218 82.156C218 97.1552 209.029 94.1552 163.5 94.1552C111.499 94.1552 102.499 94.1556 102.499 101.656C102.499 109.156 110.499 111.155 137.5 111.155C162.045 111.155 176.499 111.156 176.499 120.656C176.499 129.156 169 129.155 118 129.155H103.494C51 129.155 51 129.155 51 120.656C51 112.156 54.9988 111.155 65.9988 111.155C75.9988 111.155 77.4988 107.565 77.4988 100.656C77.4988 93.7466 64.9988 94.1552 35.4717 94.1552C8.4988 94.1552 2.5 92.1558 2.5 73.656C2.49999 58.6561 20.9988 48.1558 35.4717 53.1549M48.4988 37.1557C46.9988 36.1557 43.6862 35.919 39.9988 38.0093C34.7117 41.0064 32.8553 47.7221 35.8524 53.0092" stroke="#76678D" stroke-opacity="0.54" stroke-width="5" stroke-linecap="round"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="262" height="145" viewBox="0 0 262 145" fill="none"><path d="M112.829 40.7599C108.077 26.0023 115.175 10.6602 129.5 4.72929C144.491 -1.47735 161.721 5.72883 167.829 20.7599M168 21.2295C173 17.23 180.549 18.5662 185.5 23.7297C189.504 27.9062 192 33.7296 186.5 39.7296M187 39.7295L187.045 39.7161C195.542 37.2173 207.315 33.755 216 47.73C220.143 54.3968 218.135 61.9577 211 65.2296C203.366 68.7302 196.701 64.9793 197 59.7302C197.177 56.6139 200 54.2302 204.5 55.7302M56 76.7298C40.5 75.2298 26.0318 83.6364 23.5004 91.2297C19 104.73 31.0004 107.73 48.5 107.73C65.9995 107.73 72.0005 108.73 72.0005 115.73C72.0005 125.729 67.5 125.729 38 125.729C7.50003 125.729 2.50001 127.23 2.5 133.23C2.5 142.23 4.49986 142.23 71.9923 142.23L72.0005 142.23C120.5 142.23 127 143.229 127 131.73C127 125.729 120.5 125.729 111.5 125.729C102.5 125.729 94.5005 125.729 94.5005 115.73C94.5005 105.73 108 107.73 171.5 107.73C232.5 107.73 259.5 103.23 259.5 90.2295C259.5 77.2289 255.869 75.2783 247 71.73C242 69.7295 235.5 69.7295 227.5 69.7295C220.873 69.7295 216.5 66.2295 216.5 60.7295M55.9999 76.2298C55.9999 76.2298 48.4999 59.6338 67.5 42.7297C80.7142 30.9732 98.5807 30.2102 112.749 40.7971" stroke="#76678D" stroke-opacity="0.54" stroke-width="5" stroke-linecap="round"/></svg>`,
    `<svg xmlns="http://www.w3.org/2000/svg" width="87" height="96" viewBox="0 0 87 96" fill="none"><path d="M81.9293 5.00314C82.6632 5.6385 28.9522 73.2206 28.9522 73.2206L21.9998 67.2017C21.9998 67.2017 81.1954 4.36777 81.9293 5.00314Z" fill="white"/><path d="M83.5654 3.11288C84.4871 3.91082 84.4464 4.96008 84.4311 5.19401C84.4085 5.5364 84.3218 5.80049 84.285 5.90584C84.2012 6.14556 84.0934 6.34744 84.035 6.45414C83.9009 6.69951 83.7219 6.98128 83.5358 7.26062C83.1507 7.83842 82.5849 8.63346 81.8808 9.59444C80.4653 11.5265 78.4132 14.2365 75.9447 17.4523C71.0036 23.889 64.351 32.4053 57.6817 40.8944C51.0111 49.3852 44.3178 57.8558 39.2928 64.2029C36.7804 67.3763 34.6852 70.0196 33.2175 71.8693C32.4837 72.7942 31.9059 73.5209 31.5125 74.0163C31.3159 74.2639 31.1654 74.4544 31.0637 74.5824C31.0131 74.6462 30.9747 74.6946 30.9488 74.7271C30.936 74.7432 30.9262 74.7556 30.9196 74.7638L30.91 74.7748C30.9096 74.7754 30.9093 74.7761 28.9525 73.2209L30.9094 74.7756L29.2867 76.817L18.3922 67.3851L20.1802 65.4869L21.9998 67.2017C20.1801 65.4874 20.1804 65.4866 20.1809 65.4861C20.1813 65.4857 20.182 65.4847 20.1828 65.4839C20.1846 65.482 20.1877 65.4794 20.1912 65.4757C20.1984 65.4681 20.2092 65.4565 20.2233 65.4415C20.2518 65.4113 20.2942 65.3664 20.35 65.3071C20.4621 65.1882 20.6284 65.0113 20.8453 64.7813C21.2793 64.321 21.9165 63.6457 22.7268 62.787C24.3473 61.0697 26.6627 58.617 29.4436 55.6761C35.0059 49.7941 42.4309 41.957 49.8792 34.1394C57.3259 26.3234 64.8027 18.5206 70.4656 12.7088C73.2948 9.8053 75.6831 7.38638 77.3926 5.7088C78.2429 4.8744 78.9487 4.20054 79.4654 3.73676C79.7152 3.51258 79.9678 3.29443 80.1914 3.12651C80.2886 3.0535 80.4737 2.91847 80.699 2.80129C80.7981 2.74975 81.0463 2.62546 81.3818 2.55415C81.6105 2.50556 82.6434 2.31476 83.5654 3.11288Z" stroke="#76678D" stroke-opacity="0.54" stroke-width="5"/><path d="M21.5972 54.9937C22.4028 54.9937 22.8299 63.6307 26.5924 67.3731C30.2799 71.041 39 71.2824 39 72.2598C39 73.2371 31.2739 73.3003 27.6032 76.332C22.8562 80.2526 22.4028 91.1547 21.5972 90.9918C20.7915 90.829 21.1286 80.3399 16.6459 76.332C12.8004 72.8937 5 72.7484 5 71.934C5 71.1195 12.983 70.9857 16.6459 67.6989C20.8604 63.9171 20.7915 54.9937 21.5972 54.9937Z" fill="white"/><path d="M21.5967 52.4937C22.8461 52.4937 23.5435 53.3244 23.7422 53.5884C23.9913 53.9194 24.1367 54.2581 24.2139 54.4536C24.379 54.8719 24.5108 55.3728 24.6172 55.8081C24.8729 56.8548 25.0576 57.8044 25.4062 59.1558C26.0852 61.7873 27.0071 64.2599 28.3555 65.6011C29.6484 66.8869 32.0941 67.7468 34.7686 68.396C35.3988 68.549 36.0059 68.6827 36.582 68.8091C37.144 68.9324 37.7039 69.0544 38.1826 69.1733C38.6313 69.2848 39.1648 69.4299 39.6191 69.6284C39.8371 69.7236 40.1983 69.8988 40.542 70.1978C40.8816 70.4932 41.4998 71.1803 41.5 72.2593L41.4941 72.438C41.4378 73.3113 40.9768 73.9188 40.6387 74.2417C40.2973 74.5676 39.9334 74.7573 39.7119 74.8599C39.2581 75.0701 38.7401 75.2105 38.3281 75.311C37.5252 75.5069 36.2506 75.7434 35.2061 75.9692C32.7773 76.4945 30.5044 77.1782 29.1953 78.2593C28.4115 78.9066 27.688 79.9507 27.0469 81.3442C26.4144 82.719 25.9314 84.2805 25.5459 85.8062C25.1559 87.3497 24.8982 88.713 24.6514 89.8511C24.5389 90.3698 24.4101 90.9311 24.2588 91.3755C24.1917 91.5727 24.057 91.9427 23.8145 92.3003C23.6784 92.5009 22.768 93.7788 21.1016 93.4419C19.8002 93.1787 19.2902 92.1013 19.2168 91.9526C19.0533 91.622 18.9624 91.2911 18.9102 91.0796C18.7991 90.6301 18.7132 90.0726 18.6387 89.5474C18.4775 88.4119 18.3172 87.0606 18.041 85.5552C17.767 84.0619 17.3998 82.5461 16.8721 81.2085C16.3379 79.8546 15.7004 78.8403 14.9795 78.1958C13.5724 76.9377 11.2275 76.1477 8.8125 75.5835C8.23718 75.4491 7.68486 75.333 7.16406 75.2251C6.65768 75.1202 6.14832 75.0162 5.71875 74.9175C5.31752 74.8253 4.82949 74.7036 4.41113 74.5356C4.21369 74.4564 3.864 74.3023 3.52344 74.0288C3.22259 73.7872 2.5862 73.1662 2.50781 72.144L2.5 71.9341L2.50781 71.7192C2.58954 70.6759 3.25238 70.0531 3.54883 69.8208C3.89156 69.5522 4.24226 69.4011 4.44043 69.3237C4.86183 69.1592 5.35443 69.0403 5.76367 68.9497C6.20138 68.8528 6.71758 68.7521 7.2334 68.6499C7.7631 68.545 8.32351 68.4329 8.90625 68.3032C11.3732 67.7541 13.6824 66.9996 14.9766 65.8384C16.4476 64.5184 17.3571 62.0524 17.9609 59.3774C18.2556 58.0722 18.4288 56.9718 18.6211 55.9741C18.7061 55.5334 18.8122 55.0217 18.9531 54.5972C19.0182 54.401 19.1467 54.0457 19.3838 53.6948C19.5722 53.4161 20.2724 52.4939 21.5967 52.4937Z" stroke="#76678D" stroke-opacity="0.54" stroke-width="5"/></svg>`,
  ];

  // Colorize: replace original purple stroke+opacity and white fills with target color
  function colorize(svg, color) {
    return svg
      .replace(/stroke="#76678D"\s+stroke-opacity="0\.54"/g, `stroke="${color}"`)
      .replace(/fill="white"/g, `fill="${color}"`);
  }

  const YEL = '#E8B83A', LIL = '#8070A0';

  // Yellow: stars + swoosh shapes [0,1] + sparkle+swoosh [5] → diagonal, fast
  const YELLOW_SVGS = [
    ...RAW_STARS.map(s => colorize(s, YEL)),
    colorize(RAW_SHAPES[0], YEL),
    colorize(RAW_SHAPES[1], YEL),
    colorize(RAW_SHAPES[5], YEL),
  ];
  // Lilac: dash/line [2] + cloud shapes [3,4] → straight, slow
  const LILAC_SVGS = [
    colorize(RAW_SHAPES[2], LIL),
    colorize(RAW_SHAPES[3], LIL),
    colorize(RAW_SHAPES[4], LIL),
  ];

  const containers = [
    document.querySelector('.hero-left'),
    document.querySelector('footer'),
  ].filter(Boolean);

  function spawn(container) {
    const isYellow = Math.random() < 0.5;
    const pool     = isYellow ? YELLOW_SVGS : LILAC_SVGS;
    const svgStr   = pool[Math.floor(Math.random() * pool.length)];

    const el = document.createElement('div');
    el.className = 'float-sv' + (isYellow ? ' is-star' : '');
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = svgStr;

    el.style.height = (isYellow ? 15 + Math.random() * 10 : 50 + Math.random() * 40) + 'px';  // yellow 15–25px, lilac clouds 50–90px
    el.style.top    = (5 + Math.random() * 82) + '%';
    const dur = isYellow ? (4 + Math.random() * 4) : (22 + Math.random() * 13);
    el.style.setProperty('--sv-dur',  dur + 's');
    el.style.setProperty('--sv-fade', isYellow ? '0.75' : '0.5');

    container.appendChild(el);
    el.addEventListener('animationend', () => el.remove(), { once: true });
  }

  function loop(container) {
    spawn(container);
    setTimeout(() => loop(container), 6000 + Math.random() * 8000);
  }

  containers.forEach((c, i) => {
    setTimeout(() => loop(c), i * 2500 + Math.random() * 5000);
  });
})();
