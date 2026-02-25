import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, Employee } from '../utils/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Users, MapPin } from 'lucide-react';
import './MapView.css';

// Fix for default marker icon
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

const MapView: React.FC<{ forceCity?: string }> = ({ forceCity }) => {
  const [cityLocations, setCityLocations] = useState<CityLocation[]>([]);
  const [loading, setLoading] = useState(true);

  const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
    'New York': { lat: 40.7128, lng: -74.0060 },
    'Los Angeles': { lat: 34.0522, lng: -118.2437 },
    'Chicago': { lat: 41.8781, lng: -87.6298 },
    'Houston': { lat: 29.7604, lng: -95.3698 },
    'Phoenix': { lat: 33.4484, lng: -112.0740 },
    'London': { lat: 51.5074, lng: -0.1278 },
    'Mumbai': { lat: 19.0760, lng: 72.8777 },
    'Dubai': { lat: 25.2048, lng: 55.2708 },
    'San Francisco': { lat: 37.7749, lng: -122.4194 },
    'Edinburgh': { lat: 55.9533, lng: -3.1883 },
    'Tokyo': { lat: 35.6762, lng: 139.6503 },
  };

  useEffect(() => {

    const fetchData = async () => {
      try {
        const employees = await api.fetchEmployees();
        const cityMap: { [key: string]: Employee[] } = {};
        
        employees.forEach(emp => {
          if (!cityMap[emp.city]) cityMap[emp.city] = [];
          cityMap[emp.city].push(emp);
        });

        const locations = Object.keys(cityMap).map(city => ({
          city,
          lat: cityCoordinates[city]?.lat || 40.7128,
          lng: cityCoordinates[city]?.lng || -74.0060,
          employees: cityMap[city]
        }));

        setCityLocations(locations);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading && !forceCity) return <div className="map-loader">Syncing geographic data...</div>;

  const initialCenter: [number, number] = forceCity ? 
    [cityCoordinates[forceCity]?.lat || 40.7128, 
     cityCoordinates[forceCity]?.lng || -74.0060] : 
    [40.7128, -74.0060];

  const filteredLocations = forceCity 
    ? cityLocations.filter(loc => loc.city === forceCity)
    : cityLocations;

  // If forceCity is specified but no locations found, create a default marker
  const displayLocations = forceCity && filteredLocations.length === 0 
    ? [{
        city: forceCity,
        lat: cityCoordinates[forceCity]?.lat || 40.7128,
        lng: cityCoordinates[forceCity]?.lng || -74.0060,
        employees: []
      }]
    : filteredLocations;

  return (
    <div className={`map-page ${forceCity ? 'embedded' : ''}`}>
      {!forceCity && (
        <header className="page-header">
          <h1>Global Workforce Distribution</h1>
          <p>Real-time geographic visibility of team clusters.</p>
        </header>
      )}

      <div className="map-layout-with-list">
        <div className="map-container-main">
          <MapContainer 
            center={initialCenter} 
            zoom={forceCity ? 10 : 3} 
            style={{ height: forceCity ? '100%' : '600px', width: '100%' }}
            scrollWheelZoom={!forceCity}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {displayLocations.map((loc, i) => (
              <Marker key={i} position={[loc.lat, loc.lng]}>
                <Popup>
                  <div className="map-popup">
                    <h4>{loc.city}</h4>
                    <div className="popup-stat">
                      <Users size={14} />
                      <span>{loc.employees.length} Employees</span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {!forceCity && (
          <div className="map-sidebar-list">
            <h3>Locations</h3>
            <div className="location-list">
              {cityLocations.map((loc, i) => (
                <div key={i} className="location-item-card">
                  <div className="loc-header">
                    <MapPin size={16} />
                    <strong>{loc.city}</strong>
                  </div>
                  <div className="loc-count">
                    <Users size={14} />
                    <span>{loc.employees.length} Employees</span>
                  </div>
                  <div className="loc-emp-previews">
                    {loc.employees.slice(0, 3).map(e => (
                      <span key={e.id} className="mini-badge">{e.name}</span>
                    ))}
                    {loc.employees.length > 3 && <span>+{loc.employees.length - 3} more</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MapView;
