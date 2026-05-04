<script>
  import { Link } from "svelte-routing";
  import { onMount } from "svelte";

  let searchMovie = $state("");
  let showMatches = $state("");
  let results = $state([]);
  let movies = $state([]);

  let newestMovies = $derived(
    movies
      .slice()
      .sort(
        (a, b) =>
          new Date(b.release_year).getTime() -
          new Date(a.release_year).getTime(),
      ),
  );

  // FILTER MED YEAR VIRKER IKKE ORDENTLIGT

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
</script>

<div class="container">
  <h2>Movies</h2>
  <input bind:value={searchMovie} placeholder="Movie name" />
  <button onclick={findMovie}>Search</button>

  {#if showMatches}
    <h1>Showing matches for "{showMatches}"</h1>
    <div class="movie-rows">
      {#each results as movie}
        <Link to={`/movies/${movie.id}`}>
          <img
            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
            alt={movie.title}
          />
          <p>{movie.title}</p>
        </Link>
      {/each}
    </div>
  {:else}
    <div class="movie-rows">
      <h1>Newest releases</h1>
      {#each newestMovies as movie}
        <Link to={`/movies/${movie.tmdb_id}`}>
          <img
            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
            alt={movie.title}
          />
          <p>{movie.title}</p>
        </Link>
      {/each}
    </div>
  {/if}
</div>

<!-- </div> -->

<style>
  h1 {
    text-decoration: underline;
    height: 56px;
  }

  .movie-rows {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(4, 1fr);
  }
</style>
