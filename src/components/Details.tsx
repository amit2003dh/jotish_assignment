import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Details.css';

interface Employee {
  id: number;
  name: string;
  date: string;
  city: string;
  salary: number;
  department: string;
}

const Details: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const employee = location.state?.employee as Employee;
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
 
  if (!employee) {
    return (
      <div className="error-container">
        <p>No employee data found</p>
        <button onClick={() => navigate('/list')} className="back-button">Back to List</button>
      </div>
    );
  }

  const handleProfileClick = () => {
    navigate('/camera', { state: { employee } });
  };

  const viewPhotoResult = () => {
    if (capturedImage) {
      navigate('/photo-result', { state: { image: capturedImage, employee } });
    }
  };

  const goBack = () => {
    navigate('/list');
  };

function getDateDifference(lastDateString: string) {
    const today = new Date();
    const lastDate = new Date(lastDateString);

    today.setHours(0, 0, 0, 0);
    lastDate.setHours(0, 0, 0, 0);

    let start = new Date(today);
    let end = new Date(lastDate);
    let isFuture = true;

    if (end < start) {
        [start, end] = [end, start];
        isFuture = false;
    }

    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
        months--;
        const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
        days += prevMonth.getDate();
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    const parts = [];

    if (years > 0) parts.push(years + " " + (years === 1 ? "year" : "years"));
    if (months > 0) parts.push(months + " " + (months === 1 ? "month" : "months"));
    if (days > 0) parts.push(days + " " + (days === 1 ? "day" : "days"));

    if (parts.length === 0) return "Today";

    const result = parts.slice(0, 2).join(" "); // show max 2 units for cleaner UX

    return isFuture ? result + " left" : result + " ago";
}

  return (
    <div className="details-container">
      <div className="details-header">
        <button onClick={goBack} className="back-button">
          <span className="back-icon">←</span>
          <span>Back to List</span>
        </button>
        <h2>Employee Profile</h2>
        {/* <div className="header-actions">
          
        </div> */}
      </div>

      <div className="details-content">
        <div className="profile-section">
          <div className="profile-card">
            <div className="profile-header">
              <div className="employee-avatar">
                {capturedImage ? (
                  <img 
                    src={capturedImage} 
                    alt={employee.name} 
                    className="profile-photo"
                    onClick={handleProfileClick}
                  />
                ) : (
                  <div 
                    className="avatar-placeholder clickable-avatar"
                    onClick={handleProfileClick}
                  >
                    <span className="avatar-text">{employee.name.charAt(0).toUpperCase()}</span>
                    <div className="camera-hint">
                      <span className="camera-icon">📷</span>
                      <span className="hint-text">Click to add photo</span>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="profile-info">
                <h3 className="employee-name">{employee.name}</h3>
                <div className="employee-title">
                  <span className="department-badge">{employee.department}</span>
                  <span className="employee-id">ID: {employee.id}</span>
                </div>
              </div>
            </div>

            <div className="info-grid">
              <div className="info-section">
                <h4 className="section-title">Contact Information</h4>
                <div className="info-items">
      
            
                  <div className="info-item">
                    <div className="info-icon">📍</div>
                    <div className="info-content">
                      <span className="info-label">Location</span>
                      <span className="info-value">{employee.city}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="info-section">
                <h4 className="section-title">Employment Details</h4>
                <div className="info-items">
                  <div className="info-item salary-item">
                    <div className="info-icon">💰</div>
                    <div className="info-content">
                      <span className="info-label">Annual Salary</span>
                      <span className="info-value salary-value">${employee.salary.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="info-items">
                  <div className="info-item salary-item">
                    <div className="info-icon">📅</div>
                    <div className="info-content">
                      <span className="info-label">Date</span>
                      <span className="info-value salary-value">{employee.date.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                <div className="info-items">
                  <div className="info-item salary-item">
                    <div className="info-icon">📅</div>
                    <div className="info-content">
                      <span className="info-label">Duration</span>
                      <span className="info-value salary-value">{getDateDifference(employee.date)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {capturedImage && (
          <div className="photo-actions">
            <button onClick={viewPhotoResult} className="view-photo-button">
              <span className="button-icon">👁</span>
              <span>View Full Photo</span>
            </button>
            <button onClick={handleProfileClick} className="retake-photo-button">
              <span className="button-icon">📷</span>
              <span>Replace Photo</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Details;
