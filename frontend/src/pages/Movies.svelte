<script>
  import { onMount } from "svelte";
  import { Link } from "svelte-routing";

  let movies = $state([]);
  let sortBy = $state("rating");

  let filteredMovies = $derived(
    movies.slice().sort((a, b) => {
      if (sortBy === "rating") return b.tmdb_rating - a.tmdb_rating;
      if (sortBy === "year")
        return (
          new Date(b.release_year).getTime() -
          new Date(a.release_year).getTime()
        );
      if (sortBy === "title") return a.title.localeCompare(b.title);
    }),
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
</script>

<select bind:value={sortBy}>
  <input placeholder="Sort by" />
  <option value="rating">Rating (H-L)</option>
  <option value="year">Newest</option>
  <option value="title">Title (A-Z)</option>
</select>

<div class="container">
  {#if sortBy === "rating"}
    <h1>Movies sorted by rating</h1>
    <p></p>
  {:else if sortBy === "year"}
    <h1>Movies sorted by year</h1>
  {:else if sortBy === "title"}
    <h1>Movies sorted by title</h1>
  {/if}

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
    grid-template-columns: repeat(4, 1fr);
  }
</style>
