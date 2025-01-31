import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import SpeechInput from "../../components/SpeechInput/SpeechInput";
import API from "../../services/api";
import styles from "./PersonalityTest.module.css";
import { toast } from "sonner";

function PersonalityTest() {
  const navigate = useNavigate();
  const chatContainerRef = useRef(null);

  const testQuestions = [
    "What are your qualifications?",
    "What are your career goals?",
    "What are your hobbies?",
    "Where do you live by the way?",
  ];

  const [state, setState] = useState({
    isLoading: false,
    answers: {},
    currentIndex: 0,
    analysis: null,
    isSpeaking: false,
  });

  useEffect(() => {
    if (chatContainerRef.current) {
      requestAnimationFrame(() => {
        chatContainerRef.current.scrollTop =
          chatContainerRef.current.scrollHeight;
      });
    }
  }, [state.answers, state.currentIndex, state.isLoading]);

  const speakText = useCallback((text) => {
    if (!window.speechSynthesis) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.3;
    utterance.volume = 1;

    utterance.onstart = () =>
      setState((prev) => ({ ...prev, isSpeaking: true }));
    utterance.onend = () =>
      setState((prev) => ({ ...prev, isSpeaking: false }));

    window.speechSynthesis.speak(utterance);
  }, []);

  useEffect(() => {
    speakText(testQuestions[state.currentIndex]);

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [state.currentIndex, speakText]);

  const handleAnswerChange = (value) => {
    setState((prev) => ({
      ...prev,
      answers: { ...prev.answers, [prev.currentIndex]: value },
    }));
  };

  const handleNext = async () => {
    window.speechSynthesis.cancel();

    if (state.currentIndex < testQuestions.length - 1) {
      setState((prev) => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
      }));
    } else {
      setState((prev) => ({ ...prev, isLoading: true }));

      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const response = await API.post("/test/submit", {
          userId: user?._id,
          questions: testQuestions,
          answers: state.answers,
        });

        setState((prev) => ({ ...prev, analysis: response.data.analysis }));
        navigate("/profile");
      } catch (error) {
        console.error(error);
        toast.error("Error submitting test");
      } finally {
        setState((prev) => ({ ...prev, isLoading: false }));
      }
    }
  };

  const handleSpeechCapture = (transcript) => {
    handleAnswerChange(transcript);
  };

  if (state.isLoading) {
    return (
      <div className={styles.fullPageLoader}>
        <div className={styles.spinner}></div>
        <p>Analyzing your responses...</p>
        <p className={styles.subText}>Building your career profile</p>
        {state.analysis && (
          <div className={styles.analysisContainer}>
            <h3>Career Profile Analysis</h3>
            <div className={styles.analysisContent}>
              <div>Bio: {state.analysis.bio}</div>
              <div>Qualifications: {state.analysis.qualifications}</div>
              <div>Goal: {state.analysis.goal}</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={styles.testOuterContainer}>
      <div className={styles.testCard}>
        <div className={styles.chatHeader}>
          <div className={styles.aiProfile}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/4712/4712139.png"
              alt="AI Interviewer"
              className={styles.aiAvatar}
            />
            <div>
              <h2>AI Career Assistant</h2>
              <p>Personality Test</p>
            </div>
          </div>
          <div className={styles.progress}>
            Question {state.currentIndex + 1} of {testQuestions.length}
          </div>
        </div>

        <div className={styles.chatContainer} ref={chatContainerRef}>
          {testQuestions.slice(0, state.currentIndex + 1).map((q, index) => (
            <React.Fragment key={index}>
              <div className={styles.aiMessage}>
                <div className={styles.messageBubble}>
                  <p>{q}</p>
                </div>
              </div>

              {state.answers[index] && (
                <div className={styles.userMessage}>
                  <div className={styles.messageBubble}>
                    <p>{state.answers[index]}</p>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}

          {state.analysis && (
            <div className={styles.analysisContainer}>
              <h3>Career Profile Analysis</h3>
              <div className={styles.analysisContent}>{state.analysis}</div>
            </div>
          )}
        </div>

        {state.currentIndex < testQuestions.length && !state.analysis && (
          <div className={styles.inputSection}>
            <textarea
              className={styles.answerField}
              value={state.answers[state.currentIndex] || ""}
              onChange={(e) => handleAnswerChange(e.target.value)}
              placeholder="Type or speak your answer..."
            />
            <div className={styles.controls}>
              <SpeechInput onTextCapture={handleSpeechCapture} />
              <button className={styles.nextButton} onClick={handleNext}>
                {state.currentIndex === testQuestions.length - 1 ? (
                  <span>Submit Interview</span>
                ) : (
                  <span>
                    Next Question <span className={styles.arrow}>&rarr;</span>
                  </span>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PersonalityTest;
