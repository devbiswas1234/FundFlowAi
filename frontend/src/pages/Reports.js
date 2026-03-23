import React, { useState, useEffect } from "react";
import { Download, FileText, CheckCircle } from 'lucide-react';
import './Pages.css';
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000';


function Reports() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/cases`)
      .then(res => res.json())
      .then(data => {
        setCases(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="text-gradient">Report Generation</h1>
          <p className="text-subtitle">Export official PDF investigation summaries.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
        <div className="flex items-center gap-3 mb-6 border-b pb-4" style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'24px', borderBottom:'1px solid var(--glass-border)', paddingBottom:'16px'}}>
           <div className="p-3 bg-primary/20 rounded-lg text-primary" style={{padding:'12px', background:'rgba(88,166,255,0.1)', borderRadius:'8px', color:'var(--primary-color)'}}>
              <FileText size={28} />
           </div>
           <div>
              <h2 className="m-0 text-xl font-semibold text-white" style={{margin:0, fontSize:'20px', fontWeight:600, color:'white'}}>Available Case Reports</h2>
              <p className="m-0 text-sm text-secondary mt-1" style={{margin:0, fontSize:'14px', color:'var(--text-secondary)', marginTop:'4px'}}>Select a case to download its comprehensive PDF dossier.</p>
           </div>
        </div>

        {loading ? (
          <div className="text-center py-10 text-secondary">Loading available reports...</div>
        ) : (
          <div className="flex flex-col gap-3" style={{display:'flex', flexDirection:'column', gap:'12px'}}>
            {cases.map(c => (
              <div key={c.id} className="glass-card hover:bg-white/5 transition-colors flex justify-between items-center p-4" style={{padding:'16px', display:'flex', justifyContent:'space-between', alignItems:'center', background:'var(--glass-bg)', transition:'background 0.2s', ':hover': {background: 'rgba(255,255,255,0.05)'}}}>
                <div style={{display:'flex', alignItems:'center', gap:'16px'}}>
                  <div style={{width:'40px', height:'40px', borderRadius:'50%', background:'rgba(255,255,255,0.05)', display:'flex', alignItems:'center', justifyContent:'center'}}>
                    <CheckCircle size={20} className={c.status === 'closed' ? 'text-success' : 'text-warning'} style={{color: c.status === 'closed' ? 'var(--success-color)' : 'var(--warning-color)'}}/>
                  </div>
                  <div>
                    <h3 className="m-0 text-base" style={{margin:0, fontSize:'16px'}}>Investigation: {c.id}</h3>
                    <p className="m-0 text-sm text-secondary" style={{margin:0, fontSize:'14px', color:'var(--text-secondary)'}}>Entity {c.accountId} • Risk Score: {c.riskScore}</p>
                  </div>
                </div>
                
                <a 
                  href={`${API_BASE_URL}/report/${c.id}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{textDecoration: 'none'}}
                >
                  <button className="btn-primary" style={{padding:'8px 16px', fontSize:'14px'}}>
                    <Download size={16}/> Download PDF
                  </button>
                </a>
              </div>
            ))}
            
            {cases.length === 0 && (
              <div className="text-center py-8 bg-black/20 rounded-lg text-secondary" style={{textAlign:'center', padding:'32px', background:'rgba(0,0,0,0.2)', borderRadius:'8px', color:'var(--text-secondary)'}}>
                No cases available for export.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Reports;
