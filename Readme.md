# Amboseli Luxury Lodge - Safari Booking Website

A multi-page web application for a luxury safari lodge at the foot of Mount Kilimanjaro, Kenya. Users can browse safari experiences, learn about the lodge, and make reservations that persist in their browser's localStorage.

## Project Purpose

This project provides a complete booking interface for a luxury safari lodge. It demonstrates a full web application with data persistence, form validation, and dynamic content — all without any frameworks or libraries.

## Technologies Used

- **HTML5** — Semantic markup with `<header>`, `<nav>`, `<main>`, `<section>`, `<footer>`, `<aside>`
- **CSS3** — Custom properties, Flexbox, CSS Grid, media queries for responsive design
- **JavaScript** — DOM manipulation, event handling, form validation, localStorage

## Features

- **5 Interconnected Pages:** Home, About, Experiences, Book Now, Reservations
- **Responsive Design:** Mobile, tablet, and desktop layouts
- **Form Validation:** with real-time error messages
- **localStorage Persistence:** Bookings are saved and retrieved from browser storage
- **Dynamic Content:** Stats, booking counts, and reservation lists update automatically
- **Single Data Source:** The Book page adds data; all other pages read from localStorage

## File Structure
├── index.html # Home page with hero, stats, experiences, testimonials
├── about.html # About page with story, values, team, conservation impact
├── book.html # Booking form (ADD data page) with validation
├── experiences.html # Safari packages with filtering by category
├── reservations.html # View and manage bookings (READ/DELETE from localStorage)
├── style.css # External stylesheet for shared components
├── script.js # All JavaScript functionality
└── README.md # Project documentation

## How to Use

1. Open `index.html` in any modern web browser
2. Navigate to **Book Now** to make a reservation
3. Fill in the form — validation will guide you if there are errors
4. After booking, view your reservations on the **Reservations** page
5. Bookings persist in localStorage and survive page refreshes
6. The **Experiences** page shows how many times each package has been booked

## Known Issues / Limitations

- Data is stored only in the browser's localStorage — clearing browser data will remove all bookings
- No backend storage — bookings are not shared between devices
- Form validation is client-side only

## Browser Compatibility

Tested on modern versions of:
- Google Chrome
- Mozilla Firefox
- Microsoft Edge