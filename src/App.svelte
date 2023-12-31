<script context="module" lang="ts">
  import { convertDuration } from "./common/util/date-time";

  const controlBtnStateToTextMap = Object.freeze({
    running: "Stop",
    stopped: "Reset",
    not_started: "Start",
  });

  type ButtonState = keyof typeof controlBtnStateToTextMap;

  // const text = `Thing is Butch, right now you got ability. But painful as it may be, ability don't last. Now that's a hard fact of life, but it's a fact of life you're gonna have to get realistic about.`;
  const testDuration = convertDuration({
    duration: 3,
    fromUnit: "m",
    toUnit: "ms",
  });
</script>

<script lang="ts">
  import type { KeypressLog, WPMState } from "./components/TestBoard/interface";
  import paragraphController from "./controllers/paragraph-controller";

  import TestBoard from "./components/TestBoard/TestBoard.svelte";
  import {
    getDefaultWPMState,
    WPMCalculatorReducer,
  } from "./components/TestBoard/util";
  import performanceController from "./controllers/performance-controller";

  let elapsedTime = 0;
  let textBoardKey = 0;
  let intervalId: number;
  let testBoard: TestBoard;
  let startTime: number, endTime: number;
  let btnState: ButtonState = "not_started";
  let wpmState: WPMState | null = null;
  let wpm = 0;

  function tick() {
    const timestamp = Date.now();
    elapsedTime += 1000;

    if (elapsedTime >= testDuration) {
      clearInterval(intervalId);

      endTime = timestamp;
      btnState = "stopped";
      if (testBoard) testBoard.setMessage({ message: "Time up" });
    }

    if (elapsedTime && elapsedTime % 5_000 === 0) {
      wpmState = WPMCalculatorReducer(wpmState!, {
        name: "time_increase",
        arg: { endTime: timestamp },
      });

      wpm = wpmState.netWPM;
    }
  }

  function handleControl() {
    switch (btnState) {
      case "not_started":
        startTime = Date.now();
        wpmState = getDefaultWPMState({ startTime });
        testBoard.start();
        btnState = "running";
        intervalId = setInterval(tick, 1000);
        // reset();
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
        wpm = 0;
        break;
    }
  }

  function onComplete() {
    console.log("paragraph completed");
    if (intervalId) clearInterval(intervalId);
    endTime = Date.now();
    const p = $paragraphController;
    performanceController.addPerformance({
      wpm: wpmState!.netWPM,
      timeTaken: endTime - startTime,
      totalWords: p.text.split(" ").length,
      topicTitle: p.title,
      paragraphIndex: p.paragraphIndex,
    });
    paragraphController.nextParagraph();
    startTime = Date.now();
    wpm = 0;
    elapsedTime = 0;
    wpmState = getDefaultWPMState({ startTime });
    testBoard.start();
    intervalId = setInterval(tick, 1000);
  }

  function onKeypress(log: KeypressLog) {
    wpmState = WPMCalculatorReducer(wpmState!, { name: "keypress", arg: log });
  }
</script>

<main>
  {#key textBoardKey}
    <TestBoard
      bind:this={testBoard}
      {...{
        wpm,
        text: $paragraphController.text,
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
  {#if $performanceController.length}
    <div class="performance">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Paragraph NO.</th>
            <th>WPM</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {#each $performanceController as performance}
            <tr>
              <td>{performance.topicTitle}</td>
              <td>{performance.paragraphIndex + 1}</td>
              <td>{performance.wpm}</td>
              <td>{(performance.timeTaken / 1000).toFixed(1)}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
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

  .performance {
    max-width: 70ch;
    margin: 20px auto;
    margin-top: 1em;
  }
  .performance table {
    width: 100%;
  }
  .performance th,
  .performance td {
    text-align: left;
  }
</style>
