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
  <div>
    <img
      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
      alt={movie.title}
    />
    <button onclick={() => history.back()}>Go back!</button>
    <button onclick={addToWatchList}>Add to watchlist</button>
    <h2>{movie.title}</h2>
    <p>Synopsis: {movie.synopsis}</p>
    <p>Release date: {movie.release_year}</p>
    <p>Rating: {movie.tmdb_rating}</p>
  </div>
{:else}
  <p>..</p>
{/if}
