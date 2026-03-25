import { useState, useEffect, useRef, useContext } from 'react';
import { interviewAPI } from '../api/endpoints';
import { AppContext } from '../context/AppContext';
import './AIInterview.css';

function AIInterview() {
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const recognitionRef = useRef(null);
  const frameIntervalRef = useRef(null);

  const { analysisData } = useContext(AppContext);
  const [file, setFile] = useState(null);
  const [stage, setStage] = useState('setup');
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [listening, setListening] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isFullscreen, setFullscreen] = useState(false);
  const [cameraError, setCameraError] = useState('');

  useEffect(() => {
    if (!isFullscreen) return;

    const handleChange = () => {
      if (!document.fullscreenElement) {
        setFullscreen(false);
      }
    };
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, [isFullscreen]);

  useEffect(() => {
    if (stage !== 'interview') return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (questions[currentIndex]) {
      speakQuestion(questions[currentIndex]);
    }
  }, [stage, countdown, currentIndex, questions]);

  useEffect(() => {
    return () => {
      stopListening();
      if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
    };
  }, []);

  const speakQuestion = (text) => {
    if (!('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 1;
    msg.pitch = 1;
    msg.volume = 1;
    window.speechSynthesis.speak(msg);
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError('Camera not supported by this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});

      frameIntervalRef.current = setInterval(() => {
        sendCameraSnapshot(stream);
      }, 5000);
    } catch (err) {
      setCameraError('Camera permission denied or not available.');
    }
  };

  const sendCameraSnapshot = async (stream) => {
    if (!videoRef.current) return;

    try {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 320;
      canvas.height = videoRef.current.videoHeight || 240;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.5));
      if (!blob) return;

      const formData = new FormData();
      formData.append('frame', blob, 'frame.jpg');

      await fetch('http://127.0.0.1:8001/proctoring/analyze-events', {
        method: 'POST',
        body: formData,
      });
    } catch (e) {
      // ignore errors for optional visual analytics
    }
  };

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      try {
        await document.documentElement.requestFullscreen();
        setFullscreen(true);
      } catch (err) {
        setError('Unable to enter full-screen mode.');
      }
    } else {
      await document.exitFullscreen();
      setFullscreen(false);
    }
  };

  const startRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const text = Array.from(event.results)
        .map((result) => result[0]?.transcript || '')
        .join(' ');
      setTranscript(text);
      setAnswers((prev) => {
        const updated = [...prev];
        updated[currentIndex] = (updated[currentIndex] || '') + ' ' + text;
        return updated;
      });
    };

    recognition.onerror = () => {
      setError('Speech recognition error.');
      recognition.stop();
      setListening(false);
    };

    recognition.onend = () => setListening(false);

    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setListening(false);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setError('');
    } else {
      setError('Please select a PDF resume file.');
      setFile(null);
    }
  };

  const prepareQuestions = async () => {
    setLoading(true);
    setError('');

    try {
      let qList = [];

      if (file) {
        const res = await interviewAPI.startInterview(file);
        qList = res.data?.questions ?? [];
      }

      if (!qList.length && analysisData?.detected_skills?.length) {
        qList = analysisData.detected_skills.slice(0, 5).map((skill) => `Share a project where you applied ${skill}.`);
      }

      if (!qList.length) {
        qList = [
          'Tell me about yourself.',
          'What is your greatest professional strength?',
          'How do you handle tight deadlines?',
          'Describe a time you overcame a challenging problem.',
        ];
      }

      setQuestions(qList);
      setAnswers(Array(qList.length).fill(''));
      setCurrentIndex(0);
      setStage('interview');
      setCountdown(3);

      await startCamera();
      await toggleFullscreen();
    } catch (err) {
      setError(err?.response?.data?.detail || 'Unable to start AI interview.');
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    setTranscript('');
    stopListening();
    setCurrentIndex((prev) => Math.min(prev + 1, questions.length - 1));
    setCountdown(3);
  };

  const handlePrevious = () => {
    setTranscript('');
    stopListening();
    setCurrentIndex((prev) => Math.max(prev - 1, 0));
    setCountdown(3);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        answers: answers.map((a) => (a || '').trim()).filter(Boolean),
        skills: analysisData?.detected_skills || [],
      };
      const res = await interviewAPI.submitInterview(payload);
      setResults(res.data);
      setStage('results');
      stopListening();
      if (frameIntervalRef.current) clearInterval(frameIntervalRef.current);
      if (document.fullscreenElement) await document.exitFullscreen();
    } catch (err) {
      setError(err?.response?.data?.detail || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  const cancelInterview = async () => {
    stopListening();
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    if (document.fullscreenElement) await document.exitFullscreen();
    setStage('setup');
    setCurrentIndex(0);
    setQuestions([]);
    setAnswers([]);
  };

  if (stage === 'setup') {
    return (
      <div className="interview-page">
        <h1>AI Mock Interview</h1>
        <p>Start a guided interview session with video, voice Q&A, and AI scoring.</p>

        <div className="interview-actions">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ marginBottom: '1rem' }}
          />

          <button onClick={prepareQuestions} className="btn-primary" disabled={loading}>
            {loading ? 'Starting...' : 'Start Interview'}
          </button>

          {error && <div className="error-message">{error}</div>}
          {cameraError && <div className="error-message">{cameraError}</div>}

          <div className="interview-notice">
            {isFullscreen ? 'Full-screen mode active. Press Esc to exit at any time.' : 'Interview will go full-screen and lock navigation during the session.'}
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'interview') {
    return (
      <div className="interview-page interview-active">
        <div className="interview-header">
          <h1>Interview in Progress</h1>
          <p>Time left for this question: {countdown}s</p>
        </div>

        <div className="interview-grid">
          <div className="question-panel">
            <h2>{questions[currentIndex]}</h2>
            <p className="question-index">{currentIndex + 1}/{questions.length}</p>

            <textarea
              value={answers[currentIndex] || ''}
              onChange={(e) => {
                const updated = [...answers];
                updated[currentIndex] = e.target.value;
                setAnswers(updated);
              }}
              placeholder="Speak or type your answer here"
              rows={5}
            />

            <div className="voice-row">
              <button onClick={startRecognition} disabled={loading || listening} className="btn btn-voice">
                🎙 Start Speech Recognition
              </button>
              <button onClick={stopListening} disabled={!listening} className="btn btn-voice">
                ⏹ Stop
              </button>
              {listening && <span className="listening-indicator">Listening...</span>}
            </div>

            <p className="transcript-label">Transcript</p>
            <div className="transcript-box">{transcript || 'Transcript will appear here...'}</div>

            <div className="navigation-buttons">
              <button onClick={handlePrevious} disabled={currentIndex === 0} className="btn">
                Previous
              </button>
              {currentIndex < questions.length - 1 ? (
                <button onClick={handleNext} className="btn">
                  Next
                </button>
              ) : (
                <button onClick={handleSubmit} className="btn btn-primary" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Interview'}
                </button>
              )}
              <button onClick={cancelInterview} className="btn btn-secondary">
                Cancel
              </button>
            </div>

            {error && <div className="error-message">{error}</div>}
          </div>

          <div className="video-panel">
            <video ref={videoRef} autoPlay muted playsInline className="webcam-video" />
            <p className="video-label">Live camera feed</p>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'results') {
    return (
      <div className="interview-page">
        <h1>Interview Results</h1>
        <p>Review the feedback from your AI interview.</p>

        <div className="interview-results">
          <pre>{JSON.stringify(results, null, 2)}</pre>
          <button onClick={cancelInterview} className="btn-primary">
            Start New Interview
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default AIInterview;
