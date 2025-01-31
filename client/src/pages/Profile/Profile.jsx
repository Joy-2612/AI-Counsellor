import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { Link } from "react-router-dom";
import styles from "./Profile.module.css";
import {
  FiEdit,
  FiUser,
  FiMail,
  FiBook,
  FiSmile,
  FiMapPin,
} from "react-icons/fi";

function Profile() {
  const [profile, setProfile] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});

  const fetchProfile = async () => {
    try {
      const { data } = await API.get("/profile");
      setProfile(data);
      console.log("Profile data", data);
      setFormData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleEdit = () => setEditMode(!editMode);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await API.put("/profile", formData);
      setProfile(formData);
      setEditMode(false);
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className={styles.profilePage}>
      <div className={styles.profileContainer}>
        {/* Personality Test Card */}
        <div className={styles.testCard}>
          <div className={styles.testContent}>
            <h3>Wanna refine your profile?</h3>
            <p>Take our personality test for better recommendations</p>
            <Link to="/start-test" className={styles.testButton}>
              Take Test Now
            </Link>
          </div>
          <div className={styles.testIllustration}>🎯</div>
        </div>

        {/* Profile Header */}
        <div className={styles.profileHeader}>
          <div className={styles.avatarContainer}>
            <div className={styles.avatar}>
              {profile.name?.[0] || <FiUser />}
            </div>
            <button onClick={handleEdit} className={styles.editAvatarBtn}>
              <FiEdit />
            </button>
          </div>
          <div className={styles.profileInfo}>
            {editMode ? (
              <input
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                className={styles.editInput}
              />
            ) : (
              <h2>{profile.name || "Loading..."}</h2>
            )}
            <div className={styles.metaInfo}>
              <span>
                <FiMapPin /> {profile.location || "Add Location"}
              </span>
              <span>
                <FiBook /> {profile.qualifications || "Add Qualification"}
              </span>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className={styles.detailsGrid}>
          <div className={styles.detailCard}>
            <h3>
              <FiUser /> Personal Info
            </h3>
            <DetailItem
              icon={<FiMail />}
              label="Email"
              value={profile.email}
              editMode={editMode}
              name="email"
              onChange={handleChange}
              formData={formData}
            />
            <DetailItem
              icon={<FiMapPin />}
              label="Location"
              value={profile.location}
              editMode={editMode}
              name="location"
              onChange={handleChange}
              formData={formData}
            />
          </div>

          <div className={styles.detailCard}>
            <h3>
              <FiBook /> Education
            </h3>
            <DetailItem
              icon={<FiBook />}
              label="Qualifications"
              value={profile.qualifications}
              editMode={editMode}
              name="qualification"
              onChange={handleChange}
              formData={formData}
            />
          </div>

          <div className={styles.detailCard}>
            <h3>
              <FiSmile /> About You
            </h3>
            <DetailItem
              icon={<FiSmile />}
              label="Bio"
              value={profile.bio}
              editMode={editMode}
              name="bio"
              onChange={handleChange}
              formData={formData}
              textarea
            />
            <DetailItem
              icon={<FiSmile />}
              label="Hobbies"
              value={profile.hobbies}
              editMode={editMode}
              name="hobbies"
              onChange={handleChange}
              formData={formData}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className={styles.actionButtons}>
          {editMode ? (
            <>
              <button onClick={handleSave} className={styles.saveBtn}>
                Save Changes
              </button>
              <button
                onClick={() => setEditMode(false)}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
            </>
          ) : (
            <button onClick={handleEdit} className={styles.editBtn}>
              <FiEdit /> Edit Profile
            </button>
          )}
          <button onClick={handleLogOut} className={styles.logoutBtn}>
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}

const DetailItem = ({
  icon,
  label,
  value,
  editMode,
  name,
  onChange,
  formData,
  textarea,
}) => (
  <div className={styles.detailItem}>
    <span className={styles.detailIcon}>{icon}</span>
    <div className={styles.detailContent}>
      <label>{label}</label>
      {editMode ? (
        textarea ? (
          <textarea
            name={name}
            value={formData[name] || ""}
            onChange={onChange}
            className={styles.editTextarea}
          />
        ) : (
          <input
            type="text"
            name={name}
            value={formData[name] || ""}
            onChange={onChange}
            className={styles.editInput}
          />
        )
      ) : (
        <p>{value || `No ${label.toLowerCase()} added`}</p>
      )}
    </div>
  </div>
);

export default Profile;
