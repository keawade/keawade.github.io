<template>
  <div id='about' v-html='content'></div>
</template>

<script>
import marked from 'marked'

export default {
  name: 'about',
  data () {
    return {
      content: marked(require(`./about.md`))
    }
  }
}
</script>

<style lang='scss' scoped>
</style>
