import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import "./App.css";

// Import pages
import LoginPage from "./pages/Login/Login";
import RegisterPage from "./pages/Register/Register";
import PersonalityTestPage from "./pages/PersonalityTest/PersonalityTest";
import ProfilePage from "./pages/Profile/Profile";
import RoadmapPage from "./pages/Roadmap/Roadmap";
import JobReferralPortalPage from "./pages/JobReferralPortal/JobReferralPortal";
import RecommendationsPage from "./pages/Recommendations/Recommendations";

// Import components
import Navbar from "./components/Navbar/Navbar";
import Sidebar from "./components/Sidebar/Sidebar";
import TestStartPage from "./pages/PersonalityTest/TestStartPage/TestStartPage";
import Motivation from "./pages/Motivation/Motivation";
import TalkToAI from "./pages/Motivation/TalkToAI/TalkToAI";

const App = () => {
  const location = useLocation();

  // Define routes where Sidebar and Navbar should not be displayed
  const hideNavAndSidebar = ["/", "/register", "/test", "/start-test"].includes(
    location.pathname
  );

  return (
    <div className="app-container">
      {!hideNavAndSidebar && <Sidebar />}
      <div className="main-content">
        {!hideNavAndSidebar && <Navbar />}
        <div className="page-content">
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/start-test" element={<TestStartPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/test" element={<PersonalityTestPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/referrals" element={<JobReferralPortalPage />} />
            <Route path="/recommendations" element={<RecommendationsPage />} />
            <Route path="/motivation" element={<Motivation />} />
            <Route path="/talk-to-ai" element={<TalkToAI />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default App;
