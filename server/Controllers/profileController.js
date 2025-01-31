const { User } = require("../Models/User");

exports.getProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from protect middleware
    const user = await User.findById(userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({
      name: user.name,
      email: user.email,
      goal: user.goal,
      hobbies: user.hobbies,
      qualifications: user.qualifications,
      location: user.location,
      bio: user.bio,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
