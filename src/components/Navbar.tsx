import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';
import { Users, BarChart3, Map as MapIcon, LogOut, Menu, X } from 'lucide-react';
import './Navbar.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleNavClick = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/list', label: 'Employees', icon: Users },
    { path: '/barchart', label: 'Statistics', icon: BarChart3 },
    { path: '/map', label: 'Map View', icon: MapIcon },
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={() => navigate('/')}>
          <div className="brand-icon">
            <Users size={24} />
          </div>
          <span className="brand-text">Jotish</span>
        </div>
        
        <div className="navbar-links">
          {navItems.map((item) => (
            <button 
              key={item.path}
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => handleNavClick(item.path)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
        
        <div className="navbar-actions">
          <button onClick={logout} className="btn-logout" title="Logout">
            <LogOut size={18} />
            <span className="logout-text">Logout</span>
          </button>
          
          <button className="mobile-toggle" onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="mobile-nav">
          {navItems.map((item) => (
            <button 
              key={item.path}
              className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => handleNavClick(item.path)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
          <button onClick={logout} className="mobile-nav-link logout">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
