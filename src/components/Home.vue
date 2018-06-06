<template>
  <div id="home">
    <h1>Articles and Projects</h1>
    <div v-for='post in posts' :key='{post}' class='article'>
      <div class='title'>
        <h2 class='header'><router-link :to='post.filename' class=''>{{post.title}}</router-link></h2>
        <div class='date'>{{post.date}}</div>
      </div>
      <div class='excerpt'>{{post.excerpt}}</div>
    </div>
  </div>
</template>

<script>
import { posts } from '../posts/posts.json'
import '../assets/list.min.css'
import moment from 'moment'

export default {
  name: 'home',
  data () {
    return {
      posts: posts
        .sort((a, b) => (Date.parse(a.date) < Date.parse(b.date)))
        .map((post) => {
          post.date = moment(post.date).format('LL')
          return post
        })
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
  .title {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.67rem;
    // justify-content: space-between;
    // align-items: center;

    h2 {
      margin-bottom: 0.25rem;
    }

    .date {
      font-size: 0.75rem;
    }
  }
}
</style>
