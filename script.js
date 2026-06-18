// ============================================
// 1. PAGE NAVIGATION SYSTEM
// ============================================
(function() {
  // Get all page containers
  const pages = {
    home: document.getElementById('page-home'),
    services: document.getElementById('page-services'),
    about: document.getElementById('page-about'),
    contact: document.getElementById('page-contact')
  };

  // Get all navigation links
  const allNavLinks = document.querySelectorAll('.nav-links a[data-page]');
  const allFooterLinks = document.querySelectorAll('.footer-links a[data-page]');
  const allHeroActions = document.querySelectorAll('.hero-actions a[data-page]');
  const allCtaActions = document.querySelectorAll('.cta-actions a[data-page]');
  const allServiceLinks = document.querySelectorAll('.btn-service[data-page]');

  // Function to switch pages with smooth transition
  function switchPage(pageId) {
    // Hide all pages
    Object.keys(pages).forEach(key => {
      if (pages[key]) {
        pages[key].classList.remove('active');
      }
    });

    // Show the target page
    if (pages[pageId]) {
      pages[pageId].classList.add('active');
    }

    // Update active class on all navigation links
    document.querySelectorAll('.nav-links a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-page') === pageId) {
        link.classList.add('active');
      }
    });

    // Update active class on footer links
    document.querySelectorAll('.footer-links a').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-page') === pageId) {
        link.classList.add('active');
      }
    });

    // Scroll to top with smooth behavior
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Close any open mobile menus
    closeAllMobileMenus();

    // Update URL hash
    if (pageId !== 'home') {
      window.location.hash = pageId;
    } else {
      window.location.hash = '';
    }

    // Re-trigger animations for new page
    setTimeout(() => {
      animateCounters();
      animateCardsOnScroll();
    }, 100);
  }

  // Close all mobile menus
  function closeAllMobileMenus() {
    document.querySelectorAll('.nav-links').forEach(menu => {
      menu.classList.remove('show');
    });
    document.querySelectorAll('.menu-toggle').forEach(toggle => {
      toggle.classList.remove('active');
    });
  }

  // Add click listeners to navigation links
  function addNavListeners(links) {
    links.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const page = this.getAttribute('data-page');
        if (page) {
          switchPage(page);
        }
      });
    });
  }

  // Add listeners to all link groups
  addNavListeners(allNavLinks);
  addNavListeners(allFooterLinks);
  addNavListeners(allHeroActions);
  addNavListeners(allCtaActions);
  addNavListeners(allServiceLinks);

  // Handle browser back/forward buttons
  window.addEventListener('popstate', function(e) {
    if (e.state && e.state.page) {
      switchPage(e.state.page);
    }
  });

  // Handle hash-based navigation
  function handleHash() {
    const hash = window.location.hash.replace('#', '');
    if (hash && pages[hash]) {
      switchPage(hash);
    }
  }

  window.addEventListener('hashchange', handleHash);
  handleHash();

  // Expose switchPage globally
  window.switchPage = switchPage;
})();

// ============================================
// 2. MOBILE MENU TOGGLES - Enhanced
// ============================================
(function() {
  const toggleConfigs = [
    { toggleId: 'menuToggle', navId: 'navLinks' },
    { toggleId: 'menuToggle2', navId: 'navLinks2' },
    { toggleId: 'menuToggle3', navId: 'navLinks3' },
    { toggleId: 'menuToggle4', navId: 'navLinks4' }
  ];

  toggleConfigs.forEach(config => {
    const toggleBtn = document.getElementById(config.toggleId);
    const navLinks = document.getElementById(config.navId);

    if (toggleBtn && navLinks) {
      // Toggle menu on button click with animation
      toggleBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        navLinks.classList.toggle('show');
        this.classList.toggle('active');
      });

      // Close menu when a link is clicked
      navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
          navLinks.classList.remove('show');
          toggleBtn.classList.remove('active');
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', function(event) {
        if (!navLinks.contains(event.target) && !toggleBtn.contains(event.target)) {
          navLinks.classList.remove('show');
          toggleBtn.classList.remove('active');
        }
      });

      // Close menu on escape key
      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('show')) {
          navLinks.classList.remove('show');
          toggleBtn.classList.remove('active');
        }
      });
    }
  });
})();

