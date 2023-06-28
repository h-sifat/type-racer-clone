<script context="module" lang="ts">
  import { convertDuration } from "./common/util/date-time";

  const controlBtnStateToTextMap = Object.freeze({
    running: "Stop",
    stopped: "Reset",
    not_started: "Start",
  });

  type ButtonState = keyof typeof controlBtnStateToTextMap;
  const text = `Thing is Butch, right now you got ability. But painful as it may be, ability don't last. Now that's a hard fact of life, but it's a fact of life you're gonna have to get realistic about.`;
  const testDuration = convertDuration({
    duration: 3,
    fromUnit: "m",
    toUnit: "ms",
  });
</script>

<script lang="ts">
  import type { KeypressLog } from "./components/TestBoard/interface";

  import TestBoard from "./components/TestBoard/TestBoard.svelte";

  let elapsedTime = 0;
  let textBoardKey = 0;
  let intervalId: number;
  let testBoard: TestBoard;
  let startTime: number, endTime: number;
  let btnState: ButtonState = "not_started";

  function tick() {
    elapsedTime += 1000;

    if (elapsedTime >= testDuration) {
      clearInterval(intervalId);

      endTime = Date.now();
      btnState = "stopped";
      if (testBoard) testBoard.setMessage({ message: "Time up" });
    }
  }

  function handleControl() {
    switch (btnState) {
      case "not_started":
        startTime = Date.now();
        testBoard.start();
        btnState = "running";
        intervalId = setInterval(tick, 1000);
        break;

      case "running":
        clearInterval(intervalId);
        endTime = Date.now();
        testBoard.end({ message: "Manually ended" });
        btnState = "stopped";
        break;

      case "stopped":
        textBoardKey++;
        btnState = "not_started";
        elapsedTime = 0;
        break;
    }
  }

  function onComplete() {
    console.log("test completed");
    btnState = "stopped";
    clearInterval(intervalId);
    endTime = Date.now();
  }

  function onKeypress(log: KeypressLog) {
    // console.log(log);
  }
</script>

<main>
  {#key textBoardKey}
    <TestBoard
      bind:this={testBoard}
      {...{
        text,
        onComplete,
        onKeypress,
        remainingTimeMS: testDuration - elapsedTime,
      }}
    />
  {/key}

  <div class="controls">
    <button class="control-btn" on:click|trusted={handleControl}
      >{controlBtnStateToTextMap[btnState]}</button
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
