import express from "express";
import cors from "cors";
import session from "express-session";
import "dotenv/config";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

// -------- AUTH --------
import authRouter from "./routers/authRouter.js";
app.use("/api", authRouter);

import movieRouter from "./routers/movieRouter.js";
app.use("/api", movieRouter);

import watchlistRouter from "./routers/watchlistRouter.js";
app.use("/api", watchlistRouter);

app.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
