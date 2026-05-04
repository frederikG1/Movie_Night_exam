<script>
  import { onMount } from "svelte";
  import { Link } from "svelte-routing";

  let movies = $state([]);
  let sortBy = $state("rating");

  let filteredMovies = $derived(
    movies.slice().sort((a, b) => {
      if (sortBy === "rating") return b.tmdb_rating - a.tmdb_rating;
      if (sortBy === "year") return b.release_year - a.release_year;
      if (sortBy === "title") return a.title.localeCompare(b.title);
    }),
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
</script>

<select bind:value={sortBy}>
<input placeholder="Sort by">
  <option value="rating">Highest rating</option>
  <option value="year">Newest</option>
  <option value="title">Title (A-Z)</option>
</select>

<div class="container">
  <h1>All Movies</h1>
  <div class="movie-rows">
    {#each filteredMovies as movie}
      <Link to={`/movies/${movie.tmdb_id}`}>
        <img
          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
          alt={movie.title}
        />
        <p>{movie.title}</p>
      </Link>
    {/each}
  </div>
</div>

<style>
  .movie-rows {
    display: grid;
    gap: 2rem;
    grid-template-columns: repeat(3, 1fr);
  }
</style>
