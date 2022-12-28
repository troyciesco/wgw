<script lang="ts">
  import type { PageData } from "./$types"
  import Card from "$lib/components/Card.svelte"
  import { page } from "$app/stores"

  export let data: PageData
  const searchString = $page.url.searchParams.get("search") ?? ""
  const selectedTags = [...new Set($page.url.searchParams.get("tags")?.split(" "))]
  const selectedCategories = [...new Set($page.url.searchParams.get("categories")?.split(" "))]
</script>

<div class="pt-8">
  <h1 class="text-center text-5xl mb-8">Sites</h1>
  <section class="max-w-7xl mx-auto grid grid-cols-12">
    <aside class="col-span-2">
      <div class="text-2xl">Filters</div>
      <div>
        <form
          method="POST"
          action="?/search-and-filter"
          class="flex flex-col">
          <div class="flex flex-col">
            <button type="submit">Search</button>
            <div>Text Search</div>
            <label
              class="sr-only"
              for="search">Search</label>
            <input
              class="border border-blue-700"
              type="text"
              name="search"
              value={searchString}
              placeholder="Search..." />
            <div class="font-bold">categories</div>
            {#each data.categories as category}
              <label>
                <input
                  type="checkbox"
                  name={`category:${category.slug}`}
                  checked={selectedCategories.includes(category.slug)} />
                {category.name}
              </label>
            {/each}
          </div>
          <div class="flex flex-col">
            <div class="font-bold">tags</div>
            {#each data.tags as tag}
              <label>
                <input
                  type="checkbox"
                  name={`tag:${tag.slug}`}
                  checked={selectedTags.includes(tag.slug)} />
                {tag.name}
              </label>
            {/each}
          </div>
        </form>
      </div>
    </aside>
    <main class="col-span-10 flex mx-auto gap-10 items-center">
      {#each data.sites as site}
        <Card {site} />
      {/each}
    </main>
  </section>
</div>
