import React from "react";
import { Link } from "react-router-dom";
import styles from "./Sidebar.module.css";
import { AiOutlineUser, AiOutlineFileSearch } from "react-icons/ai";
import {
  FaRoad,
  FaUserCircle,
  FaBriefcase,
  FaStar,
  FaRegCommentDots,
} from "react-icons/fa";

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebarHeader}>
        <h2>AI Counsellor</h2>
      </div>
      <ul className={styles.sidebarNav}>
        {/* New Motivation Feature Tab */}
        <li className={styles.specialLink}>
          <Link to="/motivation">
            <FaRegCommentDots className={styles.icon} />
            Feeling Demotivated?
          </Link>
        </li>
        <li>
          <Link to="/roadmap">
            <FaRoad className={styles.icon} /> Roadmap
          </Link>
        </li>
        <li>
          <Link to="/referrals">
            <FaBriefcase className={styles.icon} /> Job Referrals
          </Link>
        </li>
        <li>
          <Link to="/recommendations">
            <FaStar className={styles.icon} /> Recommendations
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
