import React, { useState, useEffect, useRef } from "react";
import API from "../../services/api";
import styles from "./Recommendations.module.css";

function Recommendations() {
  const [recommendations, setRecommendations] = useState({
    platforms: [],
    competitions: [],
    exams: [],
    hackathons: [],
    scholarships: [],
  });

  const [selectedRecommendation, setSelectedRecommendation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const scrollRefs = useRef({});

  const fetchRecommendations = async () => {
    try {
      setIsLoading(true);
      const userId = localStorage.getItem("user");
      const { data } = await API.get("/recommendations", { userId });

      const transformedData = {
        platforms: Object.values(data.recommendations.platforms || {}),
        competitions: Object.values(data.recommendations.competetions || {}),
        exams: Object.values(data.recommendations.exams || {}),
        hackathons: Object.values(data.recommendations.hackathons || {}),
        scholarships: Object.values(data.recommendations.scolarships || {}),
      };

      setRecommendations(transformedData);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = (category, direction) => {
    const container = scrollRefs.current[category];
    if (container) {
      const scrollAmount = direction === "left" ? -300 : 300;
      container.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const SkeletonCategory = () => (
    <div className={styles.categorySection}>
      <div className={styles.skeletonTitle}></div>
      <div className={styles.cardsWrapper}>
        {[1, 2, 3].map((_, index) => (
          <div key={index} className={styles.skeletonCard}>
            <div className={styles.skeletonLogo}></div>
            <div className={styles.skeletonLine}></div>
            <div className={styles.skeletonLine}></div>
            <div className={styles.skeletonLine}></div>
          </div>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const renderCategory = (categoryName, items) => {
    if (!items || items.length === 0) return null;

    return (
      <div className={styles.categorySection} key={categoryName}>
        <div className={styles.categoryHeader}>
          <h3>{categoryName}</h3>
          <div className={styles.scrollArrows}>
            <button
              className={styles.arrowLeft}
              onClick={() => handleScroll(categoryName, "left")}
            >
              &lt;
            </button>
            <button
              className={styles.arrowRight}
              onClick={() => handleScroll(categoryName, "right")}
            >
              &gt;
            </button>
          </div>
        </div>
        <div
          className={styles.cardsWrapper}
          ref={(el) => (scrollRefs.current[categoryName] = el)}
        >
          {items.map((item, index) => (
            <div
              key={index}
              className={styles.recommendationCard}
              onClick={() => setSelectedRecommendation(item)}
            >
              {item.link && (
                <div className={styles.cardLogo}>
                  <img
                    src={`https://www.google.com/s2/favicons?domain=${item.link}`}
                    alt="Website logo"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}
              <h4>{item.name}</h4>
              <p>{item.description}</p>
              <div className={styles.cardFooter}>
                {item.link && (
                  <span className={styles.linkDomain}>{item.link}</span>
                )}
                <span className={styles.cardCategory}>{categoryName}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.recommendationsContainer}>
      <h2>AI Based Recommendations</h2>

      {isLoading ? (
        [...Array(5)].map((_, i) => <SkeletonCategory key={i} />)
      ) : (
        <>
          {renderCategory("Platforms", recommendations.platforms)}
          {renderCategory("Competitions", recommendations.competitions)}
          {renderCategory("Exams", recommendations.exams)}
          {renderCategory("Hackathons", recommendations.hackathons)}
          {renderCategory("Scholarships", recommendations.scholarships)}
        </>
      )}

      {selectedRecommendation && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelectedRecommendation(null)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className={styles.closeButton}
              onClick={() => setSelectedRecommendation(null)}
            >
              &times;
            </button>
            <div className={styles.modalLogo}>
              {selectedRecommendation.link && (
                <img
                  src={`https://www.google.com/s2/favicons?domain=${selectedRecommendation.link}`}
                  alt="Website logo"
                />
              )}
            </div>
            <h3>{selectedRecommendation.name}</h3>
            <p>{selectedRecommendation.description}</p>
            {selectedRecommendation.link && (
              <a
                href={selectedRecommendation.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.modalLink}
              >
                Visit Resource
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Recommendations;
