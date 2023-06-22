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
  import { resetSelection } from "./index";
  import { createEventDispatcher, onMount } from "svelte";

  //  ----- Types ----------
  type InputEvent = KeyboardEvent & {
    currentTarget: EventTarget & HTMLInputElement;
  };

  // ------ Props -----------
  export let value = "";
  export let maxlength: number = -1;

  //  ----- Rest ----------
  const dispatch = createEventDispatcher<{
    change: {
      key: string;
      value: string;
      timestamp: number;
      valueChanged: boolean;
    };
  }>();

  let inputElement: HTMLInputElement;

  onMount(() => {
    inputElement.onpaste = (e) => e.preventDefault();
    inputElement.oncut = (e) => e.preventDefault();
  });

  function processKeyDown(e: InputEvent) {
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
    if (previousValue && key === "Backspace")
      dispatch("change", {
        valueChanged: true,
        timestamp: Date.now(),
        key: e.ctrlKey ? "<C-BS>" : "<BS>",
        value: e.ctrlKey ? "" : previousValue.slice(0, -1),
      });
  }

  function processKeypress(e: InputEvent) {
    const { key } = e;

    if (key.length !== 1) return void e.preventDefault();

    // it's called "previousValue" because the input value hasn't updated yet
    const previousValue = e.currentTarget.value;

    dispatch("change", {
      key,
      timestamp: Date.now(),
      ...(previousValue.length !== maxlength
        ? { value: previousValue + key, valueChanged: true }
        : { value: previousValue, valueChanged: false }),
    });
  }
</script>

<input
  bind:value
  type="text"
  {maxlength}
  bind:this={inputElement}
  class="input text-styles"
  on:keydown|trusted={processKeyDown}
  on:keypress={processKeypress}
  on:click|preventDefault={resetSelection}
  on:select|preventDefault={resetSelection}
/>

<style>
  .input {
    width: 99%;
    margin: 1em 0;
    outline: none;
    display: block;
    padding: 0.2em;
    border-radius: 3px;
    color: var(--txt-clr);
    border: 2px solid currentColor;
  }
</style>
