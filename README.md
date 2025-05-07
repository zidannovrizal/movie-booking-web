# Movie Booking Web Application

A modern and responsive movie booking web application built with Vue 3, Vuetify, and TypeScript.

## Creator

**Zidan Novrizal**

## Features

- 🎬 Browse latest movies with real-time TMDB integration
- 🎫 Interactive seat selection system
- 🏟️ Multiple theater support with dynamic pricing
- 📅 Advanced date and time selection
- 💳 Secure booking management
- 🎨 Modern and responsive UI with Vuetify 3
- 🌙 Dark/Light theme support
- 📱 Mobile-friendly design

## Tech Stack

- Vue 3 with Composition API
- TypeScript for type safety
- Vuetify 3 for UI components
- Vite for fast development
- Vue Router for navigation
- Pinia for state management
- Moment.js for date handling
- QR Code generation for tickets

## Project Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Variables

Create a `.env` file in the root directory with:

```env
VITE_API_URL=your_backend_url
VITE_TMDB_API_KEY=your_tmdb_api_key
```

## Project Structure

```
movie-booking-web/
├── src/
│   ├── api/          # API integration
│   ├── assets/       # Static assets
│   ├── components/   # Reusable components
│   ├── composables/  # Vue composables
│   ├── layouts/      # Layout components
│   ├── pages/        # Page components
│   ├── router/       # Route definitions
│   ├── store/        # Pinia stores
│   └── types/        # TypeScript types
├── public/           # Public assets
└── ...config files
```

## Key Features Implementation

### Movie Details

- Dynamic movie information fetching
- Responsive hero section with parallax effect
- Interactive theater selection

### Booking System

- Real-time seat availability checking
- Dynamic pricing calculation
- Date and time slot selection
- QR code generation for tickets

### User Management

- Authentication system
- Booking history
- Ticket management

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
