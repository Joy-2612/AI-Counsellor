import React, { useState } from "react";
import styles from "./SpeechInput.module.css";
import { toast } from "sonner";
import { FaMicrophone } from "react-icons/fa";
import { FaStop } from "react-icons/fa";
import { useRef } from "react";

function SpeechInput({ onTextCapture }) {
  const [recording, setRecording] = useState(false);
  const recognitionRef = useRef(null);

  const handleToggle = () => {
    if (recording) {
      recognitionRef.current?.stop();
      setRecording(false);
    } else {
      startRecording();
    }
  };

  const startRecording = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Your browser does not support Speech Recognition");
      return;
    }

    const recog = new SpeechRecognition();
    recog.lang = "en-US";
    recog.interimResults = false;

    recog.onstart = () => {
      setRecording(true);
      recognitionRef.current = recog;
    };

    recog.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTextCapture(transcript);
    };

    recog.onend = () => {
      setRecording(false);
      recognitionRef.current = null;
    };

    recog.start();
  };

  return (
    <div className={styles.container}>
      <button
        className={`${styles.recordButton} ${
          recording ? styles.recording : ""
        }`}
        onClick={handleToggle}
        aria-label={recording ? "Stop recording" : "Start recording"}
      >
        {recording ? (
          <>
            <FaStop className={styles.icon} />
            <div className={styles.pulse}></div>
          </>
        ) : (
          <FaMicrophone className={styles.icon} />
        )}
      </button>
      {recording && <span className={styles.status}>Recording...</span>}
    </div>
  );
}
export default SpeechInput;
