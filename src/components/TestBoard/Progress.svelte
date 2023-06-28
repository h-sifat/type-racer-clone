<script lang="ts">
  export let progress = 0;
</script>

<div class="track" style:background-position={`${progress}% 13px`} />

<style>
  .track {
    flex: 1;
    height: 100%;
    min-width: 50%;
    background-image: url(/car.svg);
    background-size: 3em 100%;
    background-repeat: no-repeat;
    border-bottom: 3px dashed black;

    transition: background-position 2s ease-in;
  }
</style>
