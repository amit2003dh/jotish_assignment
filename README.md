# Jotish Assignment - Employee Management System

A ReactJS application with employee data management, photo capture, and data visualization features.

## Features

### Core Functionality
- **Login System**: Secure authentication with username/password
- **Employee List**: Display employee data from REST API
- **Employee Details**: View detailed information with photo capture
- **Photo Management**: Capture and download employee photos
- **Data Visualization**: Interactive charts and maps

### Creative Features
- **Bar Chart Visualization**: Salary distribution for first 10 employees
- **Interactive Map**: Geographic distribution of employees across cities
- **Modern UI**: Responsive design with gradient themes and animations
- **Photo Capture**: WebRTC-based camera integration

## Project Structure

```
jotish-assignment/
├── src/
│   ├── components/
│   │   ├── Login.tsx          # Login page with authentication
│   │   ├── List.tsx           # Employee list with API integration
│   │   ├── Details.tsx        # Employee details with photo capture
│   │   ├── PhotoResult.tsx    # Photo display and download
│   │   ├── BarChart.tsx       # Salary visualization
│   │   └── MapView.tsx        # Geographic employee distribution
│   ├── App.tsx                # Main application with routing
│   └── App.css                # Global styles
├── public/
│   └── index.html             # HTML template with Leaflet CSS
└── package.json              # Dependencies and scripts
```

## Technology Stack

- **React 18** with TypeScript
- **React Router** for navigation
- **Axios** for API calls
- **Chart.js** with react-chartjs-2 for data visualization
- **Leaflet** with react-leaflet for maps
- **CSS3** with modern gradients and animations

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd jotish-assignment
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Login
- **Username**: `testuser`
- **Password**: `Test123`

### Navigation Flow
1. Login → Employee List
2. Click any employee → Employee Details
3. Capture photo → Photo Result
4. Access visualizations from the list page

### API Integration
The application fetches data from:
```
POST https://backend.jotish.in/backend_dev/gettabledata.php
```
With payload:
```json
{
   "username":"test",
   "password":"123456"
}
```

## Pages Description

### 1. Login Page
- Clean gradient design
- Form validation
- Error handling for invalid credentials
- Responsive layout

### 2. Employee List Page
- Tabular display of employee data
- Click-to-view details functionality
- Navigation to visualizations
- Logout functionality
- Loading states and error handling

### 3. Employee Details Page
- Comprehensive employee information display
- WebRTC camera integration
- Real-time photo capture
- Modern card-based layout

### 4. Photo Result Page
- Captured photo display
- Download functionality
- Capture metadata
- Retake photo option

### 5. Bar Chart Visualization
- Interactive salary chart
- Statistical summaries
- Animated chart rendering
- Responsive design

### 6. Map Visualization
- Geographic employee distribution
- Interactive markers with popups
- City-wise employee counts
- OpenStreetMap integration

## Key Features Implemented

### Security
- Authentication system with localStorage
- Route protection
- Input validation

### User Experience
- Loading spinners
- Error boundaries
- Smooth transitions
- Hover effects
- Mobile responsive design

### Data Handling
- Async API calls
- Error handling
- Data transformation
- State management

### Creative Elements
- Gradient backgrounds
- Card-based layouts
- Interactive charts
- Map visualization
- Photo capture with WebRTC

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Browser Compatibility

- Chrome/Edge (recommended)
- Firefox
- Safari
- Requires HTTPS for camera functionality in production

## Notes

- Camera functionality requires HTTPS in production environments
- Map tiles are loaded from OpenStreetMap
- All data is fetched from the provided API endpoint
- The application is fully responsive and works on mobile devices

## Author

Developed as a technical assignment for Jotish company internship position.

---

**Note**: This project demonstrates proficiency in React development, API integration, data visualization, and modern web development practices.
