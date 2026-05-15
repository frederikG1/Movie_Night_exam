<script>
  import { onMount } from "svelte";

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
    } catch {}
  });
</script>
