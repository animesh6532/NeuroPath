import React, { createContext, useState, useEffect, useCallback } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [analysisData, setAnalysisData] = useState(null);
  const [recentUpload, setRecentUpload] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('analysisData');
    const storedFile = localStorage.getItem('recentUpload');
    if (storedData) {
      try {
        setAnalysisData(JSON.parse(storedData));
      } catch (err) {
        console.warn('Could not parse analysisData from localStorage', err);
      }
    }
    if (storedFile) {
      setRecentUpload(storedFile);
    }
  }, []);

  useEffect(() => {
    if (analysisData) {
      localStorage.setItem('analysisData', JSON.stringify(analysisData));
    } else {
      localStorage.removeItem('analysisData');
    }
  }, [analysisData]);

  useEffect(() => {
    if (recentUpload) {
      localStorage.setItem('recentUpload', recentUpload);
    } else {
      localStorage.removeItem('recentUpload');
    }
  }, [recentUpload]);

  const clearAnalysisData = useCallback(() => {
    setAnalysisData(null);
    setRecentUpload(null);
    localStorage.removeItem('analysisData');
    localStorage.removeItem('recentUpload');
  }, []);

  return (
    <AppContext.Provider
      value={{
        analysisData,
        setAnalysisData,
        recentUpload,
        setRecentUpload,
        loading,
        setLoading,
        clearAnalysisData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
