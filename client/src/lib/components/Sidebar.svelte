<script>
  import { page } from "$app/stores"
  import Avatar from "./Avatar.svelte"

  export let open = false
</script>

<aside
  class="absolute z-10 w-full bg-blue-900 shadow-lg pt-96"
  class:open
  class:hidden={!open}>
  <nav>
    <ul class="flex flex-col items-center gap-8 font-mono font-bold pb-5 mb-5 border-b border-white/20">
      <li>
        <a
          on:click={() => (open = !open)}
          href="/sites">Sites</a>
      </li>
      <li>
        <a
          on:click={() => (open = !open)}
          href="/surprise">Surprise Me</a>
      </li>
      <li>
        <a
          on:click={() => (open = !open)}
          href="/submit-a-site">Submit a Site</a>
      </li>
    </ul>
    {#if $page.data.user}
      <div class="flex flex-col gap-8 items-center mb-10">
        <a
          on:click={() => (open = !open)}
          href="/account"
          class="font-mono font-bold">
          <Avatar name={$page.data.user.name} />
        </a>
        <form
          action="/account?/sign-out"
          method="POST">
          <button
            type="submit"
            class=" font-mono font-bold">Sign out</button>
        </form>
      </div>
    {:else}
      <div class="flex flex-col gap-8 items-center font-mono font-bold mb-10">
        <a
          on:click={() => (open = !open)}
          href="/auth/sign-in">Sign In</a>
        <a
          on:click={() => (open = !open)}
          href="/auth/sign-up">Sign Up</a>
      </div>
    {/if}
  </nav>
</aside>

<style>
  aside {
    right: -100%;
    transition: right 0.3s ease-in-out;
  }

  .open {
    right: 0;
  }
</style>
