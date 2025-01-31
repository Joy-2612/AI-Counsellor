import React, { useState, useEffect } from "react";
import styles from "./Motivation.module.css";
import API from "../../services/api";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FaArrowRightLong } from "react-icons/fa6";
import { BsStars } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import {
  faLightbulb,
  faPlayCircle,
  faRobot,
} from "@fortawesome/free-solid-svg-icons";

function getYouTubeID(url) {
  const regExp =
    /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&-]*).*/;
  return url.match(regExp)?.[7]?.substr(0, 11) || null;
}

const Motivation = () => {
  const navigate = useNavigate();
  const [motivation, setMotivation] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchMotivation = async () => {
    try {
      const response = await API.get("/motivation/generate");
      setMotivation(response.data.motivation);
    } catch (error) {
      console.error("Error fetching motivation:", error);
      setMotivation({
        quote: {
          text: "Every day may not be good, but there's something good in every day 🌟",
          author: "Unknown",
        },
        tips: {
          1: "Start with small, achievable goals",
          2: "Celebrate your progress, not just perfection",
          3: "Surround yourself with positive influences",
        },
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMotivation();
  }, []);

  const SkeletonQuote = () => (
    <div className={styles.skeletonQuote}>
      <div className={styles.skeletonIcon}></div>
      <div className={styles.skeletonLine} style={{ width: "80%" }}></div>
      <div className={styles.skeletonLine} style={{ width: "60%" }}></div>
      <div className={styles.skeletonLine} style={{ width: "40%" }}></div>
    </div>
  );

  const SkeletonTip = () => (
    <div className={styles.skeletonTip}>
      <div className={styles.skeletonNumber}></div>
      <div className={styles.skeletonLine}></div>
      <div className={styles.skeletonLine} style={{ width: "80%" }}></div>
    </div>
  );

  const SkeletonVideo = () => (
    <div className={styles.skeletonVideo}>
      <div className={styles.skeletonThumbnail}></div>
      <div className={styles.skeletonLine} style={{ width: "70%" }}></div>
      <div className={styles.skeletonLine} style={{ width: "90%" }}></div>
    </div>
  );

  const handleNavigateToAI = () => {
    navigate("/talk-to-ai");
  };

  return (
    <div className={styles.container}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Fuel Your <span className={styles.highlight}>Ambition</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Daily inspiration to unlock your greatest potential
          </p>
        </div>
        <div className={styles.heroOverlay}></div>
      </section>

      {/* Main Content */}
      <main className={styles.mainContent}>
        {/* Quote Card */}
        <section className={`${styles.card} ${styles.quoteCard}`}>
          {loading ? (
            <SkeletonQuote />
          ) : (
            <>
              <FontAwesomeIcon
                icon={faLightbulb}
                className={styles.quoteIcon}
              />
              <blockquote className={styles.quote}>
                "{motivation?.quote?.text}"
              </blockquote>
              <cite className={styles.quoteAuthor}>
                – {motivation?.quote?.author || "Anonymous"}
              </cite>
            </>
          )}
        </section>

        {loading ? (
          <section className={styles.tipsSection}>
            <div className={styles.skeletonSectionTitle}></div>
            <div className={styles.tipsGrid}>
              {[1, 2, 3].map((key) => (
                <SkeletonTip key={key} />
              ))}
            </div>
          </section>
        ) : motivation?.tips ? (
          <>
            <div className={styles.aicard} onClick={handleNavigateToAI}>
              <div className={styles.aicardicon}>
                <BsStars />
              </div>
              <div className={styles.aicardcontent}>
                <div className={styles.headertext}>Talking AI</div>
                <p>Get personalized advice from our AI assistant to help you</p>
              </div>
              <div className={styles.continueButton}>
                <h3>Continue</h3>
                <FaArrowRightLong />
              </div>
            </div>
            <section className={styles.tipsSection}>
              <h2 className={styles.sectionTitle}>
                <FontAwesomeIcon icon={faLightbulb} /> Daily Success Strategies
              </h2>
              <div className={styles.tipsGrid}>
                {Object.entries(motivation.tips).map(([key, tip]) => (
                  <div key={key} className={styles.tipCard}>
                    <div className={styles.tipNumber}>{key}</div>
                    <p className={styles.tipText}>{tip}</p>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : null}

        {loading ? (
          <section className={styles.videoSection}>
            <div className={styles.skeletonSectionTitle}></div>
            <div className={styles.videoGrid}>
              {[1, 2, 3].map((key) => (
                <SkeletonVideo key={key} />
              ))}
            </div>
          </section>
        ) : motivation?.videos ? (
          <section className={styles.videoSection}>
            <h2 className={styles.sectionTitle}>
              <FontAwesomeIcon icon={faPlayCircle} /> Energizing Content
            </h2>
            <div className={styles.videoGrid}>
              {Object.entries(motivation.videos).map(([key, video]) => (
                <div key={key} className={styles.videoCard}>
                  <div className={styles.videoWrapper}>
                    <iframe
                      className={styles.videoIframe}
                      src={`https://www.youtube.com/embed/${getYouTubeID(
                        video.link
                      )}`}
                      title={video.title}
                      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                  <h3 className={styles.videoTitle}>{video.title}</h3>
                  <p className={styles.videoDescription}>{video.description}</p>
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </main>

      {/* CTA Footer */}
      <footer className={styles.ctaFooter}>
        <button onClick={fetchMotivation} className={styles.refreshButton}>
          Refresh Inspiration ♻️
        </button>
        <a href="/talk-to-ai" className={styles.aiButton}>
          <FontAwesomeIcon icon={faRobot} /> Get Personalized Advice
        </a>
      </footer>
    </div>
  );
};

export default Motivation;
