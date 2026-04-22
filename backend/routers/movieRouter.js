import { Router } from "express";

const router = Router();

router.get("/movies/search", async (req, res) => {
  const q = req.query;

  if (!q) {
    return res.status(400).send({ errorMessage: "No search provided" });
  }

  try {
    const response = await fetch(
      "https://api.themoviedb.org/3/search/movie?query=inception",
      {
        headers: {
          Authorization: `Bearer ${process.env.TMDB_API_KEY}`,
        },
      },
    );

    if (!response.ok) {
      return res.status(500).send({ errorMessage: "TMDB api failed" });
    }

    const data = await response.json();
  } catch (err) {
    
  }
});
