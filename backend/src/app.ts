import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import userRouter from "./routes/user.router";
import messageRouter from "./routes/message.router";
import { RATE_LIMITER_MAX, RATE_LIMITER_WINDOW } from "./constants";
import errorHandler from "./middlewares/error.middleware";

const app = express();

app.set("trust proxy", 1);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
const limiter = rateLimit({
  windowMs: RATE_LIMITER_WINDOW,
  max: RATE_LIMITER_MAX,
});

app.use(limiter);
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true }));

app.get("/ping", (_, res) => {
  res.send("pong: " + Date());
});

//using routers as a middleware
app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);
// router
//   .route("/ping")
//   .get(asyncHandler(async (_, res) => res.send("pong: " + Date())));

app.use(errorHandler);

export default app;
