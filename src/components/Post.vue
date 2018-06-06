<template>
  <div id='post'>
    <div class='title'>
      <h1>{{metadata.title}}</h1>
      <div class='date'>{{metadata.date}}</div>
    </div>
    <div v-html='content'></div>
  </div>
</template>

<script>
import { posts } from '../posts/posts.json'
import marked from 'marked'
import hljs from 'highlight.js'
import moment from 'moment'

marked.setOptions({
  highlight: function (code) {
    return hljs.highlightAuto(code).value
  }
})

export default {
  name: 'post',
  data () {
    const metadata = posts.filter((post) => (post.filename === this.$route.params.name)).pop()
    metadata.date = moment(metadata.date).format('LL')
    return {
      content: marked(require(`../posts/${this.$route.params.name}.md`)),
      metadata: metadata
    }
  }
}
</script>

<style lang='scss' scoped>
  .title {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.67rem;
    // justify-content: space-between;
    // align-items: center;

    h1 {
      margin-bottom: 0.25rem;
    }

    .date {
      font-size: 0.75rem;
    }
  }
</style>
