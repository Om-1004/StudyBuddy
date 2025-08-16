import express from "express";
import cors from "cors";             
import authRouter from "./routes/auth.route.js";
import listingsRouter from "./routes/listings.route.js"
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";


dotenv.config()

mongoose.connect(process.env.MONGO).then(()=>{
    console.log("Connected to Mongo")
}).catch((err) =>{
    console.log(err);
});


const app = express();
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/listings", listingsRouter)

app.listen(3000, () => {
  console.log("Server listening on port: 3000");
});
