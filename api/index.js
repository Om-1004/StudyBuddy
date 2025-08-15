import express from "express";
import cors from "cors";             
import userRouter from "./routes/test.route.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use("/", userRouter);

app.listen(3000, () => {
  console.log("Server listening on port: 3000");
});
