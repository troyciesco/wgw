<script lang="ts">
  import { page } from "$app/stores"
  import Avatar from "./Avatar.svelte"
</script>

<header class="grid items-center grid-cols-8 w-full p-5 bg-blue-900 dark:bg-slate-900 text-white">
  <div class="col-span-2">
    <a
      href="/"
      class="text-xl font-logo font-bold italic">Wicked Good Websites</a>
  </div>
  <nav class="col-span-4 flex justify-center">
    <ul class="flex items-center gap-8 font-mono font-bold">
      <li>
        <a href="/sites">Sites</a>
      </li>
      <li>
        <a href="/surprise">Surprise Me</a>
      </li>
      <li>
        <a href="/submit-a-site">Submit a Site</a>
      </li>
    </ul>
  </nav>
  <div class="col-span-2 flex gap-10 items-center justify-end">
    <!-- <form
      class="flex"
      role="search"
      method="POST"
      action="/?/search">
      <label
        class="sr-only"
        for="search">Search</label>
      <input
        class="border border-emerald-700"
        type="text"
        name="search"
        placeholder="Search..." />
      <button
        type="submit"
        class="border border-emerald-700 text-emerald-100 py-1 px-2 bg-emerald-700">Search</button>
    </form> -->
    {#if $page.data.user}
      <div class="flex gap-4 items-center">
        <a
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
      <div class="flex gap-4 items-center font-mono font-bold">
        <a href="/auth/sign-in">Sign In</a>
        <a href="/auth/sign-up">Sign Up</a>
      </div>
    {/if}
  </div>
</header>
