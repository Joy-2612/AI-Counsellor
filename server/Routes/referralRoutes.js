const express = require("express");
const router = express.Router();
const {
  getAllReferrals,
  createReferral,
  requestReferral,
  getAllCompanies,
  getCompanyById,
} = require("../Controllers/referralController");
const { protect } = require("../Middlewares/authMiddleware");

router.get("/", protect, getAllReferrals);
router.post("/", protect, createReferral);
router.post("/request/:jobId", protect, requestReferral);
router.get("/companies", getAllCompanies);
router.get("/companies/:companyId", getCompanyById);

module.exports = router;
