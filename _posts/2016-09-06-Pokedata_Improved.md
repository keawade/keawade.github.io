---
layout: post
title:  "PokéData Improved"
date:   2016-09-06
excerpt: "Pokémon strengths and weaknesses Pokédex built with React."
project: true
tag:
- pokemon
- javascript
- react
comments: true
disqus_identifier: 0007
---

# PokéData Improved

I took another look at the [PokeData]({{ site.url }}/pokedata-old) app, this time with an eye towards what technologies would work best rather than trying to cram some odd things in for the development experience. What I've come up with is [a new version of PokeData]({{ site.url }}/pokedata) built using [React](https://facebook.github.io/react/) without [Redux](http://redux.js.org/) or [PokeAPI](https://pokeapi.co/).

Removing Redux was an easy choice for this app since it wasn't necessary in the slightest and just complicated the app for no reason. The [Redux FAQ answer to "When should I use Redux?"](http://redux.js.org/docs/FAQ.html#when-should-i-use-redux), while slightly cryptic, is a good one.

No longer using PokeAPI was mildly annoying as I had to build the data I was using from it into my app directly but dramatically improved performance. While PokeAPI has a ton of data, it isn't presented in a particulary useful structure and suffers from extremely slow access speeds. I can't complain too much since it is a free service, but it was responsible for the only noticeable latency resulting in load times of *five to ten seconds*.

Overall, the app is much more responsive and the code is much cleaner. [The app is available here.]({{ site.url }}/pokedata) As always, feel free to [report bugs or request features](https://github.com/keawade/pokedata/issues).
