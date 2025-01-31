const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  company: { type: mongoose.Schema.Types.ObjectId, ref: "Company" },
  jobLink: { type: String, required: true },
  referralCount: { type: Number, default: 0 },
});

const Job = mongoose.model("Job", jobSchema);

module.exports = { Job };
