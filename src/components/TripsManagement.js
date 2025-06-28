import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5001/api';

function TripsManagement() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [formData, setFormData] = useState({
    destination: '',
    date: '',
    time: '',
    busCapacity: 45,
    price: '',
    departureLocation: '',
    returnTime: '',
    description: '',
    driver: { name: '', phone: '', license: '' },
    bus: { number: '', model: '', capacity: 45 }
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTrips();
  }, [currentPage, searchTerm]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm })
      });
      
      const response = await fetch(`${API_BASE_URL}/trips?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setTrips(data.trips || []);
        setTotalPages(data.totalPages || 1);
      } else {
        setError(data.message || 'Failed to fetch trips');
      }
    } catch (err) {
      setError('Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const url = editingTrip 
        ? `${API_BASE_URL}/trips/${editingTrip._id}`
        : `${API_BASE_URL}/trips`;
      
      const method = editingTrip ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setShowForm(false);
        setEditingTrip(null);
        resetForm();
        fetchTrips();
      } else {
        setError(data.message || 'Failed to save trip');
      }
    } catch (err) {
      setError('Failed to save trip');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (trip) => {
    setEditingTrip(trip);
    setFormData({
      destination: trip.destination,
      date: trip.date.split('T')[0],
      time: trip.time,
      busCapacity: trip.busCapacity,
      price: trip.price,
      departureLocation: trip.departureLocation,
      returnTime: trip.returnTime || '',
      description: trip.description || '',
      driver: trip.driver || { name: '', phone: '', license: '' },
      bus: trip.bus || { number: '', model: '', capacity: trip.busCapacity }
    });
    setShowForm(true);
  };

  const handleDelete = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/trips/${tripId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchTrips();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete trip');
      }
    } catch (err) {
      setError('Failed to delete trip');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      destination: '',
      date: '',
      time: '',
      busCapacity: 45,
      price: '',
      departureLocation: '',
      returnTime: '',
      description: '',
      driver: { name: '', phone: '', license: '' },
      bus: { number: '', model: '', capacity: 45 }
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTrip(null);
    resetForm();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Trips Management</h2>
        <button
          onClick={() => setShowForm(true)}
          style={{
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: 6,
            padding: '12px 24px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
          + Add New Trip
        </button>
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

      {showForm && (
        <div style={{ 
          background: 'white', 
          borderRadius: 8, 
          padding: 24, 
          marginBottom: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, marginBottom: 20 }}>
            {editingTrip ? 'Edit Trip' : 'Add New Trip'}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Destination *</label>
                <input
                  type="text"
                  value={formData.destination}
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                  required
                  style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 4 }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                  style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 4 }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Time *</label>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({...formData, time: e.target.value})}
                  required
                  style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 4 }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Return Time</label>
                <input
                  type="time"
                  value={formData.returnTime}
                  onChange={(e) => setFormData({...formData, returnTime: e.target.value})}
                  style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 4 }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Bus Capacity *</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={formData.busCapacity}
                  onChange={(e) => setFormData({...formData, busCapacity: parseInt(e.target.value)})}
                  required
                  style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 4 }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Price *</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                  required
                  style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 4 }}
                />
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Departure Location *</label>
                <input
                  type="text"
                  value={formData.departureLocation}
                  onChange={(e) => setFormData({...formData, departureLocation: e.target.value})}
                  required
                  style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 4 }}
                />
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                  style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 4 }}
                />
              </div>
            </div>
            
            <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  padding: '12px 24px',
                  fontWeight: 500,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Saving...' : (editingTrip ? 'Update Trip' : 'Create Trip')}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  padding: '12px 24px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search trips by destination or departure location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ 
            width: '100%', 
            padding: 12, 
            border: '1px solid #d1d5db', 
            borderRadius: 6,
            fontSize: 16
          }}
        />
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40 }}>Loading trips...</div>
      ) : trips.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
          No trips found.
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: 8, overflow: 'hidden' }}>
          {trips.map(trip => (
            <div key={trip._id} style={{ 
              borderBottom: '1px solid #e5e7eb', 
              padding: 20,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>
                  {trip.destination}
                </div>
                <div style={{ color: '#6b7280', marginBottom: 4 }}>
                  {new Date(trip.date).toLocaleDateString()} at {trip.time}
                  {trip.returnTime && ` - Return: ${trip.returnTime}`}
                </div>
                <div style={{ color: '#6b7280', marginBottom: 4 }}>
                  From: {trip.departureLocation} | ${trip.price} | {trip.bookings?.length || 0}/{trip.busCapacity} seats
                </div>
                {trip.description && (
                  <div style={{ color: '#6b7280', fontSize: 14 }}>
                    {trip.description}
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => handleEdit(trip)}
                  style={{
                    background: '#059669',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    padding: '8px 16px',
                    cursor: 'pointer'
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(trip._id)}
                  style={{
                    background: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: 4,
                    padding: '8px 16px',
                    cursor: 'pointer'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            style={{
              background: currentPage === 1 ? '#e5e7eb' : '#2563eb',
              color: currentPage === 1 ? '#9ca3af' : 'white',
              border: 'none',
              borderRadius: 4,
              padding: '8px 16px',
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          <span style={{ padding: '8px 16px' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            style={{
              background: currentPage === totalPages ? '#e5e7eb' : '#2563eb',
              color: currentPage === totalPages ? '#9ca3af' : 'white',
              border: 'none',
              borderRadius: 4,
              padding: '8px 16px',
              cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default TripsManagement; 