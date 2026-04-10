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
  const carouselNum     = document.getElementById('carousel-num');
  const COUNT           = glanceRows.length;

  let activeIdx = 0;
  let autoTimer = null;
  const PX_PER_SLIDE = window.innerHeight * 1.1;

  function applyPeek() {
    glanceRows.forEach(r => r.classList.remove('peek-above', 'peek-below'));
    const prevIdx = ((activeIdx - 1) + COUNT) % COUNT;
    const nextIdx = (activeIdx + 1) % COUNT;
    // Don't add peek to the active slide itself (when COUNT===1)
    if (prevIdx !== activeIdx) glanceRows[prevIdx].classList.add('peek-above');
    if (nextIdx !== activeIdx) glanceRows[nextIdx].classList.add('peek-below');
  }

  function setActive(next, dir = 1) {
    next = ((next % COUNT) + COUNT) % COUNT;
    if (next === activeIdx) return;

    const prev = activeIdx;
    activeIdx  = next;

    glanceRows[prev].classList.remove('active', 'peek-above', 'peek-below');
    glanceRows[prev].classList.add(dir >= 0 ? 'exit-up' : 'exit-down');
    setTimeout(() => {
      glanceRows[prev].classList.remove('exit-up', 'exit-down');
      applyPeek(); // re-run after exit so prev can become a peek if needed
    }, 1200);

    glanceRows[activeIdx].classList.remove('peek-above', 'peek-below');
    glanceRows[activeIdx].classList.add('active');
    applyPeek();

    cDots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
    if (carouselNum) carouselNum.textContent = String(activeIdx + 1).padStart(2, '0');
  }

  function resetAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => setActive(activeIdx + 1, 1), 4500);
  }

  // Boot
  glanceRows[0].classList.add('active');
  cDots[0]?.classList.add('active');
  applyPeek();
  resetAuto();

  // Scroll drives the carousel
  window.addEventListener('scroll', () => {
    if (!projectsSection) return;
    const scrolledIn = -projectsSection.getBoundingClientRect().top;
    if (scrolledIn < 0) return;
    const target = Math.min(Math.floor(scrolledIn / PX_PER_SLIDE), COUNT - 1);
    if (target !== activeIdx) {
      setActive(target, target > activeIdx ? 1 : -1);
      resetAuto();
    }
  }, { passive: true });

  // Dot clicks
  cDots.forEach((dot, i) => {
    dot.addEventListener('click', () => { setActive(i, i > activeIdx ? 1 : -1); resetAuto(); });
  });

  // Auto-jump when scroll exits the projects section boundary
  if (projectsSection) {
    let lastScrollY = window.scrollY;
    let jumping = false;
    window.addEventListener('scroll', () => {
      if (jumping) return;
      const rect = projectsSection.getBoundingClientRect();
      const dy = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      // Scrolled fully past the bottom of the section
      if (dy > 0 && rect.bottom < window.innerHeight * 0.1) {
        jumping = true;
        document.getElementById('workspace')?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => { jumping = false; }, 1200);
      }
      // Scrolled fully past the top of the section (going up)
      if (dy < 0 && rect.top > window.innerHeight * 0.9) {
        jumping = true;
        document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
        setTimeout(() => { jumping = false; }, 1200);
      }
    }, { passive: true });
  }

  // ── 5b. PARALLAX SYSTEM ──
  // Uses the CSS `translate` standalone property so it stacks on top of any
  // existing `transform` without clobbering rotations or animation fills.

  // glance-img-card and glance-text parallax removed — they're now in a sticky
  // carousel with absolute stacking; viewport-relative parallax doesn't apply.
  const heroChar      = document.querySelector('.hero-char-col');
  const heroContent   = document.querySelector('.hero-content');
  const heroStatement = document.querySelector('.hero-statement');
  const imacScene     = document.querySelector('.imac-scene');

  const scribLayers = [
    { sel: '.scrib-hero-ul',     rate:  0.045 },
    { sel: '.scrib-proj-pencil', rate:  0.07  },
    { sel: '.scrib-proj-wave',   rate: -0.05  },
    { sel: '.scrib-ws-dashes',   rate:  0.06  },
    { sel: '.scrib-footer-wm',   rate:  0.03  },
  ].map(({ sel, rate }) => ({ el: document.querySelector(sel), rate }))
   .filter(({ el }) => el);

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

    scribLayers.forEach(({ el, rate }) => {
      el.style.translate = `0 ${(scrollY * rate).toFixed(1)}px`;
    });
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();

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
  const imacScreen = document.querySelector('.imac-screen');
  let   winZTop    = 30; // stacking counter

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

  function spawnWindow(iconId) {
    if (!imacScreen) return;
    const data = iconContent[iconId];
    if (!data) return;

    winZTop++;
    const win = document.createElement('div');
    win.className = 'icon-win';
    win.style.zIndex = winZTop;

    // Spawn centered in the screen, cascade each new window slightly
    const cascade = ((winZTop - 31) % 5) * 22;
    const sr = imacScreen.getBoundingClientRect();
    const winW = Math.min(320, sr.width * 0.8);
    const winH = Math.min(sr.height * 0.7, 360);
    win.style.left = Math.round((sr.width  - winW) / 2 + cascade) + 'px';
    win.style.top  = Math.round((sr.height - winH) / 2 + cascade) + 'px';

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

    imacScreen.appendChild(win);

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

    // Drag the window by its bar
    const bar = win.querySelector('.icon-win-bar');
    let dx = 0, dy = 0, draggingWin = false;

    bar.addEventListener('mousedown', e => {
      e.preventDefault();
      draggingWin = true;
      dx = e.clientX - win.offsetLeft;
      dy = e.clientY - win.offsetTop;
      winZTop++;
      win.style.zIndex = winZTop;
      win.classList.add('is-dragging');
    });
    window.addEventListener('mousemove', e => {
      if (!draggingWin) return;
      const sr = imacScreen.getBoundingClientRect();
      win.style.left = Math.max(0, Math.min(e.clientX - dx, sr.width  - win.offsetWidth))  + 'px';
      win.style.top  = Math.max(0, Math.min(e.clientY - dy, sr.height - win.offsetHeight)) + 'px';
    });
    window.addEventListener('mouseup', () => {
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

  document.querySelectorAll('.gallery-item, .gb-item').forEach(item => {
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

  // ── 11b. GALLERY SLIDE-IN — reveal when workspace scrolls near ──
  const galleryBg       = document.querySelector('.gallery-bg');
  const workspaceSection = document.querySelector('.workspace');
  if (galleryBg && workspaceSection) {
    const galleryObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          galleryBg.classList.add('gallery-revealed');
          galleryObs.unobserve(workspaceSection);
        }
      });
    }, { threshold: 0.7 });
    galleryObs.observe(workspaceSection);
  }

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
  const scene = document.querySelector('.imac-screen');
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

    char.style.left      = x + 'px';
    char.style.top       = y + 'px';
    char.style.transform = facingRight ? 'scaleX(-1)' : 'scaleX(1)';
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
    x = cx - sr.left - CHAR_W / 2;
    y = cy - sr.top;
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
