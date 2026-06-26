import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, BarChart2, LogOut, Music } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Sidebar: React.FC = () => {
  const { logout, user } = useAuth();

  return (
    <div style={{
      width: '260px',
      background: 'rgba(25, 28, 41, 0.5)',
      backdropFilter: 'blur(10px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 0',
      zIndex: 10
    }}>
      <div style={{ padding: '0 24px', marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Music color="#ff4b82" size={32} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, background: 'var(--gradient-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Moodify
        </h2>
      </div>

      <div style={{ padding: '0 24px', marginBottom: '24px' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Menu</p>
      </div>

      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', padding: '0 12px' }}>
        <NavLink to="/" style={({ isActive }) => ({
          display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', borderRadius: '12px',
          color: isActive ? '#fff' : 'var(--text-secondary)',
          background: isActive ? 'var(--bg-glass-hover)' : 'transparent',
          textDecoration: 'none',
          fontWeight: isActive ? 600 : 400,
          transition: 'all 0.2s'
        })}>
          <Home size={20} /> Dashboard
        </NavLink>
        <NavLink to="/analytics" style={({ isActive }) => ({
          display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px', borderRadius: '12px',
          color: isActive ? '#fff' : 'var(--text-secondary)',
          background: isActive ? 'var(--bg-glass-hover)' : 'transparent',
          textDecoration: 'none',
          fontWeight: isActive ? 600 : 400,
          transition: 'all 0.2s'
        })}>
          <BarChart2 size={20} /> Analytics
        </NavLink>
      </nav>

      <div style={{ padding: '24px', marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--gradient-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <p style={{ fontWeight: 600, fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.name}</p>
          </div>
        </div>
        <button onClick={logout} className="btn btn-glass" style={{ width: '100%' }}>
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
