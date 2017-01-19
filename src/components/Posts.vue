<template>
  <div id="posts">
    Posts will go here
    <div v-html='testPost'></div>
  </div>
</template>

<script>
const testPost = require('../posts/2014-08-04-NTP_Configuration.md')

// import list from '../posts'
// console.log(list)

export default {
  name: 'posts',
  data () {
    return {
      testPost
    }
  }
}
</script>

<style scoped>
</style>
