Hickeypad
=========

This is a soundpad with Rich Hickey (of [Clojure](http://clojure.org/)
fame) quotes/soundbites.

It was built mostly as a joke (and the need to easily access a sound
clip of Rich saying "What happened? What happened?"), but also to
learn a bit about
[AppCache](http://www.html5rocks.com/tutorials/appcache/beginner/). Thus,
the result page is prepared for offline use.

To compile the page from source, you will need to install
[Middleman](https://middlemanapp.com/). Then you can just run
`make`. To develop this page you might want to install
[RoboHydra](http://robohydra.org/) and run it by typing `robohydra
robohydra/devserver.conf`. Then you can open http://localhost:3000 to
see the final page. Note that you will have to constantly compile with
`make` to get the latest changes.
