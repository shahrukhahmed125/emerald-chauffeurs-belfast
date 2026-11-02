/**
 * EMERALD CHAUFFEURS BELFAST — GLOBAL NAVIGATION & INTERACTION ENGINE
 * Pure Vanilla JavaScript (Modular, reliable, multi-page aware)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. SCROLL PROGRESS INDICATOR & HEADER STICKY BEHAVIOR
  const scrollProgress = document.getElementById('scroll-progress');
  const headerWrapper = document.querySelector('.site-header-wrapper');
  const backToTopBtn = document.getElementById('backToTopBtn');

  const onScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Progress bar
    if (scrollProgress && docHeight > 0) {
      const progressPercent = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
      scrollProgress.style.width = `${progressPercent}%`;
    }

    // Header background transition
    if (headerWrapper) {
      if (scrollY > 40) {
        headerWrapper.classList.add('scrolled');
      } else {
        headerWrapper.classList.remove('scrolled');
      }
    }

    // Back to top button visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 2. ACTIVE PAGE NAVIGATION HIGHLIGHT
  const currentPath = window.location.pathname;
  const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1) || 'index.html';

  document.querySelectorAll('.nav-item a, .dropdown-item a, .mobile-nav-link, .mobile-submenu-item a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentFile || (currentFile === '' && href === 'index.html')) {
      link.parentElement.classList.add('active');
      // If it's inside a dropdown, highlight the parent nav-item as well
      const parentDropdown = link.closest('.dropdown-menu');
      if (parentDropdown) {
        const parentNavItem = parentDropdown.closest('.nav-item');
        if (parentNavItem) parentNavItem.classList.add('active');
      }
    }
  });

  // 3. DESKTOP DROPDOWN ACCESSIBILITY & KEYBOARD NAVIGATION
  const dropdownNavItems = document.querySelectorAll('.nav-item.has-dropdown');
  dropdownNavItems.forEach(item => {
    const triggerBtn = item.querySelector('.nav-link-btn');
    const dropdownMenu = item.querySelector('.dropdown-menu');

    if (triggerBtn && dropdownMenu) {
      triggerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isExpanded = triggerBtn.getAttribute('aria-expanded') === 'true';
        triggerBtn.setAttribute('aria-expanded', !isExpanded);
        item.classList.toggle('open');
      });

      // Close on focusout of the entire item
      item.addEventListener('focusout', (e) => {
        if (!item.contains(e.relatedTarget)) {
          triggerBtn.setAttribute('aria-expanded', 'false');
          item.classList.remove('open');
        }
      });
    }
  });

  // Close all open desktop dropdowns when pressing Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdownNavItems.forEach(item => {
        const triggerBtn = item.querySelector('.nav-link-btn');
        if (triggerBtn) triggerBtn.setAttribute('aria-expanded', 'false');
        item.classList.remove('open');
      });
    }
  });

  // 4. MOBILE DRAWER NAVIGATION & ACCORDIONS
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerCloseBtn = document.getElementById('mobileDrawerCloseBtn');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link:not(.has-submenu)');
  const mobileSubmenuTriggers = document.querySelectorAll('.mobile-nav-link.has-submenu');

  if (mobileToggleBtn && mobileDrawer) {
    const toggleMobileMenu = (open) => {
      const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('active');
      mobileDrawer.classList.toggle('active', isOpen);
      mobileToggleBtn.classList.toggle('active', isOpen);
      mobileToggleBtn.setAttribute('aria-expanded', isOpen);
      mobileDrawer.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    if (mobileDrawerCloseBtn) {
      mobileDrawerCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMobileMenu(false);
      });
    }

    // Expandable accordion submenus in mobile drawer
    mobileSubmenuTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const parentItem = trigger.closest('.mobile-nav-item');
        if (parentItem) {
          parentItem.classList.toggle('expanded');
          const isExpanded = parentItem.classList.contains('expanded');
          trigger.setAttribute('aria-expanded', isExpanded);
        }
      });
    });

    // Close menu when regular links are selected
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => toggleMobileMenu(false));
    });

    document.querySelectorAll('.mobile-submenu-item a').forEach(subLink => {
      subLink.addEventListener('click', () => toggleMobileMenu(false));
    });

    // Dismiss on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
        toggleMobileMenu(false);
      }
    });

    // Dismiss on backdrop click
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) {
        toggleMobileMenu(false);
      }
    });
  }

  // 5. CUSTOM LUXURY GOLD MOUSE CURSOR (Desktop only)
  const cursorDot = document.getElementById('cursorDot');
  const cursorRing = document.getElementById('cursorRing');
  
  if (cursorDot && cursorRing && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        cursorDot.classList.remove('cursor-hidden');
        cursorRing.classList.remove('cursor-hidden');
      }
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      isVisible = false;
      cursorDot.classList.add('cursor-hidden');
      cursorRing.classList.add('cursor-hidden');
    });

    document.addEventListener('mouseenter', () => {
      isVisible = true;
      cursorDot.classList.remove('cursor-hidden');
      cursorRing.classList.remove('cursor-hidden');
    });

    // Lerp loop for outer trailing ring
    const renderCursorRing = () => {
      if (isVisible) {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      requestAnimationFrame(renderCursorRing);
    };
    requestAnimationFrame(renderCursorRing);

    // Interactive elements trigger scale & glow
    const interactiveSelectors = 'a, button, input, select, textarea, .vehicle-card, .benefit-card, .timeline-stop-card, [role="button"]';
    document.querySelectorAll(interactiveSelectors).forEach(el => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-hover'));
    });
  }

  // 6. FLOATING WHATSAPP BUTTON URL
  const whatsappFloating = document.getElementById('whatsappFloating');
  if (whatsappFloating) {
    const defaultMsg = encodeURIComponent("Hello Emerald Chauffeurs Belfast, I would like to enquire about booking a chauffeur.");
    whatsappFloating.href = `https://wa.me/447894270520?text=${defaultMsg}`;
  }
});
