<script>
  import InputBox from "./components/InputBox/InputBox.svelte";

  // import TestBoard from "./components/TestBoard.svelte";
  // const text = `Lorem ipsum dolor sit, amet consectetur adipisicing elit. Asperiores, cumque maiores voluptatibus tempora exercitationem delectus recusandae praesentium eos. Molestiae ad nulla vitae velit fugit autem consequatur explicabo quis cupiditate omnis!`;
</script>

<main>
  <InputBox on:change={(e) => console.log(e.detail)} --txt-clr="red" />
  <!-- <TestBoard {text} /> -->
</main>
