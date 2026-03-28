import { createContext, useEffect, useState } from "react";

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [analysisData, setAnalysisData] = useState(() => {
    const saved = localStorage.getItem("analysisData");
    return saved ? JSON.parse(saved) : null;
  });

  const [dashboardData, setDashboardData] = useState(() => {
    const saved = localStorage.getItem("dashboardData");
    return saved ? JSON.parse(saved) : null;
  });

  const [interviewData, setInterviewData] = useState(() => {
    const saved = localStorage.getItem("interviewData");
    return saved ? JSON.parse(saved) : null;
  });

  const [placementData, setPlacementData] = useState(() => {
    const saved = localStorage.getItem("placementData");
    return saved ? JSON.parse(saved) : null;
  });

  const [roadmapData, setRoadmapData] = useState(() => {
    const saved = localStorage.getItem("roadmapData");
    return saved ? JSON.parse(saved) : null;
  });

  const [recentUpload, setRecentUpload] = useState(
    localStorage.getItem("recentUpload") || null
  );

  useEffect(() => {
    localStorage.setItem("analysisData", JSON.stringify(analysisData));
  }, [analysisData]);

  useEffect(() => {
    localStorage.setItem("dashboardData", JSON.stringify(dashboardData));
  }, [dashboardData]);

  useEffect(() => {
    localStorage.setItem("interviewData", JSON.stringify(interviewData));
  }, [interviewData]);

  useEffect(() => {
    localStorage.setItem("placementData", JSON.stringify(placementData));
  }, [placementData]);

  useEffect(() => {
    localStorage.setItem("roadmapData", JSON.stringify(roadmapData));
  }, [roadmapData]);

  useEffect(() => {
    if (recentUpload) {
      localStorage.setItem("recentUpload", recentUpload);
    }
  }, [recentUpload]);

  const clearAllAppData = () => {
    setAnalysisData(null);
    setDashboardData(null);
    setInterviewData(null);
    setPlacementData(null);
    setRoadmapData(null);
    setRecentUpload(null);

    localStorage.removeItem("analysisData");
    localStorage.removeItem("dashboardData");
    localStorage.removeItem("interviewData");
    localStorage.removeItem("placementData");
    localStorage.removeItem("roadmapData");
    localStorage.removeItem("recentUpload");
  };

  return (
    <AppContext.Provider
      value={{
        analysisData,
        setAnalysisData,
        dashboardData,
        setDashboardData,
        interviewData,
        setInterviewData,
        placementData,
        setPlacementData,
        roadmapData,
        setRoadmapData,
        recentUpload,
        setRecentUpload,
        clearAllAppData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};