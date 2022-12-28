<script lang="ts">
  import Footer from "$lib/components/Footer.svelte"
  import Header from "$lib/components/Header.svelte"
  import "../styles/index.scss"
</script>

<svelte:head>
  <title>Wicked Good Websites</title>

  <meta
    name="description"
    content="This is a showcase for websites with wicked good typography, animation, colors, and overall design." />
  <script>
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  </script>
</svelte:head>

<div class="flex flex-col min-h-screen dark:bg-slate-900 dark:text-white">
  <Header />
  <div class="flex-grow">
    <slot />
  </div>
  <Footer />
</div>
