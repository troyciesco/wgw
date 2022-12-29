<script lang="ts">
  import { enhance } from "$app/forms"

  export let favoriteId = ""
  export let siteId: any
</script>

<form
  method="POST"
  action="/api?/toggle-favorite"
  use:enhance>
  <input
    type="hidden"
    name="favoriteId"
    value={favoriteId} />
  <input
    type="hidden"
    name="siteId"
    value={siteId} />
  <button
    class="heart-like-button"
    class:liked={favoriteId}
    type="submit">❤</button>
</form>

<style lang="scss">
  .heart-like-button {
    font-size: 24px;
    background: #ffffff;
    border-radius: 100%;
    padding: 2px 8px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    color: #ffffff;
    text-shadow: -1px 1px 0 #000, 1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000;
  }

  .heart-like-button.liked {
    color: #d65076;
    animation: liked 0.25s ease-in-out;
  }
  @keyframes liked {
    0% {
      transform: scale(0.8);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
