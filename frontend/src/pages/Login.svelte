<script>
  import { navigate } from "svelte-routing";
  import { authStore } from "../stores/authStore.js";
  import { toast, Toaster } from "svelte-5-french-toast";

  let email = $state("");
  let password = $state("");

  async function handleLogin() {
    try {
      const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        authStore.set(data.user);
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

<div class="container">
  <div class="card">
    <h2>Login</h2>
    <input bind:value={email} placeholder="Email" />
    <input type="password" bind:value={password} placeholder="Password" />
    <button onclick={handleLogin}>Login</button>
  </div>
</div>
