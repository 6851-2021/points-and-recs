# points-and-recs

You'll need to run this on a server. If you have Python 3 you can run `python3 -m http.server` in the root directory, then open `http://localhost:8000/` in a browser.

This is just the skeleton for now. `store.js` should have the logic for handling points while `graphics.js` should have the logic for drawing them. Graphics should be thought of as a state machine; the entire thing is redrawn every loop and should be based entirely on the state of `store`.

The algorithm side should be mostly independent from the webapp side? Idk

Next steps for the web app side:

- Add points on click
- Remove points on, say, double click
- Add a tool to switch to a different set of points (for letting the user, say, construct the satisfied set)

For the algorithms side:

- Write up an algorithm for determining if a set of points is satisfied, and if not, give an offending pair of points?
- Write up an algorithm for finding a satisfied superset of points?
