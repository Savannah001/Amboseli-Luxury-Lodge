// configuring local storage
var STORAGE_KEY = 'amboseli_bookings';
// getting unique id for each booking
function generateId() {
  return 'bk_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 8);
}
// Format a date string
function formatDate(dateStr) {
  var options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', options);
}
// Calculating number of nights between two dates
function calculateNights(checkIn, checkOut) {
  var start = new Date(checkIn);
  var end = new Date(checkOut);
  var diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}
// Check if email is valid
function isValidEmail(email) {
  var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Check if phone number is valid
function isValidPhone(phone) {
  var regex = /^[\+]?[\d\s\-\(\)]{7,20}$/;
  return regex.test(phone);
}
// Get today's date as YYYY-MM-DD
function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

//Local storage functions

// Get all bookings from localStorage
function getBookings() {
  var data = localStorage.getItem(STORAGE_KEY);
  if (data) { return JSON.parse(data); }
  return [];
}
// Save a new booking
function saveBooking(booking) {
  var bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  return true;
}
// Delete a booking by ID
function deleteBooking(id) {
  var bookings = getBookings();
  var filtered = [];
  for (var i = 0; i < bookings.length; i++) {
    if (bookings[i].id !== id) { filtered.push(bookings[i]); }
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}
// Notification
function showToast(message, type) {
  var existing = document.querySelector('.toast');
  if (existing) { existing.remove(); }
  var toast = document.createElement('div');
  toast.className = 'toast ' + (type || 'success');
  toast.innerHTML = '<span>' + message + '</span>';
  document.body.appendChild(toast);
  setTimeout(function() { toast.classList.add('show'); }, 10);
  setTimeout(function() {
    toast.classList.remove('show');
    setTimeout(function() { toast.remove(); }, 400);
  }, 4000);
}
// Navigation
function initNavigation() {
  var navbar = document.querySelector('.navbar');
  var menuBtn = document.getElementById('mobile-menu-btn');
  var closeBtn = document.getElementById('mobile-close-btn');
  var mobileMenu = document.getElementById('mobile-menu');
  var mobileOverlay = document.getElementById('mobile-overlay');
  // Navbar background on scroll
  if (navbar) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  }
    // Open mobile menu
  function openMobileMenu() {
    if (mobileMenu) mobileMenu.classList.add('open');
    if (mobileOverlay) mobileOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  // Close mobile menu
  function closeMobileMenu() {
    if (mobileMenu) mobileMenu.classList.remove('open');
    if (mobileOverlay) mobileOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }
  if (menuBtn) menuBtn.addEventListener('click', openMobileMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);
  // Close menu on link click
  var mobileLinks = document.querySelectorAll('.mobile-link');
  for (var i = 0; i < mobileLinks.length; i++) {
    mobileLinks[i].addEventListener('click', closeMobileMenu);
  }
  // Highlight active page link
  setActiveNavLink();
}
// Set active class on current page nav link
function setActiveNavLink() {
  var path = window.location.pathname;
  var filename = path.split('/').pop() || 'index.html';
  var pageMap = {
    'index.html': 'home',
    'about.html': 'about',
    'experiences.html': 'experiences',
    'book.html': 'book',
    'reservations.html': 'reservations'
  };
  var activePage = pageMap[filename];
  var navLinks = document.querySelectorAll('.nav-link');
  for (var i = 0; i < navLinks.length; i++) {
    if (navLinks[i].dataset.page === activePage) {
      navLinks[i].classList.add('active');
    }
  }
  var mobileLinks = document.querySelectorAll('.mobile-link');
  for (var j = 0; j < mobileLinks.length; j++) {
    if (mobileLinks[j].dataset.page === activePage) {
      mobileLinks[j].classList.add('active');
    }
  }
}

//booking functionality
function initBookPage() {
  var form = document.getElementById('booking-form');
  if (!form) return;
  // Set min date to today
  var today = getTodayString();
  var checkInInput = document.getElementById('checkIn');
  var checkOutInput = document.getElementById('checkOut');
  if (checkInInput) checkInInput.setAttribute('min', today);
  if (checkOutInput) checkOutInput.setAttribute('min', today);
  // Update checkout min when checkin changes
  if (checkInInput) {
    checkInInput.addEventListener('change', function() {
      if (checkInInput.value) {
        checkOutInput.setAttribute('min', checkInInput.value);
        if (checkOutInput.value && checkOutInput.value <= checkInInput.value) {
          checkOutInput.value = '';
        }
      }
    });
  }
    // Form validation
  var inputs = form.querySelectorAll('.form-input, .form-select, .form-textarea');
  for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('blur', function() { validateField(this); });
    inputs[i].addEventListener('input', function() {
      if (this.classList.contains('error')) { clearFieldError(this); }
    });
  }
  // Form submission
  form.addEventListener('submit', handleFormSubmit);
}
// Validating one field
function validateField(field) {
  var name = field.name;
  var value = field.value.trim();
  var errorMsg = '';
  if (name === 'firstName') {
    if (!value) errorMsg = 'First name is required';
    else if (value.length < 2) errorMsg = 'First name must be at least 2 characters';
  } else if (name === 'lastName') {
    if (!value) errorMsg = 'Last name is required';
    else if (value.length < 2) errorMsg = 'Last name must be at least 2 characters';
  } else if (name === 'email') {
    if (!value) errorMsg = 'Email address is required';
    else if (!isValidEmail(value)) errorMsg = 'Please enter a valid email';
  } else if (name === 'phone') {
    if (!value) errorMsg = 'Phone number is required';
    else if (!isValidPhone(value)) errorMsg = 'Please enter a valid phone number';
  } else if (name === 'checkIn') {
    if (!value) errorMsg = 'Check-in date is required';
    else if (value < getTodayString()) errorMsg = 'Date cannot be in the past';
  } else if (name === 'checkOut') {
    if (!value) errorMsg = 'Check-out date is required';
    else {
      var checkIn = document.getElementById('checkIn').value;
      if (checkIn && value <= checkIn) errorMsg = 'Must be after check-in date';
      else if (value < getTodayString()) errorMsg = 'Date cannot be in the past';
    }
  } else if (name === 'guests') {
    if (!value) errorMsg = 'Number of guests is required';
    else if (parseInt(value) < 1 || parseInt(value) > 10) errorMsg = 'Must be between 1 and 10';
  } else if (name === 'package') {
    if (!value) errorMsg = 'Please select a package';
  }
  if (errorMsg) { showFieldError(field, errorMsg); return false; }
  else { clearFieldError(field); field.classList.add('valid'); return true; }
}
// error message
function showFieldError(field, message) {
  field.classList.add('error');
  field.classList.remove('valid');
  var errorEl = document.getElementById(field.name + '-error');
  if (errorEl) { errorEl.textContent = message; errorEl.classList.add('visible'); }
}
// Clear error message
function clearFieldError(field) {
  field.classList.remove('error');
  var errorEl = document.getElementById(field.name + '-error');
  if (errorEl) { errorEl.textContent = ''; errorEl.classList.remove('visible'); }
}
// Handle form submission
function handleFormSubmit(e) {
  e.preventDefault();
  var form = e.target;
  var fields = form.querySelectorAll('.form-input, .form-select, .form-textarea');
  var isValid = true;

  // Validate all fields
  for (var i = 0; i < fields.length; i++) {
    if (!validateField(fields[i])) { isValid = false; }
  }
  if (!isValid) {
    var firstError = form.querySelector('.form-input.error, .form-select.error');
    if (firstError) { firstError.scrollIntoView({ behavior: 'smooth', block: 'center' }); firstError.focus(); }
    return;
  }
  //booking object
  var booking = {
    id: generateId(),
    firstName: document.getElementById('firstName').value.trim(),
    lastName: document.getElementById('lastName').value.trim(),
    email: document.getElementById('email').value.trim(),
    phone: document.getElementById('phone').value.trim(),
    checkIn: document.getElementById('checkIn').value,
    checkOut: document.getElementById('checkOut').value,
    guests: parseInt(document.getElementById('guests').value),
    package: document.getElementById('package').value,
    specialRequests: document.getElementById('specialRequests').value.trim(),
    createdAt: new Date().toISOString()
  };
  saveBooking(booking);
  showBookingSuccess(booking);
  form.reset();
  for (var j = 0; j < fields.length; j++) {
    fields[j].classList.remove('valid', 'error');
    clearFieldError(fields[j]);
  }
  showToast('Reservation confirmed successfully!', 'success');
}
// Show success message
function showBookingSuccess(booking) {
  var formContainer = document.getElementById('form-container');
  var successContainer = document.getElementById('success-container');
  if (!formContainer || !successContainer) return;
  var nights = calculateNights(booking.checkIn, booking.checkOut);
  var nightsText = nights + ' night' + (nights !== 1 ? 's' : '');
  var html = '<div class="success-message">';
  html = html + '<div class="success-icon">&#10003;</div>';
html = html + '<h2 style="color:#1a3c34;margin-bottom:0.5rem;">Reservation Confirmed!</h2>';
html = html + '<p style="color:#6b5b4f;margin-bottom:1.5rem;">Thank you, ' + booking.firstName + '! Your safari adventure awaits.</p>';
html = html + '<div style="background:#faf6f0;border-radius:8px;padding:1.5rem;text-align:left;margin-bottom:1.5rem;">';
html = html + '<p><strong>Guest:</strong> ' + booking.firstName + ' ' + booking.lastName + '</p>';
html = html + '<p><strong>Package:</strong> ' + booking.package + '</p>';
html = html + '<p><strong>Check-in:</strong> ' + formatDate(booking.checkIn) + '</p>';
html = html + '<p><strong>Check-out:</strong> ' + formatDate(booking.checkOut) + '</p>';
html = html + '<p><strong>Duration:</strong> ' + nightsText + '</p>';
html = html + '<p><strong>Guests:</strong> ' + booking.guests + '</p>';
  if (booking.specialRequests) {
    html = html + '<p><strong>Special Requests:</strong> ' + booking.specialRequests + '</p>';
  }
  html = html + '</div>';
  html = html + '<a href="reservations.html" class="btn-primary">View Reservations</a> ';
  html = html + '<button onclick="resetBookingForm()" class="btn-outline">Book Another</button>';
  html = html + '</div>';
  successContainer.innerHTML = html;
  formContainer.style.display = 'none';
  successContainer.style.display = 'block';
}
// Reset form visibility
function resetBookingForm() {
  var formContainer = document.getElementById('form-container');
  var successContainer = document.getElementById('success-container');
  if (formContainer) formContainer.style.display = '';
  if (successContainer) successContainer.style.display = 'none';
}
// reservation page
function initReservationsPage() { renderReservations(); }
// Show all bookings
function renderReservations() {
  var container = document.getElementById('reservations-list');
  if (!container) return;
  var bookings = getBookings();
  if (bookings.length === 0) {
    container.innerHTML = '<div class="empty-state">' +
      '<h3>No Reservations Yet</h3>' +
      '<p>Start planning your African safari adventure by making your first reservation.</p>' +
      '<a href="book.html" class="btn-primary">Make a Reservation</a></div>';
    return;
  }
    // Sort from newest
  bookings.sort(function(a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
  var html = '';
  for (var i = 0; i < bookings.length; i++) {
    var b = bookings[i];
    var nights = calculateNights(b.checkIn, b.checkOut);
    var nightsText = nights + ' night' + (nights !== 1 ? 's' : '');
    var guestsText = b.guests + ' guest' + (b.guests !== 1 ? 's' : '');
    html = html + '<div class="reservation-card">';
    html = html + '<div class="reservation-header">';
    html = html + '<div class="reservation-name">' + b.firstName + ' ' + b.lastName + '</div>';
    html = html + '<div class="reservation-package">' + b.package + '</div>';
    html = html + '</div>';
    html = html + '<div class="reservation-body">';
    html = html + '<div class="reservation-detail"><strong>Dates:</strong> ' + formatDate(b.checkIn) + ' — ' + formatDate(b.checkOut) + ' (' + nightsText + ')</div>';
    html = html + '<div class="reservation-detail"><strong>Guests:</strong> ' + guestsText + '</div>';
    html = html + '<div class="reservation-detail"><strong>Email:</strong> ' + b.email + '</div>';
    html = html + '<div class="reservation-detail"><strong>Phone:</strong> ' + b.phone + '</div>';
    if (b.specialRequests) {
      html = html + '<div class="reservation-detail"><strong>Requests:</strong> ' + b.specialRequests + '</div>';
    }
    html = html + '</div>';
    html = html + '<div class="reservation-actions">';
    html = html + '<button class="btn-danger" onclick="confirmDelete(\'' + b.id + '\')">Cancel Booking</button>';
    html = html + '</div>';
    html = html + '</div>';
  }
  container.innerHTML = html;
}