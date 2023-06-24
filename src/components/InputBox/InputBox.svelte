<script context="module">
  const keysThatChangesCursorPos = new Set([
    "End",
    "Home",
    "Home",
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
  ]);
</script>

<script lang="ts">
  import "./common.css";
  import type { InputBoxEventMap } from "./interface";
  import { createEventDispatcher, onMount } from "svelte";
  import { ctrlBackspace, resetSelection } from "./index";

  //  ----- Types ----------
  type InputEvent = KeyboardEvent & {
    currentTarget: EventTarget & HTMLInputElement;
  };

  // ----- States ----------
  let inputElement: HTMLInputElement;

  // ------ Props -----------
  export let value = "";
  export let disabled = false;
  export let maxlength: number = -1;
  export let placeholder = "Type here...";

  export function focus() {
    if (inputElement) inputElement.focus();
  }

  //  ----- Rest ----------
  const dispatch = createEventDispatcher<InputBoxEventMap>();

  onMount(() => {
    inputElement.onpaste = (e) => e.preventDefault();
    inputElement.oncut = (e) => e.preventDefault();
  });

  function processKeyDown(e: InputEvent) {
    if (disabled) return void e.preventDefault();

    resetSelection(e);

    const { key } = e;

    {
      const shouldNotProceed =
        // Any repeating keys other than "Backspace"
        (e.repeat && key !== "Backspace") ||
        // Any non-char keys that changes the cursor pos
        (key.length !== 1 && keysThatChangesCursorPos.has(key));

      if (shouldNotProceed) return void e.preventDefault();
    }

    // it's called "previousValue" because the input value hasn't updated yet
    const previousValue = e.currentTarget.value;

    //  only dispatch the Backspace key event if previous value is not empty
    if (previousValue && key === "Backspace") {
      e.preventDefault();

      const newValue = e.ctrlKey
        ? ctrlBackspace(previousValue)
        : previousValue.slice(0, -1);

      dispatch("keypress", {
        value: newValue,
        printable: false,
        valueChanged: true,
        timestamp: Date.now(),
        key: e.ctrlKey ? "<C-BS>" : "<BS>",
      });

      value = newValue;
      inputElement.value = newValue;
    }
  }

  function processKeypress(e: InputEvent) {
    const { key } = e;
    if (disabled || key.length !== 1) return void e.preventDefault();

    // it's called "previousValue" because the input value hasn't updated yet
    const previousValue = e.currentTarget.value;

    const shouldContinue = dispatch(
      "keypress",
      {
        key,
        printable: true,
        timestamp: Date.now(),
        ...(previousValue.length !== maxlength
          ? { value: previousValue + key, valueChanged: true }
          : { value: previousValue, valueChanged: false }),
      },
      { cancelable: true }
    );

    if (!shouldContinue) e.preventDefault();
  }
</script>

<input
  on:blur
  on:focus
  bind:value
  {disabled}
  type="text"
  {maxlength}
  {placeholder}
  spellcheck="false"
  bind:this={inputElement}
  class="input text-styles"
  on:keydown|trusted={processKeyDown}
  on:keypress|trusted={processKeypress}
  on:click|preventDefault={resetSelection}
  on:select|preventDefault={resetSelection}
/>

<style>
  .input {
    outline: none;
    display: block;
    padding: 0.2em;
    margin-top: 0.7em;
    border-radius: 3px;
    word-spacing: -1px;
    color: var(--txt-clr);
    border: 2px solid currentColor;
    width: var(--input-width, 100%);
    font-weight: var(--font-weight, 400);

    border-style: dashed;
  }

  input:focus {
    border-style: solid;
  }

  input::selection {
    background-color: transparent;
  }

  input:focus::placeholder,
  input:disabled::placeholder {
    color: transparent;
  }
</style>
