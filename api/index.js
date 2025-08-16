// api/index.js
// api/index.js
import express from "express";
import cors from "cors";             
import authRouter from "./routes/auth.route.js";
import listingsRouter from "./routes/listings.route.js"
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import userRouter from "./routes/user.route.js"
import Message from "./models/message.js";
import { verifyToken } from "./middleware/verify.js";


dotenv.config()

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to Mongo")
}).catch((err) =>{
    console.log(err);
});

/* ---------- App & Middleware ---------- */
const app = express();
const server = createServer(app);

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);

app.get("/api/me", verifyToken, (req, res) => {
  res.json({ user: req.user }); 
});

function isDmRoom(room) {
  return typeof room === "string" && room.startsWith("dm:");
}
function parseDmRoom(room) {
  const raw = room.slice(3);
  const [a, b] = raw.split("|");
  return [a, b];
}
function userAllowedInRoom(userId, room) {
  if (!isDmRoom(room)) return true; // public/group rooms allowed
  const [a, b] = parseDmRoom(room);
  return userId === a || userId === b;
}

app.use("/api/listings", listingsRouter)


app.get("/api/messages/:roomId", verifyToken, async (req, res) => {
  const roomId = req.params.roomId;
  console.log(`📥 Fetching messages for room: ${roomId}, user: ${req.user.id}`);
  
  if (!userAllowedInRoom(req.user.id, roomId)) {
    console.log(`❌ User ${req.user.id} not allowed in room ${roomId}`);
    return res.status(403).json({ message: "Forbidden" });
  }
  try {
    const messages = await Message.find({ room: roomId }).sort({ createdAt: 1 });
    console.log(`✅ Found ${messages.length} messages for room ${roomId}`);
    res.json(messages);
  } catch (e) {
    console.error("Failed to fetch messages:", e);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
});

/* ---------- Socket.IO ---------- */
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Authenticate sockets va auth.token or accessToken cookie
io.use((socket, next) => {
  const tokenFromAuth = socket.handshake.auth?.token;

  // fallback: read accessToken from Cookie header
  const cookieHeader = socket.handshake.headers?.cookie || "";
  const cookieToken = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("accessToken="))
    ?.split("=")[1];

  const token = tokenFromAuth || cookieToken;
  if (!token) {
    console.log("❌ Socket authentication failed: No token");
    return next(new Error("Authentication error: No token"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log("❌ Socket authentication failed: Invalid token", err.message);
      return next(new Error("Authentication error: Invalid token"));
    }
    socket.user = decoded; // e.g., { id, email }
    console.log("✅ Socket authenticated for user:", decoded.id);
    next();
  });
});

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id, "user:", socket.user?.id);

  socket.on("join-room", (room) => {
    if (!room) {
      console.log("❌ No room provided for join-room");
      return;
    }
    
    if (!userAllowedInRoom(socket.user.id, room)) {
      console.log(`❌ User ${socket.user.id} not allowed in room ${room}`);
      return socket.emit("error", "You are not allowed in this DM.");
    }
    
    socket.join(room);
    console.log(`✅ ${socket.id} (user: ${socket.user.id}) joined room ${room}`);
  });

  socket.on("message", async ({ room, message }) => {
    console.log("📥 Received message event:", { room, message: message?.substring(0, 50), userId: socket.user.id });
    
    if (!room || !message?.trim()) {
      console.log("❌ Missing room or message");
      return;
    }
    
    if (!userAllowedInRoom(socket.user.id, room)) {
      console.log(`❌ User ${socket.user.id} not allowed to send in room ${room}`);
      return socket.emit("error", "You are not allowed to send in this DM.");
    }
    
    try {
      const doc = await Message.create({
        room,
        message: message.trim(),
        sender: { id: socket.user.id, email: socket.user.email },
      });

      console.log(`💾 Message saved with ID: ${doc._id}`);

      const messageData = {
        _id: doc._id,
        room: doc.room,
        message: doc.message,
        sender: doc.sender,
        createdAt: doc.createdAt,
      };

      console.log(`📡 Broadcasting message to room ${room}`);
      io.to(room).emit("receive-message", messageData);
      
    } catch (e) {
      console.error("❌ Failed to persist message:", e);
      socket.emit("error", "Failed to send message");
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔌 Socket disconnected: ${socket.id} (user: ${socket.user?.id})`);
  });
});

/* ---------- Start ---------- */
server.listen(3000, () => {
  console.log("🚀 Server listening on port: 3000");

});