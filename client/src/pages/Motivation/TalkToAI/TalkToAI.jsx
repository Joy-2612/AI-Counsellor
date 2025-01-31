import React, { useState, useRef, useEffect } from "react";
import styles from "./TalkToAI.module.css";
import API from "../../../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMicrophone,
  faWaveSquare,
  faVolumeUp,
} from "@fortawesome/free-solid-svg-icons";

const TalkToAI = () => {
  const [conversation, setConversation] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMounted, setIsMounted] = useState(true);
  const [error, setError] = useState("");
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const transcriptRef = useRef(null);

  const audioRef = useRef(null);
  const recognition = useRef(null);
  const synth = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [conversation]);

  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      setIsMounted(false);
      if (recognition.current) {
        recognition.current.abort();
      }
      if (synth.current) {
        synth.current.cancel();
      }
    };
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognition.current = new SpeechRecognition();
      recognition.current.continuous = false;
      recognition.current.interimResults = false;
      recognition.current.lang = "en-US";

      recognition.current.onstart = () => {
        setIsListening(true);
      };

      recognition.current.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;
        handleUserInput(transcript);
      };

      recognition.current.onerror = (event) => {
        setError("Error occurred in recognition: " + event.error);
        setIsListening(false);
      };

      recognition.current.onend = () => {
        setIsListening(false);
      };

      synth.current = window.speechSynthesis;
      // Mark recognition as supported now that it's set up
      setRecognitionSupported(true);
    } else {
      setError("Speech recognition not supported in this browser");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUserInput = async (text) => {
    try {
      // Add user voice message
      setConversation((prev) => [
        ...prev,
        {
          type: "user",
          content: text,
          timestamp: new Date(),
        },
      ]);

      // Get AI response
      const response = await API.post("/talktoai/", { user, message: text });
      const aiResponse = response.data.reply;

      // Add AI response
      setConversation((prev) => [
        ...prev,
        {
          type: "ai",
          content: aiResponse,
          timestamp: new Date(),
          recommendations: response.data.recommendations,
        },
      ]);

      // Speak the response
      speakResponse(aiResponse);
    } catch (error) {
      console.error("AI Conversation Error:", error);
      setError("Failed to connect to AI service");
    }
  };

  const speakResponse = (text) => {
    if (!synth.current) return;
    if (synth.current.speaking) {
      synth.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = synth.current
      .getVoices()
      .find((voice) => voice.name === "Google US English");
    utterance.rate = 1.1;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);

    utterance.onend = () => {
      setIsSpeaking(false);
      // Automatically restart listening after AI finishes speaking
      if (isMounted && recognition.current) {
        try {
          recognition.current.start();
        } catch (error) {
          console.log("Auto-start error:", error);
        }
      }
    };

    utterance.onerror = () => setIsSpeaking(false);

    synth.current.speak(utterance);
  };

  return (
    <div className={styles.vocalContainer}>
      {/* Voice Visualization */}
      <div className={styles.visualization}>
        <div
          className={`${styles.waveform} ${isListening ? styles.active : ""}`}
        >
          {[...Array(12)].map((_, i) => (
            <div key={i} className={styles.waveBar}></div>
          ))}
        </div>
        <button
          className={`${styles.micButton} ${
            isListening ? styles.listening : ""
          }`}
          onClick={() => recognition.current?.start()}
          disabled={!recognitionSupported || isSpeaking}
        >
          <FontAwesomeIcon icon={faMicrophone} size="2x" />
        </button>
        <div className={styles.status}>
          {isListening
            ? "Listening..."
            : isSpeaking
            ? "AI is Speaking..."
            : "Tap microphone to start"}
        </div>
      </div>

      {/* Conversation Transcript */}
      <div className={styles.transcript} ref={transcriptRef}>
        {conversation.map((entry, index) => (
          <div key={index} className={`${styles.bubble} ${styles[entry.type]}`}>
            <div className={styles.bubbleHeader}>
              <FontAwesomeIcon
                icon={entry.type === "user" ? faMicrophone : faVolumeUp}
                className={styles.bubbleIcon}
              />
              <span className={styles.timestamp}>
                {entry.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
            <p className={styles.bubbleContent}>{entry.content}</p>

            {entry.recommendations && (
              <div className={styles.recommendations}>
                <div className={styles.recommendationsHeader}>
                  <FontAwesomeIcon icon={faWaveSquare} />
                  <span>Suggested Paths</span>
                </div>
                {entry.recommendations.map((rec, i) => (
                  <div key={i} className={styles.recommendation}>
                    {rec}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Error Display */}
      {error && <div className={styles.error}>{error}</div>}

      {/* Hidden Audio Element */}
      <audio ref={audioRef} className={styles.hiddenAudio} />
    </div>
  );
};

export default TalkToAI;
