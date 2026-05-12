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
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

// -------- SOCKETS --------
import http from "http";
const server = http.createServer(app);

import { Server } from "socket.io";
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A new socket connected with id", socket.id);
  socket.on("disconnect", () => {
    console.log(socket.id, "disconnected");
  });
});

export default io;

// -------- AUTH --------
import authRouter from "./routers/authRouter.js";
app.use("/api", authRouter);

import movieRouter from "./routers/movieRouter.js";
app.use("/api", movieRouter);

import watchlistRouter from "./routers/watchlistRouter.js";
app.use("/api", watchlistRouter);

server.listen(8080, () => {
  console.log("Server is running on http://localhost:8080");
});
