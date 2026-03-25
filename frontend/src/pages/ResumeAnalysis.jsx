import { useState, useContext } from 'react'
import { resumeAPI } from '../api/endpoints'
import { AppContext } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'
import LoadingSpinner from '../components/LoadingSpinner'
import Toast from '../components/Toast'
import './ResumeAnalysis.css'

function Resume() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)
  const { setAnalysisData, setRecentUpload } = useContext(AppContext)
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile)
      setToast(null)
    } else {
      setFile(null)
      setToast({ message: 'Please select a PDF file', type: 'error' })
    }
  }

  const handleAnalyze = async (e) => {
    e.preventDefault()
    if (!file) {
      setToast({ message: 'Please select a resume PDF', type: 'error' })
      return
    }

    setLoading(true)
    setToast(null)
    try {
      const response = await resumeAPI.analyze(file)
      setAnalysisData(response.data)
      setRecentUpload(file.name)
      setToast({ message: 'Resume analyzed successfully! Redirecting…', type: 'success' })
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      console.error(err.response?.data)
      setToast({
        message: err.response?.data?.detail || 'Failed to analyze resume',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="resume-page">
      <div className="upload-section">
        <h1>Resume Upload</h1>
        <p>Upload your PDF resume to get AI-powered analysis</p>

        <form onSubmit={handleAnalyze} className="upload-form">
          <div className="file-input-wrapper">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="file-input"
            />
            <div className="file-display">
              {file ? (
                <>
                  <span className="file-icon">📄</span>
                  <span className="file-name">{file.name}</span>
                </>
              ) : (
                <>
                  <span className="file-icon">📎</span>
                  <span className="file-text">Click to select PDF resume</span>
                </>
              )}
            </div>
          </div>

          <button type="submit" className="analyze-btn" disabled={!file}>
            Analyze Resume
          </button>
        </form>

        {toast && (
          <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
        )}
      </div>
    </div>
  )
}

export default Resume
