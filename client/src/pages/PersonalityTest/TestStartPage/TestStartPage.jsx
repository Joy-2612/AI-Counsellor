import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TestStartPage.module.css";

function TestStartPage() {
  const navigate = useNavigate();

  const handleStartTest = () => {
    navigate("/test"); // Navigate to the test route
  };

  const handleSkipTest = () => {
    navigate("/profile"); // Navigate to the profile page
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.content}>
          <h1 className={styles.title}>Career Personality Assessment</h1>
          <p className={styles.subtitle}>
            This assessment will help us understand your career preferences,
            strengths, and goals through a series of questions. Please find a
            quiet place and allow about 10-15 minutes to complete the
            assessment.
          </p>

          <div className={styles.features}>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>💡</div>
              <h3>What to expect</h3>
              <p>3-5 scenario-based questions about your work preferences</p>
            </div>
            <div className={styles.featureItem}>
              <div className={styles.featureIcon}>🎤</div>
              <h3>Voice or Text</h3>
              <p>Answer using voice input or type your responses</p>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button className={styles.startButton} onClick={handleStartTest}>
              Begin Assessment
            </button>
            <button className={styles.skipButton} onClick={handleSkipTest}>
              Already given?
              <br></br>Skip Assessment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestStartPage;
