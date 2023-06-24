<script lang="ts">
  import { onMount } from "svelte";

  import TestBoard from "./components/TestBoard/TestBoard.svelte";
  const text = `Thing is Butch, right now you got ability. But painful as it may be, ability don't last. Now that's a hard fact of life, but it's a fact of life you're gonna have to get realistic about.`;

  let testBoard: TestBoard;

  function onComplete() {
    console.log("test completed");
  }

  onMount(() => {
    // testBoard.start();
    //
    // setTimeout(() => {
    //   testBoard.end({ message: "Time up" });
    // }, 10_000);
  });
</script>

<main>
  <TestBoard bind:this={testBoard} {text} {onComplete} />
</main>
