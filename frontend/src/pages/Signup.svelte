<script>
  import { navigate } from "svelte-routing";
  import { Toaster, toast } from "svelte-5-french-toast";

  let username = $state("");
  let email = $state("");
  let password = $state("");

  async function handleSignup() {
    try {
      const response = await fetch("http://localhost:8080/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, email, password }),
      });
      const data = await response.json();

      if (response.ok) {
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

<div class="container">
    <div class="card">
        <h2>Signup</h2>
        <input bind:value={username} placeholder="Username" />
        <input bind:value={email} placeholder="Email" />
        <input type="password" bind:value={password} placeholder="Password" />
        <button onclick={handleSignup}>Signup</button>
    </div>
</div>
