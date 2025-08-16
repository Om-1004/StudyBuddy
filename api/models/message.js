import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    room: { type: String, required: true },          
    sender: {
      id: { type: String, required: true },   
      email: { type: String },    
    },
    message: { type: String, required: true },
  },
  { timestamps: true } 
);

messageSchema.index({ room: 1, createdAt: 1 });
messageSchema.index({ "sender.id": 1, createdAt: -1 });
messageSchema.index({ createdAt: -1 });

messageSchema.index({ message: "text" });

messageSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

export default mongoose.models.Message || mongoose.model("Message", messageSchema);
