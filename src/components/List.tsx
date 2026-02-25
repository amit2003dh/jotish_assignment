import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, Employee } from '../utils/api';
import { Search, Map as MapIcon, ChevronRight, LayoutGrid, List as ListIcon, Loader2, AlertCircle } from 'lucide-react';
import './List.css';

const List: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const navigate = useNavigate();

  const isValidEmployee = (emp: any): emp is Employee => {
    return emp && typeof emp.id === 'number' && typeof emp.name === 'string';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.fetchEmployees();
        if (response && Array.isArray(response)) {
          setEmployees(response);
        } else {
          setError('No employee data available');
        }
      } catch (err: any) {
        setError(`Connection failed: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredEmployees = employees
    .filter(isValidEmployee)
    .filter(emp => 
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const handleRowClick = (employee: Employee) => {
    navigate(`/details/${employee.id}`, { state: { employee } });
  };

  if (loading) {
    return (
      <div className="loading-state">
        <Loader2 className="animate-spin" size={40} />
        <p>Synchronizing workforce data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-state">
        <AlertCircle size={48} />
        <h2>Data sync failed</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary">Try Again</button>
      </div>
    );
  }

  return (
    <div className="list-page">
      <header className="page-header">
        <div className="header-info">
          <h1>Workforce Directory</h1>
          <p>Manage and monitor your global team across departments.</p>
        </div>
        <div className="header-actions">
          <button onClick={() => navigate('/map')} className="btn-secondary">
            <MapIcon size={18} />
            <span>Map View</span>
          </button>
        </div>
      </header>

      <div className="controls-bar">
        <div className="search-field">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search by name, city or department..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="view-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
            onClick={() => setViewMode('table')}
          >
            <ListIcon size={18} />
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
          >
            <LayoutGrid size={18} />
          </button>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="table-wrapper">
          <table className="standard-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Department</th>
                <th>Location</th>
                <th>Salary</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} onClick={() => handleRowClick(emp)}>
                  <td>
                    <div className="user-cell">
                      <div className="user-avatar">{emp.name.charAt(0)}</div>
                      <div className="user-info">
                        <span className="user-name">{emp.name}</span>
                        <span className="user-id">#{emp.id}</span>
                      </div>
                    </div>
                  </td>
                  <td><span className="badge-dep">{emp.department}</span></td>
                  <td>{emp.city}</td>
                  <td className="font-medium">${emp.salary.toLocaleString()}</td>
                  <td><span className="badge-active">Active</span></td>
                  <td className="text-right"><ChevronRight size={18} className="row-arrow" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="employee-grid">
          {filteredEmployees.map((emp) => (
            <div key={emp.id} className="employee-card" onClick={() => handleRowClick(emp)}>
              <div className="card-avatar">{emp.name.charAt(0)}</div>
              <h3>{emp.name}</h3>
              <p className="card-dep">{emp.department}</p>
              <div className="card-footer">
                <span>{emp.city}</span>
                <strong>${emp.salary.toLocaleString()}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {filteredEmployees.length === 0 && (
        <div className="empty-state">
          <p>No team members found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default List;
