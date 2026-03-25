import { useState, useEffect } from 'react'
import API from '../services/api'
import './Interview.css'

function Interview() {
  const [questions, setQuestions] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetchQuestions()
  }, [])

  const fetchQuestions = async () => {
    try {
      setLoading(true)
      const response = await API.get('/interview/questions')
      setQuestions(response.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load questions')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (e) => {
    setAnswers({
      ...answers,
      [currentIndex]: e.target.value
    })
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const handleSubmit = async () => {
    try {
      await API.post('/interview/submit', {
        answers: answers,
        questionIds: questions.map(q => q.id)
      })
      setSubmitted(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit answers')
    }
  }

  if (loading) return <div className="interview loading">Loading interview...</div>
  if (error) return <div className="interview error">{error}</div>
  if (submitted) return <div className="interview success">Thank you! Your answers have been submitted.</div>
  if (!questions.length) return <div className="interview">No questions available</div>

  const currentQuestion = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100

  return (
    <div className="interview">
      <div className="interview-header">
        <h1>Interview Session</h1>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="progress-text">Question {currentIndex + 1} of {questions.length}</p>
      </div>

      <div className="interview-content">
        <div className="question-box">
          <h2>{currentQuestion.question}</h2>
          <textarea
            value={answers[currentIndex] || ''}
            onChange={handleAnswerChange}
            placeholder="Type your answer here..."
            rows="8"
            className="answer-input"
          />
        </div>

        <div className="interview-controls">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="btn btn-secondary"
          >
            Previous
          </button>

          <div className="button-spacer" />

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="btn btn-primary"
            >
              Submit Interview
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="btn btn-primary"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Interview
