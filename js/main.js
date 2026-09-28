/* ==========================================================================
   STACKLY AUTOMOTIVE - MAIN JAVASCRIPT
   Interactive Features, 3D Flip Cards, Scroll Animations & Color Configurator
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --------------------------------------------------
  // 1. Sticky Header & Glassmorphism Scroll Effect
  // --------------------------------------------------
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  // --------------------------------------------------
  // 2. Mobile Menu Drawer Navigation
  // --------------------------------------------------
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileMenu = document.querySelector('.mobile-nav-menu');
  const mobileClose = document.querySelector('.mobile-nav-close');

  function openMobileMenu() {
    mobileOverlay?.classList.add('active');
    mobileMenu?.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileOverlay?.classList.remove('active');
    mobileMenu?.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  mobileToggle?.addEventListener('click', openMobileMenu);
  mobileClose?.addEventListener('click', closeMobileMenu);
  mobileOverlay?.addEventListener('click', closeMobileMenu);

  // Close mobile nav when clicking a link
  document.querySelectorAll('.mobile-nav-links .nav-link').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  // --------------------------------------------------
  // 3. Scroll Reveal Animations (IntersectionObserver)
  // --------------------------------------------------
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-up, .reveal-scale');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.12
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          // Start counter if element is stats bar
          if (entry.target.classList.contains('stats-bar')) {
            animateCounters();
          }
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  // --------------------------------------------------
  // 4. 3D Flip Card Toggle Support (Click & Button)
  // --------------------------------------------------
  const flipCardWrappers = document.querySelectorAll('.flip-card-wrapper');
  
  flipCardWrappers.forEach(wrapper => {
    // Click toggle for touch devices or manual click
    wrapper.addEventListener('click', (e) => {
      // Don't flip if clicking inside an interactive button on the back/front
      if (e.target.closest('.btn-primary') || e.target.closest('.btn-accent')) return;
      
      wrapper.classList.toggle('flipped');
    });
  });

  // Manual trigger flip buttons
  document.querySelectorAll('.trigger-flip').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const wrapper = btn.closest('.flip-card-wrapper');
      wrapper?.classList.toggle('flipped');
    });
  });

  // --------------------------------------------------
  // 5. Interactive Car Color Configurator (Home Page)
  // --------------------------------------------------
  const colorSwatches = document.querySelectorAll('.color-swatch');
  const previewImg = document.getElementById('featuredCarImage');
  const colorNameLabel = document.getElementById('selectedColorName');
  const priceDisplay = document.getElementById('configuratorPrice');

  const carColorData = {
    red: {
      title: 'Crimson Red Metallic',
      img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80',
      price: '$189,500'
    },
    cyan: {
      title: 'Electric Cyber Cyan',
      img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1200&q=80',
      price: '$194,200'
    },
    black: {
      title: 'Stealth Obsidian Black',
      img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1200&q=80',
      price: '$185,000'
    },
    white: {
      title: 'Pearl Hyper White',
      img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
      price: '$187,900'
    }
  };

  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => {
      const colorKey = swatch.getAttribute('data-color');
      const data = carColorData[colorKey];

      if (!data || !previewImg) return;

      // Active state highlight
      colorSwatches.forEach(s => s.classList.remove('active'));
      swatch.classList.add('active');

      // Image fade transition effect
      previewImg.classList.add('changing');
      setTimeout(() => {
        previewImg.src = data.img;
        if (colorNameLabel) colorNameLabel.textContent = data.title;
        if (priceDisplay) priceDisplay.textContent = data.price;
        previewImg.classList.remove('changing');
      }, 250);
    });
  });

  // --------------------------------------------------
  // 6. Fleet Category Filter Tabs
  // --------------------------------------------------
  const filterBtns = document.querySelectorAll('.package-filter-btn');
  const cardItems = document.querySelectorAll('.package-card-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filterValue = btn.getAttribute('data-filter');

      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cardItems.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'scale(1)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.9)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // --------------------------------------------------
  // 7. Animated Counter Stats
  // --------------------------------------------------
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;
    countersAnimated = true;

    const counters = document.querySelectorAll('.counter-val');
    counters.forEach(counter => {
      const target = parseFloat(counter.getAttribute('data-target'));
      const duration = 2000;
      const startTime = performance.now();

      function updateNumber(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentVal = (target * easeProgress).toFixed(target % 1 !== 0 ? 1 : 0);

        counter.textContent = currentVal;

        if (progress < 1) {
          requestAnimationFrame(updateNumber);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(updateNumber);
    });
  }

  // --------------------------------------------------
  // 8. Redirect Useless/Placeholder Links & Buttons to 404
  // --------------------------------------------------
  document.querySelectorAll('a, button').forEach(element => {
    const href = element.getAttribute('href');
    const isUselessLink = href === '#' || href === 'javascript:void(0)' || href === '';
    const has404Flag = element.getAttribute('data-redirect-404') === 'true';

    if (isUselessLink || has404Flag) {
      element.addEventListener('click', (e) => {
        // Prevent default hash scroll
        e.preventDefault();
        window.location.href = '404.html';
      });
    }
  });

  // --------------------------------------------------
  // 9. Toast Notification Helper
  // --------------------------------------------------
  window.showToast = function(message, icon = 'bi-check-circle-fill') {
    let container = document.querySelector('.toast-container');
    if (!container) {
      container = document.createElement('div');
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast-msg';
    toast.innerHTML = `<i class="bi ${icon} text-primary fs-5"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.4s ease';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  };

  // --------------------------------------------------
  // 10. Form Submissions Simulation
  // --------------------------------------------------
  const heroSearchForm = document.getElementById('heroSearchForm');
  heroSearchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const model = document.getElementById('searchModel')?.value || 'Hypercar';
    showToast(`Searching Stackly Salem Inventory for "${model}"...`, 'bi-search');
    setTimeout(() => {
      window.location.href = 'get-started.html';
    }, 1500);
  });

  const contactForm = document.getElementById('contactForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Message sent! Stackly Salem Concierge will call you shortly.', 'bi-send-fill');
    contactForm.reset();
  });

  const signinForm = document.getElementById('signInForm') || document.getElementById('signinForm');
  signinForm?.addEventListener('submit', (e) => {
    if (typeof handleAuthSubmit === 'function') {
      return; // Handled by inline script in signin.html
    }
    e.preventDefault();
    showToast('Authentication Successful! Redirecting...', 'bi-shield-check');
    setTimeout(() => {
      window.location.href = 'owner-dashboard.html';
    }, 1200);
  });

  const getStartedForm = document.getElementById('getStartedForm');
  getStartedForm?.addEventListener('submit', (e) => {
    if (typeof handleSignupSubmit === 'function') {
      return; // Handled by inline script in get-started.html
    }
    e.preventDefault();
    showToast('Test Drive Booked! Redirecting to Reservation Dashboard...', 'bi-speedometer2');
    setTimeout(() => {
      window.location.href = 'get-started-dashboard.html';
    }, 1200);
  });
});

