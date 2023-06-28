<script context="module" lang="ts">
  import { formatDurationMsAsHMS } from "../../common/util/date-time";

  const formatDuration = (duration: number) =>
    formatDurationMsAsHMS({
      duration,
      separator: " ",
      showUnit: true,
      padWithZero: false,
      filterZeroValues: true,
    });
</script>

<script lang="ts">
  import { Timer, Gauge } from "lucide-svelte";

  export let remainingTimeMS = 0;
  export let wpm = 0;
</script>

<div class="status">
  <div class="timer-icon">
    <Timer size={28} />
  </div>
  <div>
    <span class="value">{formatDuration(remainingTimeMS) || "--"} </span>
  </div>
  <div>
    <Gauge />
  </div>
  <div>
    <span class="value">{wpm || "--"} wpm</span>
  </div>
</div>

<style>
  .status {
    min-width: 4em;
    padding: 2px;
    margin-left: 0.5rem;

    display: grid;
    grid-template-columns: min-content 1fr;
    grid-template-rows: 1fr 1fr;
    column-gap: 0.2rem;
  }

  .value {
    font-weight: 500;
  }

  .timer-icon {
    margin-left: -2px;
  }
</style>
