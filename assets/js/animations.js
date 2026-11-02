/**
 * EMERALD CHAUFFEURS BELFAST — MOTION & REVEAL ENGINE
 * Pure Vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. SECTION REVEAL OBSERVER
  const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right, .reveal-scale, .gold-divider');

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
            const duration = 1500;
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
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  // 2. HOMEPAGE PRELOADER LIFECYCLE (if element exists)
  const preloader = document.getElementById('preloader');
  if (preloader) {
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
        updatePreloader(loadProgress + (loadProgress < 40 ? 4 : 2.5));
      }
    }, 35);

    const completePreloader = () => {
      clearInterval(progressInterval);
      updatePreloader(100);

      setTimeout(() => {
        if (!preloader.classList.contains('loaded')) {
          preloader.classList.add('loaded');
          setTimeout(() => {
            preloader.style.display = 'none';
          }, 900);
        }
      }, 350);
    };

    setTimeout(() => {
      if (document.readyState === 'complete') {
        completePreloader();
      } else {
        window.addEventListener('load', completePreloader);
        setTimeout(completePreloader, 1000);
      }
    }, 1500);
  }
});
