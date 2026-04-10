// ── SCROLL SPY & PROGRESS BAR ──
const sections    = document.querySelectorAll('.content-section');
const navLinks    = document.querySelectorAll('.nav-item a');
const progressFill = document.getElementById('progress-fill');

function updateNav() {
  const scrollY = window.scrollY;
  const docH    = document.documentElement.scrollHeight - window.innerHeight;

  // Progress bar
  const pct = Math.min(100, Math.round((scrollY / docH) * 100));
  progressFill.style.width = pct + '%';

  // Active nav link
  let current = '';
  sections.forEach(section => {
    if (scrollY >= section.offsetTop - 120) {
      current = section.id;
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();
