<script lang="ts" context="module">
  import type { CharState } from "./interface";

  const charStateToClassMap = Object.freeze({
    incorrect: "typo",
    correct: "matched",
  });

  function getCharClass(states: CharState[], hasFocus: boolean) {
    if (!hasFocus)
      states = states.filter((state) => !state.startsWith("cursor"));

    return states
      .map((state) =>
        state in charStateToClassMap ? charStateToClassMap[state] : state
      )
      .join(" ");
  }
</script>

<script lang="ts">
  import "../InputBox/common.css";
  import { getEmptyFormattedCurrentWord } from "./util";

  export let afterText = "";
  export let beforeText = "";
  export let isLastWord = false;
  export let isInputFocused: boolean;
  export let formattedWord = getEmptyFormattedCurrentWord();
</script>

<div class="text text-styles">
  <span class="matched">
    {beforeText}
  </span>
  <span class="current-word">
    {#each formattedWord.wordChars as { char, states }}
      <span class={getCharClass(states, isInputFocused)}>{char}</span>
    {/each}
  </span>
  {#if !isLastWord}
    <span
      class={getCharClass(formattedWord.trailingSpaceStates, isInputFocused)}
    />
  {/if}
  {afterText}
</div>

<style>
  .text {
    padding: 0.2em;
    border-radius: 3px;
    background-color: #eee;
    user-select: none;
  }

  .matched {
    color: var(--matched-color);
  }

  .typo {
    color: var(--typo-color);
    background: var(--typo-bg-color);
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
