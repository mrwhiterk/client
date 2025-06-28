import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'https://saunie-tours-api-3aa870356899.herokuapp.com/api';

function SeatManagement() {
  const [trips, setTrips] = useState([]);
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [seatMap, setSeatMap] = useState([]);
  const [patrons, setPatrons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    patronId: '',
    seatNumber: null
  });
  const [selectedSeat, setSelectedSeat] = useState(null);

  useEffect(() => {
    fetchTrips();
    fetchPatrons();
  }, []);

  useEffect(() => {
    if (selectedTrip) {
      fetchSeatMap(selectedTrip._id);
    }
  }, [selectedTrip]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/trips?limit=50`);
      const data = await response.json();
      
      if (response.ok) {
        setTrips(data.trips || []);
      } else {
        setError(data.message || 'Failed to fetch trips');
      }
    } catch (err) {
      setError('Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  };

  const fetchPatrons = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/patrons?limit=100`);
      const data = await response.json();
      
      if (response.ok) {
        setPatrons(data.patrons || []);
      }
    } catch (err) {
      console.error('Failed to fetch patrons:', err);
    }
  };

  const fetchSeatMap = async (tripId) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/trips/${tripId}/seats`);
      const data = await response.json();
      
      if (response.ok) {
        setSeatMap(data.seatMap || []);
      } else {
        setError(data.message || 'Failed to fetch seat map');
      }
    } catch (err) {
      setError('Failed to fetch seat map');
    } finally {
      setLoading(false);
    }
  };

  const handleBookSeat = async (e) => {
    e.preventDefault();
    if (!bookingData.patronId || !bookingData.seatNumber) {
      setError('Please select both patron and seat');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/trips/${selectedTrip._id}/book`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setShowBookingForm(false);
        setBookingData({ patronId: '', seatNumber: null });
        setSelectedSeat(null);
        fetchSeatMap(selectedTrip._id);
      } else {
        setError(data.message || 'Failed to book seat');
      }
    } catch (err) {
      setError('Failed to book seat');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (seatNumber) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/trips/${selectedTrip._id}/book/${seatNumber}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchSeatMap(selectedTrip._id);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to cancel booking');
      }
    } catch (err) {
      setError('Failed to cancel booking');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seatNumber) => {
    const seat = seatMap.find(s => s.seatNumber === seatNumber);
    if (!seat.isBooked) {
      setSelectedSeat(seatNumber);
      setBookingData({ ...bookingData, seatNumber });
      setShowBookingForm(true);
    }
  };

  const renderSeat = (seat) => {
    const isSelected = selectedSeat === seat.seatNumber;
    const isBooked = seat.isBooked;
    
    return (
      <div
        key={seat.seatNumber}
        onClick={() => handleSeatClick(seat.seatNumber)}
        style={{
          width: 60,
          height: 60,
          border: isSelected ? '3px solid #2563eb' : '2px solid #d1d5db',
          borderRadius: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: isBooked ? 'default' : 'pointer',
          background: isBooked ? '#f3f4f6' : (isSelected ? '#dbeafe' : 'white'),
          color: isBooked ? '#6b7280' : '#374151',
          fontWeight: 600,
          fontSize: 14,
          position: 'relative',
          margin: 4
        }}
      >
        <div>{seat.seatNumber}</div>
        {isBooked && (
          <div style={{ fontSize: 10, textAlign: 'center', color: '#6b7280' }}>
            {seat.patron?.name?.split(' ')[0] || 'Booked'}
          </div>
        )}
      </div>
    );
  };

  const renderSeatMap = () => {
    if (!selectedTrip) return null;

    const seatsPerRow = 4;
    const rows = Math.ceil(selectedTrip.busCapacity / seatsPerRow);
    
    return (
      <div style={{ marginTop: 20 }}>
        <h3>Seat Map - {selectedTrip.destination}</h3>
        <div style={{ marginBottom: 16, color: '#6b7280' }}>
          {selectedTrip.date} at {selectedTrip.time} | ${selectedTrip.price}
        </div>
        
        <div style={{ 
          background: '#f9fafb', 
          padding: 20, 
          borderRadius: 8,
          border: '1px solid #e5e7eb'
        }}>
          {/* Driver area */}
          <div style={{ 
            textAlign: 'center', 
            marginBottom: 20, 
            padding: 10,
            background: '#e5e7eb',
            borderRadius: 6,
            color: '#374151',
            fontWeight: 500
          }}>
            🚌 Driver Area
          </div>
          
          {/* Seats */}
          {Array.from({ length: rows }, (_, rowIndex) => (
            <div key={rowIndex} style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 8,
              marginBottom: 8
            }}>
              {Array.from({ length: seatsPerRow }, (_, colIndex) => {
                const seatNumber = rowIndex * seatsPerRow + colIndex + 1;
                if (seatNumber > selectedTrip.busCapacity) return null;
                
                const seat = seatMap.find(s => s.seatNumber === seatNumber) || {
                  seatNumber,
                  isBooked: false
                };
                
                return renderSeat(seat);
              })}
            </div>
          ))}
          
          {/* Legend */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 20, 
            marginTop: 20,
            fontSize: 14
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ 
                width: 20, 
                height: 20, 
                background: 'white', 
                border: '2px solid #d1d5db',
                borderRadius: 4
              }}></div>
              Available
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ 
                width: 20, 
                height: 20, 
                background: '#f3f4f6', 
                border: '2px solid #d1d5db',
                borderRadius: 4
              }}></div>
              Booked
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ 
                width: 20, 
                height: 20, 
                background: '#dbeafe', 
                border: '3px solid #2563eb',
                borderRadius: 4
              }}></div>
              Selected
            </div>
          </div>
        </div>
        
        {/* Booking summary */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginTop: 20,
          padding: 16,
          background: 'white',
          borderRadius: 8,
          border: '1px solid #e5e7eb'
        }}>
          <div>
            <strong>Available Seats:</strong> {selectedTrip.busCapacity - seatMap.filter(s => s.isBooked).length}
          </div>
          <div>
            <strong>Total Revenue:</strong> ${(seatMap.filter(s => s.isBooked).length * selectedTrip.price).toFixed(2)}
          </div>
          <div>
            <strong>Booking Percentage:</strong> {Math.round((seatMap.filter(s => s.isBooked).length / selectedTrip.busCapacity) * 100)}%
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>Seat Management</h2>

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

      {/* Trip Selection */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', marginBottom: 8, fontWeight: 500 }}>
          Select a Trip:
        </label>
        <select
          value={selectedTrip?._id || ''}
          onChange={(e) => {
            const trip = trips.find(t => t._id === e.target.value);
            setSelectedTrip(trip);
          }}
          style={{ 
            width: '100%', 
            padding: 12, 
            border: '1px solid #d1d5db', 
            borderRadius: 6,
            fontSize: 16
          }}
        >
          <option value="">Choose a trip...</option>
          {trips.map(trip => (
            <option key={trip._id} value={trip._id}>
              {trip.destination} - {new Date(trip.date).toLocaleDateString()} at {trip.time} 
              ({trip.bookings?.length || 0}/{trip.busCapacity} seats)
            </option>
          ))}
        </select>
      </div>

      {selectedTrip && renderSeatMap()}

      {/* Booking Form */}
      {showBookingForm && (
        <div style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ 
            background: 'white', 
            borderRadius: 8, 
            padding: 24, 
            maxWidth: 400,
            width: '90%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <h3 style={{ marginTop: 0, marginBottom: 20 }}>
              Book Seat {bookingData.seatNumber}
            </h3>
            
            <form onSubmit={handleBookSeat}>
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>
                  Select Patron *
                </label>
                <select
                  value={bookingData.patronId}
                  onChange={(e) => setBookingData({...bookingData, patronId: e.target.value})}
                  required
                  style={{ 
                    width: '100%', 
                    padding: 8, 
                    border: '1px solid #d1d5db', 
                    borderRadius: 4 
                  }}
                >
                  <option value="">Choose a patron...</option>
                  {patrons.map(patron => (
                    <option key={patron._id} value={patron._id}>
                      {patron.name} - {patron.phone}
                    </option>
                  ))}
                </select>
              </div>
              
              <div style={{ marginBottom: 20 }}>
                <strong>Seat:</strong> {bookingData.seatNumber}<br />
                <strong>Price:</strong> ${selectedTrip?.price}
              </div>
              
              <div style={{ display: 'flex', gap: 12 }}>
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
                  {loading ? 'Booking...' : 'Confirm Booking'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowBookingForm(false);
                    setBookingData({ patronId: '', seatNumber: null });
                    setSelectedSeat(null);
                  }}
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
        </div>
      )}

      {/* Bookings List */}
      {selectedTrip && seatMap.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3>Current Bookings</h3>
          <div style={{ background: 'white', borderRadius: 8, overflow: 'hidden' }}>
            {seatMap.filter(seat => seat.isBooked).length === 0 ? (
              <div style={{ padding: 20, textAlign: 'center', color: '#6b7280' }}>
                No bookings yet.
              </div>
            ) : (
              seatMap
                .filter(seat => seat.isBooked)
                .sort((a, b) => a.seatNumber - b.seatNumber)
                .map(seat => (
                  <div key={seat.seatNumber} style={{ 
                    borderBottom: '1px solid #e5e7eb', 
                    padding: 16,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: 600 }}>
                        Seat {seat.seatNumber} - {seat.patron?.name}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: 14 }}>
                        📞 {seat.patron?.phone}
                        {seat.patron?.address && ` | 📍 ${seat.patron.address}`}
                      </div>
                      <div style={{ color: '#6b7280', fontSize: 12 }}>
                        Booked on {new Date(seat.bookingDate).toLocaleDateString()}
                      </div>
                    </div>
                    <button
                      onClick={() => handleCancelBooking(seat.seatNumber)}
                      style={{
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: 4,
                        padding: '8px 16px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SeatManagement; 