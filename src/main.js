/**
 * EMERALD CHAUFFEURS BELFAST — LUXURY MOTION & INTERACTION ENGINE
 * Pure Vanilla JavaScript (No frameworks, high performance, silky 60fps)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. CUSTOM LUXURY GOLD MOUSE CURSOR (Desktop / Pointer Devices)
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

    // Lerp animation loop for silky fluid trailing outer ring
    const renderCursorRing = () => {
      if (isVisible) {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }
      requestAnimationFrame(renderCursorRing);
    };
    requestAnimationFrame(renderCursorRing);

    // Interactive Hover Detection
    const interactiveSelectors = 'a, button, input, select, textarea, .service-card, .tour-stop-card, .fleet-tab-btn, .why-us-card, .testimonial-card, [role="button"]';
    
    const attachCursorHover = () => {
      document.querySelectorAll(interactiveSelectors).forEach(el => {
        el.addEventListener('mouseenter', () => cursorRing.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursorRing.classList.remove('cursor-hover'));
      });
    };
    attachCursorHover();
  }

  // 2. LUXURY PRELOADER LIFECYCLE (Smooth progressive countdown & curtain reveal)
  const preloader = document.getElementById('preloader');
  const preloaderFill = document.getElementById('preloaderLineFill');
  const preloaderCounter = document.getElementById('preloaderCounter');
  const preloaderStatus = document.getElementById('preloaderStatus');

  let loadProgress = 0;
  const statusMessages = [
    { threshold: 0, text: 'Preparing Your Sovereign Journey' },
    { threshold: 30, text: 'Calibrating Mercedes-Benz Fleet' },
    { threshold: 65, text: 'Fine-Tuning Coastal Itineraries' },
    { threshold: 92, text: 'Welcome to Emerald Chauffeurs' }
  ];

  const updatePreloader = (val) => {
    loadProgress = Math.min(100, Math.max(loadProgress, val));
    if (preloaderCounter) preloaderCounter.textContent = `${Math.floor(loadProgress)}%`;
    if (preloaderFill) preloaderFill.style.width = `${loadProgress}%`;

    if (preloaderStatus) {
      for (let i = statusMessages.length - 1; i >= 0; i--) {
        if (loadProgress >= statusMessages[i].threshold) {
          preloaderStatus.textContent = statusMessages[i].text;
          break;
        }
      }
    }
  };

  const progressInterval = setInterval(() => {
    if (loadProgress < 90) {
      updatePreloader(loadProgress + (loadProgress < 40 ? 3.8 : 2.2));
    }
  }, 35);

  const completeAndDismissPreloader = () => {
    clearInterval(progressInterval);
    updatePreloader(100);

    setTimeout(() => {
      if (preloader && !preloader.classList.contains('loaded')) {
        preloader.classList.add('loaded');
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 900);
      }
    }, 380);
  };

  // Ensure minimum visibility of 1.7s so the visitor experiences the luxury preloader
  setTimeout(() => {
    if (document.readyState === 'complete') {
      completeAndDismissPreloader();
    } else {
      window.addEventListener('load', completeAndDismissPreloader);
      // Hard fallback timeout so it never hangs
      setTimeout(completeAndDismissPreloader, 1000);
    }
  }, 1650);

  // 3. SCROLL PROGRESS INDICATOR & STICKY HEADER
  const scrollProgress = document.getElementById('scroll-progress');
  const headerNav = document.getElementById('headerNav');
  const backToTopBtn = document.getElementById('backToTopBtn');

  // Parallax elements
  const heroBg = document.querySelector('.hero-bg-img');
  const tourBg = document.querySelector('.tour-bg-image');
  const introImg = document.querySelector('.intro-img');
  const introBadge = document.querySelector('.intro-badge-floating');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let isMobile = window.innerWidth < 768;

  window.addEventListener('resize', () => {
    isMobile = window.innerWidth < 768;
  }, { passive: true });

  let ticking = false;

  const onScroll = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // A. Top Progress Bar
    if (scrollProgress && docHeight > 0) {
      const progressPercent = Math.min(100, Math.max(0, (scrollY / docHeight) * 100));
      scrollProgress.style.width = `${progressPercent}%`;
    }

    // B. Header Glassmorphism Transition
    if (headerNav) {
      if (scrollY > 50) {
        headerNav.classList.add('scrolled');
      } else {
        headerNav.classList.remove('scrolled');
      }
    }

    // C. Back To Top Visibility
    if (backToTopBtn) {
      if (scrollY > 400) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    }

    // D. Advanced Differential Parallax Effects (Disabled on reduced motion or mobile)
    if (!prefersReducedMotion && !isMobile) {
      // Hero Parallax
      if (heroBg) {
        const heroOffset = scrollY * 0.32;
        heroBg.style.transform = `translate3d(0, ${heroOffset}px, 0)`;
      }

      // Introduction Section Photo Parallax
      if (introImg) {
        const introRect = introImg.getBoundingClientRect();
        if (introRect.top < window.innerHeight && introRect.bottom > 0) {
          const introOffset = (introRect.top - window.innerHeight / 2) * 0.08;
          introImg.style.transform = `scale(1.04) translate3d(0, ${introOffset}px, 0)`;
        }
      }

      // Floating Badge Counter-Parallax (only on desktop where it's absolute)
      if (introBadge && window.innerWidth > 1024) {
        const badgeRect = introBadge.getBoundingClientRect();
        if (badgeRect.top < window.innerHeight && badgeRect.bottom > 0) {
          const badgeOffset = (badgeRect.top - window.innerHeight / 2) * -0.06;
          introBadge.style.transform = `translate3d(0, ${badgeOffset}px, 0)`;
        }
      }

      // Scenic Tour Background Parallax
      if (tourBg) {
        const tourRect = tourBg.getBoundingClientRect();
        if (tourRect.top < window.innerHeight && tourRect.bottom > 0) {
          const tourOffset = (tourRect.top - window.innerHeight / 2) * 0.16;
          tourBg.style.transform = `scale(1.08) translate3d(0, ${tourOffset}px, 0)`;
        }
      }
    }

    ticking = false;
  };

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  // Initial call
  onScroll();

  // 4. BACK TO TOP BUTTON
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  // 5. INTERSECTION OBSERVER FOR SECTION REVEALS & METRIC COUNTERS
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .reveal-clip, .gold-divider');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Animate numeric counters inside this block if present
          const counters = entry.target.querySelectorAll('.metric-val[data-target]');
          counters.forEach(counter => {
            const target = parseFloat(counter.getAttribute('data-target'));
            const suffix = counter.getAttribute('data-suffix') || '';
            let current = 0;
            const duration = 1600;
            const stepTime = 30;
            const steps = duration / stepTime;
            const increment = target / steps;

            const timer = setInterval(() => {
              current += increment;
              if (current >= target) {
                counter.textContent = (target % 1 === 0 ? target.toString() : target.toFixed(1)) + suffix;
                clearInterval(timer);
              } else {
                counter.textContent = (target % 1 === 0 ? Math.floor(current).toString() : current.toFixed(1)) + suffix;
              }
            }, stepTime);
          });
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // 6. MOBILE DRAWER NAVIGATION (Responsive & Accessible)
  const mobileToggleBtn = document.getElementById('mobileToggleBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const mobileDrawerCloseBtn = document.getElementById('mobileDrawerCloseBtn');
  const mobileDrawerBrand = document.getElementById('mobileDrawerBrand');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggleBtn && mobileDrawer) {
    const toggleMenu = (open) => {
      const isOpen = open !== undefined ? open : !mobileDrawer.classList.contains('active');
      mobileDrawer.classList.toggle('active', isOpen);
      mobileToggleBtn.classList.toggle('active', isOpen);
      mobileToggleBtn.setAttribute('aria-expanded', isOpen);
      mobileDrawer.setAttribute('aria-hidden', !isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    mobileToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMenu();
    });

    if (mobileDrawerCloseBtn) {
      mobileDrawerCloseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMenu(false);
      });
    }

    if (mobileDrawerBrand) {
      mobileDrawerBrand.addEventListener('click', () => toggleMenu(false));
    }

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileDrawer.classList.contains('active')) {
        toggleMenu(false);
      }
    });

    // Close on backdrop click
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) {
        toggleMenu(false);
      }
    });
  }

  // 7. INTERACTIVE FLEET SHOWCASE
  const fleetData = {
    's-class': {
      title: 'Mercedes-Benz S-Class LWB',
      category: 'Flagship Luxury Saloon',
      description: 'The global benchmark for executive discretion and sovereign comfort. Fitted with first-class rear executive seating, extended legroom, acoustic privacy glass, and bespoke leather appointments.',
      image: '/src/assets/images/hero_chauffeur_mercedes_1793622641365.jpg',
      interior: '/src/assets/images/fleet_interior_luxury_1793622664432.jpg',
      specs: [
        { label: 'Capacity', value: '3 Passengers' },
        { label: 'Luggage', value: '2 Large + 2 Cabin Bags' },
        { label: 'Wi-Fi', value: 'High-Speed 5G On-Board' },
        { label: 'Refreshments', value: 'Chilled Celtic Spring Water' },
        { label: 'Power', value: 'Wireless Qi & USB-C Ports' },
        { label: 'Comfort', value: 'Heated & Massaging Seats' }
      ]
    },
    'v-class': {
      title: 'Mercedes-Benz V-Class Extra-Long',
      category: 'First-Class Executive MPV',
      description: 'Supreme spaciousness for delegations, family relocations, private aviation transfers, and golf excursions. Features face-to-face conference seating, ambient LED lighting, and colossal luggage capacity.',
      image: '/src/assets/images/service_private_jet_1793622644372.jpg',
      interior: '/src/assets/images/fleet_interior_luxury_1793622664432.jpg',
      specs: [
        { label: 'Capacity', value: '7 Passengers' },
        { label: 'Luggage', value: '7 Large Cases + 7 Golf Bags' },
        { label: 'Layout', value: 'Face-to-Face Conference' },
        { label: 'Refreshments', value: 'Chilled Mini-Bar Cooler' },
        { label: 'Privacy', value: 'Rear Privacy Curtains & Tint' },
        { label: 'Doors', value: 'Dual Electric Sliding Doors' }
      ]
    },
    'range-rover': {
      title: 'Range Rover Autobiography LWB',
      category: 'Prestige All-Terrain Luxury SUV',
      description: 'Elevated command and peerless refinement across Northern Ireland’s majestic landscapes. Exceptional sound insulation, active noise cancellation, panoramic glass roof, and sovereign ride comfort.',
      image: '/src/assets/images/service_corporate_chauffeur_1793622642178.jpg',
      interior: '/src/assets/images/fleet_interior_luxury_1793622664432.jpg',
      specs: [
        { label: 'Capacity', value: '4 Passengers' },
        { label: 'Luggage', value: '4 Large Hard Shell Cases' },
        { label: 'Suspension', value: 'Electronic Air Suspension' },
        { label: 'Sound', value: 'Meridian Signature Audio' },
        { label: 'Terrain', value: 'Intelligent All-Wheel Drive' },
        { label: 'Atmosphere', value: 'Cabin Air Purification Pro' }
      ]
    }
  };

  const fleetTabs = document.querySelectorAll('.fleet-tab-btn');
  const fleetTitle = document.getElementById('fleetTitle');
  const fleetCategory = document.getElementById('fleetCategory');
  const fleetDescription = document.getElementById('fleetDescription');
  const fleetImage = document.getElementById('fleetImage');
  const fleetSpecsContainer = document.getElementById('fleetSpecsContainer');

  fleetTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const vehicleKey = tab.getAttribute('data-vehicle');
      const data = fleetData[vehicleKey];
      if (!data) return;

      fleetTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Smooth transition
      if (fleetImage) {
        fleetImage.style.opacity = '0';
        setTimeout(() => {
          fleetImage.src = data.image;
          fleetImage.style.opacity = '1';
        }, 220);
      }

      if (fleetTitle) fleetTitle.textContent = data.title;
      if (fleetCategory) fleetCategory.textContent = data.category;
      if (fleetDescription) fleetDescription.textContent = data.description;

      if (fleetSpecsContainer) {
        fleetSpecsContainer.innerHTML = data.specs.map(spec => `
          <div class="spec-item">
            <span class="spec-label">${spec.label}</span>
            <span class="spec-value">${spec.value}</span>
          </div>
        `).join('');
      }
    });
  });

  // 8. INTERACTIVE SCENIC TOUR STOPS SELECTOR
  const tourStops = [
    {
      id: 'giants-causeway',
      title: "Giant's Causeway UNESCO Site",
      duration: 'Full Day · 8 Hours',
      desc: 'Marvel at over 40,000 interlocking basalt columns formed 60 million years ago. Seamless VIP drop-off directly at the Visitor Centre, private guided strolls, and dramatic coastal panoramas.'
    },
    {
      id: 'dunluce-castle',
      title: 'Dunluce Castle Ruins',
      duration: 'Morning Stop · 45 Mins',
      desc: 'Perched precipitously on dramatic sea cliffs along the North Antrim coast. Unmatched photography vantage points with our knowledgeable chauffeur acting as your personal local guide.'
    },
    {
      id: 'carrick-rope',
      title: 'Carrick-a-Rede & Coastal Bridges',
      duration: 'Scenic Excursion · 1.5 Hours',
      desc: 'Suspended nearly 100 feet above the crashing Atlantic ocean. Chauffeur awaits with warm refreshments, dry towels, and climate-controlled cabin.'
    },
    {
      id: 'dark-hedges',
      title: 'The Dark Hedges (Kingsroad)',
      duration: 'Afternoon Stop · 30 Mins',
      desc: 'The iconic 18th-century avenue of intertwined beech trees planted by the Stuart family. Perfectly timed arrival to avoid tourist coaches for pristine photography.'
    },
    {
      id: 'bushmills-distillery',
      title: 'Old Bushmills Whiskey Tasting',
      duration: 'Private Tasting · 1.5 Hours',
      desc: 'The world’s oldest licensed whiskey distillery dating back to 1608. Enjoy rare reserve tastings with peace of mind knowing your luxury Mercedes chauffeur is your designated driver.'
    }
  ];

  const tourStopCards = document.querySelectorAll('.tour-stop-card');
  const activeTourTitle = document.getElementById('activeTourTitle');
  const activeTourDesc = document.getElementById('activeTourDesc');
  const activeTourDuration = document.getElementById('activeTourDuration');

  tourStopCards.forEach((card, index) => {
    card.addEventListener('click', () => {
      tourStopCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');

      const stop = tourStops[index];
      if (stop) {
        if (activeTourTitle) activeTourTitle.textContent = stop.title;
        if (activeTourDesc) activeTourDesc.textContent = stop.desc;
        if (activeTourDuration) activeTourDuration.textContent = stop.duration;
      }
    });
  });

  // 9. INTERACTIVE BESPOKE QUOTE & BOOKING FORM
  const bookingForm = document.getElementById('chauffeurBookingForm');
  const serviceSelect = document.getElementById('bookingService');
  const vehicleSelect = document.getElementById('bookingVehicle');
  const estimateVehicleName = document.getElementById('estimateVehicleName');
  const estimatePrice = document.getElementById('estimatePrice');
  const modalOverlay = document.getElementById('bookingConfirmationModal');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const modalBookingRef = document.getElementById('modalBookingRef');
  const modalPassengerName = document.getElementById('modalPassengerName');
  const modalJourneyDetails = document.getElementById('modalJourneyDetails');

  // Pricing Matrix Estimates (GBP)
  const baseEstimates = {
    'airport-bfs': { 's-class': '£110', 'v-class': '£140', 'range-rover': '£160' },
    'airport-bhd': { 's-class': '£85', 'v-class': '£115', 'range-rover': '£135' },
    'airport-dub': { 's-class': '£290', 'v-class': '£350', 'range-rover': '£380' },
    'corporate-day': { 's-class': '£550', 'v-class': '£650', 'range-rover': '£720' },
    'giants-causeway': { 's-class': '£460', 'v-class': '£540', 'range-rover': '£590' },
    'golf-tour': { 's-class': '£490', 'v-class': '£580', 'range-rover': '£640' },
    'wedding': { 's-class': '£420', 'v-class': '£500', 'range-rover': '£560' },
    'private-jet': { 's-class': '£160', 'v-class': '£195', 'range-rover': '£220' }
  };

  const updatePriceEstimate = () => {
    if (!serviceSelect || !vehicleSelect) return;
    const sVal = serviceSelect.value;
    const vVal = vehicleSelect.value;
    
    let priceStr = '£140+';
    if (baseEstimates[sVal] && baseEstimates[sVal][vVal]) {
      priceStr = baseEstimates[sVal][vVal];
    }

    const vNames = {
      's-class': 'Mercedes-Benz S-Class LWB',
      'v-class': 'Mercedes-Benz V-Class XL (7 Seats)',
      'range-rover': 'Range Rover Autobiography LWB'
    };

    if (estimatePrice) estimatePrice.textContent = priceStr;
    if (estimateVehicleName) estimateVehicleName.textContent = vNames[vVal] || 'Mercedes-Benz Executive';
  };

  if (serviceSelect && vehicleSelect) {
    serviceSelect.addEventListener('change', updatePriceEstimate);
    vehicleSelect.addEventListener('change', updatePriceEstimate);
    updatePriceEstimate();
  }

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Form validation
      const name = document.getElementById('bookingName')?.value.trim();
      const phone = document.getElementById('bookingPhone')?.value.trim();
      const email = document.getElementById('bookingEmail')?.value.trim();
      const pickup = document.getElementById('bookingPickup')?.value.trim();
      const destination = document.getElementById('bookingDestination')?.value.trim();
      const date = document.getElementById('bookingDate')?.value;
      const time = document.getElementById('bookingTime')?.value;

      if (!name || !phone || !email || !pickup || !destination || !date || !time) {
        alert('Please complete all required journey details.');
        return;
      }

      // Generate Reference Code
      const refCode = 'ECB-' + Math.floor(100000 + Math.random() * 900000);
      
      if (modalBookingRef) modalBookingRef.textContent = refCode;
      if (modalPassengerName) modalPassengerName.textContent = name;
      if (modalJourneyDetails) {
        modalJourneyDetails.textContent = `${pickup} → ${destination} on ${date} at ${time}`;
      }

      if (modalOverlay) {
        modalOverlay.classList.add('active');
      }

      bookingForm.reset();
      updatePriceEstimate();
    });
  }

  if (modalCloseBtn && modalOverlay) {
    modalCloseBtn.addEventListener('click', () => {
      modalOverlay.classList.remove('active');
    });

    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.classList.remove('active');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modalOverlay.classList.contains('active')) {
        modalOverlay.classList.remove('active');
      }
    });
  }

  // 10. SMOOTH SCROLL FOR IN-PAGE ANCHOR LINKS
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          const headerHeight = headerNav ? headerNav.offsetHeight : 70;
          const elementPosition = targetEl.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  // 11. DYNAMIC PRE-FILLED WHATSAPP GENERATOR
  const whatsappFloating = document.getElementById('whatsappFloating');
  if (whatsappFloating) {
    const defaultMsg = encodeURIComponent("Hello Emerald Chauffeurs Belfast, I would like to enquire about your chauffeur services.");
    whatsappFloating.href = `https://wa.me/447894270520?text=${defaultMsg}`;
  }
});
