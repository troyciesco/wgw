<script lang="ts">
  export let name: string
  const wordsInName = name.split(" ")

  let initials = wordsInName[0][0].toUpperCase()

  if (wordsInName.length > 1) {
    initials = initials + wordsInName[wordsInName.length - 1][0].toUpperCase()
  }
</script>

<span
  class="h-8 w-8 overflow-hidden rounded-full bg-amber-300 text-amber-800 font-bold flex items-center justify-center">
  <span class="text-lg">{initials}</span>
</span>
