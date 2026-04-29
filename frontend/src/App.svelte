<script>
  import { Router, Route, Link, navigate } from "svelte-routing";
  import Login from "./pages/Login.svelte";
  // import Home from "./pages/Home.svelte";
  import Movie from "./pages/Movie.svelte";
  import Signup from "./pages/Signup.svelte";
  import WatchParty from "./pages/WatchParty.svelte";
  import Watchlist from "./pages/Watchlist.svelte";
  import { Toaster, toast } from "svelte-5-french-toast";
  import { authStore } from "./stores/authStore.js";
  import { onMount } from "svelte";
  

  onMount(async () => {
    try {
      const response = await fetch("http://localhost:8080/api/me", {
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        authStore.set(data.user);
      }
    } catch {
      authStore.set(null);
    }
  });

  async function handleLogout() {
    try {
      const response = await fetch("http://localhost:8080/api/logout", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        authStore.set(null);
        toast.success(data.successMessage, {
          position: "top-right",
        });
        navigate("/login");
      } else {
        toast.error(data.errorMessage, {
          position: "top-right",
        });
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
</script>

<Toaster />

<Router>
  <nav>
    {#if $authStore}
      <Link to="/">Home</Link>
      <Link to="/watchlist">Watchlist</Link>
      <Link to="/movie">Movies</Link>

      <h1>Welcome, {$authStore?.username}! You are logged in.</h1>
      <button onclick={handleLogout}>Logout</button>
    {:else}
      <Link to="/login">Login</Link>
      <Link to="/signup">Signup</Link>
    {/if}

    <!-- <Link to="/login">Login</Link>
    <Link to="/signup">Signup</Link>
    <Link to="/movie">Movie</Link> -->
  </nav>

  <div>
    <Route path="/">Movie Night</Route>
    <Route path="/login"><Login /></Route>
    <Route path="/signup"><Signup /></Route>
    <Route path="/movie"><Movie /></Route>
    <Route path="/watchlist"><Watchlist /></Route>
    <Route path="/watch-party"><WatchParty /></Route>
  </div>
</Router>
