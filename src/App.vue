<template>
  <div id="app" class='ui container'>
    <Header></Header>
    <div class='ui segment'>
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
  #app {
    padding-top: 16px;
  }
</style>
