import React, { useState, useEffect, useRef, use } from "react";
import API from "../../services/api";
import styles from "./JobReferralPortal.module.css";
import { toast } from "sonner";

// // Predefined companies with logos (replace placeholder URLs)
// const predefinedCompanies = [
//   {
//     name: "Google",
//     logo: "https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png",
//   },
//   {
//     name: "Microsoft",
//     logo: "https://i.pinimg.com/736x/91/92/1c/91921cec4f8a8cbe3d09e596e0659d81.jpg",
//   },
//   {
//     name: "Amazon",
//     logo: "https://static.vecteezy.com/system/resources/previews/014/018/561/non_2x/amazon-logo-on-transparent-background-free-vector.jpg",
//   },
//   {
//     name: "Apple",
//     logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Apple_logo_grey.svg/404px-Apple_logo_grey.svg.png",
//   },
//   {
//     name: "Meta",
//     logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPm5lkKSipay2G3uA5kEqC8IcBjS8jEMYnBg&s",
//   },
// ];

function JobReferralPortal() {
  const [isLoading, setIsLoading] = useState(true);
  const [jobs, setJobs] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [company, setCompany] = useState("");
  const [jobLink, setJobLink] = useState("");
  const [referralCount, setReferralCount] = useState("");
  const [jobLogo, setJobLogo] = useState("");
  const [isOtherCompany, setIsOtherCompany] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const fetchCompanies = async () => {
    try {
      const { data } = await API.get("/referrals/companies");
      console.log("Companies : ", data.companies);
      setCompanies(data.companies);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  useEffect(() => {
    fetchJobs();
  }, []);

  // Fetch job referrals
  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const { data } = await API.get("/referrals");
      console.log("Jobs : ", data.jobs);
      setJobs(data.jobs);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const SkeletonJobItem = () => (
    <div className={styles.skeletonJobItem}>
      <div className={styles.skeletonJobHeader}>
        <div className={styles.skeletonLogo}></div>
        <div className={styles.skeletonCompanyInfo}>
          <div className={styles.skeletonLine}></div>
          <div className={styles.skeletonPill}></div>
        </div>
      </div>

      <div className={styles.skeletonJobDetails}>
        <div className={styles.skeletonLink}></div>
        <div className={styles.skeletonPostedBy}>
          <div className={styles.skeletonAvatar}></div>
          <div className={styles.skeletonUserInfo}>
            <div className={styles.skeletonLine}></div>
            <div className={styles.skeletonLine}></div>
          </div>
        </div>
        <div className={styles.skeletonButton}></div>
      </div>
    </div>
  );

  const user = localStorage.getItem("user");

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    clearForm();
  };

  const clearForm = () => {
    setCompany("");
    setJobLink("");
    setReferralCount("");
    setIsOtherCompany(false);
  };

  const handleCreateJob = async () => {
    try {
      await API.post("/referrals", {
        company: company._id,
        jobLink,
        referralCount,
        user,
      });
      toast.success("Job referral posted!");
      fetchJobs();
      closeModal();
    } catch (error) {
      console.error(error);
    }
  };

  const handleRequestReferral = async (jobId) => {
    try {
      await API.post(`/referrals/request/${jobId}`);
      toast.success("Referral request sent!");
    } catch (error) {
      console.error(error);
    }
  };

  // Filter jobs based on search term
  const filteredJobs = jobs.filter((job) =>
    job.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name) => {
    return name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const renderJobItem = (job) => (
    <div key={job._id} className={styles.jobItem}>
      <div className={styles.jobHeader}>
        <div className={styles.companyLogoContainer}>
          {job.company?.logo ? (
            <img
              src={job.company.logo}
              alt={`${job.company.name} Logo`}
              className={styles.companyLogo}
            />
          ) : (
            <div className={styles.companyLogoPlaceholder}>
              {getInitials(job.company?.name)}
            </div>
          )}
        </div>
        <div className={styles.companyInfo}>
          <h3 className={styles.companyName}>{job.company?.name}</h3>
          <div className={styles.referralPill}>
            <span>{job.referralCount} referrals available</span>
          </div>
        </div>
      </div>

      <div className={styles.jobDetails}>
        <div className={styles.jobMeta}>
          <a
            href={job.jobLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.jobLink}
          >
            View Job Posting ↗
          </a>
          <div className={styles.postedBy}>
            <div className={styles.userAvatar}>
              {getInitials(job.user?.name)}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{job.user?.name}</span>
              <span className={styles.userEmail}>{job.user?.email}</span>
            </div>
          </div>
        </div>

        <button
          className={styles.requestButton}
          onClick={() => handleRequestReferral(job._id)}
        >
          Request Referral
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.jobPortalContainer}>
      <h2 className={styles.header}>Job Referral Portal</h2>

      {/* Search Bar */}
      <div className={styles.searchBarContainer}>
        <input
          type="text"
          className={styles.searchBar}
          placeholder="Search by company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className={styles.addButton} onClick={openModal}>
          + Add New Referral
        </button>
      </div>

      {/* Modal for creating a new job referral */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h3>Create a New Referral</h3>

            {/* Company Selection */}
            <div className={styles.formGroup}>
              <label>Company</label>
              {!isOtherCompany ? (
                <div className={styles.customDropdown} ref={dropdownRef}>
                  <div
                    className={styles.dropdownTrigger}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {company ? (
                      <div className={styles.selectedCompany}>
                        <img
                          src={company.logo}
                          alt={company}
                          className={styles.dropdownLogo}
                        />
                        <span>{company.name}</span>
                      </div>
                    ) : (
                      <div className={styles.placeholder}>Select a company</div>
                    )}
                  </div>
                  {isDropdownOpen && (
                    <div className={styles.dropdownOptions}>
                      {companies.map((co) => (
                        <div
                          key={co.name}
                          className={styles.dropdownOption}
                          onClick={() => {
                            setCompany(co);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <img
                            src={co.logo}
                            alt={co.name}
                            className={styles.dropdownLogo}
                          />
                          <span>{co.name}</span>
                        </div>
                      ))}
                      <div
                        className={styles.dropdownOption}
                        onClick={() => {
                          setIsOtherCompany(true);
                          setIsDropdownOpen(false);
                        }}
                      >
                        <span>Other...</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  placeholder="Enter company name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              )}
            </div>

            {/* Job Link */}
            <div className={styles.formGroup}>
              <label>Job Link</label>
              <input
                type="text"
                placeholder="Job Link"
                value={jobLink}
                onChange={(e) => setJobLink(e.target.value)}
              />
            </div>

            {/* Number of Referrals */}
            <div className={styles.formGroup}>
              <label>Number of Referrals</label>
              <input
                type="number"
                placeholder="Number of referrals"
                value={referralCount}
                onChange={(e) => setReferralCount(e.target.value)}
              />
            </div>

            <div className={styles.modalActions}>
              <button className={styles.saveButton} onClick={handleCreateJob}>
                Save
              </button>
              <button className={styles.cancelButton} onClick={closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className={styles.jobGrid}>
          {[1, 2, 3, 4].map((_, index) => (
            <SkeletonJobItem key={index} />
          ))}
        </div>
      ) : filteredJobs.length > 0 ? (
        <div className={styles.jobGrid}>{filteredJobs.map(renderJobItem)}</div>
      ) : (
        <div className={styles.emptyState}>
          <img src="/empty-state.svg" alt="No jobs found" />
          <p>No referrals found matching your search</p>
        </div>
      )}
    </div>
  );
}

export default JobReferralPortal;
