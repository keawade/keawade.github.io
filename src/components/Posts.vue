<template>
  <div id="posts">
    <h1>Posts</h1>
    <div class='ui list'>
      <div v-for='post in posts' class='item'>
        <div class='content'>
          <router-link :to='"posts/" + post.filename' class='header' >{{post.title}}</router-link>
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
  name: 'posts',
  data () {
    return {
      posts
    }
  }
}
</script>

<style scoped>
</style>
