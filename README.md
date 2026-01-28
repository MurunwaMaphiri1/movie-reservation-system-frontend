# Movie Reservation System - Frontend

A modern, user-friendly movie reservation system frontend built with JavaScript. This application allows users to browse movies, view details, select showtimes, choose seats, and complete payments seamlessly.

## Overview

The Movie Reservation System frontend provides an intuitive interface for moviegoers to book tickets at MagicBox Theatres. The application integrates with a .NET Core Web API backend that handles JWT authentication, Entity Framework Core, and PostgreSQL for secure data storage.

## Tech Stack

- **JavaScript** - Core application logic
- **HTML/CSS** - Structure and styling
- **Integration with Backend API** - .NET Core Web API with JWT authentication

## Features

- **Movie Browsing** - Browse available movies with search functionality
- **Movie Details** - View comprehensive movie information including synopsis, cast, director, and trailer
- **Showtime Selection** - Choose from available dates and times
- **Interactive Seat Selection** - Visual seat map with real-time availability
- **Secure Payment Processing** - Integrated Stripe payment gateway
- **User Authentication** - Secure login and registration system

## Screenshots

### Home Page
Browse through available movies with an elegant card-based layout featuring search functionality.

![Home Page](public/images/Movie%20Reservation%20System%20Screenshots/HomePage.png)

### Movie Details - Overview
View detailed information about the movie including poster, title, genres, and synopsis.

![Movie Details 1](public/images/Movie%20Reservation%20System%20Screenshots/MovieDetails1.png)

### Movie Details - Additional Info
See complete movie information including director, release date, duration, cast, and embedded trailer.

![Movie Details 2](public/images/Movie%20Reservation%20System%20Screenshots/MovieDetails2.png)

### Movie Details - Showtime Selection
Select your preferred date and showtime with ticket pricing information.

![Movie Details 3](public/images/Movie%20Reservation%20System%20Screenshots/MovieDetails3.png)

### Seat Selection - Overview
Interactive seat selection interface showing the cinema screen and seat layout.

![Seat Reservation 1](public/images/Movie%20Reservation%20System%20Screenshots/SeatReservation1.png)

### Seat Selection - Booking
Choose your seats with visual indicators for available, selected, and occupied seats. Real-time price calculation based on selection.

![Seat Reservation 2](public/images/Movie%20Reservation%20System%20Screenshots/SeatReservation2.png)

### Payment Page
Secure payment processing through Stripe integration with support for various payment methods.

![Stripe Payment](public/images/Movie%20Reservation%20System%20Screenshots/StripePaymentPage.png)

### Reservation Confirmation Email
Email received upon payment completion

![Confirmation Email](public/images/Movie%20Reservation%20System%20Screenshots/ConfirmationEmail.png)

## Getting Started

### Prerequisites

- A modern web browser
- Backend API running (see backend repository for setup instructions)

### Installation

1. Clone the repository
```bash
git clone https://github.com/MurunwaMaphiri1/movie-reservation-frontend.git
cd movie-reservation-frontend
```

2. Configure API endpoint
Update the API base URL in your configuration file to point to your backend server.

3. Open the application

```bash
npm run dev
```

4. Navigate to `http://localhost:5173` in your browser
