+++
title = "PokéData Vue"
date = 2017-01-22
slug = "2017-01-22-Pokedata_Vue"
+++

The latest technology in my serial of [Pokedex's](https://keawade.github.io/pokedata) with different JavaScript frameworks is [Vue](https://vuejs.org/)! I've been working with Vue off and on for the last few months with [garden-vue](https://github.com/garden-stream/garden-vue) and [w-os](https://github.com/whiteboards/w-os). Now I've finally gotten around to building my recurring PokeData with Vue as well.

![PokeData](//image.thum.io/get/width/800/crop/700/http://keawade.github.io/pokedata-vue/)

The main thing that struck me was how quickly I was able to build this app with Vue. Total dev time on this project was approximately 3 to 4 hours. Vue seems to me to be an excellent choice for small focused projects or rapid prototyping.

Another aspect of Vue that I really liked was Vue's [`vuex`](https://vuex.vuejs.org/en/) state management solution. Vuex was an absolute pleasure to work with. It is extremely simple to configure and use.

To configure `vuex`, I just need to import the package, create my vuex store, and use that store in my Vue app. Check out my [`main.js`](https://github.com/keawade/pokedata-vue/blob/master/src/main.js#L8-L23) file for my implementation. All I needed to do after that was to reference `$store` in a component like here in [`History.vue`](https://github.com/keawade/pokedata-vue/blob/master/src/components/History.vue#L4).

I have really enjoyed my time working with Vue. If you're interested, [the app is available here](https://keawade.github.io/pokedata-vue). As always, feel free to [report bugs or request features](https://github.com/keawade/pokedata-vue/issues).
