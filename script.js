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