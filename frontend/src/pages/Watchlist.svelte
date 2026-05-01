<script>
  import { onMount } from "svelte";
  import { Toaster, toast } from "svelte-5-french-toast";

  let watchlist = $state([]);

  onMount(async () => {
    try {
      const response = await fetch("http://localhost:8080/api/watchlist", {
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        watchlist = data;
      }
    } catch (error) {}
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
    } catch {}
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

      if (response.ok) {
        const response = await fetch(`http://localhost:8080/api/watchlist`, {
          credentials: "include",
        });
        watchlist = await response.json();
      }
    } catch {}
  }
</script>

<Toaster />
<div class="columns">
  <div>
    <h3>Want to watch</h3>
    {#each watchlist.filter((m) => m.status === "want_to_watch") as movie}
      <p>Title: {movie.title}</p>
      <img
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={movie.title}
      />

      <button onclick={() => markAsWatched(movie.id)}>Mark as watched</button>
      <p>Synopsis: {movie.synopsis}</p>
      <p>Release date: {movie.release_year}</p>
      <p>Rating: {movie.tmdb_rating}</p>
    {/each}
  </div>

  <div>
    <h3>Watched</h3>
    {#each watchlist.filter((m) => m.status === "watched") as movie}
      <p>Title: {movie.title}</p>
      <img
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={movie.title}
      />
      <button onclick={() => deleteFromList(movie.id)}
        >Remove from watchlist</button
      >
      <p>Synopsis: {movie.synopsis}</p>
      <p>Release date: {movie.release_year}</p>
      <p>Rating: {movie.tmdb_rating}</p>
    {/each}
  </div>
</div>

<style>
  .columns {
    display: flex;
    gap: 2rem;
  }

  .columns div {
    flex: 1;
  }
</style>
