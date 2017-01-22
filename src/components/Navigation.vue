<template>
  <div id="header" class='ui stackable menu'>
    <router-link to='/' class='item header'>keawade.io</router-link>
    <router-link to='/about' class='item' active-class='active'>about</router-link>
    <a class='item' href='http://github.com/keawade' target='_blank'><i class="fa fa-github fa-lg" aria-hidden="true"></i></a>
    <a class='item' href='http://twitter.com/TheKeithWade' target='_blank'><i class="fa fa-twitter fa-lg" aria-hidden="true"></i></a>
    <a class='item' href='http://linkedin.com/in/keawade' target='_blank'><i class="fa fa-linkedin fa-lg" aria-hidden="true"></i></a>
  </div>
</template>

<script>
import '../assets/menu.min.css'

export default {
  name: 'header'
}
</script>

<style lang='scss' scoped>
#header {
  margin-top: 0;
}
.ui.menu {
  .item {
    &.active {
      background-color: rgba(23,107,182, 0.05);
    }
    .item:hover {
      background-color: rgba(23,107,182, 0.03);
      &.active:hover {
        background-color: rgba(23,107,182, 0.03);
      }
    }
  }
}
</style>
