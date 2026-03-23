import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Search, 
  ShieldAlert, 
  ActivitySquare, 
  FolderOpen, 
  FileText,
  Bell,
  Settings,
  Moon,
  Sun,
  Menu
} from 'lucide-react';
import './Layout.css';

const Layout = () => {
  const [theme, setTheme] = useState('dark');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const navItems = [
    { path: '/', name: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/investigations', name: 'Investigations', icon: <Search size={20} /> },
    { path: '/transactions', name: 'Transactions', icon: <ActivitySquare size={20} /> },
    { path: '/analytics', name: 'Risk Analytics', icon: <ShieldAlert size={20} /> },
    { path: '/cases', name: 'Cases', icon: <FolderOpen size={20} /> },
    { path: '/reports', name: 'Reports', icon: <FileText size={20} /> },
  ];

  const handleSearch = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      window.location.href = `/investigations?search=${e.target.value.trim()}`;
    }
  };

  const handleIconClick = (feature) => {
    alert(`${feature} feature is not available in the MVP.`);
  };

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className={`sidebar glass-panel ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo cursor-pointer" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <div className="logo-icon bg-gradient">FundFlow</div>
            {sidebarOpen && <span className="logo-text text-gradient">AI</span>}
          </div>
          <button className="mobile-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {sidebarOpen && <span className="nav-name">{item.name}</span>}
              {!sidebarOpen && <div className="nav-tooltip">{item.name}</div>}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar">IN</div>
            {sidebarOpen && (
              <div className="user-info">
                <p className="user-name">Investigator</p>
                <p className="user-role">Admin</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-wrapper">
        {/* Top Header */}
        <header className="top-header glass-card">
          <div className="search-bar">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Search account ID, tx ID, or case ID..." 
              className="glass-input"
              onKeyDown={handleSearch}
            />
          </div>
          
          <div className="header-actions">
            <button className="action-btn" onClick={toggleTheme} title="Toggle Theme">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="action-btn relative" title="Notifications" onClick={() => handleIconClick('Notifications')}>
              <Bell size={20} />
              <span className="badge warning">3</span>
            </button>
            <button className="action-btn" title="Settings" onClick={() => handleIconClick('Settings')}>
              <Settings size={20} />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="content-area">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
