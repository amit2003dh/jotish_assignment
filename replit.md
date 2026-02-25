# Jotish Assignment - Employee Management System

## Project Overview
A React-based web application for managing employee data. Features include:
- Secure login (`testuser` / `Test123`)
- Employee list with data fetched from external REST API
- Employee detail view with chart and map visualizations
- WebRTC camera capture for employee photos
- Interactive geographic maps (Leaflet)
- Salary distribution bar charts (Chart.js)

## Tech Stack
- **Framework**: React 18 (Create React App)
- **Language**: TypeScript 4.9
- **Routing**: React Router v7
- **HTTP Client**: Axios
- **Charts**: Chart.js + react-chartjs-2
- **Maps**: Leaflet + react-leaflet
- **Build Tool**: react-scripts (CRA)
- **Package Manager**: npm

## Project Structure
```
src/
  components/    # Page components (Login, List, Details, Camera, etc.)
  utils/
    api.ts       # API integration with https://backend.jotish.in/
  App.tsx        # Root component + routing
public/          # Static assets and index.html
```

## Environment Setup
- `HOST=0.0.0.0` - Binds to all interfaces for Replit proxy
- `PORT=5000` - Required for Replit webview
- `DANGEROUSLY_DISABLE_HOST_CHECK=true` - Allows Replit proxy host header

## Development
```bash
npm install
npm start   # Starts dev server on 0.0.0.0:5000
```

## Deployment
Configured as a static site:
- Build command: `npm run build`
- Output directory: `build/`

## External API
Connects to `https://backend.jotish.in/backend_dev/gettabledata.php` for employee data.
