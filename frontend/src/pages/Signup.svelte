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


<style>
  .container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }
  .card {
    width: 300px;
    background: grey;
    padding: 20px;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  input {
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  button {
    padding: 10px;
    border: none;
    background: black;
    color: white;
    border-radius: 5px;
    cursor: pointer;
  }

</style>