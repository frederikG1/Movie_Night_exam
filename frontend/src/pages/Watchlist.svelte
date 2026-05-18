<script>
  import { onMount } from "svelte";
  import { Toaster, toast } from "svelte-5-french-toast";

  let watchlist = $state([]);
  let score = $state("");
  let note = $state("");
  let ratings = $state([]);
  let rateMovieId = $state(null);
  // [] for things that will be arrays (lists)
  // "" for text inputs (so the form starts empty)
  // null for "nothing selected yet" states (good for toggles)

  onMount(async () => {
    try {
      const response = await fetch("http://localhost:8080/api/watchlist", {
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        watchlist = data;
      }
    } catch (error) {
      toast.error(error.message);
    }
  });

  async function markAsWatched(id) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/watchlist/${id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status: "watched" }),
        },
      );

      if (response.ok) {
        const response = await fetch(`http://localhost:8080/api/watchlist`, {
          credentials: "include",
        });
        watchlist = await response.json();
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function deleteFromList(id) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/watchlist/${id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );

      const data = await response.json();

      if (response.ok) {
        const listResponse = await fetch(
          `http://localhost:8080/api/watchlist`,
          {
            credentials: "include",
          },
        );
        watchlist = await listResponse.json();
        toast.success(data.successMessage, {
          position: "bottom-right",
        });
      } else {
        toast.error(data.errorMessage, { position: "bottom-right" });
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  async function rateMovie(tmdbId) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/movies/${tmdbId}/ratings`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ score, note }),
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

  async function submitRating(watchlistId, tmdbId) {
    await rateMovie(tmdbId); // save score and note to ratings table
    await markAsWatched(watchlistId); // update watchlist status to "watched"
    rateMovieId = null; // closes the form
    score = ""; // clear inputs (empty string)
    note = "";
  }
</script>

<Toaster />
<div class="columns">
  <div>
    <h3>Want to watch</h3>
    {#each watchlist.filter((m) => m.status === "want_to_watch") as movie}
      <div class="watchlist-item">
        <img
          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
          alt={movie.title}
        />
        <div class="info">
          <h4>{movie.title}</h4>
          <p>{movie.synopsis}</p>
          <p>Release date: {movie.release_year}</p>
          <p>Rating: {movie.tmdb_rating}/10</p>

          {#if rateMovieId === movie.id}
            <!-- <form onsubmit={(e) => { e.preventDefault(); submitRating(); }}> -->
            <input
              type="number"
              bind:value={score}
              min="1"
              max="10"
              placeholder="Score 1-10"
            />
            <textarea bind:value={note} placeholder="Notes"></textarea>
            <button onclick={() => submitRating(movie.id, movie.tmdb_id)}
              >Submit</button
            >
            <button onclick={() => (rateMovieId = null)}>Cancel</button>
            <!-- </form> -->
          {:else}
            <button onclick={() => (rateMovieId = movie.id)}
              >Mark as watched</button
            >
          {/if}
        </div>
      </div>
    {/each}
  </div>

  <div>
    <h3>Watched</h3>
    {#each watchlist.filter((m) => m.status === "watched") as movie}
      <div class="watchlist-item">
        <img
          src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
          alt={movie.title}
        />
        <div class="info">
          <h4>{movie.title}</h4>
          <p>{movie.synopsis}</p>
          <p>Release date: {movie.release_year}</p>
          <p>Rating: {movie.tmdb_rating}</p>
          <button onclick={() => deleteFromList(movie.id)}
            >Remove from watched list</button
          >
        </div>
      </div>
    {/each}
  </div>
</div>

<style>
  .columns {
    display: flex;
    gap: 2rem;
    max-width: 1400px;
    margin: 1rem auto;
    padding: 0 2rem;
  }

  .columns div {
    flex: 1;
  }

  .columns h3 {
    padding: 0.25rem;
  }

  .watchlist-item {
    display: flex;
    gap: 1.5rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
    background: #0e0d0d;
    border-radius: 8px;
  }

  .watchlist-item img {
    width: 200px;
    height: auto;
    flex-shrink: 0;
    border-radius: 4px;
  }

  .watchlist-item .info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .watchlist-item h4 {
    font-size: 1.5rem;
  }

  .watchlist-item p {
    line-height: 1.5;
  }
</style>
