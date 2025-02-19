import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true }));

import userRouter from "./routes/user.router";

//using routers as a middleware
app.use("/api/users", userRouter);

export default app;
