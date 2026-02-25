import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import './Login.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  useEffect(() => {
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      navigate('/list', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    // Simulate slight delay for professional feel
    await new Promise(r => setTimeout(r, 600));

    if (username === 'testuser' && password === 'Test123') {
      localStorage.setItem('isAuthenticated', 'true');
      if (setIsAuthenticated) {
        setIsAuthenticated(true);
      }
      navigate('/list');
    } else {
      setError('Invalid username or password');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-visual">
        <div className="visual-content">
          <h1>Employee Management System</h1>
          <p>Streamline your workforce operations with our unified internal dashboard.</p>
        </div>
      </div>
      
      <div className="login-form-side">
        <div className="login-card">
          <div className="login-header">
            <h2>Welcome back</h2>
            <p>Please enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-field">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="testuser"
                  required
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <div className="input-wrapper">
                <Lock className="input-icon" size={18} />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="error-box">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="btn-login" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  <span>Signing in...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
            
            <div className="login-footer">
              <p>Demo account: <strong>testuser</strong> / <strong>Test123</strong></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
