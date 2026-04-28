import { Router } from "express";
import db from "../database/connection.js";
import { isLoggedIn } from "./middlewareRouter.js";

const router = Router();

router.get("/watchlist", isLoggedIn, (req, res) => {
  const watchedMovie = db
    .prepare(`SELECT * FROM watchlist WHERE user_id = ?`)
    .all(req.session.user.id);

  if (!watchedMovie) {
    res.status(400).send({ errorMessage: "No movies in watchlist" });
  }

  res.status(200).send(watchedMovie);
});

router.post("/watchlist/:id", isLoggedIn, (req, res) => {
  const { id } = req.params;

  const movie = db.prepare(`SELECT * FROM movies where tmdb_id = ?`).get(id);

  if (!movie) {
    res.status(400).send({ errorMessage: "Movie doesn't exist" });
  }

  const alreadyAdded = db
    .prepare(`SELECT * FROM watchlist WHERE user_id = ? AND movie_id = ?`)
    .get(req.session.user.id);

  if (alreadyAdded) {
    return res
      .status(400)
      .send({ errorMessage: "This movie has already been added" });
  }

  const addToList = db
    .prepare(
      `INSERT INTO watchlist (user_id, movie_id, status) VALUES (?, ?,?)`,
    )
    .run(req.session.user.id, movie.id, "want_to_watch");

  res
    .status(201)
    .send({ successMessage: "Movie has been added to watchlist!" });
});

router.patch("/watchlist/:id", isLoggedIn, (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).send({ errorMessage: "Please update status" });
  }

  const patchMovie = db
    .prepare(`UPDATE watchlist SET status = ? WHERE id = ?`)
    .run(status, id);

  res
    .status(201)
    .send({ successMessage: `Movie status has been updated to: ${status}` });
});

router.delete("/watchlist/:id", isLoggedIn, (req, res) => {
  const { id } = req.params;

  const deleteMovie = db.prepare(`DELETE FROM watchlist WHERE id = ?`).run(id);

  if (!deleteMovie.changes) {
    res.status(400).send({ errorMessage: "Movie with this ID not found" });
  }

  res.status(200).send({ successMessage: "Movie has been deleted" });
});

export default router;
