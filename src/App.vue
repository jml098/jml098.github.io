<script setup lang="ts">
import Game from './components/Game.vue'
</script>

<template>
  <Game />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

body {
  font-family: 'Press Start 2P', cursive;
  background-color: #1a1a1a;
  color: #e6e6e6;
  line-height: 1.6;
}

h1, h2, h3 {
  font-size: 16px;
  margin-bottom: 16px;
}

button {
  font-family: 'Press Start 2P', cursive;
  cursor: pointer;
  background-color: #333333;
  color: #e6e6e6;
  border: 2px solid #666666;
}

button:hover {
  background-color: #404040;
}

button:focus {
  outline: none;
}

button.active {
  background-color: #4d4d4d;
}
</style>
