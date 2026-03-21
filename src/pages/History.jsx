import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';

function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/history/')
      .then(res => setHistory(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = (id) => {
    if (window.confirm('Are you certain you wish to delete this report permanently?')) {
      api.delete(`/history/${id}/`)
        .then(() => setHistory(history.filter(item => item.id !== id)))
        .catch(err => console.error('Failed to delete history item:', err));
    }
  };

  const getConfidenceColor = (predictedClass) => {
    const benignClasses = ['Benign Keratosis', 'Dermatofibroma', 'Melanocytic Nevus', 'Vascular Lesion'];
    return benignClasses.includes(predictedClass) ? 'var(--success)' : 'var(--danger)';
  };

  const getImageUrl = (image) => {
    if (!image) return null;
    const cleanImage = typeof image === 'string' ? image.trim() : image;
    if (typeof cleanImage === 'string' && cleanImage.startsWith('data:')) {
      return cleanImage;
    }
    if (typeof cleanImage === 'string' && cleanImage.startsWith('http')) {
      return cleanImage;
    }
    return `http://localhost:8000${cleanImage.startsWith('/') ? '' : '/'}${cleanImage}`;
  };

  return (
    <>
      <Navbar />
      <div className="container mt-8">
        <h1 className="mb-8">Your Prediction History</h1>
        
        {loading ? (
          <p className="text-center text-secondary">Loading history...</p>
        ) : history.length === 0 ? (
          <p className="text-center text-secondary card">No predictions made yet.</p>
        ) : (
          <div className="flex" style={{ flexDirection: 'column', gap: '1rem' }}>
            {history.map((item) => (
              <div key={item.id} className="card flex items-center gap-4 py-4 history-card" style={{ position: 'relative' }}>
                <button 
                  onClick={() => handleDelete(item.id)}
                  style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.5rem' }}
                  title="Delete Report"
                  onMouseOver={(e) => e.currentTarget.style.color = 'var(--danger)'}
                  onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
                {item.image && (
                  <div>
                    <img 
                      src={getImageUrl(item.image)} 
                      alt="Thumbnail" 
                      style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '0.5rem', border: '1px solid var(--border)' }} 
                    />
                  </div>
                )}
                <div style={{ flex: 1, paddingRight: '2.5rem' }}>
                  <h3 style={{ color: getConfidenceColor(item.predicted_class) }}>{item.predicted_class}</h3>
                  <p className="text-secondary mt-2">Confidence: <strong style={{ color: 'var(--text-primary)'}}>{item.confidence.toFixed(2)}%</strong></p>
                  <p className="text-secondary"><small>{new Date(item.created_at).toLocaleString()}</small></p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default History;
