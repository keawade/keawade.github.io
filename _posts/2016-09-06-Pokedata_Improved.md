---
title: "PokéData Improved"
date: "2016-09-06"
slug: "2016-09-06-Pokedata_Improved"
excerpt: "Pokémon strengths and weaknesses Pokédex built with React."
coverImage: "/assets/blog/pokedata-improved/react-banner.png"
ogImage:
  url: ""
---

I took another look at the [PokeData](https://keawade.github.io/pokedata-old) app, this time with an eye towards what technologies would work best rather than trying to cram some odd things in for the development experience. What I've come up with is [a new version of PokeData](https://keawade.github.io/pokedata) built using [React](https://facebook.github.io/react/) without [Redux](http://redux.js.org/) or [PokeAPI](https://pokeapi.co/).

[![PokeData](pokedata-improved.png)](https://keawade.github.io/pokedata/)

Removing Redux was an easy choice for this app since it wasn't necessary in the slightest and just complicated the app for no reason. The [Redux FAQ answer to "When should I use Redux?"](http://redux.js.org/docs/FAQ.html#when-should-i-use-redux), while slightly cryptic, is a good one.

No longer using PokeAPI was mildly annoying as I had to build the data I was using from it into my app directly but dramatically improved performance. While PokeAPI has a ton of data, it isn't presented in a particularly useful structure and suffers from extremely slow access speeds. I can't complain too much since it is a free service, but it was responsible for the only noticeable latency resulting in load times of *five to ten seconds*.

Overall, the app is much more responsive and the code is much cleaner. [The app is available here.](https://keawade.github.io/pokedata) As always, feel free to [report bugs or request features](https://github.com/keawade/pokedata/issues).
