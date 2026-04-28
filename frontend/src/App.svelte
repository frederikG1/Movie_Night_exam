<script>
  import { Router, Route, Link } from "svelte-routing";
  import Login from "./pages/Login.svelte";
  import Home from "./pages/Home.svelte";
  import Movie from "./pages/Movie.svelte";
  import Signup from "./pages/Signup.svelte";
  import WatchParty from "./pages/WatchParty.svelte";
  import Watchlist from "./pages/Watchlist.svelte";
  import { Toaster } from "svelte-5-french-toast";
</script>

<Toaster />
<Router>
  <nav>
    <Link to="/login">Login</Link>
    <Link to="/signup">Signup</Link>
    <Link to="/movie">Movie</Link>
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