// ============================================
// 3. ANIMATED STATISTICS COUNTER - Enhanced
// ============================================
(function() {
  let countersAnimated = false;

  function animateCounters() {
    if (countersAnimated) return;

    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-count'));
      const duration = 2500;
      let startTime = null;

      function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
      }

      function animateCounter(timestamp) {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const eased = easeOutQuart(progress);
        const current = Math.floor(eased * target);
        
        if (target >= 1000) {
          // Format large numbers with commas
          stat.textContent = current.toLocaleString();
        } else {
          stat.textContent = current;
        }

        if (progress < 1) {
          requestAnimationFrame(animateCounter);
        } else {
          stat.textContent = target >= 1000 ? target.toLocaleString() : target;
        }
      }

      requestAnimationFrame(animateCounter);
    });

    countersAnimated = true;
  }

  // Use Intersection Observer for counter animation
  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          animateCounters();
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });

    observer.observe(statsSection);
  }

  // Fallback: animate on page load if stats are visible
  window.addEventListener('load', function() {
    if (statsSection) {
      const rect = statsSection.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        setTimeout(animateCounters, 300);
      }
    }
  });

  // Re-animate when switching pages
  window.addEventListener('pageSwitch', function() {
    countersAnimated = false;
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => {
      stat.textContent = '0';
    });
    setTimeout(animateCounters, 500);
  });

  // Expose for page switching
  window.animateCounters = animateCounters;
})();

// ============================================
// 4. CARD ANIMATIONS ON SCROLL
// ============================================
(function() {
  let observerInitialized = false;

  function animateCardsOnScroll() {
    const cards = document.querySelectorAll(
      '.feature-card, .service-card, .testimonial-card, .team-card'
    );

    if (cards.length === 0) return;

    // Reset cards if they were already animated
    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(30px)';
    });

    // Create a new observer or reuse existing
    if (!observerInitialized) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
          if (entry.isIntersecting) {
            const delay = index * 100;
            setTimeout(() => {
              entry.target.style.opacity = '1';
              entry.target.style.transform = 'translateY(0)';
            }, delay);
          }
        });
      }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      });

      cards.forEach(card => {
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
      });

      observerInitialized = true;
    } else {
      // Re-observe cards on page switch
      cards.forEach(card => {
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        // Trigger re-animation with a small delay
        setTimeout(() => {
          const rect = card.getBoundingClientRect();
          if (rect.top < window.innerHeight) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }
        }, 100);
      });
    }
  }

  // Initialize on load
  window.addEventListener('load', animateCardsOnScroll);
  
  // Re-initialize on page switch
  window.addEventListener('pageSwitch', function() {
    observerInitialized = false;
    setTimeout(animateCardsOnScroll, 300);
  });

  // Expose for manual triggering
  window.animateCardsOnScroll = animateCardsOnScroll;
})();

// ============================================
// 5. CONTACT FORM HANDLING - Enhanced
// ============================================
(function() {
  const contactForm = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // Get form values
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const service = document.getElementById('service').value;
      const message = document.getElementById('message').value.trim();

      // Validation
      let errors = [];
      
      if (!name) errors.push('Please enter your full name.');
      if (!email) errors.push('Please enter your email address.');
      if (!message) errors.push('Please enter a message.');
      
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.push('Please enter a valid email address.');
      }

      if (errors.length > 0) {
        alert(errors.join('\n'));
        return;
      }

      // Simulate submission with loading state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

      // Simulate API call
      setTimeout(() => {
        // Hide form, show success message with animation
        contactForm.style.opacity = '0';
        contactForm.style.transform = 'translateY(-10px)';
        contactForm.style.transition = 'all 0.3s ease';

        setTimeout(() => {
          contactForm.style.display = 'none';
          formSuccess.style.display = 'block';
          formSuccess.style.opacity = '0';
          formSuccess.style.transform = 'translateY(10px)';
          
          setTimeout(() => {
            formSuccess.style.opacity = '1';
            formSuccess.style.transform = 'translateY(0)';
            formSuccess.style.transition = 'all 0.4s ease';
          }, 50);
        }, 300);

        // Log form data
        console.log('Form submitted:', { name, email, phone, service, message });

        // Reset form and button after delay
        setTimeout(() => {
          contactForm.reset();
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          contactForm.style.opacity = '1';
          contactForm.style.transform = 'translateY(0)';
        }, 1000);

        // You can add actual API call here:
        // fetch('/api/contact', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ name, email, phone, service, message })
        // })
        // .then(response => response.json())
        // .then(data => { ... })
        // .catch(error => { ... });

      }, 2000);
    });

    // Reset form when switching pages
    document.querySelectorAll('[data-page]').forEach(link => {
      link.addEventListener('click', function() {
        if (contactForm && formSuccess) {
          // Reset form visibility
          contactForm.style.display = 'block';
          contactForm.style.opacity = '1';
          contactForm.style.transform = 'translateY(0)';
          formSuccess.style.display = 'none';
          formSuccess.style.opacity = '0';
          contactForm.reset();
          
          const submitBtn = contactForm.querySelector('button[type="submit"]');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
          }
        }
      });
    });
  }
})();

