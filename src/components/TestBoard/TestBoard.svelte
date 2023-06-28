<script lang="ts">
  import type { KeypressLog } from "./interface";
  import type { InputBoxEventMap } from "../InputBox/interface";

  import { tick } from "svelte";
  import Text from "./Text.svelte";
  import Status from "./Status.svelte";
  import Progress from "./Progress.svelte";
  import InputBox from "../InputBox/InputBox.svelte";
  import { splitTextIntoWords, formatCurrentWord, lastIndex } from "./util";

  const typoBgColor = "#f0a3a3";

  // ------ Props --------
  export let wpm: number;
  export let text: string;
  export let onComplete: () => void;
  export let remainingTimeMS: number;
  export let onKeypress: (log: KeypressLog) => void;

  // ------ States --------
  let message = "";
  let progress = 0;
  let afterText = "";
  let beforeText = "";
  let isRunning = false;
  let currentWordIdx = 0;
  let inputBox: InputBox;
  let inputValue: string;
  let isInputFocused: boolean;
  let hasAnyKeyBeenPressed = false;
  let formattedWord = formatCurrentWord({ word: "", input: "" });

  // ------ Props --------
  export async function start() {
    isRunning = true;
    message = "Test started, please type in the box below.";

    // wait for the inputBox to be enabled
    await tick();

    inputBox.focus();
  }

  export function setMessage(arg: { message: string }) {
    message = arg.message;
  }

  export function end(arg: { message?: string }) {
    inputValue = "";
    isRunning = false;
    if (arg.message) message = arg.message;
  }

  // ----- Derived States -----------
  let currentWord = "";
  const { words, startIndices } = splitTextIntoWords(text);
  const lastWordIndex = lastIndex(words);

  $: {
    if (currentWordIdx)
      progress = Math.floor(((currentWordIdx - 1) / lastWordIndex) * 100);

    currentWord = words[currentWordIdx];
    formattedWord = formatCurrentWord({ input: "", word: currentWord });

    beforeText = words.slice(0, currentWordIdx).join(" ");
    afterText = words.slice(currentWordIdx + 1).join(" ");
  }

  $: isSeriousTypo = formattedWord.hasTypo && !formattedWord.canTypeMore;
  $: inputBoxTextColor = formattedWord.hasTypo
    ? formattedWord.canTypeMore
      ? typoBgColor
      : "red"
    : "";

  // --------- Functions -----------
  function processInputEvent(event: CustomEvent<InputBoxEventMap["keypress"]>) {
    if (!hasAnyKeyBeenPressed) {
      hasAnyKeyBeenPressed = true;
      // remove the initial message
      message = "";
    }

    const { key, value: input } = event.detail;

    // Log keypress
    {
      const { timestamp, printable = true } = event.detail;

      const keyPressLog = { key, timestamp, printable };
      const textCharIndex = startIndices[currentWordIdx] + input.length - 1;

      if (printable)
        Object.assign(keyPressLog, {
          textCharIndex,
          matched: text[textCharIndex] === key,
        });

      onKeypress(keyPressLog as KeypressLog);
    }

    if (key === " " && input === currentWord + " ") {
      event.preventDefault();

      if (currentWordIdx < lastWordIndex) currentWordIdx++;
      else {
        message = "Done.";
        isRunning = false;
        progress = 100;

        onComplete();
      }

      inputValue = "";
    } else formattedWord = formatCurrentWord({ input, word: currentWord });
  }
</script>

<div class="wrapper">
  <div class="statuses">
    <Progress {progress} />
    <Status {remainingTimeMS} {wpm} />
  </div>
  <Text
    {afterText}
    {beforeText}
    {formattedWord}
    {isInputFocused}
    isLastWord={currentWordIdx === lastWordIndex}
  />

  <div class="message">
    {#if message}
      {message}
    {:else if isSeriousTypo}
      Please type <span class="pill">{currentWord}</span> correctly to continue.
    {:else}
      &nbsp;
    {/if}
  </div>

  <InputBox
    bind:this={inputBox}
    --input-width="98.5%"
    bind:value={inputValue}
    disabled={!isRunning}
    --txt-clr={inputBoxTextColor}
    on:keypress={processInputEvent}
    maxlength={currentWord?.length + 1}
    --font-weight={isSeriousTypo ? 900 : ""}
    on:blur={() => (isInputFocused = false)}
    on:focus={() => (isInputFocused = true)}
  />

  <p class="tip">
    <span>Tip:</span> Hit <kbd class="pill">Ctrl + Backspace</kbd> to delete a whole
    word.
  </p>
</div>

<style>
  .wrapper {
    max-width: 70ch;
    margin: 20px auto;
    border: 1px solid black;
    padding: 0.9em;
    border-radius: 5px;

    --typo-color: #803333;
    --matched-color: #99cc00;
    --typo-bg-color: #f0a3a3;
  }

  .statuses {
    height: 2.5rem;
    margin-top: 0.2em;
    margin-bottom: 0.7em;
    display: flex;
  }

  .message {
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

  .wrapper :global(.pill) {
    padding: 4px;
    border-radius: 5px;
    background-color: #ddd;
  }
</style>
