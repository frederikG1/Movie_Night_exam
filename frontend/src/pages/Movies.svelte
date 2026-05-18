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
    } catch (error) {
      toast.error(error.message);
    }
  });
</script>

<div class="container">
  <select bind:value={sortBy}>
    <input placeholder="Sort by" />
    <option value="rating">Rating (H-L)</option>
    <option value="year">Newest</option>
    <option value="title">Title (A-Z)</option>
  </select>
</div>

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
        <div class="card">
          <div class="card-inner">
            <div class="card-front">
              <img
                src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                alt={movie.title}
              />
            </div>
            <div class="card-back">
              <p>{movie.title}</p>
              <p>{movie.tmdb_rating}/10</p>
            </div>
          </div>
        </div>
      </Link>
    {/each}
  </div>
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
