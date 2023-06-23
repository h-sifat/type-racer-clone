<script context="module" lang="ts">
  import type { InputBoxEventMap } from "../InputBox/interface";

  import { makeFormatCurrentWord } from "./util";

  // the following class names are taken from "./Text.svelte" module
  const formatCurrentWord = makeFormatCurrentWord({
    match: "match",
    noMatch: "no-match",
    cursorLeft: "cursor-left",
    cursorRight: "cursor-right",
  });

  const noMatchBgColor = "#f0a3a3";
</script>

<script lang="ts">
  import "../InputBox/common.css";
  import Text from "./Text.svelte";
  import ErrorMessage from "./ErrorMessage.svelte";
  import InputBox from "../InputBox/InputBox.svelte";

  let inputValue: string;
  export let text: string;
  const wordsArray = text.split(" ");

  let currentWordIdx = 0;
  let currentWord = "";
  let formattedWord = formatCurrentWord({ word: "", input: "" });

  let beforeText = "",
    afterText = "";

  $: {
    currentWord = wordsArray[currentWordIdx];

    formattedWord = formatCurrentWord({
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
      formattedWord = formatCurrentWord({
        input,
        word: wordsArray[currentWordIdx],
      });
  }

  $: isSeriousTypo = formattedWord.hasTypo && !formattedWord.canTypeMore;
  $: inputBoxTextColor = formattedWord.hasTypo
    ? formattedWord.canTypeMore
      ? noMatchBgColor
      : "red"
    : "";
</script>

<div class="wrapper">
  <Text
    {afterText}
    {beforeText}
    {formattedWord}
    isLastWord={currentWordIdx === wordsArray.length - 1}
  />

  <ErrorMessage {currentWord} isTypo={isSeriousTypo} />

  <InputBox
    bind:value={inputValue}
    on:keypress={procressInputEvent}
    maxlength={currentWord.length + 1}
    --input-width="98.5%"
    --txt-clr={inputBoxTextColor}
    --font-weight={isSeriousTypo ? 900 : ""}
  />

  <p class="tip">
    <span>Tip:</span> Hit <kbd class="pill">Ctrl + Backspace</kbd> to delete a whole
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

  /*  ---Tip---    */
  .tip {
    margin-top: 0.8em;
    text-align: center;
  }

  .tip > span {
    font-weight: bold;
  }

  .wrapper :global(.pill) {
    padding: 4px;
    border-radius: 5px;
    background-color: #ddd;
  }
</style>
