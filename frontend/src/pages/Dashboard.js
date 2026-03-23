import React, { useState, useEffect } from "react";
import FundGraph from "../FundGraph";
import BranchHeatMap from "../BranchHeatMap";
import { ShieldAlert, Activity, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import './Pages.css';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';


function Dashboard() {
  const [account, setAccount] = useState("A1");
  const [metrics, setMetrics] = useState({
    total_accounts: 0,
    total_transactions: 0,
    high_risk_accounts: 124,
    suspicious_transactions: 852
  });
  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/dashboard-metrics`)
      .then(res => res.json())
      .then(data => {
        setMetrics(prev => ({...prev, ...data}));
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="text-gradient">Command Center</h1>
          <p className="text-subtitle">Real-time overview of network activity and detected anomalies.</p>
        </div>
        <div className="search-focus">
          <input
            className="glass-input"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            placeholder="Focus Account ID (e.g., A1)"
          />
        </div>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <div className="metric-card glass-card">
          <div className="metric-icon primary"><Users size={24} /></div>
          <div className="metric-data">
            <h3 className="metric-value">{loading ? '...' : metrics.total_accounts.toLocaleString()}</h3>
            <p className="metric-label">Monitored Accounts</p>
          </div>
          <div className="metric-trend up"><TrendingUp size={16}/> +2.4%</div>
        </div>

        <div className="metric-card glass-card">
          <div className="metric-icon warning"><Activity size={24} /></div>
          <div className="metric-data">
            <h3 className="metric-value">{loading ? '...' : metrics.total_transactions.toLocaleString()}</h3>
            <p className="metric-label">Total Transactions</p>
          </div>
          <div className="metric-trend up"><TrendingUp size={16}/> +5.1%</div>
        </div>

        <div className="metric-card glass-card">
          <div className="metric-icon danger"><AlertTriangle size={24} /></div>
          <div className="metric-data">
            <h3 className="metric-value">{metrics.suspicious_transactions.toLocaleString()}</h3>
            <p className="metric-label">Suspicious Txns</p>
          </div>
          <div className="metric-trend down header-danger">+12.4%</div>
        </div>

        <div className="metric-card glass-card">
          <div className="metric-icon danger"><ShieldAlert size={24} /></div>
          <div className="metric-data">
            <h3 className="metric-value">{metrics.high_risk_accounts.toLocaleString()}</h3>
            <p className="metric-label">High Risk Entities</p>
          </div>
          <div className="metric-trend down header-danger">+4.2%</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-main">
        {/* Left Column */}
        <div className="dashboard-sidebar">
          <div className="alerts-panel glass-card">
            <h3>Active Fraud Alerts</h3>
            <div className="alert-list">
              <div className="alert-item high-severity">
                <div className="alert-indicator"></div>
                <div className="alert-content">
                  <h4>Rapid Layering</h4>
                  <p>Account A192 → 5 hops in 10 mins</p>
                </div>
                <span className="alert-time">2m ago</span>
              </div>
              <div className="alert-item medium-severity">
                <div className="alert-indicator"></div>
                <div className="alert-content">
                  <h4>Structuring</h4>
                  <p>Account A45 → Multiple small deposits</p>
                </div>
                <span className="alert-time">15m ago</span>
              </div>
              <div className="alert-item high-severity">
                <div className="alert-indicator"></div>
                <div className="alert-content">
                  <h4>Circular Flow</h4>
                  <p>Account A85 → Closed loop detected</p>
                </div>
                <span className="alert-time">1h ago</span>
              </div>
              <button className="btn-outline w-full mt-4">View All Alerts</button>
            </div>
          </div>

          <div className="heatmap-panel glass-card mt-6">
            <h3>Branch Risk Heatmap</h3>
            <div className="heatmap-container">
              <BranchHeatMap />
            </div>
          </div>
        </div>

        {/* Right Column (Graph) */}
        <div className="dashboard-graph glass-panel">
          <div className="graph-header">
            <h3>Investigation Graph: <span className="text-primary">{account}</span></h3>
            <div className="graph-actions">
              <span className="badge danger">High Risk</span>
            </div>
          </div>
          <div className="graph-wrapper" key={account}>
             <FundGraph accountId={account} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
