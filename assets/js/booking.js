/**
 * EMERALD CHAUFFEURS BELFAST — PREMIUM MULTI-STEP BOOKING SYSTEM
 * Pure Vanilla JavaScript (Stateful, validated, session-persistent)
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check if we are on the booking page or homepage widget
  const bookingFormWrap = document.getElementById('bookingStepperWrap');
  const homeWidgetForm = document.getElementById('homeBookingWidgetForm');

  // Available Vehicle Fleet Definition (Illustrative specifications)
  const vehicleFleet = [
    {
      id: 'business-class',
      category: 'Business Class',
      title: 'Mercedes-Benz E-Class / EQE',
      desc: 'Refined executive comfort and acoustic privacy. Ideal for individual airport transfers, financial district appointments, and daily business journeys.',
      passengers: '3 Passengers',
      luggage: '2 Large + 2 Cabin Bags',
      image: '/src/assets/images/hero_chauffeur_mercedes_1793622641365.jpg',
      tag: 'Illustrative Fleet Model'
    },
    {
      id: 'executive-class',
      category: 'Executive Class',
      title: 'Mercedes-Benz S-Class LWB',
      desc: 'The sovereign benchmark in luxury travel. Featuring reclining heated nappa leather seats, extended rear legroom, high-speed 5G, and acoustic privacy glass.',
      passengers: '3 Passengers',
      luggage: '2 Large + 2 Cabin Bags',
      image: '/src/assets/images/fleet_interior_luxury_1793622664432.jpg',
      tag: 'Illustrative Fleet Model'
    },
    {
      id: 'first-class',
      category: 'First Class MPV',
      title: 'Mercedes-Benz V-Class Extra-Long',
      desc: 'Unrivalled luxury group travel. Face-to-face conference seating, ambient LED lighting, dual electric doors, and massive capacity for luggage and golf equipment.',
      passengers: '7 Passengers',
      luggage: '7 Large Cases + 7 Bags',
      image: '/src/assets/images/service_private_jet_1793622644372.jpg',
      tag: 'Illustrative Fleet Model'
    },
    {
      id: 'luxury-chauffeur',
      category: 'Luxury Chauffeur SUV',
      title: 'Range Rover Autobiography LWB',
      desc: 'Prestige all-terrain command across Northern Ireland’s majestic coastlines. Panoramic glass roof, electronic air suspension, and Meridian signature audio.',
      passengers: '4 Passengers',
      luggage: '4 Large Hard Shell Bags',
      image: '/src/assets/images/fleet_range_rover_1793629359784.jpg',
      tag: 'Illustrative Fleet Model'
    }
  ];

  // Default Booking State Structure
  let bookingState = {
    journeyType: 'one-way',
    pickup: '',
    destination: '',
    pickupDate: '',
    pickupTime: '',
    returnDate: '',
    returnTime: '',
    hourlyDuration: '4',
    passengers: 2,
    suitcases: 2,
    selectedVehicleId: 'executive-class',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    flightNumber: '',
    specialRequirements: '',
    privacyAccepted: false,
    referenceCode: ''
  };

  // Restore state from sessionStorage if available
  const loadStoredState = () => {
    try {
      const stored = sessionStorage.getItem('emerald_booking_state');
      if (stored) {
        const parsed = JSON.parse(stored);
        bookingState = { ...bookingState, ...parsed };
      }
    } catch (e) {
      console.warn('Session storage read error', e);
    }
  };

  const saveStateToStorage = () => {
    try {
      sessionStorage.setItem('emerald_booking_state', JSON.stringify(bookingState));
    } catch (e) {
      console.warn('Session storage write error', e);
    }
  };

  loadStoredState();

  // ==========================================================================
  // HOMEPAGE SEARCH WIDGET INTEGRATION
  // ==========================================================================
  if (homeWidgetForm) {
    // Sync default dates (tomorrow by default)
    const widgetDateInput = document.getElementById('widgetDate');
    if (widgetDateInput && !widgetDateInput.value) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      widgetDateInput.value = tomorrow.toISOString().split('T')[0];
    }

    // Tab buttons for widget
    const widgetTabs = document.querySelectorAll('.widget-tab-btn');
    widgetTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        widgetTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        bookingState.journeyType = tab.getAttribute('data-type') || 'one-way';
      });
    });

    homeWidgetForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const pickupVal = document.getElementById('widgetPickup')?.value.trim() || '';
      const destVal = document.getElementById('widgetDestination')?.value.trim() || '';
      const dateVal = document.getElementById('widgetDate')?.value || '';
      const timeVal = document.getElementById('widgetTime')?.value || '';
      const paxVal = parseInt(document.getElementById('widgetPassengers')?.value || '2', 10);

      bookingState.pickup = pickupVal;
      bookingState.destination = destVal;
      bookingState.pickupDate = dateVal;
      bookingState.pickupTime = timeVal;
      bookingState.passengers = paxVal;

      saveStateToStorage();
      window.location.href = 'book-now.html';
    });
  }

  // ==========================================================================
  // MULTI-STEP BOOKING PAGE ENGINE (book-now.html)
  // ==========================================================================
  if (bookingFormWrap) {
    let currentStep = 1;
    const totalSteps = 4; // Step 1 to 4 + Step 5 Success

    const trackFill = document.getElementById('stepperTrackFill');
    const stepNodes = document.querySelectorAll('.step-node');
    const stepContents = document.querySelectorAll('.booking-step-content');

    const updateStepperUI = (step) => {
      currentStep = step;

      // Update progress fill bar
      if (trackFill) {
        const percent = ((step - 1) / (totalSteps - 1)) * 100;
        trackFill.style.width = `${Math.min(100, Math.max(0, percent))}%`;
      }

      // Update node bubbles
      stepNodes.forEach((node, idx) => {
        const nodeStep = idx + 1;
        node.classList.remove('active', 'completed');
        if (nodeStep === step) {
          node.classList.add('active');
        } else if (nodeStep < step) {
          node.classList.add('completed');
        }
      });

      // Update active view
      stepContents.forEach((content) => {
        content.classList.remove('active');
        if (parseInt(content.getAttribute('data-step'), 10) === step) {
          content.classList.add('active');
        }
      });

      // Scroll to top of booking card smoothly
      const bookingCard = document.querySelector('.booking-card');
      if (bookingCard) {
        const cardTop = bookingCard.getBoundingClientRect().top + window.pageYOffset - 100;
        window.scrollTo({ top: cardTop, behavior: 'smooth' });
      }
    };

    // ------------------------------------------------------------------------
    // STEP 1: JOURNEY DETAILS WIRING
    // ------------------------------------------------------------------------
    const journeyTypeBtns = document.querySelectorAll('.journey-type-btn');
    const returnFieldsWrap = document.getElementById('returnFieldsWrap');
    const hourlyDurationWrap = document.getElementById('hourlyDurationWrap');
    const swapLocationsBtn = document.getElementById('swapLocationsBtn');

    const pickupInput = document.getElementById('pickupLocation');
    const destInput = document.getElementById('destinationLocation');
    const pickupDateInput = document.getElementById('pickupDate');
    const pickupTimeInput = document.getElementById('pickupTime');
    const returnDateInput = document.getElementById('returnDate');
    const returnTimeInput = document.getElementById('returnTime');
    const hourlySelect = document.getElementById('hourlyDurationSelect');

    const paxCounterDisplay = document.getElementById('paxCountDisplay');
    const paxMinusBtn = document.getElementById('paxMinusBtn');
    const paxPlusBtn = document.getElementById('paxPlusBtn');

    const bagCounterDisplay = document.getElementById('bagCountDisplay');
    const bagMinusBtn = document.getElementById('bagMinusBtn');
    const bagPlusBtn = document.getElementById('bagPlusBtn');

    // Populate default date (tomorrow if empty)
    if (pickupDateInput && !pickupDateInput.value) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const minDate = tomorrow.toISOString().split('T')[0];
      pickupDateInput.value = minDate;
      pickupDateInput.min = new Date().toISOString().split('T')[0];
      if (returnDateInput) returnDateInput.min = minDate;
    }

    // Populate existing values from state
    if (pickupInput && bookingState.pickup) pickupInput.value = bookingState.pickup;
    if (destInput && bookingState.destination) destInput.value = bookingState.destination;
    if (pickupDateInput && bookingState.pickupDate) pickupDateInput.value = bookingState.pickupDate;
    if (pickupTimeInput && bookingState.pickupTime) pickupTimeInput.value = bookingState.pickupTime;
    if (returnDateInput && bookingState.returnDate) returnDateInput.value = bookingState.returnDate;
    if (returnTimeInput && bookingState.returnTime) returnTimeInput.value = bookingState.returnTime;

    // Journey Type handler
    const setJourneyType = (type) => {
      bookingState.journeyType = type;
      journeyTypeBtns.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-type') === type);
      });

      if (returnFieldsWrap) {
        returnFieldsWrap.style.display = type === 'return' ? 'grid' : 'none';
      }
      if (hourlyDurationWrap) {
        hourlyDurationWrap.style.display = type === 'hourly' ? 'block' : 'none';
      }
      saveStateToStorage();
    };

    journeyTypeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        setJourneyType(btn.getAttribute('data-type'));
      });
    });
    setJourneyType(bookingState.journeyType || 'one-way');

    // Swap Locations Button
    if (swapLocationsBtn && pickupInput && destInput) {
      swapLocationsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const temp = pickupInput.value;
        pickupInput.value = destInput.value;
        destInput.value = temp;
        bookingState.pickup = pickupInput.value;
        bookingState.destination = destInput.value;
        saveStateToStorage();
      });
    }

    // Passenger & Luggage Counters
    const updateCountersUI = () => {
      if (paxCounterDisplay) paxCounterDisplay.textContent = bookingState.passengers;
      if (bagCounterDisplay) bagCounterDisplay.textContent = bookingState.suitcases;
      saveStateToStorage();
    };

    if (paxMinusBtn) {
      paxMinusBtn.addEventListener('click', () => {
        if (bookingState.passengers > 1) {
          bookingState.passengers--;
          updateCountersUI();
        }
      });
    }
    if (paxPlusBtn) {
      paxPlusBtn.addEventListener('click', () => {
        if (bookingState.passengers < 8) {
          bookingState.passengers++;
          updateCountersUI();
        }
      });
    }

    if (bagMinusBtn) {
      bagMinusBtn.addEventListener('click', () => {
        if (bookingState.suitcases > 0) {
          bookingState.suitcases--;
          updateCountersUI();
        }
      });
    }
    if (bagPlusBtn) {
      bagPlusBtn.addEventListener('click', () => {
        if (bookingState.suitcases < 8) {
          bookingState.suitcases++;
          updateCountersUI();
        }
      });
    }
    updateCountersUI();

    // Step 1 Validation & Next
    const validateStep1 = () => {
      let isValid = true;
      const pickup = pickupInput?.value.trim() || '';
      const dest = destInput?.value.trim() || '';
      const pDate = pickupDateInput?.value || '';
      const pTime = pickupTimeInput?.value || '';

      const errPickup = document.getElementById('errPickup');
      const errDest = document.getElementById('errDest');
      const errPDate = document.getElementById('errPickupDate');
      const errPTime = document.getElementById('errPickupTime');

      if (!pickup) {
        if (errPickup) errPickup.classList.add('visible');
        if (pickupInput) pickupInput.classList.add('error');
        isValid = false;
      } else {
        if (errPickup) errPickup.classList.remove('visible');
        if (pickupInput) pickupInput.classList.remove('error');
      }

      if (!dest) {
        if (errDest) errDest.classList.add('visible');
        if (destInput) destInput.classList.add('error');
        isValid = false;
      } else {
        if (errDest) errDest.classList.remove('visible');
        if (destInput) destInput.classList.remove('error');
      }

      if (!pDate) {
        if (errPDate) errPDate.classList.add('visible');
        if (pickupDateInput) pickupDateInput.classList.add('error');
        isValid = false;
      } else {
        if (errPDate) errPDate.classList.remove('visible');
        if (pickupDateInput) pickupDateInput.classList.remove('error');
      }

      if (!pTime) {
        if (errPTime) errPTime.classList.add('visible');
        if (pickupTimeInput) pickupTimeInput.classList.add('error');
        isValid = false;
      } else {
        if (errPTime) errPTime.classList.remove('visible');
        if (pickupTimeInput) pickupTimeInput.classList.remove('error');
      }

      // Return validation
      if (bookingState.journeyType === 'return') {
        const rDate = returnDateInput?.value || '';
        const rTime = returnTimeInput?.value || '';
        const errRDate = document.getElementById('errReturnDate');
        const errRTime = document.getElementById('errReturnTime');

        if (!rDate) {
          if (errRDate) errRDate.classList.add('visible');
          if (returnDateInput) returnDateInput.classList.add('error');
          isValid = false;
        } else {
          if (errRDate) errRDate.classList.remove('visible');
          if (returnDateInput) returnDateInput.classList.remove('error');
        }

        if (!rTime) {
          if (errRTime) errRTime.classList.add('visible');
          if (returnTimeInput) returnTimeInput.classList.add('error');
          isValid = false;
        } else {
          if (errRTime) errRTime.classList.remove('visible');
          if (returnTimeInput) returnTimeInput.classList.remove('error');
        }
      }

      if (isValid) {
        bookingState.pickup = pickup;
        bookingState.destination = dest;
        bookingState.pickupDate = pDate;
        bookingState.pickupTime = pTime;
        if (bookingState.journeyType === 'return') {
          bookingState.returnDate = returnDateInput?.value || '';
          bookingState.returnTime = returnTimeInput?.value || '';
        }
        if (bookingState.journeyType === 'hourly') {
          bookingState.hourlyDuration = hourlySelect?.value || '4';
        }
        saveStateToStorage();
      }

      return isValid;
    };

    document.getElementById('step1NextBtn')?.addEventListener('click', () => {
      if (validateStep1()) {
        updateStepperUI(2);
      }
    });

    // ------------------------------------------------------------------------
    // STEP 2: VEHICLE SELECTION WIRING
    // ------------------------------------------------------------------------
    const vehicleGrid = document.getElementById('vehicleSelectionGrid');

    const renderVehicleCards = () => {
      if (!vehicleGrid) return;
      vehicleGrid.innerHTML = vehicleFleet.map(veh => {
        const isSelected = veh.id === bookingState.selectedVehicleId;
        return `
          <div class="vehicle-card ${isSelected ? 'selected' : ''}" data-vehicle-id="${veh.id}">
            <div class="vehicle-card-media">
              <img src="${veh.image}" alt="${veh.title}" class="vehicle-card-img" loading="lazy" />
              <div class="vehicle-card-scrim"></div>
            </div>
            <div class="vehicle-card-body">
              <div>
                <span class="vehicle-card-tier">${veh.category}</span>
                <h3 class="vehicle-card-title">${veh.title}</h3>
                <p class="vehicle-card-desc">${veh.desc}</p>
                <div class="vehicle-spec-strip">
                  <div class="vehicle-spec-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                      <circle cx="9" cy="7" r="4"></circle>
                    </svg>
                    <span>${veh.passengers}</span>
                  </div>
                  <div class="vehicle-spec-item">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    <span>${veh.luggage}</span>
                  </div>
                </div>
              </div>
              <button type="button" class="vehicle-select-btn">
                ${isSelected ? 'Vehicle Selected ✓' : 'Select Vehicle'}
              </button>
            </div>
          </div>
        `;
      }).join('');

      // Add click handlers on vehicle cards
      vehicleGrid.querySelectorAll('.vehicle-card').forEach(card => {
        card.addEventListener('click', () => {
          const vId = card.getAttribute('data-vehicle-id');
          bookingState.selectedVehicleId = vId;
          saveStateToStorage();
          renderVehicleCards();
        });
      });
    };
    renderVehicleCards();

    document.getElementById('step2BackBtn')?.addEventListener('click', () => updateStepperUI(1));
    document.getElementById('step2NextBtn')?.addEventListener('click', () => updateStepperUI(3));

    // ------------------------------------------------------------------------
    // STEP 3: PASSENGER DETAILS WIRING
    // ------------------------------------------------------------------------
    const firstNameInput = document.getElementById('passengerFirstName');
    const lastNameInput = document.getElementById('passengerLastName');
    const emailInput = document.getElementById('passengerEmail');
    const phoneInput = document.getElementById('passengerPhone');
    const companyInput = document.getElementById('passengerCompany');
    const flightInput = document.getElementById('passengerFlight');
    const notesInput = document.getElementById('passengerNotes');
    const privacyCheckbox = document.getElementById('privacyCheckbox');

    // Populate existing values
    if (firstNameInput && bookingState.firstName) firstNameInput.value = bookingState.firstName;
    if (lastNameInput && bookingState.lastName) lastNameInput.value = bookingState.lastName;
    if (emailInput && bookingState.email) emailInput.value = bookingState.email;
    if (phoneInput && bookingState.phone) phoneInput.value = bookingState.phone;
    if (companyInput && bookingState.company) companyInput.value = bookingState.company;
    if (flightInput && bookingState.flightNumber) flightInput.value = bookingState.flightNumber;
    if (notesInput && bookingState.specialRequirements) notesInput.value = bookingState.specialRequirements;
    if (privacyCheckbox && bookingState.privacyAccepted) privacyCheckbox.checked = true;

    const validateStep3 = () => {
      let isValid = true;
      const fName = firstNameInput?.value.trim() || '';
      const lName = lastNameInput?.value.trim() || '';
      const email = emailInput?.value.trim() || '';
      const phone = phoneInput?.value.trim() || '';
      const privacy = privacyCheckbox?.checked || false;

      const errFName = document.getElementById('errFirstName');
      const errLName = document.getElementById('errLastName');
      const errEmail = document.getElementById('errEmail');
      const errPhone = document.getElementById('errPhone');
      const errPrivacy = document.getElementById('errPrivacy');

      if (!fName) {
        if (errFName) errFName.classList.add('visible');
        if (firstNameInput) firstNameInput.classList.add('error');
        isValid = false;
      } else {
        if (errFName) errFName.classList.remove('visible');
        if (firstNameInput) firstNameInput.classList.remove('error');
      }

      if (!lName) {
        if (errLName) errLName.classList.add('visible');
        if (lastNameInput) lastNameInput.classList.add('error');
        isValid = false;
      } else {
        if (errLName) errLName.classList.remove('visible');
        if (lastNameInput) lastNameInput.classList.remove('error');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        if (errEmail) errEmail.classList.add('visible');
        if (emailInput) emailInput.classList.add('error');
        isValid = false;
      } else {
        if (errEmail) errEmail.classList.remove('visible');
        if (emailInput) emailInput.classList.remove('error');
      }

      if (!phone || phone.length < 7) {
        if (errPhone) errPhone.classList.add('visible');
        if (phoneInput) phoneInput.classList.add('error');
        isValid = false;
      } else {
        if (errPhone) errPhone.classList.remove('visible');
        if (phoneInput) phoneInput.classList.remove('error');
      }

      if (!privacy) {
        if (errPrivacy) errPrivacy.classList.add('visible');
        isValid = false;
      } else {
        if (errPrivacy) errPrivacy.classList.remove('visible');
      }

      if (isValid) {
        bookingState.firstName = fName;
        bookingState.lastName = lName;
        bookingState.email = email;
        bookingState.phone = phone;
        bookingState.company = companyInput?.value.trim() || '';
        bookingState.flightNumber = flightInput?.value.trim() || '';
        bookingState.specialRequirements = notesInput?.value.trim() || '';
        bookingState.privacyAccepted = privacy;
        saveStateToStorage();
      }

      return isValid;
    };

    document.getElementById('step3BackBtn')?.addEventListener('click', () => updateStepperUI(2));
    document.getElementById('step3NextBtn')?.addEventListener('click', () => {
      if (validateStep3()) {
        renderReviewSummary();
        updateStepperUI(4);
      }
    });

    // ------------------------------------------------------------------------
    // STEP 4: REVIEW & CONFIRMATION WIRING
    // ------------------------------------------------------------------------
    const renderReviewSummary = () => {
      const selectedVehicle = vehicleFleet.find(v => v.id === bookingState.selectedVehicleId) || vehicleFleet[1];

      // Journey type labels
      const typeLabels = {
        'one-way': 'One Way Transfer',
        'return': 'Return Journey',
        'hourly': `Hourly Chauffeur (${bookingState.hourlyDuration} Hours)`,
        'full-day': 'Full Day Chauffeur Hire'
      };

      // Review Fields
      document.getElementById('revJourneyType') && (document.getElementById('revJourneyType').textContent = typeLabels[bookingState.journeyType] || 'One Way');
      document.getElementById('revPickup') && (document.getElementById('revPickup').textContent = bookingState.pickup);
      document.getElementById('revDestination') && (document.getElementById('revDestination').textContent = bookingState.destination);
      document.getElementById('revDate') && (document.getElementById('revDate').textContent = `${bookingState.pickupDate} at ${bookingState.pickupTime}`);

      // Return details if applicable
      const revReturnItem = document.getElementById('revReturnItem');
      if (revReturnItem) {
        if (bookingState.journeyType === 'return' && bookingState.returnDate) {
          revReturnItem.style.display = 'flex';
          document.getElementById('revReturnDate').textContent = `${bookingState.returnDate} at ${bookingState.returnTime}`;
        } else {
          revReturnItem.style.display = 'none';
        }
      }

      document.getElementById('revPassengers') && (document.getElementById('revPassengers').textContent = `${bookingState.passengers} Passengers · ${bookingState.suitcases} Suitcases`);
      
      // Passenger Details
      document.getElementById('revPassengerName') && (document.getElementById('revPassengerName').textContent = `${bookingState.firstName} ${bookingState.lastName}`);
      document.getElementById('revEmail') && (document.getElementById('revEmail').textContent = bookingState.email);
      document.getElementById('revPhone') && (document.getElementById('revPhone').textContent = bookingState.phone);
      document.getElementById('revCompany') && (document.getElementById('revCompany').textContent = bookingState.company || 'Private Client');
      document.getElementById('revFlight') && (document.getElementById('revFlight').textContent = bookingState.flightNumber || 'None specified');
      document.getElementById('revNotes') && (document.getElementById('revNotes').textContent = bookingState.specialRequirements || 'Standard VIP requirements');

      // Vehicle Details
      document.getElementById('revVehicleName') && (document.getElementById('revVehicleName').textContent = selectedVehicle.title);
      document.getElementById('revVehicleCategory') && (document.getElementById('revVehicleCategory').textContent = selectedVehicle.category);
      document.getElementById('revVehicleImg') && (document.getElementById('revVehicleImg').src = selectedVehicle.image);
    };

    // Edit Buttons in Review
    document.getElementById('editJourneyBtn')?.addEventListener('click', () => updateStepperUI(1));
    document.getElementById('editVehicleBtn')?.addEventListener('click', () => updateStepperUI(2));
    document.getElementById('editPassengerBtn')?.addEventListener('click', () => updateStepperUI(3));
    document.getElementById('step4BackBtn')?.addEventListener('click', () => updateStepperUI(3));

    // Submit Booking Enquiry Handler
    document.getElementById('submitBookingEnquiryBtn')?.addEventListener('click', () => {
      const submitBtn = document.getElementById('submitBookingEnquiryBtn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span>Securing Reservation Enquiry...</span>`;
      }

      // Generate Authentic Reference Code
      const generatedRef = 'ECB-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);
      bookingState.referenceCode = generatedRef;
      saveStateToStorage();

      // Clean backend integration payload point
      const bookingPayload = {
        reference: generatedRef,
        timestamp: new Date().toISOString(),
        client: {
          firstName: bookingState.firstName,
          lastName: bookingState.lastName,
          email: bookingState.email,
          phone: bookingState.phone,
          company: bookingState.company
        },
        journey: {
          type: bookingState.journeyType,
          pickup: bookingState.pickup,
          destination: bookingState.destination,
          date: bookingState.pickupDate,
          time: bookingState.pickupTime,
          returnDate: bookingState.returnDate,
          returnTime: bookingState.returnTime,
          passengers: bookingState.passengers,
          suitcases: bookingState.suitcases,
          vehicle: bookingState.selectedVehicleId,
          flightNumber: bookingState.flightNumber,
          specialRequirements: bookingState.specialRequirements
        }
      };

      console.info('Emerald Chauffeurs Booking Payload Ready for Dispatch:', bookingPayload);

      // Transition to Success Step
      setTimeout(() => {
        const refDisplay = document.getElementById('successRefCode');
        const summaryDisplay = document.getElementById('successSummaryDesc');

        if (refDisplay) refDisplay.textContent = generatedRef;
        if (summaryDisplay) {
          summaryDisplay.textContent = `A priority reservation dispatch has been logged for ${bookingState.firstName} ${bookingState.lastName} (${bookingState.pickup} → ${bookingState.destination}) on ${bookingState.pickupDate} at ${bookingState.pickupTime}. Our concierge desk will contact you via phone and email to confirm final vehicle allocation.`;
        }

        // Hide stepper header & show success
        const stepperHeader = document.querySelector('.stepper-progress-bar');
        if (stepperHeader) stepperHeader.style.display = 'none';

        stepContents.forEach(c => c.classList.remove('active'));
        const step5 = document.querySelector('[data-step="5"]');
        if (step5) step5.classList.add('active');

        // Clear session storage now that booking is submitted
        sessionStorage.removeItem('emerald_booking_state');
      }, 700);
    });

    // Book another journey button
    document.getElementById('bookAnotherBtn')?.addEventListener('click', () => {
      window.location.reload();
    });
  }
});
