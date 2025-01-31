const { Job } = require("../Models/Job");
const { Company } = require("../Models/Companies");

exports.getAllReferrals = async (req, res) => {
  try {
    const jobs = await Job.find().populate("company user");
    return res.json({ jobs });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.createReferral = async (req, res) => {
  try {
    const { company, jobLink, referralCount } = req.body;
    const newJob = new Job({
      user: req.user._id,
      company: company,
      jobLink,
      referralCount,
    });
    await newJob.save();
    return res.status(201).json({ message: "Job referral created" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.requestReferral = async (req, res) => {
  try {
    const { jobId } = req.params;
    // For demonstration, we won't do anything complex
    // Possibly, you'd notify the job poster or decrement referralCount, etc.
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.referralCount > 0) {
      job.referralCount -= 1;
      await job.save();
    }

    return res.json({ message: "Referral request processed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    return res.json({ companies });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getCompanyById = async (req, res) => {
  try {
    const { companyId } = req.params;
    const company = await Company.findById(companyId);
    return res.json({ company });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
