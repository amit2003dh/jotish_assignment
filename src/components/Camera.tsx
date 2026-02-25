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
  const [isLoading, setIsLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startCamera = async () => {
    try {
      setIsLoading(true);
      // Stop any existing stream first
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'user' } 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        // Wait for video to be ready
        videoRef.current.onloadedmetadata = () => {
          setIsLoading(false);
        };
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setIsLoading(false);
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

  const capturePreview = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      canvas.width = 200;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw video frame centered and cropped
        const size = Math.min(video.videoWidth, video.videoHeight);
        const x = (video.videoWidth - size) / 2;
        const y = (video.videoHeight - size) / 2;
        ctx.drawImage(video, x, y, size, size, 0, 0, 200, 200);
        setPreviewImage(canvas.toDataURL('image/png'));
      }
    }
  };

  useEffect(() => {
    startCamera();
    
    // Capture preview every 2 seconds
    const previewInterval = setInterval(() => {
      if (!isLoading && videoRef.current) {
        capturePreview();
      }
    }, 2000);
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
      clearInterval(previewInterval);
    };
  }, []);

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
        <video 
          ref={videoRef} 
          autoPlay 
          playsInline 
          style={{ opacity: isLoading ? 0 : 1 }} 
        />
        {!isLoading && <div className="camera-guide"></div>}
        {isLoading && (
          <div className="camera-loading">
            <div className="loading-spinner"></div>
            <p>Initializing camera...</p>
          </div>
        )}
        {previewImage && !isLoading && (
          <div className="camera-preview">
            <img src={previewImage} alt="Preview" />
            <span>Live Preview</span>
          </div>
        )}
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
