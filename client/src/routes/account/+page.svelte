<script lang="ts">
  import type { PageData } from "./$types"

  export let data: PageData
  $: ({ user, submissions, favorites } = data)
</script>

<main>
  <div class="max-w-7xl mx-auto pt-10">
    <section class="mb-10">
      <h1 class="text-5xl text-center">Greetings, {user.name}.</h1>
    </section>
    <section class="mb-10">
      <h2 class="mb-4 text-3xl text-center">Submissions</h2>
      {#if submissions.length === 0}
        <p class="text-center max-w-prose mx-auto italic">
          You haven't submitted any sites yet! If you'd like to submit a site to be featured on Wicked Good Websites,
          you can do so <a
            class="underline font-bold"
            href="/submit-a-site">here</a
          >.
        </p>
      {:else}
        <div class="max-w-2xl mx-auto flex flex-col">
          <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5">
                <table class="min-w-full divide-y divide-gray-300">
                  <thead class="bg-gray-50">
                    <tr class="divide-x divide-gray-200">
                      <th
                        scope="col"
                        class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pl-6">Name</th>
                      <th
                        scope="col"
                        class="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Link</th>
                      <th
                        scope="col"
                        class="px-4 py-3.5 text-left text-sm font-semibold text-gray-900">Date Submitted</th>
                      <th
                        scope="col"
                        class="py-3.5 pl-4 pr-4 text-left text-sm font-semibold text-gray-900 sm:pr-6">Status</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">
                    {#each submissions as submission}
                      <tr class="divide-x divide-gray-200">
                        <td class="whitespace-nowrap py-4 pl-4 pr-4 text-sm font-medium text-gray-900 sm:pl-6"
                          >{submission.name}</td
                        ><td class="whitespace-nowrap p-4 text-sm text-gray-500">{submission.link}</td>
                        <td class="whitespace-nowrap p-4 text-sm text-gray-500">Date submitted</td>
                        <td class="whitespace-nowrap py-4 pl-4 pr-4 text-sm text-gray-500 sm:pr-6"
                          >{submission.status}</td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      {/if}
    </section>
    <section class="mb-10">
      <h2 class="mb-4 text-3xl text-center">Favorites</h2>
      {#if favorites.length === 0}
        <p class="text-center max-w-prose mx-auto italic">
          You haven't favorited any sites yet! Check out all of our <a
            href="/sites"
            class="underline font-bold">wicked good sites</a
          >.
        </p>
      {:else}
        {#each favorites as favorite}
          <div class="text-center">
            <a href={`sites/${favorite.site.slug}`}>{favorite.site.name}</a>
          </div>
        {/each}
      {/if}
    </section>
    <section class="mb-10 max-w-2xl mx-auto">
      <h2 class="mb-4 text-3xl text-center">Settings</h2>
      <form
        action=""
        class="p-8 flex flex-col gap-6 dark:bg-slate-800 shadow-cyan-600/70 border-cyan-700 shadow-md border-2">
        <label class="flex flex-col gap-1">
          Name
          <input
            class="border p-4 "
            type="text"
            name="name"
            value={user.name} />
        </label>
        <label class="flex flex-col gap-1">
          Email
          <input
            class="border p-4 "
            type="email"
            name="email"
            value={user.email} />
        </label>
      </form>
    </section>
  </div>
</main>
