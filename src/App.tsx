import React, { useEffect, useState, createContext, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './components/Login';
import List from './components/List';
import Details from './components/Details';
import Camera from './components/Camera';
import PhotoResult from './components/PhotoResult';
import BarChart from './components/BarChart';
import MapView from './components/MapView';
import Navbar from './components/Navbar';
import './App.css';

// Create authentication context
interface AuthContextType {
  isAuthenticated: boolean | null;
  setIsAuthenticated: (value: boolean) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

function AppContent() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Check if user is authenticated on app load
    const checkAuthStatus = () => {
      const authStatus = localStorage.getItem('isAuthenticated');
      setIsAuthenticated(authStatus === 'true');
    };

    checkAuthStatus();

    // Listen for storage changes (for logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'isAuthenticated') {
        checkAuthStatus();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem('isAuthenticated');
    setIsAuthenticated(false);
  };

  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    if (isAuthenticated === null) {
      return <div className="loading-container"><div className="spinner"></div></div>;
    }
    
    // Check authentication status again in case localStorage was cleared
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus !== 'true') {
      setIsAuthenticated(false);
      return <Navigate to="/" replace />;
    }
    
    return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
  };

  const shouldShowNavbar = isAuthenticated && location.pathname !== '/';

  if (isAuthenticated === null) {
    return <div className="loading-container"><div className="spinner"></div></div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout }}>
      <div className="App">
        {shouldShowNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/list" element={
            <ProtectedRoute>
              <List />
            </ProtectedRoute>
          } />
          <Route path="/details/:id" element={
            <ProtectedRoute>
              <Details />
            </ProtectedRoute>
          } />
          <Route path="/camera" element={
            <ProtectedRoute>
              <Camera />
            </ProtectedRoute>
          } />
          <Route path="/photo-result" element={
            <ProtectedRoute>
              <PhotoResult />
            </ProtectedRoute>
          } />
          <Route path="/barchart" element={
            <ProtectedRoute>
              <BarChart />
            </ProtectedRoute>
          } />
          <Route path="/map" element={
            <ProtectedRoute>
              <MapView />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </AuthContext.Provider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
