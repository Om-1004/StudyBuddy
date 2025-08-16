import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    room: { type: String, required: true },
    sender: {
      id: { type: String, required: true },   // user ID from JWT
      email: { type: String },                // optional
    },
    message: { type: String, required: true },
  },
  { timestamps: true }
);

// Optional TTL cleanup (30 days):
// messageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

const Message = mongoose.model("Message", messageSchema);
export default Message;
