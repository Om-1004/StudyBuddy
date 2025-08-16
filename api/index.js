// api/index.js
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.route.js";
import listingsRouter from "./routes/listings.route.js";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { createServer } from "http";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import userRouter from "./routes/user.route.js";
import Message from "./models/message.js";
import { verifyToken } from "./middleware/verify.js";

dotenv.config();

mongoose
  .connect(process.env.MONGO)
  .then(async () => {
    console.log("Connected to Mongo");
    // FIX: ensure indexes are built (important for perf)
    try {
      await Message.init();
      console.log("Message indexes ready");
    } catch (e) {
      console.warn("Failed to build Message indexes:", e?.message || e);
    }
  })
  .catch((err) => console.log(err));

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
app.use("/api/listings", listingsRouter);

// Quick auth probe for client bootstrapping
app.get("/api/me", verifyToken, (req, res) => {
  res.json({ user: req.user });
});

/* ---------- DM helpers ---------- */
const DM_ROOM_RE = /^dm:([A-Za-z0-9]+)\|([A-Za-z0-9]+)$/;

function isDmRoom(room) {
  return typeof room === "string" && room.startsWith("dm:");
}
function parseDmRoom(room) {
  if (!DM_ROOM_RE.test(room)) return [null, null];
  const raw = room.slice(3);
  const [a, b] = raw.split("|");
  return [a, b];
}
function userAllowedInRoom(userId, room) {
  if (!isDmRoom(room)) return true; // non-DM rooms allowed for now
  const [a, b] = parseDmRoom(room);
  if (!a || !b) return false;
  return userId === a || userId === b;
}

/* ---------- REST: history & conversations ---------- */
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

// Get user's conversations (rooms they've participated in)
app.get("/api/conversations", verifyToken, async (req, res) => {
  const userId = req.user.id;
  console.log(`📥 Fetching conversations for user: ${userId}`);

  try {
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { "sender.id": userId },
            {
              room: {
                $regex: new RegExp(
                  `^dm:.*${userId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}.*`
                ),
              },
            },
          ],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: "$room",
          lastMessage: { $first: "$message" },
          lastMessageAt: { $first: "$createdAt" },
          participants: { $addToSet: "$sender" },
        },
      },
    ]);

    const conversations = [];
    for (const msg of messages) {
      const room = msg._id;
      if (!isDmRoom(room)) continue;

      const [userId1, userId2] = parseDmRoom(room);
      if (!userId1 || !userId2) continue;

      const otherUserId = userId1 === userId ? userId2 : userId1;

      let otherUser = msg.participants.find((p) => p.id === otherUserId);
      if (!otherUser) {
        otherUser = {
          id: otherUserId,
          username: `User ${otherUserId.slice(-4)}`,
        };
      }

      conversations.push({
        room,
        other: otherUser,
        lastMessage: msg.lastMessage,
        lastMessageAt: msg.lastMessageAt,
      });
    }

    console.log(`✅ Found ${conversations.length} conversations for user ${userId}`);
    res.json({ conversations });
  } catch (e) {
    console.error("Failed to fetch conversations:", e);
    res.status(500).json({ message: "Failed to fetch conversations" });
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

// Authenticate sockets via auth.token or accessToken cookie
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
    socket.user = decoded; // e.g., { id, email, ... }
    console.log("✅ Socket authenticated for user:", decoded.id);
    next();
  });
});

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id, "user:", socket.user?.id);

  socket.on("join-room", (room) => {
    if (!room || typeof room !== "string") {
      console.log("❌ No/invalid room provided for join-room");
      return;
    }
    // FIX: validate DM room format to prevent arbitrary leakage
    if (isDmRoom(room) && !DM_ROOM_RE.test(room)) {
      console.log(`❌ Invalid DM room format: ${room}`);
      return socket.emit("error", "Invalid DM room.");
    }
    if (!userAllowedInRoom(socket.user.id, room)) {
      console.log(`❌ User ${socket.user.id} not allowed in room ${room}`);
      return socket.emit("error", "You are not allowed in this DM.");
    }
    socket.join(room);
    console.log(`✅ ${socket.id} (user: ${socket.user.id}) joined room ${room}`);
  });

  socket.on("message", async ({ room, message }) => {
    console.log("📥 Received message event:", {
      room,
      message: message?.substring(0, 50),
      userId: socket.user.id,
    });

    if (!room || !message?.trim()) {
      console.log("❌ Missing room or message");
      return;
    }
    // FIX: validate format + membership again on send
    if (isDmRoom(room) && !DM_ROOM_RE.test(room)) {
      console.log(`❌ Invalid DM room format on send: ${room}`);
      return socket.emit("error", "Invalid DM room.");
    }
    if (!userAllowedInRoom(socket.user.id, room)) {
      console.log(`❌ User ${socket.user.id} not allowed to send in room ${room}`);
      return socket.emit("error", "You are not allowed to send in this DM.");
    }

    try {
      // Ensure sender is in the room so they receive the broadcast
      if (!socket.rooms.has(room)) {
        socket.join(room);
      }

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
      io.to(room).emit("receive-message", messageData); // single emit
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
