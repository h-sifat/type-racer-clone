<script context="module" lang="ts">
  import type { FormattedCurrentWord } from "./util";
  import type { InputBoxEventMap } from "./InputBox/interface";

  import { makeFormatCurrentWord } from "./util";

  const formatCurrentWord = makeFormatCurrentWord({
    match: "match",
    noMatch: "no-match",
    cursorLeft: "cursor-left",
    cursorRight: "cursor-right",
  });

  const noMatchBgColor = "#f0a3a3";
</script>

<script lang="ts">
  import "./InputBox/common.css";
  import InputBox from "./InputBox/InputBox.svelte";

  let inputValue: string;
  export let text: string;
  const wordsArray = text.split(" ");

  let currentWordIdx = 0;
  let currentWord: FormattedCurrentWord = formatCurrentWord({
    word: "",
    input: "",
  });

  let beforeText = "",
    afterText = "";

  $: {
    currentWord = formatCurrentWord({
      input: "",
      word: wordsArray[currentWordIdx],
    });

    beforeText = wordsArray.slice(0, currentWordIdx).join(" ");
    afterText = wordsArray.slice(currentWordIdx + 1).join(" ");
  }

  function procressInputEvent(
    event: CustomEvent<InputBoxEventMap["keypress"]>
  ) {
    const { key, timestamp, value: input } = event.detail;

    if (key === " " && input === wordsArray[currentWordIdx] + " ") {
      event.preventDefault();

      currentWordIdx++;
      inputValue = "";
    } else
      currentWord = formatCurrentWord({
        input,
        word: wordsArray[currentWordIdx],
      });
  }

  $: isSeriousTypo = currentWord.hasTypo && !currentWord.canTypeMore;
</script>

<div class="wrapper">
  <div class="text text-styles">
    <span class="match">
      {beforeText}
    </span>
    <span class="current-word">
      {#each currentWord.wordChars as { char, className }}
        <span class={className}>{char}</span>
      {/each}
    </span>
    {#if currentWordIdx !== wordsArray.length - 1}
      <span class={currentWord.trailingSpaceClass} />
    {/if}
    {afterText}
  </div>

  {#if isSeriousTypo}
    <p class="error-msg">
      {`Please type`} <span class="pill">{wordsArray[currentWordIdx]}</span> correctly
      to continue.
    </p>
  {:else}
    <p class="error-msg">{@html "&nbsp;"}</p>
  {/if}

  <InputBox
    bind:value={inputValue}
    on:keypress={procressInputEvent}
    maxlength={wordsArray[currentWordIdx].length + 1}
    --txt-clr={currentWord.hasTypo ? noMatchBgColor : ""}
    --font-weight={isSeriousTypo ? 900 : ""}
  />

  <p class="tip">
    <span>Tip:</span> Hit <kbd class="pill">Ctrl + Backspace</kbd> to delete whole
    word
  </p>
</div>

<style>
  .wrapper {
    max-width: 70ch;
    margin: 20px auto;
    border: 1px solid black;
    padding: 0.9em;
    border-radius: 5px;

    --match-color: #99cc00;
    --nomatch-bg-color: #f0a3a3;
    --nomatch-color: #803333;
  }

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

  .error-msg {
    margin-top: 0.7em;
    text-align: center;
  }

  /*  ---Tip---    */
  .tip {
    margin-top: 0.8em;
    text-align: center;
  }

  .tip > span {
    font-weight: bold;
  }

  .pill {
    padding: 4px;
    border-radius: 5px;
    background-color: #ddd;
  }
</style>
