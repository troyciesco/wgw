<script lang="ts">
  import type { PageData } from "./$types"
  import Card from "$lib/components/Card.svelte"
  export let data: PageData
</script>

<main class="max-w-7xl mx-auto px-4">
  <section class="py-20">
    <h1 class="text-center text-6xl py-10 font-headline font-bold">
      This site showcases <span class="text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-600"
        >cool designs</span> and such.
    </h1>
  </section>
  <section class="max-w-7xl mx-auto mb-40">
    <h2 class="text-6xl mb-10 font-bold text-center md:text-left">Featured Sites</h2>
    <div class="flex items-center gap-8 justify-center md:justify-between flex-wrap">
      {#each data.featuredSites as featuredSite}
        <Card site={featuredSite} />
      {/each}
    </div>
  </section>
  <section>
    <div class="flex justify-between items-baseline mb-10">
      <h2 class="text-5xl">More Sites</h2>
      {#if data.moreSites.length === 6}
        <a
          href="/sites"
          class="underline font-bold text-lg">View All</a>
      {/if}
    </div>
    <div class="flex items-center justify-center md:justify-between gap-8 flex-wrap">
      {#each data.moreSites as site}
        <Card
          {site}
          imgLoading="lazy" />
      {/each}
    </div>
  </section>
</main>
