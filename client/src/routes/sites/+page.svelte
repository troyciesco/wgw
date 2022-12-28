<script lang="ts">
  import type { PageData } from "./$types"
  import { page } from "$app/stores"
  import { goto } from "$app/navigation"
  import LandscapeCard from "$lib/components/LandscapeCard.svelte"

  let isSortMenuOpen = false

  export let data: PageData
  $: searchString = $page.url.searchParams.get("search") ?? ""
  $: selectedTags = [...new Set($page.url.searchParams.get("tags")?.split(" "))]
  $: selectedCategories = [...new Set($page.url.searchParams.get("categories")?.split(" "))]
  $: selectedSort = [...new Set($page.url.searchParams.get("sort")?.split(" "))]

  async function handleUpdateFilters(newFilter: any) {
    const newParams: any = { search: null, tags: null, categories: null, sort: null }

    if (newFilter.type === "search") {
      searchString = newFilter.value
    }

    if (newFilter.type === "category") {
      const categoryIndex = selectedCategories?.indexOf(newFilter.value)

      // it exists already, so we want to remove it
      if (categoryIndex !== -1) {
        selectedCategories?.splice(categoryIndex, 1)
      } else {
        selectedCategories = [...selectedCategories, newFilter.value]
      }
    }

    if (newFilter.type === "tag") {
      const tagIndex = selectedTags?.indexOf(newFilter.value)
      // it exists already, so we want to remove it
      if (tagIndex !== -1) {
        selectedTags?.splice(tagIndex, 1)
      } else {
        selectedTags = [...selectedTags, newFilter.value]
      }
    }

    if (newFilter.type === "sort") {
      const existingSortType = selectedSort.find((sortItem) => sortItem.includes(newFilter.value.field))
      if (existingSortType) {
        if (existingSortType.endsWith(newFilter.value.direction)) {
          selectedSort?.splice(selectedSort?.indexOf(existingSortType), 1)
        } else {
          console.log("hit")
          console.log(selectedSort?.indexOf(existingSortType))
          selectedSort?.splice(
            selectedSort?.indexOf(existingSortType),
            1,
            `${newFilter.value.field}:${newFilter.value.direction}`
          )
          console.log(selectedSort)
        }
      } else {
        selectedSort = [...selectedSort, `${newFilter.value.field}:${newFilter.value.direction}`]
      }
    }

    newParams.search = searchString
    newParams.categories = selectedCategories && selectedCategories.length > 0 ? selectedCategories.join(" ") : null
    newParams.tags = selectedTags && selectedTags.length > 0 ? selectedTags.join(" ") : null
    newParams.sort = selectedSort && selectedSort.length > 0 ? selectedSort.join(" ") : null

    const newStrArr = []

    let newUrl = `/sites`

    if (newParams.search) {
      newStrArr.push(`search=${newParams.search}`)
    }
    if (newParams.categories) {
      newStrArr.push(`categories=${newParams.categories}`)
    }
    if (newParams.tags) {
      newStrArr.push(`tags=${newParams.tags}`)
    }
    if (newParams.sort) {
      newStrArr.push(`sort=${newParams.sort}`)
    }

    const qs = newStrArr.join("&")
    if (qs) {
      newUrl += `?${qs}`
    }

    goto(newUrl)
  }
</script>

