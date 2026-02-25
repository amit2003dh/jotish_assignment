import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, Employee } from '../utils/api';
import { mockEmployees } from '../utils/mockData';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './BarChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.fetchEmployees();
        
        console.log('BarChart API Response:', response);
        
        if (response && response.length > 0) {
          setEmployees(response);
        } else {
          console.log('Using mock data as fallback');
          
          setError('Using demo data - API format unexpected');
        }
      } catch (err) {
        console.error('BarChart API Error:', err);
        console.log('Using mock data due to API error');
        
        setError(`Using demo data - API Error: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const goBack = () => {
    navigate('/list');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading chart data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={goBack} className="back-button">Back to List</button>
      </div>
    );
  }

  // Get first 10 employees for the chart
  const firstTenEmployees = employees.slice(0, 10);
  
  const chartData = {
    labels: firstTenEmployees.map(emp => emp.name),
    datasets: [
      {
        label: 'Salary ($)',
        data: firstTenEmployees.map(emp => emp.salary),
        backgroundColor: 'rgba(102, 126, 234, 0.6)',
        borderColor: 'rgba(102, 126, 234, 1)',
        borderWidth: 2,
        hoverBackgroundColor: 'rgba(102, 126, 234, 0.8)',
        hoverBorderColor: 'rgba(102, 126, 234, 1)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            size: 14,
            weight: 'bold' as const,
          },
          color: '#333',
        },
      },
      title: {
        display: true,
        text: 'Salary Distribution - First 10 Employees',
        font: {
          size: 18,
          weight: 'bold' as const,
        },
        color: '#333',
        padding: 20,
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return `Salary: $${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value: any) {
            return '$' + value.toLocaleString();
          },
          font: {
            size: 12,
          },
          color: '#666',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
      },
      x: {
        ticks: {
          font: {
            size: 12,
          },
          color: '#666',
        },
        grid: {
          display: false,
        },
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const,
    },
  };

  return (
    <div className="chart-container">
      <div className="chart-header">
        <button onClick={goBack} className="back-button">← Back to List</button>
        <h2>Salary Analytics</h2>
      </div>

      <div className="chart-content">
        <div className="chart-wrapper">
          <Bar data={chartData} options={options} />
        </div>
        
        <div className="chart-stats">
          <h3>Statistics Summary</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-label">Total Employees</div>
              <div className="stat-value">{employees.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Chart Employees</div>
              <div className="stat-value">{firstTenEmployees.length}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Average Salary (Chart)</div>
              <div className="stat-value">
                ${Math.round(firstTenEmployees.reduce((sum, emp) => sum + emp.salary, 0) / firstTenEmployees.length).toLocaleString()}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Highest Salary (Chart)</div>
              <div className="stat-value">
                ${Math.max(...firstTenEmployees.map(emp => emp.salary)).toLocaleString()}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Lowest Salary (Chart)</div>
              <div className="stat-value">
                ${Math.min(...firstTenEmployees.map(emp => emp.salary)).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChart;
