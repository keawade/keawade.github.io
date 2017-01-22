<template>
  <div id='post'>
    <h1>{{metadata.title}}</h1>
    <div v-html='content'></div>
  </div>
</template>

<script>
import { posts } from '../posts/posts.json'
import marked from 'marked'
import hljs from 'highlight.js'

marked.setOptions({
  highlight: function (code) {
    return hljs.highlightAuto(code).value
  }
})

export default {
  name: 'post',
  data () {
    return {
      content: marked(require(`../posts/${this.$route.params.name}.md`)),
      metadata: posts.filter((post) => (post.filename === this.$route.params.name)).pop()
    }
  }
}
</script>

<style scoped>
</style>
