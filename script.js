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