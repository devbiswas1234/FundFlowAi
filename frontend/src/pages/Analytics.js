import React, { useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';
import { Layers, PieChart as PieIcon, Activity } from 'lucide-react';
import './Pages.css';
const API_BASE_URL = process.env.REACT_APP_API_URL || `${API_BASE_URL}`;


const COLORS = ['#2ea043', '#d29922', '#f85149'];

function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch analytics data
    fetch(`${API_BASE_URL}/analytics`)
      .then(res => res.json())
      .then(resData => {
        setData(resData);
        setLoading(false);
      });
  }, []);

  if (loading || !data) {
    return <div className="page-container flex-center">Loading Analytics...</div>;
  }

  // Format data for charts
  const riskData = Object.keys(data.risk_distribution).map(key => ({
    name: key,
    value: data.risk_distribution[key]
  }));

  const patternData = Object.keys(data.pattern_distribution).map(key => ({
    name: key,
    count: data.pattern_distribution[key]
  }));

  const timelineData = [
    { name: 'Mon', suspicious: 12, normal: 150 },
    { name: 'Tue', suspicious: 19, normal: 180 },
    { name: 'Wed', suspicious: 15, normal: 160 },
    { name: 'Thu', suspicious: 25, normal: 190 },
    { name: 'Fri', suspicious: 42, normal: 210 },
    { name: 'Sat', suspicious: 38, normal: 170 },
    { name: 'Sun', suspicious: 15, normal: 120 },
  ];

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="text-gradient">Risk Analytics</h1>
          <p className="text-subtitle">Statistical insights into fraud activity and system patterns.</p>
        </div>
      </div>

      <div className="analytics-grid">
        {/* Risk Distribution Chart */}
        <div className="chart-card glass-panel">
          <div className="chart-header">
             <PieIcon size={20} className="text-primary"/>
             <h3>Risk Score Distribution</h3>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={riskData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(22, 27, 34, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pattern Distribution Chart */}
        <div className="chart-card glass-panel">
          <div className="chart-header">
             <Layers size={20} className="text-primary"/>
             <h3>Fraud Pattern Distribution</h3>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={patternData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                <XAxis type="number" stroke="#8b949e" />
                <YAxis dataKey="name" type="category" stroke="#8b949e" width={100}/>
                <RechartsTooltip 
                  cursor={{fill: 'rgba(255,255,255,0.05)'}}
                  contentStyle={{ backgroundColor: 'rgba(22, 27, 34, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="var(--primary-color)" radius={[0, 4, 4, 0]} barSize={24}>
                  {patternData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`hsl(212, 100%, ${60 - index * 5}%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Timeline Chart */}
        <div className="chart-card glass-panel span-full">
           <div className="chart-header">
             <Activity size={20} className="text-primary"/>
             <h3>Weekly Transaction Volume</h3>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timelineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false}/>
                <XAxis dataKey="name" stroke="#8b949e" />
                <YAxis stroke="#8b949e" />
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: 'rgba(22, 27, 34, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                />
                <Legend />
                <Line type="monotone" dataKey="normal" stroke="#2ea043" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} />
                <Line type="monotone" dataKey="suspicious" stroke="#f85149" strokeWidth={2} dot={{r: 4}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Analytics;
