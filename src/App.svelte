<script context="module" lang="ts">
  const controlBtnStateToTextMap = Object.freeze({
    running: "Stop",
    stopped: "Reset",
    not_started: "Start",
  });

  type ButtonState = keyof typeof controlBtnStateToTextMap;
  const text = `Thing is Butch, right now you got ability. But painful as it may be, ability don't last. Now that's a hard fact of life, but it's a fact of life you're gonna have to get realistic about.`;
</script>

<script lang="ts">
  import type { KeypressLog } from "./components/TestBoard/interface";

  import TestBoard from "./components/TestBoard/TestBoard.svelte";

  let testBoard: TestBoard;
  let btnState: ButtonState = "not_started";
  let textBoardKey = 0;
  let startTime: number, endTime: number;

  function handleControl() {
    switch (btnState) {
      case "not_started":
        startTime = Date.now();
        testBoard.start();
        btnState = "running";
        break;

      case "running":
        endTime = Date.now();
        testBoard.end({ message: "Manually ended" });
        btnState = "stopped";
        break;

      case "stopped":
        textBoardKey++;
        btnState = "not_started";
        break;
    }
  }

  $: btnText = controlBtnStateToTextMap[btnState];
  // $: console.log(btnText);

  function onComplete() {
    console.log("test completed");
    btnState = "stopped";
    endTime = Date.now();
  }

  function onKeypress(log: KeypressLog) {
    // console.log(log);
  }
</script>

<main>
  {#key textBoardKey}
    <TestBoard bind:this={testBoard} {text} {onComplete} {onKeypress} />
  {/key}

  <div class="controls">
    <button class="control-btn" on:click|trusted={handleControl}
      >{btnText}</button
    >
  </div>
</main>

<style>
  .controls {
    display: flex;
    justify-content: center;
    margin-top: 1em;
  }

  .control-btn {
    padding: 0.5em 1em;
    cursor: pointer;
  }
</style>
