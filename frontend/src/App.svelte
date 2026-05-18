<script>
  import { Router, Route, Link, navigate } from "svelte-routing";
  import Login from "./pages/Login.svelte";
  import Home from "./pages/Home.svelte";
  import Movie from "./pages/Movie.svelte";
  import Movies from "./pages/Movies.svelte";
  import Signup from "./pages/Signup.svelte";
  import Watchlist from "./pages/Watchlist.svelte";
  import Profile from "./pages/Profile.svelte";
  import { Toaster, toast } from "svelte-5-french-toast";
  import { authStore } from "./stores/authStore.js";
  import { onMount } from "svelte";
  import UsersSite from "./pages/UsersSite.svelte";

  onMount(async () => {
    try {
      const response = await fetch("http://localhost:8080/api/me", {
        credentials: "include",
      });
      const data = await response.json();

      if (response.ok) {
        authStore.set(data.user);
      } else {
        navigate("/");
      }
    } catch {
      authStore.set(null);
    }
  });

  async function handleLogout() {
    if (!confirm("Are you sure you want to log out?")) {
      return;
    }
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
        navigate("/");
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
  <nav class="navbar">
    <div class="logo">
      <Link to="/">🎬 Movie Night</Link>
    </div>

    {#if $authStore}
      <div class="center-nav">
        <Link to="/">Home</Link>
        <Link to="/movies">Movies</Link>
        <Link to="/users">Users</Link>
      </div>

      <span>Welcome, {$authStore?.username}! </span>

      <div class="dropdown">
        <span>My profile</span>
        <div class="dropdown-menu">
          <Link to="/profile">Profile</Link>
          <Link to="/watchlist">Watchlist</Link>
          <button class="btn" onclick={handleLogout}>Logout</button>
        </div>
      </div>
    {:else}
      <div class="center-nav">
        <Link to="/login">Login</Link>
        <Link to="/signup">Create account</Link>
        <Link to="/movies">Movies</Link>
        <Link to="/users">Users</Link>
      </div>
    {/if}

    <!-- <Link to="/login">Login</Link>
    <Link to="/signup">Signup</Link>
    <Link to="/movie">Movie</Link> -->
  </nav>

  <div>
    <Route path="/"><Home /></Route>
    <Route path="/login"><Login /></Route>
    <Route path="/signup"><Signup /></Route>
    <Route path="/movies"><Movies /></Route>
    <Route path="/profile"><Profile /></Route>
    <Route path="/movies/:id" let:params>
      <Movie id={params.id} /></Route
    >
    <!-- Think of let:params as the Route component saying "here's what I found in the URL, you can use it" -->
    <Route path="/watchlist"><Watchlist /></Route>
    <Route path="/users/:id" let:params>
      <UsersSite id={params.id} /></Route
    >
  </div>
</Router>

<style>
  .dropdown {
    position: relative;
    display: inline-block;
    cursor: pointer;
  }

  .dropdown-menu {
    display: none;
    position: absolute;
    border-radius: 6px;
    min-width: 100px;
    background: #1a1a1a;
    padding: 0.5rem;
    z-index: 1;
  }

  .dropdown-menu :global(a) {
    height: 3vh;
    text-decoration: none;
    display: block;
  }

  .dropdown:hover .dropdown-menu {
    display: block;
    cursor: pointer;
  }

  .center-nav {
    margin: 40ch;
    display: flex;
    gap: 2rem;
  }

  .logo :global(a) {
    font-size: 1.25rem;
    font-weight: bold;
    color: white;
    text-decoration: none;
  }

  .logo :global(a:hover) {
    color: #00c030;
  }
</style>
