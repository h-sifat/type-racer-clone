<script lang="ts">
  export let currentWord = "";
  export let isTypo = false;
</script>

{#if isTypo}
  <p class="error-msg">
    {`Please type`} <span class="pill">{currentWord}</span> correctly to continue.
  </p>
{:else}
  <p class="error-msg">{@html "&nbsp;"}</p>
{/if}

<style>
  .error-msg {
    margin-top: 0.7em;
    text-align: center;
  }
</style>
