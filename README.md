# Geometric View of Binary Search Trees
## (a.k.a. Points and Rectangles)

An implementation/visualization of "[The Geometry of Binary Search
Trees](http://erikdemaine.org/papers/BST_SODA2009/)" by Demaine, Harmon,
Iacono, Kane, and Pǎtraşcu (2009).

## [Web app](https://6851-2021.github.io/points-and-recs/)

You can [run the app](https://6851-2021.github.io/points-and-recs/)
in your browser.

## Features

* You can interactively add input points (accesses) and satisfaction points
  (touches), and it will highlight unsatisfied rectangles.
* There are two satisfaction algorithms implemented:
  * *O*(*n* log *n*) divide-and-conquer solution
  * Optimal solution by brute force, which performs well when there are
    few columns (fixed-parameter tractable in number of columns).

## Usage

If you want to run this app locally, you'll need to run a server. If you have Python 3 you can run `python3 -m http.server` in the root directory, then open `http://localhost:8000/` in a browser. 

## Overview

* `index.js` contains the top-level app logic.
* `store.js` contains the logic for handling point sets.
* `graphics.js` contains the logic for drawing them.
* `algo` directory contains the point set satisfaction algorithms.

Graphics should be thought of as a state machine; everything is redrawn every loop and should be based entirely on the state of `store`.
