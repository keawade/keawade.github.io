<template>
  <div id='application' class='ui container'>
    <div id='particles-js'></div>
    <Navigation></Navigation>
    <div class='ui segment'>
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import Navigation from './components/Navigation'
import './assets/container.min.css'
import './assets/segment.min.css'
import particles from 'exports?particlesJS=window.particlesJS,window.pJSDom!particles.js'

particles.particlesJS.load('particles-js', './static/particlesjs-config.json', () => {
  console.info('particles js loaded')
})

export default {
  name: 'app',
  components: {
    Navigation
  }
}
</script>

<style lang='scss'>
  body {
    background-color: rgba(23,107,182, 1);

    .ui.segment {
      padding: 1rem 2rem 1rem !important;
    }
    #particles-js {
      position: fixed;
      height: 100%;
      width: 100%;
    }
    #application {
      z-index: 1;
    }
    .container {
      background-color: rgba(255, 255, 255, 0.3);
      padding: 16px 16px 16px;
      min-height: calc(100vh - 32px);
    }
  }
</style>
