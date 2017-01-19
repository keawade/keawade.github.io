import './normalize.css'

// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'

import App from './App'

import Home from './components/Home'
import Posts from './components/Posts'
import Projects from './components/Projects'
import About from './components/About'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: Home
    }, {
      path: '/posts',
      component: Posts
    }, {
      path: '/projects',
      component: Projects
    }, {
      path: '/about',
      component: About
    }
  ]
})

/* eslint-disable no-new */
new Vue({
  router,
  template: '<App />',
  components: {
    App
  }
}).$mount('#app')
