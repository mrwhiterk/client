import React, { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'https://saunie-tours-api-3aa870356899.herokuapp.com/api';

function PatronsManagement() {
  const [patrons, setPatrons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingPatron, setEditingPatron] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    email: '',
    emergencyContact: { name: '', phone: '', relationship: '' },
    notes: ''
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchPatrons = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm })
      });
      
      const response = await fetch(`${API_BASE_URL}/patrons?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setPatrons(data.patrons || []);
        setTotalPages(data.totalPages || 1);
      } else {
        setError(data.message || 'Failed to fetch patrons');
      }
    } catch (err) {
      setError('Failed to fetch patrons');
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchPatrons();
  }, [fetchPatrons]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const url = editingPatron 
        ? `${API_BASE_URL}/patrons/${editingPatron._id}`
        : `${API_BASE_URL}/patrons`;
      
      const method = editingPatron ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setShowForm(false);
        setEditingPatron(null);
        resetForm();
        fetchPatrons();
      } else {
        setError(data.message || 'Failed to save patron');
      }
    } catch (err) {
      setError('Failed to save patron');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (patron) => {
    setEditingPatron(patron);
    setFormData({
      name: patron.name,
      phone: patron.phone,
      address: patron.address || '',
      email: patron.email || '',
      emergencyContact: patron.emergencyContact || { name: '', phone: '', relationship: '' },
      notes: patron.notes || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (patronId) => {
    if (!window.confirm('Are you sure you want to delete this patron?')) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/patrons/${patronId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchPatrons();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete patron');
      }
    } catch (err) {
      setError('Failed to delete patron');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      address: '',
      email: '',
      emergencyContact: { name: '', phone: '', relationship: '' },
      notes: ''
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPatron(null);
    resetForm();
  };

  const updateEmergencyContact = (field, value) => {
    setFormData({
      ...formData,
      emergencyContact: {
        ...formData.emergencyContact,
        [field]: value
      }
    });
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Patrons Management</h2>
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
          + Add New Patron
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
            {editingPatron ? 'Edit Patron' : 'Add New Patron'}
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 4 }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Phone *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 4 }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 4 }}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 4 }}
                />
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <h4 style={{ marginBottom: 12 }}>Emergency Contact</h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Name</label>
                    <input
                      type="text"
                      value={formData.emergencyContact.name}
                      onChange={(e) => updateEmergencyContact('name', e.target.value)}
                      style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 4 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Phone</label>
                    <input
                      type="tel"
                      value={formData.emergencyContact.phone}
                      onChange={(e) => updateEmergencyContact('phone', e.target.value)}
                      style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 4 }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Relationship</label>
                    <input
                      type="text"
                      value={formData.emergencyContact.relationship}
                      onChange={(e) => updateEmergencyContact('relationship', e.target.value)}
                      style={{ width: '100%', padding: 8, border: '1px solid #d1d5db', borderRadius: 4 }}
                    />
                  </div>
                </div>
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', marginBottom: 4, fontWeight: 500 }}>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
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
                {loading ? 'Saving...' : (editingPatron ? 'Update Patron' : 'Create Patron')}
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
          placeholder="Search patrons by name, phone, or address..."
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
        <div style={{ textAlign: 'center', padding: 40 }}>Loading patrons...</div>
      ) : patrons.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>
          No patrons found.
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: 8, overflow: 'hidden' }}>
          {patrons.map(patron => (
            <div key={patron._id} style={{ 
              borderBottom: '1px solid #e5e7eb', 
              padding: 20,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>
                  {patron.name}
                </div>
                <div style={{ color: '#6b7280', marginBottom: 4 }}>
                  📞 {patron.phone}
                  {patron.email && ` | 📧 ${patron.email}`}
                </div>
                {patron.address && (
                  <div style={{ color: '#6b7280', marginBottom: 4 }}>
                    📍 {patron.address}
                  </div>
                )}
                {patron.emergencyContact && patron.emergencyContact.name && (
                  <div style={{ color: '#6b7280', marginBottom: 4 }}>
                    🚨 Emergency: {patron.emergencyContact.name} ({patron.emergencyContact.relationship}) - {patron.emergencyContact.phone}
                  </div>
                )}
                {patron.notes && (
                  <div style={{ color: '#6b7280', fontSize: 14, fontStyle: 'italic' }}>
                    📝 {patron.notes}
                  </div>
                )}
              </div>
              
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => handleEdit(patron)}
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
                  onClick={() => handleDelete(patron._id)}
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

export default PatronsManagement; 