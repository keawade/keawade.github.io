<template>
  <div id="header" class='ui pointing menu'>
    <router-link to='/' class='item header'>keawade.io</router-link>
    <router-link to='/posts' class='item' active-class='active' exact='true'>Posts</router-link>
    <router-link to='/projects' class='item' active-class='active' exact='true'>Projects</router-link>
    <router-link to='/about' class='item' active-class='active' exact='true'>About</router-link>
    <div class='right menu'>
      <a class='item' href='http://github.com/keawade' target='_blank'><i class="fa fa-github fa-lg" aria-hidden="true"></i></a>
      <a class='item' href='http://twitter.com/TheKeithWade' target='_blank'><i class="fa fa-twitter fa-lg" aria-hidden="true"></i></a>
      <a class='item' href='http://linkedin.com/in/keawade' target='_blank'><i class="fa fa-linkedin fa-lg" aria-hidden="true"></i></a>
    </div>
  </div>
</template>

<script>
import '../assets/menu.min.css'

export default {
  name: 'header'
}
</script>

<style scoped>
#header {
  margin-top: 0;
}
.ui.menu .active.item {
  background-color: rgba(23,107,182, 0.05);
}
.ui.menu .item:hover {
  background-color: rgba(23,107,182, 0.03);
}
.ui.menu .active.item:hover {
  background-color: rgba(23,107,182, 0.03);
}
</style>
