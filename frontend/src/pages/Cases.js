import React, { useState, useEffect } from "react";
import { FolderOpen, Edit, CheckCircle, FileText } from 'lucide-react';
import './Pages.css';
const API_BASE_URL = process.env.REACT_APP_API_URL || `${API_BASE_URL}`;


function Cases() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editNotes, setEditNotes] = useState("");
  const [editStatus, setEditStatus] = useState("");

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = () => {
    fetch(`${API_BASE_URL}/cases`)
      .then(res => res.json())
      .then(data => {
        setCases(data);
        setLoading(false);
      });
  };

  const handleEdit = (c) => {
    setEditingId(c.id);
    setEditNotes(c.investigatorNotes);
    setEditStatus(c.status);
  };

  const handleSave = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/cases/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: editStatus,
          investigatorNotes: editNotes
        })
      });
      setEditingId(null);
      fetchCases();
    } catch (e) {
      console.error("Error updating case", e);
    }
  };

  return (
    <div className="page-container fade-in">
      <div className="page-header">
        <div>
          <h1 className="text-gradient">Case Management</h1>
          <p className="text-subtitle">Track, update, and resolve ongoing investigations.</p>
        </div>
        <button className="btn-primary"><FolderOpen size={18}/> New Case</button>
      </div>

      <div className="analytics-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(450px, 1fr))' }}>
        {loading ? <div className="text-secondary mt-10">Loading cases...</div> : null}
        
        {cases.map(c => (
          <div key={c.id} className="glass-card flex flex-col gap-4">
            <div className="flex justify-between items-start border-b pb-3" style={{borderColor: 'var(--glass-border)', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px'}}>
              <div>
                <h3 className="m-0 text-lg flex items-center gap-2" style={{margin:0}}>
                  <FolderOpen size={18} className="text-primary"/> Case {c.id}
                </h3>
                <p className="text-sm text-secondary m-0 mt-1" style={{margin:'4px 0 0 0'}}>Entity: {c.accountId}</p>
              </div>
              <div className="flex flex-col items-end gap-2" style={{display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'8px'}}>
                <span className={`badge ${c.status === 'open' ? 'warning' : c.status==='closed' ? 'success' : ''}`} style={{
                    padding: '4px 8px', borderRadius: '12px', fontSize: '12px',
                    background: c.status === 'open' ? 'rgba(210, 153, 34, 0.2)' : 'rgba(88,166,255,0.2)',
                    color: c.status === 'open' ? 'var(--warning-color)' : 'var(--primary-color)'
                }}>
                  {c.status.toUpperCase()}
                </span>
                <span className="text-xs text-danger font-bold" style={{fontSize:'12px', color:'var(--danger-color)', fontWeight:'bold'}}>Risk: {c.riskScore}</span>
              </div>
            </div>

            <div className="py-2">
              <p className="text-sm font-medium mb-1" style={{fontSize:'14px', marginBottom:'4px', fontWeight:500}}>Detected Patterns:</p>
              <div className="flex flex-wrap gap-2" style={{display:'flex', flexWrap:'wrap', gap:'8px'}}>
                 {c.fraudPatterns.map(p => <span key={p} className="badge-outline">{p}</span>)}
              </div>
            </div>

            {editingId === c.id ? (
              <div className="flex flex-col gap-3 bg-black/20 p-3 rounded mt-2" style={{display:'flex',flexDirection:'column', gap:'12px', background:'rgba(0,0,0,0.2)', padding:'12px', borderRadius:'8px', marginTop:'8px'}}>
                <div>
                  <label className="text-xs text-secondary block mb-1">Status</label>
                  <select 
                    className="glass-input p-2 text-sm" 
                    value={editStatus} 
                    onChange={e => setEditStatus(e.target.value)}
                  >
                     <option value="open">Open</option>
                     <option value="investigating">Investigating</option>
                     <option value="closed">Closed</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-secondary block mb-1">Notes</label>
                  <textarea 
                    className="glass-input p-2 text-sm" 
                    rows={3} 
                    value={editNotes}
                    onChange={e => setEditNotes(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 justify-end mt-2" style={{display:'flex', gap:'8px', justifyContent:'flex-end', marginTop:'8px'}}>
                   <button className="btn-outline text-sm py-1 px-3" onClick={() => setEditingId(null)}>Cancel</button>
                   <button className="btn-primary text-sm py-1 px-3" onClick={() => handleSave(c.id)}><CheckCircle size={14}/> Save</button>
                </div>
              </div>
            ) : (
              <div className="mt-2 text-sm text-secondary bg-white/5 p-3 rounded" style={{marginTop:'8px', fontSize:'14px', color:'var(--text-secondary)', background:'rgba(255,255,255,0.05)', padding:'12px', borderRadius:'8px'}}>
                <p className="m-0 font-medium mb-1 text-primary">Investigator Notes:</p>
                <p className="m-0">{c.investigatorNotes || "No notes added yet."}</p>
              </div>
            )}

            {!editingId && (
              <div className="flex justify-between items-center mt-auto pt-4 border-t" style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'auto', paddingTop:'16px', borderTop:'1px solid var(--glass-border)'}}>
                 <a href={`${API_BASE_URL}/report/${c.id}`} target="_blank" rel="noreferrer" className="text-primary text-sm flex items-center gap-1 hover:underline" style={{color:'var(--primary-color)', fontSize:'14px', display:'flex', alignItems:'center', textDecoration:'none'}}>
                    <FileText size={16}/> View PDF Report
                 </a>
                 <button className="btn-outline py-1 px-3 text-sm flex items-center gap-2" style={{padding:'4px 12px', fontSize:'14px'}} onClick={() => handleEdit(c)}>
                   <Edit size={14}/> Update
                 </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cases;
