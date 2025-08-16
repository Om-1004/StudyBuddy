// api/index.js
// api/index.js
import express from "express";
import cors from "cors";             
import authRouter from "./routes/auth.route.js";
import tutorRouter from "./routes/tutor.route.js"
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


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

/* ---------- REST Routes ---------- */
app.use("/api/auth", authRouter);
// app.use("/api/tutor", tutorRouter);

app.listen(3000, () => {
  console.log("Server listening on port: 3000");
});