import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Download, RefreshCcw, Check, ArrowLeft, Calendar, User, Building2 } from 'lucide-react';
import { Employee } from '../utils/api';
import './PhotoResult.css';

const PhotoResult: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { image, employee } = location.state as { image: string; employee: Employee };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image;
    link.download = `emp_${employee.id}_photo.png`;
    link.click();
  };

  const handleSave = () => {
    localStorage.setItem(`photo_${employee.id}`, image);
    navigate(`/details/${employee.id}`, { state: { employee } });
  };

  return (
    <div className="result-page">
      <header className="page-header">
        <button onClick={() => navigate('/list')} className="btn-back">
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <h1>Capture Preview</h1>
      </header>

      <div className="result-grid">
        <div className="photo-card-main">
          <div className="photo-container">
            <img src={image} alt="Captured" />
          </div>
          <div className="photo-actions-inline">
            <button onClick={handleSave} className="btn-primary-ghost">
              <Check size={18} />
              <span>Save as Profile</span>
            </button>
            <button onClick={handleDownload} className="btn-primary-ghost">
              <Download size={18} />
              <span>Download</span>
            </button>
            <button onClick={() => navigate(-1)} className="btn-primary-ghost">
              <RefreshCcw size={18} />
              <span>Retake</span>
            </button>
          </div>
        </div>

        <div className="info-sidebar">
          <div className="standard-card">
            <div className="card-header-styled">
              <h3>Metadata</h3>
            </div>
            <div className="meta-list">
              <div className="meta-row">
                <User size={16} />
                <div className="meta-val">
                  <label>Employee</label>
                  <span>{employee.name}</span>
                </div>
              </div>
              <div className="meta-row">
                <Building2 size={16} />
                <div className="meta-val">
                  <label>Department</label>
                  <span>{employee.department}</span>
                </div>
              </div>
              <div className="meta-row">
                <Calendar size={16} />
                <div className="meta-val">
                  <label>Captured On</label>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          <button onClick={() => navigate('/list')} className="btn-finish">
            <Check size={20} />
            <span>Finish & Return</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoResult;
