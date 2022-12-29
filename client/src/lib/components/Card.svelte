<script lang="ts">
  import { getImage } from "$lib/utils"
  import { page } from "$app/stores"
  import Heart from "./Heart.svelte"

  export let site: any
  export let imgLoading: "eager" | "lazy" = "eager"

  $: src = getImage(site.portraitImage, 2)
</script>

<div class="bg-white dark:bg-slate-700 h-full shadow-md rounded-lg w-[21rem] relative group">
  {#if $page.data.user}
    <div
      class="absolute z-10 top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 ease-in-out"
      class:opacity-100={site.favorites[0]?.id}>
      <Heart
        siteId={site.id}
        favoriteId={site.favorites[0]?.id ?? ""} />
    </div>
  {/if}
  <a href={`/sites/${site.slug}`}>
    <div class="relative w-[21rem] h-[28rem] rounded-lg overflow-hidden">
      <img
        class="absolute w-full h-full object-cover rounded-lg transition-all duration-300 ease-in-out transform group-hover:scale-125"
        style="aspect-ratio: 4/3;"
        loading={imgLoading}
        {src}
        alt={site.name} />
      <div
        class="h-1/4 bottom-0 w-full absolute bg-slate-900/30 flex items-center rounded-bl-lg rounded-br-lg backdrop-blur-2xl">
        <h3 class="font-bold px-4 text-2xl text-white">{site.name}</h3>
      </div>
    </div>
  </a>
</div>
