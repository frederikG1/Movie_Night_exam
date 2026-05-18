<script>
  import { onMount } from "svelte";
  import { createAvatar } from "@dicebear/core";
  import { lorelei } from "@dicebear/collection";

  let { id } = $props();
  let user = $state(null);
  let watchlist = $state([]);
  let ratings = $state([]);

  onMount(async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/users/${id}/profile`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();

      if (response.ok) {
        user = data.user;
        watchlist = data.watchlist;
        ratings = data.ratings;
      }
    } catch (error) {
      toast.error(error.message);
    }
  });

  const avatar = $derived(
    user
      ? createAvatar(lorelei, {
          seed: user.username,
          size: 128,
        }).toDataUri()
      : "",
  );
</script>

<div class="container">
  {#if user}
    <div class="card">
      <div class="avatar">
        <img src={avatar} alt="Avatar" />
      </div>
      <div class="profile-info">
        <!-- <div class="profile-notes">
        <h1>Likes: </h1>
        <h1>Dislikes: </h1>
      </div> -->
        <h1>{user.username}</h1>
        <p class="member-since">Member since {user.created_at}</p>
      </div>

      <div class="stats">
        <div class="stat">
          <span class="stat-number"
            >{watchlist.filter((m) => m.status === "watched").length}</span
          >
          <span class="stat-label">Watched</span>
        </div>
        <div class="stat">
          <span class="stat-number"
            >{watchlist.filter((m) => m.status === "want_to_watch")
              .length}</span
          >
          <span class="stat-label">In watchlist</span>
        </div>
        <div class="stat">
          <span class="stat-number">{ratings.length}</span>
          <span class="stat-label">Movies reviewed</span>
        </div>
      </div>
    </div>

    <div class="columns">
      <div>
        {#if watchlist.filter((m) => m.status === "watched").length > 0}
          <section class="movie-section">
            <h2>Recently watched</h2>
            <div class="movie-row">
              {#each watchlist.filter((m) => m.status === "watched") as movie}
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                />
              {/each}
            </div>
          </section>
        {/if}
        {#if watchlist.filter((m) => m.status === "want_to_watch").length > 0}
          <section class="movie-section">
            <h2>In watchlist</h2>
            <div class="movie-row">
              {#each watchlist.filter((m) => m.status === "want_to_watch") as movie}
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                />
              {/each}
            </div>
          </section>
        {/if}
      </div>

      <div>
        {#if ratings.length > 0}
          <section class="movie-section">
            <h2>Recently reviewed</h2>
            <div class="movie-row">
              {#each ratings as rating}
                <img
                  src={`https://image.tmdb.org/t/p/w200${rating.poster_path}`}
                  alt={rating.title}
                />
              {/each}
            </div>
          </section>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 2000px;
    margin: 1rem auto;
    padding: 0 2rem;
  }

  .columns {
    display: flex;
    gap: 2rem;
  }

  .columns div {
    flex: 1;
  }

  .card {
    display: flex;
    gap: 2rem;
    align-items: center;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    padding: 2rem;
  }

  .avatar img {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    background: #2a2a2a;
  }

  .profile-info {
    flex: 1;
  }

  .profile-info h1 {
    margin: 0;
    font-size: 2rem;
  }

  .member-since {
    color: #888;
    margin: 0.5rem 0 1.5rem;
    font-size: 0.875rem;
  }

  .stats {
    display: flex;
    gap: 2rem;
  }

  .stats {
    display: flex;
    flex-direction: column;
  }

  .stat-number {
    font-size: 2rem;
    font-weight: bold;
    color: white;
  }

  .stat-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #888;
  }

  .movie-section {
    margin-top: 2rem;
    background: rgba(255, 255, 255, 0.03);
    border-radius: 12px;
    padding: 2rem;
  }

  .movie-section h2 {
    margin: 0 0 1rem;
    font-size: 1.5rem;
    color: #ccc;
  }

  .movie-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .movie-row img {
    width: 100px;
    border-radius: 4px;
    flex-shrink: 0;
  }
</style>
