import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, Employee } from '../utils/api';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Users } from 'lucide-react';
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

  useEffect(() => {
    const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
      'New York': { lat: 40.7128, lng: -74.0060 },
      'Los Angeles': { lat: 34.0522, lng: -118.2437 },
      'Chicago': { lat: 41.8781, lng: -87.6298 },
      'Houston': { lat: 29.7604, lng: -95.3698 },
      'Phoenix': { lat: 33.4484, lng: -112.0740 },
      'London': { lat: 51.5074, lng: -0.1278 },
      'Mumbai': { lat: 19.0760, lng: 72.8777 },
      'Dubai': { lat: 25.2048, lng: 55.2708 },
    };

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

  if (loading) return <div className="map-loader">Syncing geographic data...</div>;

  const initialCenter: [number, number] = forceCity ? 
    [cityLocations.find(l => l.city === forceCity)?.lat || 40.7128, 
     cityLocations.find(l => l.city === forceCity)?.lng || -74.0060] : 
    [40.7128, -74.0060];

  return (
    <div className={`map-page ${forceCity ? 'embedded' : ''}`}>
      {!forceCity && (
        <header className="page-header">
          <h1>Global Workforce Distribution</h1>
          <p>Real-time geographic visibility of team clusters.</p>
        </header>
      )}

      <div className="map-container-main">
        <MapContainer 
          center={initialCenter} 
          zoom={forceCity ? 10 : 3} 
          style={{ height: forceCity ? '100%' : '600px', width: '100%' }}
          scrollWheelZoom={!forceCity}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {cityLocations.map((loc, i) => (
            <Marker key={i} position={[loc.lat, loc.lng]}>
              <Popup>
                <div className="map-popup">
                  <h4>{loc.city}</h4>
                  <div className="popup-stat">
                    <Users size={14} />
                    <span>{loc.employees.length} Personnel</span>
                  </div>
                  <div className="popup-list">
                    {loc.employees.slice(0, 3).map(e => (
                      <div key={e.id} className="popup-emp">
                        {e.name} • {e.department}
                      </div>
                    ))}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
