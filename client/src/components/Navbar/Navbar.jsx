import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Navbar.module.css";
import API from "../../services/api";

function Navbar() {
  const [profile, setProfile] = useState({});

  const fetchProfile = async () => {
    try {
      const { data } = await API.get("/profile");
      console.log("Profile Data", data);
      setProfile(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  /* Add this helper function somewhere in your code */
  const getInitials = (name) => {
    if (name) {
      return name[0];
    } else {
      return name;
    }
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.profile}>
        <Link to="/profile" className={styles.profileLink}>
          <div className={styles.profileText}>
            <div className={styles.userName}>Hey, {profile.name}</div>
            {/* <div className={styles.userEmail}>{profile.email}</div> */}
          </div>
          <div className={styles.avatar}>{getInitials(profile.name)}</div>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
