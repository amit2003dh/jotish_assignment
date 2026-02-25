import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './PhotoResult.css';

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  salary: number;
  department: string;
}

const PhotoResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { image, employee } = location.state as { image: string; employee: Employee };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image;
    link.download = `employee_${employee.id}_photo.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const goBack = () => {
    navigate('/list');
  };

  const retakePhoto = () => {
    navigate(`/details/${employee.id}`, { state: { employee } });
  };

  return (
    <div className="photo-result-container">
      <div className="photo-result-header">
        <button onClick={goBack} className="back-button">← Back to List</button>
        <h2>Photo Capture Result</h2>
      </div>

      <div className="photo-result-content">
        <div className="employee-summary">
          <h3>Employee: {employee.name}</h3>
          <p>ID: {employee.id} | Department: {employee.department}</p>
        </div>

        <div className="photo-display">
          <div className="photo-frame">
            <img src={image} alt={employee.name} className="captured-photo" />
          </div>
          
          <div className="photo-info">
            <h4>Capture Details</h4>
            <div className="info-grid">
              <div className="info-item">
                <span className="label">Employee Name:</span>
                <span className="value">{employee.name}</span>
              </div>
              <div className="info-item">
                <span className="label">Employee ID:</span>
                <span className="value">{employee.id}</span>
              </div>
              <div className="info-item">
                <span className="label">Department:</span>
                <span className="value">{employee.department}</span>
              </div>
              <div className="info-item">
                <span className="label">Capture Date:</span>
                <span className="value">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <span className="label">Capture Time:</span>
                <span className="value">{new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={handleDownload} className="download-button">
            📥 Download Photo
          </button>
          <button onClick={retakePhoto} className="retake-button">
            🔄 Retake Photo
          </button>
          <button onClick={goBack} className="done-button">
            ✅ Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoResult;
