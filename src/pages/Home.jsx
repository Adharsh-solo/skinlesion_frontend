import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Home() {
  const userName = localStorage.getItem('user_name') || 'User';
  const [showAccuracy, setShowAccuracy] = useState(false);

  return (
    <>
      <Navbar />
      <div className="container mt-8">
        <h1 className="mb-8 text-center" style={{ fontSize: '2.5rem' }}>Welcome, {userName}!</h1>

        <div className="flex gap-4" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Card 1: Prediction */}
          <div className="card text-center flex home-card" style={{ minHeight: '320px', padding: '3rem 2rem', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
            <h2>Prediction</h2>
            <p className="text-secondary">Upload a dermoscopic image to classify skin lesions instantly with our AI.</p>
            <Link to="/predict" className="btn mt-auto">Start Prediction</Link>
          </div>

          {/* Card 2: History */}
          <div className="card text-center flex home-card" style={{ minHeight: '320px', padding: '3rem 2rem', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
            <h2>History</h2>
            <p className="text-secondary">View past predictions, review confidence scores, and access uploaded images.</p>
            <Link to="/history" className="btn btn-secondary mt-auto">View History</Link>
          </div>

          {/* Card 3: Accuracy */}
          <div className="card text-center flex home-card" style={{ minHeight: '320px', padding: '3rem 2rem', flexDirection: 'column', gap: '1.5rem', justifyContent: 'center' }}>
            <h2>Accuracy & Details</h2>
            <p className="text-secondary">Learn about our deep learning techniques and the diseases we actively detect.</p>
            <button onClick={() => setShowAccuracy(true)} className="btn btn-secondary mt-auto" style={{ backgroundColor: 'var(--bg-primary)' }}>Learn More</button>
          </div>
        </div>

        {/* Modal for Accuracy details */}
        {showAccuracy && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div className="card" style={{ maxWidth: '600px', width: '90%' }}>
              <h2 className="mb-4 text-center" style={{ color: 'var(--accent)' }}>Model Technique & Accuracy</h2>

              <div className="mb-4">
                <h3 className="mb-2">Technique Used</h3>
                <p className="text-secondary">
                  We use state-of-the-art Deep Learning models trained on large datasets of dermoscopic images.
                  These models extract intricate visual patterns to provide highly accurate classifications, enabling robust and reliable diagnosis assistance.
                </p>
              </div>

              <div>
                <h3 className="mb-2">Diseases Detected</h3>
                <ul className="text-secondary" style={{ listStylePosition: 'inside', lineHeight: '1.8' }}>
                  <li><strong>Melanoma</strong> (Cancerous)</li>
                  <li><strong>Basal Cell Carcinoma</strong> (Cancerous)</li>
                  <li><strong>Actinic Keratosis</strong> (Cancerous/Pre-Cancerous)</li>
                  <li><strong>Melanocytic Nevus</strong> (Benign)</li>
                  <li><strong>Benign Keratosis</strong> (Benign)</li>
                  <li><strong>Dermatofibroma</strong> (Benign)</li>
                  <li><strong>Vascular Lesion</strong> (Benign)</li>
                </ul>
              </div>

              <div className="mt-8 text-center">
                <button onClick={() => setShowAccuracy(false)} className="btn">Close</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
