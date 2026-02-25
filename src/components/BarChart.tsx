import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, Employee } from '../utils/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { ArrowLeft, TrendingUp, Users, DollarSign, Award, Target } from 'lucide-react';
import './BarChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const BarChart: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.fetchEmployees();
        if (response) setEmployees(response);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const topEmployees = employees.slice(0, 8);
  
  const chartData = {
    labels: topEmployees.map(emp => emp.name),
    datasets: [
      {
        label: 'Salary Breakdown',
        data: topEmployees.map(emp => emp.salary),
        backgroundColor: 'rgba(99, 102, 241, 0.8)',
        borderRadius: 8,
        barThickness: 32,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        padding: 12,
        titleFont: { size: 14, weight: 'bold' as const },
        bodyFont: { size: 13 },
        cornerRadius: 8,
      }
    },
    scales: {
      y: {
        grid: { color: '#f1f5f9' },
        ticks: { callback: (val: any) => '$' + val.toLocaleString() }
      },
      x: { grid: { display: false } }
    },
  };

  if (loading) return null;

  const avgSalary = Math.round(topEmployees.reduce((a, b) => a + b.salary, 0) / topEmployees.length);

  return (
    <div className="stats-page">
      <header className="stats-header">
        <button onClick={() => navigate('/list')} className="btn-icon-text">
          <ArrowLeft size={18} />
          <span>Back</span>
        </button>
        <div className="title-group">
          <h1>Compensation Analytics</h1>
          <p>Visualizing salary distributions across top-performing personnel.</p>
        </div>
      </header>

      <div className="stats-layout">
        <div className="main-chart-card">
          <div className="chart-info">
            <TrendingUp size={24} className="text-primary" />
            <div>
              <h3>Salary Benchmark</h3>
              <p>Top 8 earners comparison</p>
            </div>
          </div>
          <div className="chart-height-wrapper">
            <Bar data={chartData} options={options} />
          </div>
        </div>

        <div className="stats-sidebar">
          <div className="mini-stat-card">
            <div className="mini-icon blue"><Users size={20} /></div>
            <div>
              <label>Total Workforce</label>
              <strong>{employees.length}</strong>
            </div>
          </div>
          
          <div className="mini-stat-card">
            <div className="mini-icon green"><DollarSign size={20} /></div>
            <div>
              <label>Average Salary</label>
              <strong>${avgSalary.toLocaleString()}</strong>
            </div>
          </div>

          <div className="mini-stat-card">
            <div className="mini-icon purple"><Award size={20} /></div>
            <div>
              <label>Top Earner</label>
              <strong>{topEmployees[0]?.name || 'N/A'}</strong>
            </div>
          </div>

          <div className="promo-card">
            <Target size={32} />
            <h4>Performance Review</h4>
            <p>Annual salary adjustments are scheduled for next quarter.</p>
            <button className="btn-outline">View Schedule</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarChart;