// ============================================
// 6. SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
(function() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href !== '#') {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
      }
    });
  });
})();

// ============================================
// 7. NAVBAR SCROLL EFFECT
// ============================================
(function() {
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    // Add shadow and background on scroll
    if (currentScroll > 20) {
      navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.3)';
      navbar.style.borderBottom = '1px solid rgba(30, 47, 61, 0.8)';
    } else {
      navbar.style.boxShadow = 'none';
      navbar.style.borderBottom = '1px solid rgba(30, 47, 61, 0.5)';
    }

    lastScroll = currentScroll;
  });
})();

// ============================================
// 8. INTERSECTION OBSERVER FOR FADE-IN
// ============================================
(function() {
  const fadeElements = document.querySelectorAll(
    '.feature-card, .service-card, .testimonial-card, .team-card, .about-content, .hero-grid'
  );

  if (fadeElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    fadeElements.forEach(el => {
      if (!el.classList.contains('hero-grid')) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
      }
    });
  }
})();

// ============================================
// 9. KEYBOARD ACCESSIBILITY
// ============================================
(function() {
  // Allow Enter/Space to trigger navigation links
  document.querySelectorAll('.nav-links a, .footer-links a, .btn').forEach(link => {
    link.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // Add focus styles for keyboard navigation
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      document.body.classList.add('keyboard-navigation');
    }
  });

  document.addEventListener('mousedown', function() {
    document.body.classList.remove('keyboard-navigation');
  });
})();

// ============================================
// 10. AUTO-UPDATE YEAR IN FOOTER
// ============================================
(function() {
  const footerBottom = document.querySelector('.footer-bottom');
  if (footerBottom) {
    const year = new Date().getFullYear();
    footerBottom.innerHTML = footerBottom.innerHTML.replace(/\d{4}/, year);
  }
})();

// ============================================
// 11. PERFORMANCE OPTIMIZATION
// ============================================
(function() {
  // Lazy load images if needed
  if ('IntersectionObserver' in window) {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute('data-src');
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    images.forEach(img => imageObserver.observe(img));
  }

  // Reduce reflows by batching DOM updates
  window.requestAnimationFrame = window.requestAnimationFrame || function(callback) {
    return setTimeout(callback, 16);
  };
})();

// ============================================
// 12. CONSOLE WELCOME - Professional
// ============================================
(function() {
  const styles = {
    title: 'font-size: 28px; font-weight: 800; color: #2d9cdb; padding: 10px 0;',
    subtitle: 'font-size: 16px; color: #b0c4d4; padding: 4px 0;',
    accent: 'font-size: 14px; color: #6d8a9e; padding: 4px 0;',
    heart: 'color: #e74c3c;'
  };

  console.log('%c🏥 Larosy Medical Center', styles.title);
  console.log('%cDesigned with ❤️ by Aristotle John', styles.subtitle);
  console.log('%cVersion 2.0 · Premium Healthcare Website', styles.accent);
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #1e2f3d;');
  console.log('%c✨ Built with modern UI/UX principles', styles.accent);
  console.log('%c📱 Fully responsive · Dark theme', styles.accent);
  console.log('%c⚡ Optimized for performance', styles.accent);
  console.log('%c━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'color: #1e2f3d;');
})();

// ============================================
// 13. SERVICE CARD HOVER EFFECT
// ============================================
(function() {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
      const icon = this.querySelector('.service-icon-wrapper');
      if (icon) {
        icon.style.transform = 'scale(1.1) rotate(-5deg)';
        icon.style.transition = 'all 0.3s ease';
      }
    });
    
    card.addEventListener('mouseleave', function() {
      const icon = this.querySelector('.service-icon-wrapper');
      if (icon) {
        icon.style.transform = 'scale(1) rotate(0deg)';
      }
    });
  });
})();

// ============================================
// 14. CUSTOM EVENT FOR PAGE SWITCH
// ============================================
(function() {
  // Dispatch custom event when page changes
  const originalSwitch = window.switchPage;
  if (originalSwitch) {
    window.switchPage = function(pageId) {
      originalSwitch(pageId);
      const event = new CustomEvent('pageSwitch', { detail: { page: pageId } });
      window.dispatchEvent(event);
    };
  }
})();

console.log('%c✅ All systems ready!', 'color: #2ecc71; font-size: 14px; font-weight: 600;');