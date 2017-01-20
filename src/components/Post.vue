<template>
  <div id='post'>
    <h1>{{metadata.title}}</h1>
    <div><vue-markdown lang-prefix='language-js'>{{content}}</vue-markdown></div>
  </div>
</template>

<script>
import { posts } from '../posts/posts.json'
import VueMarkdown from 'vue-markdown'

export default {
  name: 'post',
  components: {
    VueMarkdown
  },
  data () {
    return {
      content: require(`../posts/${this.$route.params.name}.md`),
      metadata: posts.filter((post) => (post.filename === this.$route.params.name)).pop()
    }
  }
}
</script>

<style scoped>
</style>
