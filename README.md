# Saunie's Tours - Bus Trip Management System

A comprehensive React application for managing bus tours, patrons, and seat bookings.

## Features

### 🏠 Dashboard
- **Overview Statistics**: Total trips, patrons, bookings, and revenue
- **Upcoming Trips**: Quick view of scheduled trips with booking percentages
- **Recent Patrons**: Latest registered patrons
- **Quick Stats**: Detailed statistics from the API dashboard endpoint

### 📍 Trips Management
- **Create New Trips**: Add trips with destination, date, time, capacity, and pricing
- **Edit Existing Trips**: Modify trip details (except capacity if bookings exist)
- **Delete Trips**: Remove trips from the system
- **Search & Filter**: Find trips by destination or departure location
- **Pagination**: Navigate through large lists of trips
- **Real-time Updates**: Automatic refresh after operations

### 👥 Patrons Management
- **Add New Patrons**: Register patrons with contact information
- **Edit Patron Details**: Update patron information
- **Delete Patrons**: Soft delete patrons (sets isActive to false)
- **Emergency Contacts**: Store emergency contact information
- **Search Functionality**: Find patrons by name, phone, or address
- **Pagination**: Handle large patron lists efficiently

### 💺 Seat Management
- **Interactive Seat Map**: Visual representation of bus seating
- **Book Seats**: Assign patrons to specific seats
- **Cancel Bookings**: Remove seat assignments
- **Real-time Updates**: Live seat map updates
- **Booking Summary**: Revenue and occupancy statistics
- **Patron Selection**: Dropdown to select from registered patrons

## API Integration

The application integrates with the following API endpoints:

### Trips API
- `GET /api/trips` - List all trips with pagination and search
- `POST /api/trips` - Create new trip
- `PUT /api/trips/:id` - Update existing trip
- `DELETE /api/trips/:id` - Delete trip
- `GET /api/trips/:id/seats` - Get seat map for specific trip
- `POST /api/trips/:id/book` - Book a seat
- `DELETE /api/trips/:id/book/:seatNumber` - Cancel booking
- `GET /api/trips/dashboard/stats` - Get dashboard statistics

### Patrons API
- `GET /api/patrons` - List all patrons with pagination and search
- `POST /api/patrons` - Create new patron
- `PUT /api/patrons/:id` - Update existing patron
- `DELETE /api/patrons/:id` - Soft delete patron

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend API server running on `http://localhost:5001`

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) to view the application

## Project Structure

```
src/
├── components/
│   ├── Dashboard.js          # Dashboard with statistics and overview
│   ├── TripsManagement.js    # Complete trips CRUD operations
│   ├── PatronsManagement.js  # Complete patrons CRUD operations
│   └── SeatManagement.js     # Interactive seat booking system
├── App.js                    # Main application component
└── index.js                  # Application entry point
```

## Key Features

### Modern UI/UX
- Clean, responsive design
- Intuitive navigation with tabbed interface
- Real-time feedback and loading states
- Error handling with user-friendly messages
- Consistent styling throughout the application

### Data Management
- Optimistic updates for better user experience
- Proper error handling and validation
- Pagination for large datasets
- Search and filtering capabilities
- Real-time data synchronization

### Seat Booking System
- Visual seat map representation
- Interactive seat selection
- Booking confirmation workflow
- Cancellation with confirmation
- Real-time availability updates

## API Configuration

The application is configured to connect to the backend API at `http://localhost:5001/api`. Make sure your backend server is running and accessible at this URL.

## Development

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

### Code Style

The application follows React best practices:
- Functional components with hooks
- Proper state management
- Component composition
- Consistent naming conventions
- Inline styles for simplicity (can be migrated to CSS modules or styled-components)

## Future Enhancements

- Authentication and user management
- Advanced reporting and analytics
- Email notifications
- Mobile-responsive design improvements
- Offline functionality
- Advanced search and filtering
- Bulk operations
- Export functionality

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
