<template>
  <div id="post" v-html='content'></div>
</template>

<script>
export default {
  name: 'post',
  data () {
    return {
      content: require(`../posts/${this.$route.params.name}.md`)
    }
  }
}
</script>

<style scoped>
</style>
