// ── SCROLL SPY (top nav) ──
const sections = document.querySelectorAll('.cs-section[id], [id="overview"]');
const navLinks  = document.querySelectorAll('.page-nav a');

function updateNav() {
  const scrollY = window.scrollY;
  let current = 'overview';

  sections.forEach(section => {
    if (scrollY >= section.offsetTop - 120) {
      current = section.id || 'overview';
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + current);
  });
}

window.addEventListener('scroll', updateNav, { passive: true });
updateNav();
