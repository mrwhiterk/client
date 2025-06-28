import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5001/api';

function Dashboard({ onNavigateToSeats }) {
  const [trips, setTrips] = useState([]);
  const [patrons, setPatrons] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tripsRes, patronsRes, statsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/trips?limit=10`).then(r => r.json()),
        fetch(`${API_BASE_URL}/patrons?limit=10`).then(r => r.json()),
        fetch(`${API_BASE_URL}/trips/dashboard/stats`).then(r => r.json()).catch(() => null)
      ]);
      
      setTrips(tripsRes.trips || []);
      setPatrons(patronsRes.patrons || []);
      setDashboardStats(statsRes);
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const totalBookings = trips.reduce((sum, trip) => sum + (trip.bookings ? trip.bookings.length : 0), 0);
  const totalRevenue = trips.reduce((sum, trip) => sum + (trip.bookings ? trip.bookings.length * trip.price : 0), 0);

  const upcomingTrips = trips.filter(trip => new Date(trip.date) > new Date()).slice(0, 5);
  const recentPatrons = patrons.slice(0, 5);

  return (
    <div>
      {/* Summary Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
        <SummaryCard 
          label="Total Trips" 
          value={loading ? '...' : trips.length} 
          color="#dbeafe" 
          textColor="#2563eb" 
          icon="📍"
        />
        <SummaryCard 
          label="Total Patrons" 
          value={loading ? '...' : patrons.length} 
          color="#d1fae5" 
          textColor="#166534" 
          icon="👥"
        />
        <SummaryCard 
          label="Total Bookings" 
          value={loading ? '...' : totalBookings} 
          color="#f3e8ff" 
          textColor="#7c3aed" 
          icon="💺"
        />
        <SummaryCard 
          label="Total Revenue" 
          value={loading ? '...' : `$${totalRevenue.toFixed(2)}`} 
          color="#fef3c7" 
          textColor="#d97706" 
          icon="💰"
        />
      </div>

      {error && (
        <div style={{ 
          background: '#fef2f2', 
          color: '#dc2626', 
          padding: 12, 
          borderRadius: 6, 
          marginBottom: 16,
          border: '1px solid #fecaca'
        }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Upcoming Trips */}
        <div style={{ background: 'white', borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.03)', padding: 24 }}>
          <h5 style={{ fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span role="img" aria-label="upcoming">📅</span>
            Upcoming Trips
          </h5>
          {loading ? (
            <div>Loading...</div>
          ) : upcomingTrips.length === 0 ? (
            <div style={{ color: '#6b7280', textAlign: 'center', padding: 20 }}>
              No upcoming trips scheduled.
            </div>
          ) : (
            upcomingTrips.map(trip => (
              <div key={trip._id} style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: 8, 
                padding: 16, 
                marginBottom: 16, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{trip.destination}</div>
                  <div style={{ fontSize: 14, color: '#555' }}>
                    {new Date(trip.date).toLocaleDateString()} at {trip.time} | ${trip.price}
                  </div>
                  <div style={{ fontSize: 14, color: '#6b7280' }}>
                    {trip.bookings ? trip.bookings.length : 0} of {trip.busCapacity} seats booked
                    <span style={{ 
                      marginLeft: 8, 
                      padding: '2px 6px', 
                      background: '#f3f4f6', 
                      borderRadius: 4,
                      fontSize: 12
                    }}>
                      {Math.round(((trip.bookings ? trip.bookings.length : 0) / trip.busCapacity) * 100)}%
                    </span>
                  </div>
                </div>
                <button 
                  onClick={onNavigateToSeats}
                  style={{ 
                    background: '#2563eb', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: 6, 
                    padding: '8px 16px', 
                    fontWeight: 500, 
                    cursor: 'pointer' 
                  }}
                >
                  Manage Seats
                </button>
              </div>
            ))
          )}
        </div>

        {/* Recent Patrons */}
        <div style={{ background: 'white', borderRadius: 8, boxShadow: '0 1px 2px rgba(0,0,0,0.03)', padding: 24 }}>
          <h5 style={{ fontWeight: 600, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span role="img" aria-label="recent">👥</span>
            Recent Patrons
          </h5>
          {loading ? (
            <div>Loading...</div>
          ) : recentPatrons.length === 0 ? (
            <div style={{ color: '#6b7280', textAlign: 'center', padding: 20 }}>
              No patrons registered yet.
            </div>
          ) : (
            recentPatrons.map(patron => (
              <div key={patron._id} style={{ 
                border: '1px solid #e5e7eb', 
                borderRadius: 8, 
                padding: 16, 
                marginBottom: 16 
              }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{patron.name}</div>
                <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 2 }}>
                  📞 {patron.phone}
                </div>
                {patron.email && (
                  <div style={{ fontSize: 14, color: '#6b7280', marginBottom: 2 }}>
                    📧 {patron.email}
                  </div>
                )}
                {patron.address && (
                  <div style={{ fontSize: 14, color: '#6b7280' }}>
                    📍 {patron.address}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {dashboardStats && (
        <div style={{ marginTop: 32 }}>
          <h5 style={{ fontWeight: 600, marginBottom: 20 }}>Quick Statistics</h5>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: 16 
          }}>
            <div style={{ 
              background: 'white', 
              padding: 16, 
              borderRadius: 8, 
              border: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#2563eb' }}>
                {dashboardStats.upcomingTrips || 0}
              </div>
              <div style={{ fontSize: 14, color: '#6b7280' }}>Upcoming Trips</div>
            </div>
            <div style={{ 
              background: 'white', 
              padding: 16, 
              borderRadius: 8, 
              border: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#059669' }}>
                {dashboardStats.completedTrips || 0}
              </div>
              <div style={{ fontSize: 14, color: '#6b7280' }}>Completed Trips</div>
            </div>
            <div style={{ 
              background: 'white', 
              padding: 16, 
              borderRadius: 8, 
              border: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#7c3aed' }}>
                ${(dashboardStats.totalRevenue || 0).toFixed(2)}
              </div>
              <div style={{ fontSize: 14, color: '#6b7280' }}>Total Revenue</div>
            </div>
            <div style={{ 
              background: 'white', 
              padding: 16, 
              borderRadius: 8, 
              border: '1px solid #e5e7eb',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#d97706' }}>
                {dashboardStats.totalBookings || 0}
              </div>
              <div style={{ fontSize: 14, color: '#6b7280' }}>Total Bookings</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, color, textColor, icon }) {
  return (
    <div style={{ background: color, borderRadius: 10, padding: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
        <div style={{ fontWeight: 600, color: textColor, fontSize: 18 }}>{label}</div>
      </div>
      <div style={{ fontWeight: 700, color: textColor, fontSize: 32 }}>{value}</div>
    </div>
  );
}

export default Dashboard; 