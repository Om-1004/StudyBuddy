// api/models/message.js
import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    room: { type: String, required: true },           // e.g. dm:<a>|<b>
    sender: {
      id: { type: String, required: true },           // user id (stringified ObjectId)
      email: { type: String },                        // optional
    },
    message: { type: String, required: true },
  },
  { timestamps: true }                                // createdAt / updatedAt
);

/* ---------- Indexes (critical) ---------- */
// Fast room history & pagination
messageSchema.index({ room: 1, createdAt: 1 });
// Get conversations for a user quickly (your aggregation benefits from this)
messageSchema.index({ "sender.id": 1, createdAt: -1 });
// Generic recency queries
messageSchema.index({ createdAt: -1 });

// Optional: full-text search inside messages (MongoDB text index)
messageSchema.index({ message: "text" });

// Optional: TTL cleanup (30 days). Uncomment if you want auto-pruning:
messageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

/* ---------- Hot-reload safe export ---------- */
export default mongoose.models.Message || mongoose.model("Message", messageSchema);
