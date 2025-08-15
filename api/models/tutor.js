import mongoose from "mongoose"

const tutorProfileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  courses: [{ type: String }],
  location: { type: String },
  bio: { type: String },
  rating: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model("TutorProfile", tutorProfileSchema);