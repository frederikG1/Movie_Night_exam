<script>
  import { onMount } from "svelte";
  import { toast, Toaster } from "svelte-5-french-toast";

  let movie = $state(null);

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
    } catch {}
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
          position: "top-right",
        });
      } else {
        toast.error(data.errorMessage, {
          position: "top-right",
        });
      }
    } catch {}
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
</style>
