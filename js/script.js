/**
 * Rahul Raj — Portfolio
 * Vanilla JS, no dependencies.
 *
 * To connect the contact form to a real service:
 *  - Formspree: set the form's action to your Formspree endpoint and let it submit normally
 *    (remove/adjust the preventDefault logic in handleContactSubmit), or POST with fetch().
 *  - EmailJS: call emailjs.send(...) inside handleContactSubmit after validation passes.
 *  - Custom backend: replace the "simulateSubmit" function with a real fetch() call to your API.
 */

(function () {
  'use strict';

  /* ---------- helpers ---------- */
  function qs(selector, scope) {
    return (scope || document).querySelector(selector);
  }
  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }
  function on(el, event, handler, options) {
    if (el) el.addEventListener(event, handler, options);
  }

  var prefersReducedMotion = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  /* =========================================================
     Navbar: scroll state, mobile menu, active link, smooth scroll
     ========================================================= */
  (function initNavbar() {
    var navbar = qs('#navbar');
    var navToggle = qs('#navToggle');
    var navLinks = qs('#navLinks');
    var navLinkItems = qsa('[data-nav]');

    if (!navbar) return;

    function updateScrolledState() {
      if (window.scrollY > 12) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }
    }
    updateScrolledState();
    on(window, 'scroll', updateScrolledState, { passive: true });

    if (navToggle && navLinks) {
      var closeMenu = function () {
        navLinks.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
      };
      var openMenu = function () {
        navLinks.classList.add('is-open');
        navToggle.setAttribute('aria-expanded', 'true');
        navToggle.setAttribute('aria-label', 'Close menu');
      };

      on(navToggle, 'click', function () {
        var isOpen = navLinks.classList.contains('is-open');
        if (isOpen) closeMenu(); else openMenu();
      });

      // Close the mobile menu whenever a nav item is clicked
      navLinkItems.forEach(function (link) {
        on(link, 'click', closeMenu);
      });

      // Close on outside click
      on(document, 'click', function (e) {
        var clickedInsideNav = navLinks.contains(e.target) || navToggle.contains(e.target);
        if (!clickedInsideNav && navLinks.classList.contains('is-open')) {
          closeMenu();
        }
      });

      // Close on Escape
      on(document, 'keydown', function (e) {
        if (e.key === 'Escape' && navLinks.classList.contains('is-open')) {
          closeMenu();
          navToggle.focus();
        }
      });
    }

    // Active link highlighting via IntersectionObserver
    var sections = navLinkItems
      .map(function (link) {
        var id = link.getAttribute('href');
        return id && id.charAt(0) === '#' ? qs(id) : null;
      })
      .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            var id = '#' + entry.target.id;
            navLinkItems.forEach(function (link) {
              var isMatch = link.getAttribute('href') === id;
              link.classList.toggle('active-link', isMatch);
            });
          });
        },
        { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
      );
      sections.forEach(function (section) { observer.observe(section); });
    }
  })();

  /* =========================================================
     Scroll reveal animations (one calm entrance per section)
     ========================================================= */
  (function initReveal() {
    var revealTargets = qsa('.section-inner, .hero-copy, .hero-visual');
    revealTargets.forEach(function (el) { el.classList.add('reveal'); });

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealTargets.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealTargets.forEach(function (el) { observer.observe(el); });
  })();

  /* =========================================================
     Project filtering
     ========================================================= */
  (function initProjectFilter() {
    var filterButtons = qsa('.filter-btn');
    var projectCards = qsa('.project-card');
    var emptyState = qs('#filterEmpty');

    if (!filterButtons.length || !projectCards.length) return;

    function applyFilter(filter) {
      var visibleCount = 0;
      projectCards.forEach(function (card) {
        var categories = (card.getAttribute('data-category') || '').split(' ');
        var matches = filter === 'all' || categories.indexOf(filter) !== -1;
        card.classList.toggle('is-hidden', !matches);
        if (matches) visibleCount += 1;
      });
      if (emptyState) emptyState.hidden = visibleCount !== 0;
    }

    filterButtons.forEach(function (button) {
      on(button, 'click', function () {
        filterButtons.forEach(function (b) {
          b.classList.remove('is-active');
          b.setAttribute('aria-selected', 'false');
        });
        button.classList.add('is-active');
        button.setAttribute('aria-selected', 'true');
        applyFilter(button.getAttribute('data-filter'));
      });
    });
  })();

  /* =========================================================
     Contact form validation
     ========================================================= */
  (function initContactForm() {
    var form = qs('#contactForm');
    if (!form) return;

    var nameField = qs('#name', form);
    var emailField = qs('#email', form);
    var messageField = qs('#message', form);
    var statusEl = qs('#formStatus');

    var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function setError(field, errorEl, message) {
      if (!field || !errorEl) return;
      var wrapper = field.closest('.form-field');
      errorEl.textContent = message || '';
      if (wrapper) wrapper.classList.toggle('has-error', Boolean(message));
    }

    function validateField(field) {
      if (!field) return true;
      var errorEl = qs('#' + field.id + 'Error');
      var value = field.value.trim();

      if (!value) {
        setError(field, errorEl, 'This field is required.');
        return false;
      }
      if (field.id === 'email' && !emailPattern.test(value)) {
        setError(field, errorEl, 'Enter a valid email address.');
        return false;
      }
      if (field.id === 'message' && value.length < 10) {
        setError(field, errorEl, 'Message should be at least 10 characters.');
        return false;
      }
      setError(field, errorEl, '');
      return true;
    }

    [nameField, emailField, messageField].forEach(function (field) {
      on(field, 'blur', function () { validateField(field); });
    });

    on(form, 'submit', function (event) {
      event.preventDefault();

      var isNameValid = validateField(nameField);
      var isEmailValid = validateField(emailField);
      var isMessageValid = validateField(messageField);

      if (!(isNameValid && isEmailValid && isMessageValid)) {
        if (statusEl) {
          statusEl.textContent = 'Please fix the highlighted fields.';
          statusEl.className = 'form-status is-error';
        }
        return;
      }

      // No backend/email service is configured in this template, so we do not
      // claim the message was sent. Replace this block with a real request
      // (Formspree / EmailJS / your own API) once one is connected.
      if (statusEl) {
        statusEl.textContent =
          'Form validated. Connect Formspree, EmailJS, or a backend in js/script.js to actually send this message.';
        statusEl.className = 'form-status is-success';
      }
    });
  })();

  /* =========================================================
     Back to top button
     ========================================================= */
  (function initBackToTop() {
    var button = qs('#backToTop');
    if (!button) return;

    function toggleVisibility() {
      button.classList.toggle('is-visible', window.scrollY > 480);
    }
    toggleVisibility();
    on(window, 'scroll', toggleVisibility, { passive: true });

    on(button, 'click', function () {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    });
  })();

  /* =========================================================
     Footer year
     ========================================================= */
  (function initFooterYear() {
    var yearEl = qs('#year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());
  })();
})();
