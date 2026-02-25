import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../App';
import { api, Employee } from '../utils/api';
import './List.css';

const List: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  

  // Type guard to ensure employee has all required properties
  const isValidEmployee = (emp: any): emp is Employee => {
    return emp && 
           typeof emp.id === 'number' &&
           typeof emp.name === 'string' &&
           typeof emp.date === 'string' &&
           typeof emp.city === 'string' &&
           typeof emp.salary === 'number' &&
           typeof emp.department === 'string';
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data from API...');
        console.log('API URL:', 'https://backend.jotish.in/backend_dev/gettabledata.php');
        console.log('Credentials:', { username: 'test', password: '123456' });
        
        const response = await api.fetchEmployees();
        console.log('Raw API Response:', response);
        console.log('Response type:', typeof response);
        console.log('Response length:', response?.length);
        console.log('Is array:', Array.isArray(response));
        
        if (response && Array.isArray(response) && response.length > 0) {
          console.log('✓ Setting employees from API:', response.length);
          console.log('✓ First employee:', response[0]);
          setEmployees(response);
          setError('');
        } else {
          console.log('API returned invalid or empty data');
          console.log('Response details:', {
            hasResponse: !!response,
            isArray: Array.isArray(response),
            length: response?.length || 0,
            keys: response ? Object.keys(response) : 'no object'
          });
          
          setEmployees([]);
          setError('No employee data available');
        }
      } catch (err: any) {
        console.error('API Error:', err);
        console.error('Error details:', {
          message: err.message,
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data
        });
        console.log(' API error');
        
        setEmployees([]);
        setError(`API Error: ${err.message || 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRowClick = (employee: Employee) => {
    navigate(`/details/${employee.id}`, { state: { employee } });
  };

  // const showBarChart = () => {
  //   navigate('/barchart');
  // };

  const showMap = () => {
    navigate('/map');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        {/* <button onClick={logout} className="logout-button">Logout</button> */}
        <button onClick={() => window.location.reload()} className="retry-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="list-container">
      <div className="list-header">
        <h2>Employee List</h2>
        <div className="header-buttons">
          <button onClick={showMap} className="map-button">Map View</button>
        </div>
      </div>
      
      <div className="table-container">
        <table className="employee-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>City</th>
              <th>Salary</th>
              <th>Department</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {employees.filter(isValidEmployee).map((employee) => (
              <tr 
                key={employee.id} 
                onClick={() => handleRowClick(employee)}
                className="clickable-row"
              >
                <td>{employee.id}</td>
                <td>{employee.name}</td>
                <td>{employee.city}</td>
                <td>{employee.salary ? `$${employee.salary.toLocaleString()}` : 'N/A'}</td>
                <td>{employee.department || 'N/A'}</td>
                <td>{employee.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View for Small Screens */}
      <div className="mobile-cards">
        {employees.filter(isValidEmployee).map((employee) => (
          <div 
            key={employee.id} 
            onClick={() => handleRowClick(employee)}
            className="employee-card"
          >
            <div className="employee-card-header">
              <span className="employee-card-name">{employee.name}</span>
              <span className="employee-card-id">ID: {employee.id}</span>
            </div>
            <div className="employee-card-details"> 
              <div className="employee-card-detail">
                <strong>City</strong>
                {employee.city}
              </div>
              <div className="employee-card-detail">
                <strong>Salary</strong>
                {employee.salary ? `$${employee.salary.toLocaleString()}` : 'N/A'}
              </div>
              <div className="employee-card-detail">
                <strong>Department</strong>
                {employee.department || 'N/A'}
              </div>
              <div className="employee-card-detail">
                <strong>Date</strong>
                {employee.date}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
