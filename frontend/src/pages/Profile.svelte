<script>
  import { onMount } from "svelte";
  import { createAvatar } from "@dicebear/core";
  import { lorelei } from "@dicebear/collection";

  let user = $state(null);
  let watchlist = $state([]);
  let ratings = $state([]);

  onMount(async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/users/me/profile`,
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

  const avatar = $derived(
    user
      ? createAvatar(lorelei, {
          seed: user.username,
          size: 128,
        }).toDataUri()
      : "",
  );
</script>

<h1>Hello</h1>
<div class="columns">
  {#if user}
    <div class="profile-header">
      <div class="avatar">
        <img src={avatar} alt="Avatar" />
      </div>

      <div>
        <h1>{user.username}</h1>
        <p>Member since {user.created_at}</p>
      </div>
    </div>
  {/if}
</div>

<style>
  .profile-header {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: #2a2a2a;
  }
</style>
