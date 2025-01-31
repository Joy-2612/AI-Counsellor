import React, { useState } from "react";
import API from "../../services/api";
import styles from "./Roadmap.module.css";
import { toast } from "sonner";
import { BsStars } from "react-icons/bs";

function Roadmap() {
  const [skill, setSkill] = useState("");
  const [steps, setSteps] = useState([]); // Store the array of steps
  const [selectedStep, setSelectedStep] = useState(null); // For modal
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateRoadmap = async () => {
    try {
      // Call your API endpoint
      setIsLoading(true);
      const data = await API.post("/roadmap/generate", { skill });
      console.log("API Response", data.data);

      // The API returns an object of steps (e.g. { step1: {...}, step2: {...} })
      // Convert that object to an array so we can use .map in the JSX
      const stepsObject = data.data.roadmap.steps;
      if (stepsObject) {
        setSteps(Object.values(stepsObject));
      } else {
        setSteps([]);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error generating roadmap");
    } finally {
      setIsLoading(false);
    }
  };

  const openStepModal = (step) => {
    setSelectedStep(step);
  };

  const closeModal = () => {
    setSelectedStep(null);
  };

  const SkeletonStep = () => (
    <div className={styles.timelineStep}>
      <div className={styles.timelineContent}>
        <div className={styles.skeletonHeading} />
        <div className={styles.skeletonLine} />
        <div className={styles.skeletonLine} />
      </div>
    </div>
  );

  function getYouTubeID(url) {
    const regExp =
      /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : false;
  }

  return (
    <div className={styles.roadmapContainer}>
      <div className={styles.title}>Generate a roadmap using AI</div>
      <div>
        <div className={styles.inputContainer}>
          <input
            className={styles.inputField}
            type="text"
            placeholder="Enter a skill (e.g. React, Node, etc.)"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
          />
          <button
            className={styles.generateButton}
            onClick={handleGenerateRoadmap}
          >
            Generate <BsStars />
          </button>
        </div>

        {isLoading && (
          <div className={styles.timeline}>
            {[1, 2, 3, 4].map((_, index) => (
              <SkeletonStep key={index} />
            ))}
          </div>
        )}

        {/* Roadmap timeline */}
        {!isLoading && steps.length > 0 && (
          <div className={styles.timeline}>
            {steps.map((step, index) => (
              <div className={styles.timelineStep} key={index}>
                <div
                  className={styles.timelineContent}
                  onClick={() => openStepModal(step)}
                >
                  <div className={styles.stepTitle}>{step.heading}</div>
                  <p className={styles.stepDescription}>{step.description}</p>
                  <h4>Estimated time : {step.estimatedTime}</h4>
                  <div className={styles.viewMore}>View More</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {selectedStep && (
          <>
            <div className={styles.modalOverlay} onClick={closeModal} />
            <div className={`${styles.modal} ${styles.modalAnimation}`}>
              <h3>{selectedStep.heading}</h3>
              <p>{selectedStep.description}</p>

              <div className={styles.modalDetails}>
                {selectedStep.links?.youtubeLink && (
                  <div className={styles.videoContainer}>
                    <h4>Related Video:</h4>
                    <div className={styles.videoWrapper}>
                      <iframe
                        width="100%"
                        height="315"
                        src={`https://www.youtube.com/embed/${getYouTubeID(
                          selectedStep.links.youtubeLink
                        )}`}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}
                <h4>Useful Links:</h4>
                <ul>
                  {selectedStep.links?.link?.map((url, idx) => (
                    <li key={idx}>
                      <a href={url} target="_blank" rel="noopener noreferrer">
                        {url}
                      </a>
                    </li>
                  ))}
                </ul>

                <h4>Estimated Time: {selectedStep.estimatedTime}</h4>
              </div>

              <button className={styles.closeButton} onClick={closeModal}>
                Close
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Roadmap;
