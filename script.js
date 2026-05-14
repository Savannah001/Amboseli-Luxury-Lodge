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