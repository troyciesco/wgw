<script lang="ts">
  import type { PageData } from "./$types"

  export let data: PageData
</script>

<main class="max-w-7xl mx-auto pt-10">
  {#if !data.user?.id}
    <div class="text-center space-y-4">
      <h1 class="text-3xl">You must be signed in to submit a site.</h1>
      <p>
        Have an account already? <a
          href="/auth/sign-in"
          class="underline">Sign In</a>
      </p>
      <p>
        Need an account? <a
          href="/auth/sign-up"
          class="underline">Sign Up</a>
      </p>
    </div>
  {:else}
    <h1 class="text-center text-3xl mb-10">Submit a site</h1>
    <div class="max-w-xl mx-auto flex flex-col px-10 justify-center">
      <form
        method="POST"
        action="?/submit-a-site"
        class="p-8 border flex flex-col gap-4">
        <input
          class="border p-4"
          type="text"
          name="name"
          placeholder="Name of the site"
          required />
        <input
          class="border p-4"
          type="text"
          name="link"
          placeholder="Link to the site"
          required />
        <button type="submit">Submit Site</button>
      </form>
    </div>
  {/if}
</main>
