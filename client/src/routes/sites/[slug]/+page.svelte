<script lang="ts">
  import { page } from "$app/stores"
  import Heart from "$lib/components/Heart.svelte"
  import { getImage } from "$lib/utils"
  import type { PageData } from "./$types"

  export let data: PageData

  $: src = getImage(data.landscapeImage, 3)
</script>

<main class="pt-10">
  <section class="max-w-7xl mx-auto mb-20">
    <div class="flex items-center justify-between px-4 md:px-0 mb-10">
      <h1 class="text-6xl font-headline font-bold">{data.name}</h1>
      {#if $page.data.user}
        <Heart
          siteId={data.id}
          favoriteId={data.favorites[0]?.id ?? ""} />
      {/if}
    </div>

    <div class="grid grid-cols-1 px-4 md:px-0 md:grid-cols-12 gap-4">
      <div class="col-span-1 md:col-span-9 w-full">
        <img
          class="object-cover rounded-lg shadow-md shadow-cyan-600"
          style="aspect-ratio: 4/3;"
          {src}
          alt={data.name} />
      </div>
      <div class="col-span-1 md:col-span-3">
        <div
          class="border rounded-lg dark:bg-slate-800 shadow-cyan-600 border-cyan-700 shadow-md px-4 py-6 flex flex-col justify-between h-full">
          <div>
            <div class="mb-8">
              <h3 class="text-lg font-bold mb-2">Description</h3>

              <p>{data.description}</p>
            </div>
            <div class="mb-8">
              <h3 class="text-lg font-bold mb-2">Categories</h3>
              <div class="flex gap-4 mb-4 flex-wrap">
                {#each data.categories as category}
                  <a
                    href={`/sites?categories=${category.slug}`}
                    class="text-sm underline">{category.name}</a>
                {/each}
              </div>
            </div>
            <div class="mb-8">
              <h3 class="text-lg font-bold mb-2">Tags</h3>
              <div class="flex gap-4 mb-4 flex-wrap">
                {#each data.tags as tag}
                  <a
                    href={`/sites?tags=${tag.slug}`}
                    class="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold font-mono text-blue-800"
                    >{tag.name}</a>
                {/each}
              </div>
            </div>
          </div>
          <a
            class="underline font-bold"
            href={data.link}
            target="_blank"
            rel="noreferrer">Visit Site</a>
        </div>
      </div>
    </div>
  </section>
  <section class="max-w-prose mx-auto px-4 md:px-0">
    <h2 class="text-5xl mb-4 font-bold">About this site</h2>
    <div class="space-y-4 mb-8">
      <p class="text-lg">{data.description}</p>
      <p class="text-lg">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime, est? Nemo maiores modi esse enim, autem
        eligendi velit odio totam molestias, maxime illo, dolores beatae in! Possimus quidem impedit saepe asperiores
        nemo porro inventore, accusantium iusto fugit distinctio. Eveniet corporis ipsam neque maxime a vero dignissimos
        non facilis nesciunt quos.
      </p>
    </div>
    <h2 class="text-5xl mb-4 font-bold">Things we like</h2>
    <div class="space-y-4 mb-8">
      <ul class="list-disc ml-4 text-lg">
        <li>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi, veniam.</li>
        <li>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi, veniam.</li>
        <li>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi, veniam.</li>
        <li>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi, veniam.</li>
        <li>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi, veniam.</li>
      </ul>
    </div>
    <h2 class="text-5xl mb-4 font-bold">Things we'd change</h2>
    <div class="space-y-4 mb-8">
      <ul class="list-disc ml-4 text-lg">
        <li>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi, veniam.</li>
        <li>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi, veniam.</li>
        <li>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi, veniam.</li>
        <li>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi, veniam.</li>
        <li>Lorem ipsum dolor sit amet consectetur, adipisicing elit. Animi, veniam.</li>
      </ul>
    </div>
  </section>
</main>
