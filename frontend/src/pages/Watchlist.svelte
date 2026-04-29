<script>
  import { onMount } from "svelte";

  let { movie } = $state(null);
  let { id } = $props();

  onMount(async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/watchlist/${id}`,
        {
          credentials: "include",
        },
      );
      const data = await response.json();

      if (response.ok) {
        movie = data;
      }
    } catch {}
  });
</script>
