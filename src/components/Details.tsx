import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Employee } from '../utils/api';
import { ArrowLeft, MapPin, Building2, Calendar, DollarSign, Camera, Download } from 'lucide-react';
import MapView from './MapView';
import './Details.css';

const Details: React.FC = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const employee = state?.employee as Employee | null;
  const [capturedImage, setCapturedImage] = useState<string | null>(localStorage.getItem(`photo_${employee?.id}`) || null);

  useEffect(() => {
    if (!employee) {
      navigate('/list');
    }
  }, [employee, navigate]);

  if (!employee) return null;

  const handleExportData = () => {
    if (!employee) return;
    
    const exportData = {
      employee: {
        id: employee.id,
        name: employee.name,
        department: employee.department,
        city: employee.city,
        salary: employee.salary,
        date: employee.date
      },
      exportTimestamp: new Date().toISOString(),
      photoCaptured: !!capturedImage
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `employee_${employee.name.replace(/\s+/g, '_')}_data.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="details-page">
      <div className="details-container-inner">
        <button onClick={() => navigate('/list')} className="btn-back">
          <ArrowLeft size={18} />
          <span>Back to Directory</span>
        </button>

        <div className="details-layout">
          <div className="profile-section">
            <div className="profile-card">
              <div className="profile-header-main">
                <div className="profile-avatar-large">
                  {capturedImage ? (
                    <img src={capturedImage} alt={employee.name} style={{ width: '100%', height: '100%', borderRadius: 'inherit', objectFit: 'cover' }} />
                  ) : (
                    employee.name.charAt(0)
                  )}
                </div>
                <div className="profile-meta">
                  <h1>{employee.name}</h1>
                  <span className="profile-id-tag">Employee ID: #{employee.id}</span>
                </div>
              </div>

              <div className="profile-details-grid">
                <div className="detail-card">
                  <div className="detail-icon-wrapper">
                    <Building2 size={20} />
                  </div>
                  <div className="detail-info">
                    <label>Department</label>
                    <span>{employee.department}</span>
                  </div>
                </div>
                
                <div className="detail-card">
                  <div className="detail-icon-wrapper">
                    <MapPin size={20} />
                  </div>
                  <div className="detail-info">
                    <label>Work Location</label>
                    <span>{employee.city}</span>
                  </div>
                </div>

                <div className="detail-card">
                  <div className="detail-icon-wrapper">
                    <DollarSign size={20} />
                  </div>
                  <div className="detail-info">
                    <label>Annual Salary</label>
                    <span>${employee.salary.toLocaleString()}</span>
                  </div>
                </div>

                <div className="detail-card">
                  <div className="detail-icon-wrapper">
                    <Calendar size={20} />
                  </div>
                  <div className="detail-info">
                    <label>Joining Date</label>
                    <span>{employee.date}</span>
                  </div>
                </div>
              </div>

              <div className="profile-actions-bar">
                <button 
                  onClick={() => navigate('/camera', { state: { employee } })} 
                  className="btn-primary-action"
                >
                  <Camera size={18} />
                  <span>Capture Photo</span>
                </button>
                <button onClick={handleExportData} className="btn-secondary-action">
                  <Download size={18} />
                  <span>Export Data</span>
                </button>
              </div>
            </div>
          </div>

          <div className="auxiliary-section">
            <div className="standard-card map-card">
              <div className="card-header-styled">
                <MapPin size={20} />
                <h2>Base Location</h2>
              </div>
              <div className="map-embed">
                 <MapView forceCity={employee.city} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
