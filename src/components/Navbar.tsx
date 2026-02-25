import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleMobileLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>Employee System</h2>
      </div>
      
      <div className="navbar-menu">
        <button 
          className={`nav-button ${isActive('/list') ? 'active' : ''}`}
          onClick={() => handleMobileNavClick('/list')}
          data-text="Employee List"
        >
          <span className="button-icon">👥</span>
          <span className="button-text">Employee List</span>
        </button>
        
        <button 
          className={`nav-button ${isActive('/barchart') ? 'active' : ''}`}
          onClick={() => handleMobileNavClick('/barchart')}
          data-text="Bar Chart"
        >
          <span className="button-icon">📊</span>
          <span className="button-text">Bar Chart</span>
        </button>
        
        <button 
          className={`nav-button ${isActive('/map') ? 'active' : ''}`}
          onClick={() => handleMobileNavClick('/map')}
          data-text="Map View"
        >
          <span className="button-icon">🗺</span>
          <span className="button-text">Map View</span>
        </button>
      </div>
      
      <div className="navbar-actions">
        <button onClick={logout} className="logout-button">
          <span className="logout-icon">🚪</span>
          <span className="logout-text">Logout</span>
        </button>
      </div>

      {/* Mobile Menu Toggle */}
      <button 
        className="mobile-menu-toggle"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        <span className={`hamburger ${isMobileMenuOpen ? 'open' : ''}`}></span>
      </button>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-header">
          <h3>Navigation</h3>
        </div>
        
        <div className="mobile-menu-items">
          <button 
            className={`mobile-nav-item ${isActive('/list') ? 'active' : ''}`}
            onClick={() => handleMobileNavClick('/list')}
          >
            <span className="mobile-nav-icon">👥</span>
            <div className="mobile-nav-content">
              <span className="mobile-nav-title">Employee List</span>
            </div>
          </button>
          
          <button 
            className={`mobile-nav-item ${isActive('/barchart') ? 'active' : ''}`}
            onClick={() => handleMobileNavClick('/barchart')}
          >
            <span className="mobile-nav-icon">📊</span>
            <div className="mobile-nav-content">
              <span className="mobile-nav-title">Bar Chart</span>
            </div>
          </button>
          
          <button 
            className={`mobile-nav-item ${isActive('/map') ? 'active' : ''}`}
            onClick={() => handleMobileNavClick('/map')}
          >
            <span className="mobile-nav-icon">🗺</span>
            <div className="mobile-nav-content">
              <span className="mobile-nav-title">Map View</span>
            </div>
          </button>
          
          <div className="mobile-menu-divider"></div>
          
          <button 
            className="mobile-nav-item mobile-nav-logout"
            onClick={handleMobileLogout}
          >
            <div className="mobile-nav-content">
              <span className="mobile-nav-title">Logout</span>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
