<script lang="ts">
  import { onMount } from "svelte"

  let isDarkModeEnabled = false

  function toggleDarkMode() {
    isDarkModeEnabled = !isDarkModeEnabled
    localStorage.setItem("theme", isDarkModeEnabled ? "dark" : "light")

    isDarkModeEnabled
      ? document.documentElement.classList.add("dark")
      : document.documentElement.classList.remove("dark")
  }

  onMount(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      isDarkModeEnabled = true
    }
  })
</script>

<footer class="p-8 text-center">
  <p>&copy; {new Date().getFullYear()} Wicked Good Websites. All Rights Reserved.</p>
  <button on:click={toggleDarkMode}>Switch to {isDarkModeEnabled ? "light mode" : "dark mode"}</button>
</footer>
