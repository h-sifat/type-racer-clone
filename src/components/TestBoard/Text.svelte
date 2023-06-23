<script lang="ts">
  import "../InputBox/common.css";
  import { getEmptyFormattedCurrentWord } from "./util";

  export let afterText = "";
  export let beforeText = "";
  export let isLastWord = false;
  export let formattedWord = getEmptyFormattedCurrentWord();
</script>

<div class="text text-styles">
  <span class="match">
    {beforeText}
  </span>
  <span class="current-word">
    {#each formattedWord.wordChars as { char, className }}
      <span class={className}>{char}</span>
    {/each}
  </span>
  {#if !isLastWord}
    <span class={formattedWord.trailingSpaceClass} />
  {/if}
  {afterText}
</div>

<style>
  .text {
    padding: 0.2em;
    border-radius: 3px;
    background-color: #eee;
  }

  .match {
    color: var(--match-color);
  }

  .no-match {
    color: var(--nomatch-color);
    background: var(--nomatch-bg-color);
  }

  .cursor-right {
    border-right: 2.4px solid black;
    animation: blink 1s infinite;
  }

  .cursor-left {
    border-left: 2.4px solid black;
    animation: blink 1s infinite;
  }

  @keyframes blink {
    50% {
      border-color: transparent;
    }
  }

  .current-word,
  .current-word > * {
    text-decoration: underline;
    text-decoration-color: currentColor;
  }
</style>
