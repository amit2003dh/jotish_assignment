import React, { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Camera.css';

interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  salary: number;
  department: string;
}

const Camera: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const employee = location.state?.employee as Employee;
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      alert('Unable to access camera. Please ensure camera permissions are granted.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const imageData = canvas.toDataURL('image/png');
        stopCamera();
        navigate('/photo-result', { state: { image: imageData, employee } });
      }
    }
  };

  const goBack = () => {
    if (stream) {
      stopCamera();
    }
    navigate(-1); // Go back to previous page
  };

  React.useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  if (!employee) {
    return (
      <div className="error-container">
        <p>No employee data found</p>
        <button onClick={() => navigate('/list')} className="back-button">Back to List</button>
      </div>
    );
  }

  return (
    <div className="camera-container">
      <div className="camera-header">
        <button onClick={goBack} className="back-button">← Back</button>
        <h2>Capture Photo for {employee.name}</h2>
      </div>

      <div className="camera-content">
        <div className="employee-summary">
          <div className="summary-card">
            <h3>{employee.name}</h3>
            <p><strong>ID:</strong> {employee.id}</p>
            <p><strong>Department:</strong> {employee.department}</p>
            <p><strong>City:</strong> {employee.city}</p>
          </div>
        </div>

        <div className="camera-view">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="camera-feed"
          />
          <canvas ref={canvasRef} className="hidden-canvas" />
          
          <div className="camera-controls">
            <button onClick={capturePhoto} className="capture-button">
              📸 Capture Photo
            </button>
            <button onClick={goBack} className="cancel-button">
              ❌ Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Camera;
