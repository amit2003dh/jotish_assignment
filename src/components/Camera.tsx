import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Zap, ArrowLeft } from 'lucide-react';
import { Employee } from '../utils/api';
import './Camera.css';

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
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      alert('Camera access denied. Please check permissions.');
      navigate(-1);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      
      const imageData = canvas.toDataURL('image/png');
      stream?.getTracks().forEach(t => t.stop());
      navigate('/photo-result', { state: { image: imageData, employee } });
    }
  };

  useEffect(() => {
    const s = startCamera();
    return () => {
      stream?.getTracks().forEach(t => t.stop());
    };
  }, [stream]);

  if (!employee) return null;

  return (
    <div className="camera-overlay">
      <div className="camera-header-floating">
        <button onClick={() => navigate(-1)} className="btn-close">
          <ArrowLeft size={24} />
        </button>
        <div className="target-info">
          <h3>Capturing Photo</h3>
          <p>{employee.name} • {employee.id}</p>
        </div>
      </div>

      <div className="camera-viewport">
        <video ref={videoRef} autoPlay playsInline />
        <div className="camera-guide"></div>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>

      <div className="camera-actions-floating">
        <button className="btn-util"><Zap size={24} /></button>
        <button onClick={capturePhoto} className="btn-shutter">
          <div className="shutter-inner"></div>
        </button>
        <button onClick={() => navigate(-1)} className="btn-util"><X size={24} /></button>
      </div>
    </div>
  );
};

export default Camera;
