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
    type="submit"
    ><svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="feather feather-heart"
      ><path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg
    ></button>
</form>

<style lang="scss">
  .heart-like-button {
    font-size: 24px;
    background: #ffffff;
    border-radius: 100%;
    padding: 4px 6px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    color: #d65076;
    fill: #ffffff;
    text-shadow: -1px 1px 0 #000, 1px 1px 0 #000, 1px -1px 0 #000, -1px -1px 0 #000;
  }

  .heart-like-button.liked {
    color: #d65076;
    fill: #d65076;
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