<div class="pt-8">
  <!-- <h1 class="text-center text-6xl mb-8">Sites</h1> -->
  <div class="max-w-7xl mx-auto flex items-baseline justify-between border-b border-gray-200 pt-10 pb-6 mb-10">
    <h1 class="text-6xl font-bold text-gray-900">All Sites</h1>

    <div class="flex items-center">
      <div class="relative inline-block text-left">
        <div>
          <button
            type="button"
            class="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900"
            id="menu-button"
            on:click={() => (isSortMenuOpen = !isSortMenuOpen)}
            aria-expanded="false"
            aria-haspopup="true">
            Sort
            <!-- Heroicon name: mini/chevron-down -->
            <svg
              class="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true">
              <path
                fill-rule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clip-rule="evenodd" />
            </svg>
          </button>
        </div>

        <!--
          Dropdown menu, show/hide based on menu state.

          Entering: "transition ease-out duration-100"
            From: "transform opacity-0 scale-95"
            To: "transform opacity-100 scale-100"
          Leaving: "transition ease-in duration-75"
            From: "transform opacity-100 scale-100"
            To: "transform opacity-0 scale-95"
        -->
        <div
          class="absolute right-0 z-20 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none"
          class:hidden={!isSortMenuOpen}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="menu-button"
          tabindex="-1">
          <div
            class="py-1"
            role="none">
            <!--
              Active: "bg-gray-100", Not Active: ""

              Selected: "font-medium text-gray-900", Not Selected: "text-gray-500"
            -->
            <button
              on:click={() => handleUpdateFilters({ type: "sort", value: { field: "createdAt", direction: "desc" } })}
              class="font-medium text-gray-700 block px-4 py-2 text-sm"
              class:bg-blue-500={selectedSort.includes("createdAt:desc")}
              role="menuitem"
              tabindex="-1"
              id="menu-item-0">Newest First</button>

            <button
              on:click={() => handleUpdateFilters({ type: "sort", value: { field: "createdAt", direction: "asc" } })}
              class="text-gray-700 block px-4 py-2 text-sm"
              class:bg-blue-500={selectedSort.includes("createdAt:asc")}
              role="menuitem"
              tabindex="-1"
              id="menu-item-1">Oldest First</button>

            <button
              on:click={() => handleUpdateFilters({ type: "sort", value: { field: "name", direction: "asc" } })}
              class:bg-blue-500={selectedSort.includes("name:asc")}
              class="text-gray-700 block px-4 py-2 text-sm"
              role="menuitem"
              tabindex="-1"
              id="menu-item-2">Name: A - Z</button>

            <button
              on:click={() => handleUpdateFilters({ type: "sort", value: { field: "name", direction: "desc" } })}
              class:bg-blue-500={selectedSort.includes("name:desc")}
              class="text-gray-700 block px-4 py-2 text-sm"
              role="menuitem"
              tabindex="-1"
              id="menu-item-3">Name: Z - A</button>
          </div>
        </div>
      </div>

      <button
        type="button"
        class="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden">
        <span class="sr-only">Filters</span>
        <!-- Heroicon name: mini/funnel -->
        <svg
          class="h-5 w-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 01.628.74v2.288a2.25 2.25 0 01-.659 1.59l-4.682 4.683a2.25 2.25 0 00-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 018 18.25v-5.757a2.25 2.25 0 00-.659-1.591L2.659 6.22A2.25 2.25 0 012 4.629V2.34a.75.75 0 01.628-.74z"
            clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </div>

  <section class="max-w-7xl mx-auto grid grid-cols-12 gap-12 items-start">
    <aside
      class="col-span-3 border rounded-lg dark:bg-slate-800 dark:shadow-cyan-600 dark:border-cyan-700 shadow-md px-6 py-6 flex flex-col h-full">
      <div class="text-2xl">Filters</div>
      <div>
        <div class="flex flex-col">
          <div class="flex flex-col">
            <div>Text Search</div>
            <label
              class="sr-only"
              for="search">Search</label>
            <input
              class="border border-blue-700"
              type="text"
              name="search"
              value={searchString}
              on:change={(event) => handleUpdateFilters({ type: "search", value: event.target.value })}
              placeholder="Search..." />
            <div class="font-bold">categories</div>
            {#each data.categories as category}
              <button
                type="button"
                on:click={() => handleUpdateFilters({ type: "category", value: category.slug })}
                class:bg-blue-500={selectedCategories.includes(category.slug)}>
                {category.name}
              </button>
            {/each}
          </div>
          <div class="flex flex-col">
            <div class="font-bold">tags</div>
            {#each data.tags as tag}
              <button
                type="button"
                on:click={() => handleUpdateFilters({ type: "tag", value: tag.slug })}
                class:bg-blue-500={selectedTags.includes(tag.slug)}>
                {tag.name}
              </button>
            {/each}
          </div>
        </div>
      </div>
    </aside>
    <main class="col-span-9 flex mx-auto gap-10 items-center justify-start flex-wrap">
      {#each data.sites as site}
        <LandscapeCard {site} />
      {/each}
    </main>
  </section>
</div>
