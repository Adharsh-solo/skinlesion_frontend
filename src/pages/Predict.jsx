import React, { useState, useRef } from 'react';
import Navbar from '../components/Navbar';
import api from '../api';
import html2pdf from 'html2pdf.js';

const getDiseaseInfo = (predictedClass) => {
  const info = {
    'Melanoma': {
      caution: 'Melanoma is a serious and potentially life-threatening form of skin cancer. Immediate medical evaluation by a dermatologist is highly recommended.',
      prevention: 'Avoid excessive sun exposure, always use broad-spectrum sunscreen, avoid indoor tanning, and routinely monitor skin changes using the ABCDE rule.'
    },
    'Basal Cell Carcinoma': {
      caution: 'BCC is the most common form of skin cancer. It usually grows slowly, but should be treated promptly to prevent local tissue damage.',
      prevention: 'Protect skin from UV rays, wear protective clothing, seek shade during peak sun hours, and avoid indoor tanning.'
    },
    'Actinic Keratosis': {
      caution: 'This is a precancerous skin lesion caused by chronic sun damage. Without treatment, it may develop into squamous cell carcinoma.',
      prevention: 'Strict sun protection, regular full-body skin checks, and early treatment of any new or suspicious lesions.'
    },
    'Melanocytic Nevus': {
      caution: 'Commonly known as a mole, these are usually completely benign. However, any rapid changes in size, shape, or color should be evaluated.',
      prevention: 'Regular self-examinations to catch any evolving moles and routine dermatological check-ups.'
    },
    'Benign Keratosis': {
      caution: 'A non-cancerous skin growth (such as a seborrheic keratosis). No treatment is needed unless it becomes irritated or for cosmetic reasons.',
      prevention: 'These are often age-related or genetic; exact prevention is unclear, though general sun protection is always a good practice.'
    },
    'Dermatofibroma': {
      caution: 'A common benign fibrous nodule in the skin. Completely harmless but can be surgically removed if symptomatic.',
      prevention: 'Often develops after minor trauma like a bug bite or splinter; there is no specific prevention strategy.'
    },
    'Vascular Lesion': {
      caution: 'A benign abnormality of blood vessels (e.g., cherry angiomas). Generally harmless and common in adults.',
      prevention: 'Most are genetic or age-related. No specific preventive measures are required.'
    }
  };
  return info[predictedClass] || { caution: 'Consult a healthcare provider for an accurate clinical evaluation.', prevention: 'Maintain healthy skin practices and strict sun protection.' };
};

