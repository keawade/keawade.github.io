<template>
  <div id="home">
    <h1>Articles and Projects</h1>
    <div class='ui list'>
      <div v-for='post in posts' class='item'>
        <div class='content'>
          <router-link :to='post.filename' class='header' >{{post.title}}</router-link>
          <div class='description'>{{post.excerpt}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { posts } from '../posts/posts.json'
import '../assets/list.min.css'

export default {
  name: 'home',
  data () {
    return {
      posts: posts.sort((a, b) => (Date.parse(a.date) < Date.parse(b.date)))
    }
  }
}
</script>

<style scoped>
</style>
