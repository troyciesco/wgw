<script lang="ts">
  import type { PageData } from "./$types"

  export let data: PageData
</script>

<h1>surprise</h1>
<pre>{JSON.stringify(data, null, 2)}</pre>
