import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import TripsManagement from './components/TripsManagement';
import PatronsManagement from './components/PatronsManagement';
import SeatManagement from './components/SeatManagement';

const TAB_DASHBOARD = 'dashboard';
const TAB_TRIPS = 'trips';
const TAB_PATRONS = 'patrons';
const TAB_SEATS = 'seats';

function App() {
  const [activeTab, setActiveTab] = useState(TAB_DASHBOARD);

  const handleNavigateToSeats = () => {
    setActiveTab(TAB_SEATS);
  };

  return (
    <div style={{ background: '#f6f8fa', minHeight: '100vh' }}>
      {/* Top Bar */}
      <div style={{ background: '#2563eb', color: 'white', padding: '24px 0 12px 0', marginBottom: 0 }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px' }}>
          <h1 style={{ fontWeight: 700, fontSize: 32, marginBottom: 4 }}>Saunie's Tours</h1>
          <div style={{ fontSize: 16, opacity: 0.9 }}>Bus Trip Management System</div>
        </div>
      </div>
      {/* Tabs */}
      <div style={{ background: 'white', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px', display: 'flex', gap: 32 }}>
          <TabButton active={activeTab === TAB_DASHBOARD} onClick={() => setActiveTab(TAB_DASHBOARD)}>
            <span role="img" aria-label="dashboard">📅</span> Dashboard
          </TabButton>
          <TabButton active={activeTab === TAB_TRIPS} onClick={() => setActiveTab(TAB_TRIPS)}>
            <span role="img" aria-label="trips">📍</span> Trips
          </TabButton>
          <TabButton active={activeTab === TAB_PATRONS} onClick={() => setActiveTab(TAB_PATRONS)}>
            <span role="img" aria-label="patrons">👥</span> Patrons
          </TabButton>
          <TabButton active={activeTab === TAB_SEATS} onClick={() => setActiveTab(TAB_SEATS)}>
            <span role="img" aria-label="seats">💺</span> Seat Management
          </TabButton>
        </div>
      </div>
      {/* Main Content */}
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 16px' }}>
        {activeTab === TAB_DASHBOARD && <Dashboard onNavigateToSeats={handleNavigateToSeats} />}
        {activeTab === TAB_TRIPS && <TripsManagement />}
        {activeTab === TAB_PATRONS && <PatronsManagement />}
        {activeTab === TAB_SEATS && <SeatManagement />}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        borderBottom: active ? '3px solid #2563eb' : '3px solid transparent',
        color: active ? '#2563eb' : '#374151',
        fontWeight: 500,
        fontSize: 16,
        padding: '18px 20px 12px 20px',
        cursor: 'pointer',
        outline: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 6,
      }}
    >
      {children}
    </button>
  );
}

export default App; 