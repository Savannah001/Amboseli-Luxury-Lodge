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