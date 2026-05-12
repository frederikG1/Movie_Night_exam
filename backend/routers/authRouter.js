import { Router } from "express";
import db from "../database/connection.js";
import bcrypt from "bcrypt";
import { isLoggedIn } from "./middlewareRouter.js";

const router = Router();
const saltRounds = 10;

router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).send({
      errorMessage: "Please fill in all fields",
    });
  }

  const existingUser = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email);

  if (existingUser) {
    return res.status(400).send({ errorMessage: "Email already in use" });
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);

  db.prepare(
    `INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)`,
  ).run(username, email, hashedPassword);

  res.status(201).send({ successMessage: "User created!" });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({
      errorMessage: "Please enter email and password",
    });
  }

  const foundUser = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email);

  if (!foundUser) {
    return res
      .status(400)
      .send({ errorMessage: "No user found with this email" });
  }

  const isPasswordCorrect = await bcrypt.compare(
    password,
    foundUser.password_hash,
  );

  if (!isPasswordCorrect) {
    return res.status(400).send({ errorMessage: "Wrong password" });
  }

  req.session.user = {
    id: foundUser.id,
    username: foundUser.username,
    email: foundUser.email,
  };
  res
    .status(200)
    .send({ successMessage: "Login succesful", user: req.session.user });
});

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(401).send({ errorMessage: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.status(200).send({ successMessage: "Logout successful" });
  });
});

router.get("/me", async (req, res) => {
  if (!req.session.user) {
    return res.status(401).send({ errorMessage: "Not logged in" });
  }

  res.status(200).send({ user: req.session.user });
});

router.get("/users/me/profile", isLoggedIn, (req, res) => {
  const user = db
    .prepare(`SELECT id, username, email, created_at FROM users WHERE id = ?`)
    .get(req.session.user.id);
  
  const watchlist = db
    .prepare(
      `SELECT watchlist.*, movies.title, movies.poster_path, movies.synopsis, movies.release_year, movies.tmdb_rating, movies.tmdb_id
    FROM watchlist
    JOIN movies ON movies.id = watchlist.movie_id
    WHERE watchlist.user_id = ?`,
    )
    .all(req.session.user.id);

  const ratings = db
    .prepare(
      `
    SELECT ratings.*, movies.title, movies.poster_path, movies.tmdb_id
    FROM ratings
    JOIN movies ON movies.id = ratings.movie_id
    WHERE ratings.user_id = ?
    ORDER BY ratings.created_at DESC
    `,
    )
    .all(req.session.user.id);

  res.status(200).send({ user, watchlist, ratings });
});

export default router;
