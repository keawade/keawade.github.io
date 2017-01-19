<template>
  <div class='ui container'>
    <div id='particles-js'></div>
    <Header></Header>
    <div class='ui segment'>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Header from './components/Header'
import './assets/container.min.css'
import './assets/segment.min.css'

export default {
  name: 'app',
  components: {
    Header
  }
}
</script>

<style>
  body {
    background-color: rgba(23,107,182, 1);
  }
  .container {
    background-color: rgba(255, 255, 255, 0.3);
    padding: 16px 16px 0;
    height: calc(100vh - 16px);
  }
</style>
