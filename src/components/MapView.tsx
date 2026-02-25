import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, Employee } from '../utils/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './MapView.css';

// Fix for default marker icon in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface CityLocation {
  city: string;
  lat: number;
  lng: number;
  employees: Employee[];
}

const MapView: React.FC = () => {
  const [cityLocations, setCityLocations] = useState<CityLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // City coordinates mapping
    const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
      'New York': { lat: 40.7128, lng: -74.0060 },
      'Los Angeles': { lat: 34.0522, lng: -118.2437 },
      'Chicago': { lat: 41.8781, lng: -87.6298 },
      'Houston': { lat: 29.7604, lng: -95.3698 },
      'Phoenix': { lat: 33.4484, lng: -112.0740 },
      'Philadelphia': { lat: 39.9526, lng: -75.1652 },
      'San Antonio': { lat: 29.4241, lng: -98.4936 },
      'San Diego': { lat: 32.7157, lng: -117.1611 },
      'Dallas': { lat: 32.7767, lng: -96.7970 },
      'San Jose': { lat: 37.3382, lng: -121.8863 },
      'Austin': { lat: 30.2672, lng: -97.7431 },
      'Jacksonville': { lat: 30.3322, lng: -81.6557 },
      'Fort Worth': { lat: 32.7555, lng: -97.3308 },
      'Columbus': { lat: 39.9612, lng: -82.9988 },
      'Charlotte': { lat: 35.2271, lng: -80.8431 },
      'San Francisco': { lat: 37.7749, lng: -122.4194 },
      'Indianapolis': { lat: 39.7684, lng: -86.1581 },
      'Seattle': { lat: 47.6062, lng: -122.3321 },
      'Denver': { lat: 39.7392, lng: -104.9903 },
      'Boston': { lat: 42.3601, lng: -71.0589 },
      'Detroit': { lat: 42.3314, lng: -83.0458 },
      'Nashville': { lat: 36.1627, lng: -86.7816 },
      'Portland': { lat: 45.5152, lng: -122.6784 },
      'Las Vegas': { lat: 36.1699, lng: -115.1398 },
      'Baltimore': { lat: 39.2904, lng: -76.6122 },
      'London': { lat: 51.5074, lng: -0.1278 },
      'Paris': { lat: 48.8566, lng: 2.3522 },
      'Tokyo': { lat: 35.6762, lng: 139.6503 },
      'Edinburgh': { lat: 55.9533, lng: -3.1883 },
      'Sidney': { lat: -33.8688, lng: 151.2093 },
      'Toronto': { lat: 43.6532, lng: -79.3832 },
      'Mumbai': { lat: 19.0760, lng: 72.8777 },
      'Delhi': { lat: 28.7041, lng: 77.1025 },
      'Bangalore': { lat: 12.9716, lng: 77.5946 },
      'Singapore': { lat: 1.3521, lng: 103.8198 },
      'Dubai': { lat: 25.2048, lng: 55.2708 },
    };

    const fetchData = async () => {
      try {
        const employees = await api.fetchEmployees();
        console.log('MapView API Response:', employees);
        
        // Group employees by city and get coordinates
        const cityMap: { [key: string]: Employee[] } = {};
        
        employees.forEach(employee => {
          if (!cityMap[employee.city]) {
            cityMap[employee.city] = [];
          }
          cityMap[employee.city].push(employee);
        });

        const locations: CityLocation[] = Object.keys(cityMap).map(city => {
          const coords = cityCoordinates[city] || { lat: 40.7128, lng: -74.0060 }; // Default to NYC if city not found
          return {
            city,
            lat: coords.lat,
            lng: coords.lng,
            employees: cityMap[city]
          };
        });

        setCityLocations(locations);
        setError('');
      } catch (err: any) {
        console.error('MapView API Error:', err);
        setCityLocations([]);
        setError(`API Error: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const goBack = () => {
    navigate('/list');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading map data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={goBack} className="back-button">Back to List</button>
      </div>
    );
  }

  return (
    <div className="map-container">
      <div className="map-header">
        <button onClick={goBack} className="back-button">← Back to List</button>
        <h2>Employee Locations</h2>
      </div>

      <div className="map-content">
        <div className="map-wrapper">
          <MapContainer 
            center={[40.7128, -74.0060]} 
            zoom={4} 
            style={{ height: '600px', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {cityLocations.map((location, index) => (
              <Marker key={index} position={[location.lat, location.lng]}>
                <Popup>
                  <div className="popup-content">
                    <h4>{location.city}</h4>
                    <p><strong>Employees:</strong> {location.employees.length}</p>
                    <div className="employee-list">
                      {location.employees.slice(0, 3).map(emp => (
                        <div key={emp.id} className="employee-item">
                          <strong>{emp.name}</strong>
                          <br />
                          <small>{emp.department} - ${emp.salary.toLocaleString()}</small>
                        </div>
                      ))}
                      {location.employees.length > 3 && (
                        <small><em>...and {location.employees.length - 3} more</em></small>
                      )}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="city-stats">
          <h3>City Statistics</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Cities</div>
              <div className="stat-value">{cityLocations.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Total Employees</div>
              <div className="stat-value">
                {cityLocations.reduce((sum, loc) => sum + loc.employees.length, 0)}
              </div>
            </div>
          </div>
          
          <div className="city-list">
            <h4>Cities with Employees</h4>
            <div className="city-items">
              {cityLocations.map((location, index) => (
                <div key={index} className="city-item">
                  <span className="city-name">{location.city}</span>
                  <span className="employee-count">{location.employees.length} employees</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;
