import React, { useState, useEffect } from "react";
import { Filter, Download, Search, AlertCircle, ArrowRightLeft } from 'lucide-react';
import './Pages.css';
const API_BASE_URL = process.env.REACT_APP_API_URL || `${API_BASE_URL}`;


function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(`${API_BASE_URL}/transactions?limit=100`)
      .then(res => res.json())
      .then(data => {
        setTransactions(data);
        setLoading(false);
      });
  }, []);

  const filteredTxs = transactions.filter(tx => 
    (tx.id && tx.id.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (tx.source && tx.source.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (tx.destination && tx.destination.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="text-gradient">Transaction Ledger</h1>
          <p className="text-subtitle">Comprehensive record of all network transfers.</p>
        </div>
        
        <div className="header-actions">
          <div className="search-bar" style={{ width: '300px' }}>
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Filter by Tx ID or Account..." 
              className="glass-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="btn-outline"><Filter size={18}/> Filters</button>
          <button className="btn-primary"><Download size={18}/> Export CSV</button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '0', overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th><AlertCircle size={14}/></th>
              <th>Transaction ID</th>
              <th>Date & Time</th>
              <th>Source</th>
              <th></th>
              <th>Destination</th>
              <th>Amount (₹)</th>
              <th>Channel</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" className="text-center py-4">Loading transactions...</td></tr>
            ) : filteredTxs.map((tx, idx) => (
              <tr key={tx.id || idx}>
                <td>
                  {/* Simulate alert state based on amount for UI purposes */}
                  {tx.amount > 85000 ? <div className="indicator danger"></div> : 
                   tx.amount > 50000 ? <div className="indicator warning"></div> : 
                   <div className="indicator success"></div>}
                </td>
                <td className="font-mono">{tx.id}</td>
                <td className="text-secondary">{new Date(tx.timestamp).toLocaleString()}</td>
                <td><span className="badge-outline">{tx.source}</span></td>
                <td className="text-secondary"><ArrowRightLeft size={14}/></td>
                <td><span className="badge-outline">{tx.destination}</span></td>
                <td className="font-semibold">₹{tx.amount.toLocaleString()}</td>
                <td><span className="channel-badge">{tx.channel}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Transactions;
