import { initNav } from './nav.js';
import { initGallery } from './gallery.js';
import { initTestimonials } from './testimonials.js';
import { initForm } from './form.js';

function initAnimations() {
  const fadeElements = document.querySelectorAll('.fade-in');
  if (!fadeElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  fadeElements.forEach((el) => observer.observe(el));
}

function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('transparent');
    } else {
      navbar.classList.remove('transparent');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initGallery();
  initTestimonials();
  initForm();
  initAnimations();
  initNavbarScroll();
});
