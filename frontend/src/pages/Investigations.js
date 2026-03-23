import React, { useState, useEffect } from "react";
import FundGraph from "../FundGraph";
import { Search, ShieldAlert, FileText, ChevronRight, Activity, Clock } from 'lucide-react';
import './Pages.css';
const API_BASE_URL = process.env.REACT_APP_API_URL || `${API_BASE_URL}`;


function Investigations() {
  const [accountId, setAccountId] = useState("A192");
  const [searchQuery, setSearchQuery] = useState("A192");
  const [accountData, setAccountData] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData(accountId);
  }, [accountId]);

  const fetchData = async (id) => {
    setLoading(true);
    try {
      const accRes = await fetch(`${API_BASE_URL}/account/${id}`);
      const accData = await accRes.json();
      
      if (!accData.error) {
        setAccountData(accData);
        
        const timeRes = await fetch(`${API_BASE_URL}/account/${id}/timeline`);
        const timeData = await timeRes.json();
        setTimeline(timeData);
      } else {
        setAccountData(null);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setAccountId(searchQuery.trim());
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="text-gradient">Deep Investigation</h1>
          <p className="text-subtitle">Entity profiling and fund flow tracing.</p>
        </div>
        
        <form onSubmit={handleSearch} className="search-bar" style={{ width: '400px' }}>
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            placeholder="Enter Exact Account ID (e.g., A192)" 
            className="glass-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-submit">Trace</button>
        </form>
      </div>

      {!accountData && !loading ? (
        <div className="glass-panel flex-center flex-col py-10">
           <Search size={48} className="text-secondary mb-4 opacity-50"/>
           <h3 className="text-secondary">No entity selected or entity not found.</h3>
           <p className="text-secondary text-sm">Please search for a valid Account ID to begin investigation.</p>
        </div>
      ) : (
        <div className="investigation-grid">
          {/* Left Panel: Profile & Timeline */}
          <div className="left-panel">
            {/* Profile Card */}
            <div className="glass-card profile-card mb-6">
              <div className="profile-header">
                <div className="profile-avatar">{accountId.substring(0,2)}</div>
                <div className="profile-title">
                  <h2>{accountData?.ownerName || "Unknown Entity"}</h2>
                  <span className="badge-outline">{accountId}</span>
                </div>
                <div className="profile-score danger">
                  <span className="score-val">82</span>
                  <span className="score-lbl">Risk</span>
                </div>
              </div>
              
              <div className="profile-details mt-6">
                <div className="detail-item">
                  <span className="lbl">Status</span>
                  <span className={`val ${accountData?.status === 'active' ? 'text-success' : 'text-warning'}`}>
                    {accountData?.status?.toUpperCase()}
                  </span>
                </div>
                <div className="detail-item">
                  <span className="lbl">Branch</span>
                  <span className="val">{accountData?.branch}</span>
                </div>
                <div className="detail-item">
                  <span className="lbl">Flags</span>
                  <span className="val inline-flex gap-2">
                    <span className="badge danger">Layering</span>
                  </span>
                </div>
              </div>
              
              <div className="profile-actions mt-6">
                 <button className="btn-primary w-full justify-center"><FileText size={16}/> Generate Report</button>
              </div>
            </div>

            {/* Timeline */}
            <div className="glass-card timeline-card">
              <h3 className="flex items-center gap-2 mb-4"><Clock size={18} className="text-primary"/> Recent Activity</h3>
              <div className="timeline-container">
                {timeline.map((tx, idx) => (
                  <div className="timeline-item" key={idx}>
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <div className="tx-meta">
                        <span className="tx-time">{new Date(tx.timestamp).toLocaleString()}</span>
                        <span className="tx-amt font-semibold text-danger">₹{tx.amount.toLocaleString()}</span>
                      </div>
                      <div className="tx-route text-secondary text-sm flex items-center gap-1 mt-1">
                        <span className={tx.source === accountId ? 'text-primary font-medium' : ''}>{tx.source}</span>
                        <ChevronRight size={14}/>
                        <span className={tx.destination === accountId ? 'text-primary font-medium' : ''}>{tx.destination}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {timeline.length === 0 && <p className="text-secondary">No recent transactions found.</p>}
              </div>
            </div>
          </div>

          {/* Right Panel: Network Graph */}
          <div className="glass-panel main-graph-panel">
            <div className="graph-header">
              <h3 className="flex items-center gap-2"><Activity size={18} className="text-primary"/> Network Topography</h3>
              <div className="graph-controls">
                <button className="btn-outline text-sm py-1 px-3">Expand +1 Hop</button>
                <button className="btn-outline text-sm py-1 px-3">Reset View</button>
              </div>
            </div>
            <div className="graph-render-area">
               <FundGraph accountId={accountId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Investigations;
