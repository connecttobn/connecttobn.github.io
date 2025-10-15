// Navigation functionality
class Navigation {
  constructor() {
    this.navToggle = document.getElementById('navToggle');
    this.navMenu = document.getElementById('navMenu');
    this.navLinks = document.querySelectorAll('.nav-link');
    
    this.init();
  }

  init() {
    // Mobile menu toggle
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => this.toggleMobileMenu());
    }

    // Close mobile menu when clicking on links
    this.navLinks.forEach(link => {
      link.addEventListener('click', () => this.closeMobileMenu());
    });

    // Smooth scroll for navigation links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => this.handleSmoothScroll(e));
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.navbar')) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    this.navMenu.classList.toggle('active');
    this.navToggle.classList.toggle('active');
  }

  closeMobileMenu() {
    this.navMenu.classList.remove('active');
    this.navToggle.classList.remove('active');
  }

  handleSmoothScroll(e) {
    const href = e.target.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const targetSection = document.querySelector(href);
      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    }
  }
}

// Tab functionality for specifications section
class TabManager {
  constructor() {
    this.tabButtons = document.querySelectorAll('.tab-btn');
    this.tabPanes = document.querySelectorAll('.tab-pane');
    
    this.init();
  }

  init() {
    this.tabButtons.forEach(button => {
      button.addEventListener('click', (e) => this.handleTabClick(e));
    });
  }

  handleTabClick(e) {
    const targetTab = e.target.getAttribute('data-tab');
    
    // Remove active class from all buttons and panes
    this.tabButtons.forEach(btn => btn.classList.remove('active'));
    this.tabPanes.forEach(pane => pane.classList.remove('active'));
    
    // Add active class to clicked button and corresponding pane
    e.target.classList.add('active');
    const targetPane = document.getElementById(targetTab);
    if (targetPane) {
      targetPane.classList.add('active');
    }
  }
}

// Contact form functionality
class ContactForm {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.init();
  }

  init() {
    if (this.form) {
      this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this.form);
    const data = {
      name: formData.get('name'),
      company: formData.get('company'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      profileType: formData.get('profile-type'),
      message: formData.get('message')
    };

    // Validate required fields
    if (!data.name || !data.phone) {
      this.showMessage('Please fill in all required fields.', 'error');
      return;
    }

    // Validate phone number (basic validation)
    const phoneRegex = /^[+]?[0-9\s\-\(\)]{10,}$/;
    if (!phoneRegex.test(data.phone)) {
      this.showMessage('Please enter a valid phone number.', 'error');
      return;
    }

    // Validate email if provided
    if (data.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        this.showMessage('Please enter a valid email address.', 'error');
        return;
      }
    }

    // Show success message (in a real application, this would send data to a server)
    this.showMessage('Thank you for your inquiry! We will contact you soon to discuss your uPVC profile requirements.', 'success');
    this.form.reset();
  }

  showMessage(text, type) {
    // Remove any existing messages
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
      existingMessage.remove();
    }

    // Create and show new message
    const message = document.createElement('div');
    message.className = `form-message status status--${type}`;
    message.textContent = text;
    message.style.marginBottom = '16px';
    
    this.form.insertBefore(message, this.form.firstChild);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
      if (message.parentNode) {
        message.remove();
      }
    }, 5000);
  }
}

// Scroll animations
class ScrollAnimations {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    
    this.init();
  }

  init() {
    // Create intersection observer for scroll animations
    this.observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries),
      this.observerOptions
    );

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
      '.section-header, .product-card, .feature-card, .service-card, .application-card'
    );
    
    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      this.observer.observe(el);
    });
  }

  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        this.observer.unobserve(entry.target);
      }
    });
  }
}

// Statistics counter animation
class StatisticsCounter {
  constructor() {
    this.counters = document.querySelectorAll('.stat-number');
    this.init();
  }

  init() {
    const observer = new IntersectionObserver(
      (entries) => this.handleCounterIntersection(entries),
      { threshold: 0.5 }
    );

    this.counters.forEach(counter => {
      observer.observe(counter);
    });
  }

  handleCounterIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        this.animateCounter(entry.target);
      }
    });
  }

  animateCounter(element) {
    const finalValue = element.textContent;
    const isNumeric = /^\d+$/.test(finalValue);
    
    if (isNumeric) {
      const target = parseInt(finalValue);
      let current = 0;
      const increment = target / 50;
      
      const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
          element.textContent = target;
          clearInterval(timer);
        } else {
          element.textContent = Math.floor(current);
        }
      }, 50);
    }
  }
}

// Navbar background on scroll
class NavbarScroll {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.init();
  }

  init() {
    window.addEventListener('scroll', () => this.handleScroll());
  }

  handleScroll() {
    if (window.scrollY > 100) {
      this.navbar.style.background = 'rgba(19, 52, 59, 0.98)';
      this.navbar.style.backdropFilter = 'blur(10px)';
    } else {
      this.navbar.style.background = 'rgba(19, 52, 59, 0.95)';
      this.navbar.style.backdropFilter = 'blur(10px)';
    }
  }
}

// Product card hover effects
class ProductCardEffects {
  constructor() {
    this.productCards = document.querySelectorAll('.product-card');
    this.init();
  }

  init() {
    this.productCards.forEach(card => {
      card.addEventListener('mouseenter', () => this.handleMouseEnter(card));
      card.addEventListener('mouseleave', () => this.handleMouseLeave(card));
    });
  }

  handleMouseEnter(card) {
    card.style.transform = 'translateY(-8px) scale(1.02)';
    card.style.boxShadow = 'var(--shadow-lg)';
  }

  handleMouseLeave(card) {
    if (!card.classList.contains('product-featured')) {
      card.style.transform = 'translateY(0) scale(1)';
    } else {
      card.style.transform = 'translateY(0) scale(1.02)';
    }
    card.style.boxShadow = 'var(--shadow-sm)';
  }
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all classes
  new Navigation();
  new TabManager();
  new ContactForm();
  new ScrollAnimations();
  new StatisticsCounter();
  new NavbarScroll();
  new ProductCardEffects();

  // Add loading animation
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  
  setTimeout(() => {
    document.body.style.opacity = '1';
  }, 100);

  console.log('Lumia uPVC Profiles website loaded successfully!');
});

// Handle window resize for responsive adjustments
window.addEventListener('resize', () => {
  // Close mobile menu on resize to desktop
  if (window.innerWidth > 768) {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    if (navMenu) navMenu.classList.remove('active');
    if (navToggle) navToggle.classList.remove('active');
  }
});

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
  // Close mobile menu with Escape key
  if (e.key === 'Escape') {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    if (navMenu && navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
    }
  }
});