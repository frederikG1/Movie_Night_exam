<script>
  let movie = $state("");
  let results = $state([]);

  async function findMovie() {
    try {
      const response = await fetch(
        `http://localhost:8080/api/movies/search?q=${movie}`,
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
  <input bind:value={movie} placeholder="Moviename" />
  <button onclick={findMovie}>Search</button>

  {#each results as movie}
    <div>
      <p>Title: {movie.title}</p>
      <img
        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
        alt={movie.title}
      />
      <p>Synopsis: {movie.overview}</p>
      <p>Release date: {movie.release_date}</p>
      <p>Rating: {movie.vote_average}</p>
    </div>
  {/each}
</div>
