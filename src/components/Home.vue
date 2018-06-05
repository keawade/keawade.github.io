<template>
  <div id="home">
    <h1>Articles and Projects</h1>
    <div v-for='post in posts' class='article'>
      <h2 class='header'><router-link :to='post.filename' class=''>{{post.title}}</router-link></h2>
      <div>{{post.excerpt}}</div>
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

<style lang='scss' scoped>
#home {
    .article {
      padding-bottom: 1rem;
    }
  .header {
    a {
      text-decoration: none;
    }
  }
}
</style>
