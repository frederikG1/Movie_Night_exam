<script>
  import { Link } from "svelte-routing";
  import { onMount } from "svelte";
  import socket from "../lib/socket.js";
  import { preventDefault } from "svelte/legacy";

  let searchMovie = $state("");
  let showMatches = $state("");
  let results = $state([]);
  let movies = $state([]);
  let recentRatings = $state([]);

  let newestMovies = $derived(
    movies
      .slice()
      .sort(
        (a, b) =>
          new Date(b.release_year).getTime() -
          new Date(a.release_year).getTime(),
      ),
  );

  onMount(async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/movies`, {
        credentials: "include",
      });

      const data = await response.json();

      if (response.ok) {
        movies = data;
      }
    } catch {}
  });

  // Fetches when page loads
  onMount(async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/ratings/recent`, {
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        recentRatings = data;
      }
    } catch {}
  });

  // Fetches when new rating occurs
  onMount(() => {
    socket.on("ratingsUpdated", async () => {
      const response = await fetch(`http://localhost:8080/api/ratings/recent`, {
        credentials: "include",
      });
      recentRatings = await response.json();
    });
  });

  async function findMovie() {
    showMatches = searchMovie;
    try {
      const response = await fetch(
        `http://localhost:8080/api/movies/search?q=${searchMovie}`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();

      if (response.ok) {
        results = data;
      }
    } catch {}
  }

  // let button = document.getElementById("button");

  // button.addEventListener("keypress", (e) => {
  //   if (e.key === "enter") button.onclick();
  // });
</script>

<div class="container">
  <h2>Movies</h2>
  <form onsubmit={(e) => { e.preventDefault(); findMovie(); }}>
    <input bind:value={searchMovie} placeholder="Movie name" />
    <button onclick={findMovie}>Search</button>
  </form>
  {#if showMatches}
    <h1>Showing matches for "{showMatches}"</h1>
    <div class="movie-rows">
      {#each results as movie}
        <Link to={`/movies/${movie.id}`}>
          <div class="card">
            <div class="card-inner">
              <div class="card-front">
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                />
              </div>
              <div class="card-back">
                <h4>{movie.title}</h4>
                <p>{movie.vote_average}/10</p>
              </div>
            </div>
          </div>
        </Link>
      {/each}
    </div>
  {:else}
    <h1>Newly rated movies by users</h1>
    <div class="movie-rows">
      {#each recentRatings as rating}
        <Link to={`/movies/${rating.tmdb_id}`}>
          <div class="card">
            <div class="card-inner">
              <div class="card-front">
                <img
                  src={`https://image.tmdb.org/t/p/w200${rating.poster_path}`}
                  alt={rating.title}
                />
              </div>
              <div class="card-back">
                <h4>{rating.title}</h4>
                <p>{rating.tmdb_rating}/10</p>
              </div>
            </div>
          </div>
        </Link>
      {/each}
    </div>
  {/if}
</div>

<style>

  .container {
    padding: 0 1rem;
  }
  h1 {
    text-decoration: underline;
    height: 56px;
  }

  .movie-rows {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(4, 1fr);
    margin: 1rem auto;
  }

  .card {
    width: 200px;
    height: 250px;
    margin: 1rem auto;
    perspective: 1000px;
    cursor: pointer;
  }

  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }

  .card:hover .card-inner {
    transform: rotateY(180deg);
  }

  .card-front,
  .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.5rem;
    gap: 0.5rem;
  }

  .card-front {
    background: white;
    border: 1px solid #e5e7eb;
  }

  .card-back {
    background: #8b5cf6;
    color: white;
    transform: rotateY(180deg);
  }
</style>
