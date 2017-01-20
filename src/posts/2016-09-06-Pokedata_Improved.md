I took another look at the [PokeData](/pokedata-old) app, this time with an eye towards what technologies would work best rather than trying to cram some odd things in for the development experience. What I've come up with is [a new version of PokeData](/pokedata) built using [React](https://facebook.github.io/react/) without [Redux](http://redux.js.org/) or [PokeAPI](https://pokeapi.co/).

![PokeData](//image.thum.io/get/width/800/crop/700/http://keawade.io/pokedata/)

Removing Redux was an easy choice for this app since it wasn't necessary in the slightest and just complicated the app for no reason. The [Redux FAQ answer to "When should I use Redux?"](http://redux.js.org/docs/FAQ.html#when-should-i-use-redux), while slightly cryptic, is a good one.

No longer using PokeAPI was mildly annoying as I had to build the data I was using from it into my app directly but dramatically improved performance. While PokeAPI has a ton of data, it isn't presented in a particulary useful structure and suffers from extremely slow access speeds. I can't complain too much since it is a free service, but it was responsible for the only noticeable latency resulting in load times of *five to ten seconds*.

Overall, the app is much more responsive and the code is much cleaner. [The app is available here.](/pokedata) As always, feel free to [report bugs or request features](https://github.com/keawade/pokedata/issues).
