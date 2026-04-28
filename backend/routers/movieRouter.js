import { Router } from "express";
import db from "../database/connection.js";
import { isLoggedIn } from "./middlewareRouter.js";

const router = Router();

router.get("/movies", (req, res) => {
  const movie = db.prepare("SELECT * FROM movies").all();

  res.status(200).send(movie);
});

router.get("/movies/search", async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).send({ errorMessage: "No search provided" });
  }

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${q}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      },
    );

    if (!response.ok) {
      return res.status(400).send({ errorMessage: "TMDB api failed" });
    }

    const data = await response.json();

    for (const movie of data.results) {
      db.prepare(
        `
        INSERT OR IGNORE INTO movies (tmdb_id, title, synopsis, release_year, tmdb_rating) VALUES (?, ?, ?, ?, ?)`,
      ).run(
        movie.id,
        movie.title,
        movie.overview,
        movie.release_date,
        movie.vote_average,
      );
    }

    res.status(200).send(data.results);
  } catch (err) {
    console.log(err);
    res.status(400).send({ errorMessage: "Something went wrong" });
  }
});

router.get("/movies/:id", (req, res) => {
  const { id } = req.params;

  const movie = db.prepare("SELECT * FROM movies WHERE tmdb_id = ?").get(id);

  if (!movie) {
    return res
      .status(404)
      .send({ errorMessage: `No movie found with tmdb_id: ${id}` });
  }

  res.status(200).send(movie);
});

router.post("/movies/:id/rating", isLoggedIn, (req, res) => {
  const { score, note } = req.body;
  const { id } = req.params;

  const movie = db.prepare("SELECT * FROM movies WHERE tmdb_id = ?").get(id);

  if (!movie) {
    return res.status(400).send({ errorMessage: "Movie not found" });
  }

  const alreadyRated = db
    .prepare("SELECT * FROM ratings WHERE user_id = ? AND movie_id = ?")
    .get(req.session.user.id, movie.id);

  if (alreadyRated) {
    return res
      .status(400)
      .send({ errorMessage: "This movie has already been rated" });
  }

  const result = db
    .prepare(
      `
    INSERT INTO ratings (user_id, movie_id, score, note) VALUES (?, ?, ?, ?)`,
    )
    .run(req.session.user.id, movie.id, score, note);

  res.status(201).send({ data: { id: result.lastInsertRowid } });
});

export default router;
