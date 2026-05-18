<script>
  import { onMount } from "svelte";
  import { toast, Toaster } from "svelte-5-french-toast";
  import { Link } from "svelte-routing";

  let movie = $state(null);
  let ratings = $state([]);

  let { id } = $props();

  onMount(async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/movies/${id}`, {
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        movie = data;
      }
    } catch (error) {
      toast.error(error.message);
    }
  });

  onMount(async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/movies/${id}/ratings`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();

      if (response.ok) {
        ratings = data;
      }
    } catch (error) {
      toast.error(error.message);
    }
  });

  async function addToWatchList() {
    try {
      const response = await fetch(
        `http://localhost:8080/api/watchlist/${id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ movie }),
        },
      );
      const data = await response.json();

      if (response.ok) {
        toast.success(data.successMessage, {
          position: "bottom-right",
        });
      } else {
        toast.error(data.errorMessage, {
          position: "bottom-right",
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
</script>

<Toaster />

{#if movie}
  <div class="movie-detail">
    <img
      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
      alt={movie.title}
    />
    <div class="movie-info">
      <h2>{movie.title}</h2>
      <p>Synopsis: {movie.synopsis}</p>
      <p>Release date: {movie.release_year}</p>
      <p>Rating: {movie.tmdb_rating}</p>
      <div class="button">
        <button onclick={() => history.back()}>Go back!</button>
        <button onclick={addToWatchList}>Add to watchlist</button>
      </div>
    </div>
  </div>
{:else}
  <p>..</p>
{/if}

{#if ratings.length > 0}
  <div class="movie-reviews">
    <h3>Reviews</h3>
    {#each ratings as rating}
      <div class="movie-review">
        <Link to={`/users/${rating.user_id}`}
          ><h1>{rating.username} rated it {rating.score}/10</h1></Link
        >
        <h1>Notes about the movie:</h1>
        <p>{rating.note}</p>
      </div>
    {/each}
  </div>
{:else}
  <p>No reviews</p>
{/if}

<style>
  .movie-detail {
    max-width: 1250px;
    margin: 2rem auto;
    padding: 2rem;
    display: flex;
    gap: 3rem;
  }

  .movie-detail img {
    width: 500px;
    height: auto;
    flex-shrink: 0;
  }

  .movie-info {
    flex: 1;
  }

  .movie-info h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .movie-info p {
    margin-bottom: 0.75rem;
    line-height: 1.6;
  }

  .button {
    display: flex;
    gap: 1rem;
    margin-top: 1.5rem;
    width: 300px;
    height: 25px;
  }

  .movie-reviews {
    max-width: 500;
    margin: 2rem auto;
    padding: 2rem;
    font-size: xx-large;
  }

  .movie-review {
    margin-bottom: 1rem;
    padding: 1rem;
    background: #0d4449;
    border-radius: 0.3em;
    font-size: 1.5rem;
    max-width: 500;
  }

  .movie-review p {
    font-style: italic;
  }

  .movie-review h1 {
    font-size: x-large;
  }
</style>
