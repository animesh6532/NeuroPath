import { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAPI } from '../api/endpoints';
import { AppContext } from '../context/AppContext';
import LoadingSpinner from './LoadingSpinner';
import './ResumeUpload.css';

function ResumeUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const fileInputRef = useRef();
  const navigate = useNavigate();
  const { setAnalysisData, setRecentUpload } = useContext(AppContext);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];

    if (!selected) {
      setError('No file selected.');
      setFile(null);
      return;
    }

    if (selected.type !== 'application/pdf') {
      setError('Please select a PDF file only.');
      setFile(null);
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (selected.size > maxSize) {
      setError('File size must be less than 10MB.');
      setFile(null);
      return;
    }

    setFile(selected);
    setError('');
    setSuccess(false);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please choose a resume PDF first.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await resumeAPI.analyze(file);

      setAnalysisData(response.data);
      setRecentUpload(file.name);
      setSuccess(true);

      setTimeout(() => {
        navigate('/dashboard');
      }, 800);
    } catch (err) {
      const msg =
        err?.response?.data?.detail ||
        err?.response?.data?.message ||
        err?.message ||
        'Failed to analyze resume. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="resume-upload-container" style={{ position: 'relative' }}>
      <input
        type="file"
        accept=".pdf"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      <div className="upload-box" onClick={handleClick} style={{ cursor: 'pointer' }}>
        <div className="upload-preview" role="button" tabIndex={0}>
          {file ? (
            <div className="file-selected">
              <p className="upload-icon">✓</p>
              <p className="upload-text">{file.name}</p>
              <p className="file-size">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          ) : (
            <div className="file-empty">
              <p className="upload-icon">📄</p>
              <p className="upload-text">Click to select PDF resume</p>
              <p className="upload-hint">PDF files only • Max 10MB</p>
            </div>
          )}
        </div>
      </div>

      <button
        className="upload-button"
        onClick={handleAnalyze}
        disabled={loading}
        style={{ pointerEvents: 'auto', zIndex: 1 }}
      >
        {loading ? (
          <>
            <LoadingSpinner /> <span>Analyzing...</span>
          </>
        ) : (
          'Analyze Resume'
        )}
      </button>

      {error && (
        <div className="upload-error" role="alert">
          <span>⚠️</span> {error}
        </div>
      )}

      {success && (
        <div className="upload-success" role="status">
          <span>✅ Resume analyzed successfully. Redirecting...</span>
        </div>
      )}
    </div>
  );
}

export default ResumeUpload;