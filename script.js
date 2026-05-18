// Intersection observer for scroll animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, entry.target.dataset.delay || 0);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

// Stagger timeline items
document.querySelectorAll('.tl-item').forEach((el, i) => {
  el.dataset.delay = i * 80;
  observer.observe(el);
});

// Stats
document.querySelectorAll('.stats-row').forEach(el => observer.observe(el));

// Certs stagger
document.querySelectorAll('.cert-item').forEach((el, i) => {
  el.dataset.delay = i * 50;
  observer.observe(el);
});

// Smooth parallax on hero ghost text
const ghost = document.querySelector('.hero-ghost');
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (ghost) ghost.style.transform = `translateY(calc(-50% + ${y * 0.15}px))`;
}, { passive: true });

// Calculate years in engineering from July 2013 to current date
function calculateYearsInEngineering() {
  const startDate = new Date('2013-07-01');
  const currentDate = new Date();
  
  // Calculate difference in milliseconds and convert to years
  const diffMilliseconds = currentDate - startDate;
  const yearsExact = diffMilliseconds / (1000 * 60 * 60 * 24 * 365.25);
  
  // Get decimal part
  const decimalPart = yearsExact - Math.floor(yearsExact);
  
  // Round up if decimal > 0.5, otherwise round down
  const yearsRounded = decimalPart > 0.5 ? Math.ceil(yearsExact) : Math.floor(yearsExact);
  
  return yearsRounded;
}

// Update the years element
const yearsElement = document.getElementById('years-in-engineering');
if (yearsElement) {
  yearsElement.textContent = calculateYearsInEngineering();
}
