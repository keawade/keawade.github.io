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
</style>
