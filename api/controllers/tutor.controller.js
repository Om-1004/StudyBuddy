import TutorProfile from "../models/tutor.js";
import User from "../models/user.js";

/**
 * Create a tutor profile for a logged-in user.
 * Requires verifyToken middleware to set req.user.id
 */
export const createTutorProfile = async (req, res) => {
  try {
    console.log("Attempting to create tutor profile...");

    // Get userId from JWT payload
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Only users with role 'tutor' can create a tutor profile
    if (user.role !== "tutor") {
      return res.status(403).json({ message: "User is not a tutor" });
    }

    // Check if a tutor profile already exists for this user
    const existingProfile = await TutorProfile.findOne({ userId });
    if (existingProfile) {
      return res.status(400).json({ message: "Tutor profile already exists" });
    }

    // Extract tutor-specific data from request body
    const { courses, bio, location } = req.body;
    if (!courses || !bio || !location) {
      return res.status(400).json({ message: "All fields (courses, bio, location) are required" });
    }

    // Create and save new tutor profile
    const newProfile = new TutorProfile({
      userId,
      courses,
      bio,
      location,
    });
    await newProfile.save();

    // Populate user info for frontend convenience
    const populatedProfile = await TutorProfile.findById(newProfile._id)
      .populate("userId", "username email")
      .exec();

    console.log("Tutor profile created successfully for user:", userId);
    res.status(201).json({
      message: "Tutor profile created successfully",
      profile: populatedProfile,
    });
  } catch (err) {
    console.error("Error creating tutor profile:", err);
    res.status(500).json({
      message: "Failed to create tutor profile",
      error: err.message,
    });
  }
};