function Predict() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (selectedFile) => {
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setResult(null);
    setError('');
  };

  const handlePredict = async () => {
    if (!file) return;

    setLoading(true);
    setError('');
    setResult(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await api.post('/predict/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Prediction failed. Ensure backend and HF API are reachable.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    if (!result || !file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Image = e.target.result;
      const userName = localStorage.getItem('user_name') || 'Guest Patient';
      const date = new Date().toLocaleString();
      const diseaseInfo = getDiseaseInfo(result.predicted_class);
      const isBenign = getStatusInfo(result.predicted_class).label === 'Benign';
      const colorIndicator = isBenign ? '#10b981' : '#ef4444';

      const htmlContent = `
        <div style="font-family: Arial, Helvetica, sans-serif; color: #1e293b; line-height: 1.6; padding: 20px 30px; background-color: #ffffff;">
          <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 20px;">
            <div>
              <h1 style="color: #0f172a; margin: 0 0 5px 0; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">Skin Lesion Detection System</h1>
              <p style="margin: 0; color: #64748b; font-size: 16px;">Automated Diagnostic Report</p>
            </div>
            <div style="text-align: right; color: #64748b; font-size: 14px;">
              <p style="margin: 0; font-weight: bold;">Date generated:</p>
              <p style="margin: 0;">${date}</p>
            </div>
          </div>

          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 20px; font-size: 18px; color: #0f172a;">
            <strong>Patient Name:</strong> ${userName}
          </div>

          <div style="display: flex; justify-content: space-between; margin-bottom: 30px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px;">
            <div style="flex: 1; padding-right: 20px;">
              <p style="margin: 0; color: #64748b; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Detected Condition</p>
              <p style="font-size: 32px; font-weight: bold; margin: 10px 0; color: #0f172a;">${result.predicted_class}</p>
              
              <div style="margin: 20px 0;">
                <p style="margin: 0; color: #64748b; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">AI Confidence Score</p>
                <div style="display: flex; align-items: baseline; margin-top: 5px;">
                  <p style="font-size: 40px; font-weight: bold; margin: 0; color: ${colorIndicator}; line-height: 1;">${result.confidence.toFixed(1)}</p>
                  <span style="font-size: 24px; color: #64748b; font-weight: bold; margin-left: 5px;">%</span>
                </div>
              </div>
              
              <p style="margin: 0; padding: 8px 16px; background-color: ${isBenign ? '#d1fae5' : '#fee2e2'}; color: ${colorIndicator}; border-radius: 4px; font-weight: bold; display: inline-block;">
                STATUS: ${getStatusInfo(result.predicted_class).label}
              </p>
            </div>
            <div style="flex: 1; text-align: center;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-weight: bold; font-size: 14px;">Uploaded Dermoscopic Image</p>
              <img src="${base64Image}" alt="Dermoscopic Image" style="max-width: 100%; max-height: 250px; border-radius: 8px; object-fit: cover; border: 1px solid #e2e8f0;" />
            </div>
          </div>

          <h2 style="color: #0f172a; margin-bottom: 15px; font-size: 22px;">Clinical Information</h2>
          <div style="background-color: ${isBenign ? '#ecfdf5' : '#fef2f2'}; border-left: 6px solid ${colorIndicator}; padding: 15px; margin-bottom: 15px; border-radius: 0 8px 8px 0; color: #1e293b;">
            <h3 style="margin: 0 0 8px 0; color: #0f172a; font-size: 18px;">Caution & Overview</h3>
            <p style="margin: 0; font-size: 15px;">${diseaseInfo.caution}</p>
          </div>
          <div style="background-color: #eff6ff; border-left: 6px solid #3b82f6; padding: 15px; margin-bottom: 30px; border-radius: 0 8px 8px 0; color: #1e293b;">
            <h3 style="margin: 0 0 8px 0; color: #0f172a; font-size: 18px;">Prevention & Recommendations</h3>
            <p style="margin: 0; font-size: 15px;">${diseaseInfo.prevention}</p>
          </div>

          <div style="margin-top: 40px; font-size: 12px; color: #64748b; border-top: 2px solid #e2e8f0; padding-top: 15px; line-height: 1.5;">
            <strong>IMPORTANT DISCLAIMER:</strong> This report is generated by an artificial intelligence model intended for educational and preliminary screening purposes only. It does not constitute a confirmed medical diagnosis and is not a substitute for professional medical advice, examination, or treatment by a licensed dermatologist or physician. Always seek the advice of a qualified healthcare provider with any questions or concerns regarding a medical condition.
          </div>
        </div>
      `;

      const opt = {
        margin:       0.3,
        filename:     `Skin_Lesion_Report_${userName.replace(/\s+/g, '_')}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
      };

      const element = document.createElement('div');
      element.innerHTML = htmlContent;
      html2pdf().set(opt).from(element).save();
    };
    reader.readAsDataURL(file);
  };

  const getStatusInfo = (predictedClass) => {
    const benignClasses = ['Benign Keratosis', 'Dermatofibroma', 'Melanocytic Nevus', 'Vascular Lesion'];
    const isBenign = benignClasses.includes(predictedClass);
    return {
      color: isBenign ? '#10b981' : '#ef4444',
      glow: isBenign ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
      label: isBenign ? 'Benign' : 'Attention Required',
      icon: isBenign ? '✓' : '⚠️',
    };
  };

  return (
    <>
      <Navbar />
      <div className="container mt-8" style={{ paddingBottom: '4rem' }}>
        <h1 className="text-center mb-6" style={{ fontSize: '2.5rem', background: 'linear-gradient(90deg, #f8fafc, var(--accent))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1.25 }}>
          Skin Lesion<br className="mobile-only" /> Analysis
        </h1>

        <div className="flex gap-4 responsive-flex" style={{ alignItems: 'flex-start' }}>
          {/* UPLOAD SECTION (Left) */}
          <div className="card" style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <p className="text-secondary text-sm mb-6" style={{ padding: '1rem', backgroundColor: 'var(--card-bg)', borderLeft: '4px solid var(--danger)', borderRadius: '0.25rem', margin: '0 0 1.5rem 0' }}>
              For accurate results, please ensure the image is a clear, closely cropped <b>dermoscopic</b> photograph.
            </p>

            {!preview ? (
              <div
                className={`drop-zone ${dragActive ? 'active' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current.click()}
              >
                <div style={{ pointerEvents: 'none' }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 1rem', display: 'block' }}>
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  <h3 style={{ marginBottom: '0.5rem' }}>Drag & Drop Image Here</h3>
                  <p className="text-secondary">or click to browse files</p>
                </div>
                <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} style={{ display: 'none' }} />
              </div>
            ) : (
              <div className="image-preview-container">
                <img src={preview} alt="Upload preview" className="preview-image" />
                {loading && <div className="scanning-overlay"></div>}

                <div className="preview-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => { setPreview(null); setFile(null); setResult(null); }}
                    disabled={loading}
                    style={{ backgroundColor: 'var(--card-bg)', border: 'none', color: 'var(--text-primary)' }}
                  >
                    Remove
                  </button>
                  <button
                    className="btn gap-4"
                    onClick={handlePredict}
                    disabled={loading}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner"></span> Analyzing...
                      </>
                    ) : (
                      <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '6px' }}><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                        Analyze Image
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {error && <p className="text-danger mt-4" style={{ fontWeight: '500' }}>{error}</p>}
          </div>

          {/* RESULT SECTION (Right) - Match Screenshot */}
          {result && (
            <div className="card bounce-in" style={{
              flex: 1, border: '1px solid var(--border)', boxShadow: `0 0 30px ${getStatusInfo(result.predicted_class).glow}`, position: 'relative', overflow: 'hidden' }}>
              
              {/* Header with checkmark */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: getStatusInfo(result.predicted_class).glow, display: 'flex', alignItems: 'center', justifyContent: 'center', color: getStatusInfo(result.predicted_class).color }}>
                  {getStatusInfo(result.predicted_class).icon === '✓' ? (
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  ) : (
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                  )}
                </div>
                <div>
                  <h2 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1.4rem' }}>Analysis Complete</h2>
                  <span style={{ color: getStatusInfo(result.predicted_class).color, fontWeight: 'bold', fontSize: '1rem' }}>{getStatusInfo(result.predicted_class).label}</span>
                </div>
              </div>

              {/* Disease Info */}
              <div>
                <p className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Detected Condition</p>
                <h3 style={{ fontSize: '2.5rem', lineHeight: '1.2', marginBottom: '2rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>
                  {result.predicted_class}
                </h3>

                <p className="text-secondary" style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}>Confidence Score</p>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '4rem', fontWeight: 'bold', lineHeight: 1, color: getStatusInfo(result.predicted_class).color }}>{result.confidence.toFixed(1)}</span>
                  <span style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>%</span>
                </div>
                
                <div className="progress-bar-bg" style={{ height: '12px', borderRadius: '6px', backgroundColor: 'rgba(255,255,255,0.05)', marginTop: '0.5rem' }}>
                  <div 
                    className="progress-bar-fill slide-right" 
                    style={{ 
                      width: `${result.confidence}% `,
                      backgroundColor: getStatusInfo(result.predicted_class).color,
                      borderRadius: '6px'
                    }}
                  ></div>
                </div>
              </div>
              
              <div style={{ marginTop: '2.5rem' }}>
                <button 
                  onClick={handleDownloadReport}
                  className="btn" 
                  style={{ width: '100%', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                  Download Report
                </button>

                <div style={{ padding: '1.25rem', backgroundColor: 'var(--bg-primary)', borderRadius: '0.5rem', borderLeft: '3px solid var(--accent)' }}>
                  <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '0.95rem' }}>Important Disclaimer</h4>
                  <p className="text-secondary" style={{ fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                    This tool uses artificial intelligence for educational and preliminary screening purposes only. 
                    It is <strong>not</strong> a substitute for professional medical advice, diagnosis, or treatment. 
                    Always seek the advice of a qualified healthcare provider.
                  </p>
                </div>
              </div>
              
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Predict;
