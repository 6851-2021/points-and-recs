import { NLogNAlgo } from "./algo/nlogn.js";

// this shouldn't be duplicated between files...
const STEP = 100;

class Store {
  constructor() {
    // list of points to be drawn as {x, y}
    this.points = [];
    this.addedPoints = [];

    this.mouseX = 0;
    this.mouseY = 0;
    this.hoverItem = null;
    this.activeClick = null;

    const b = document.getElementById("superset");
    b.addEventListener("click", (e) => this.computeSuperset());
  }
  updateClick() {
    this.activeClick = true;

    const x = Math.floor(this.mouseX / STEP + 0.5);
    const y = Math.floor(this.mouseY / STEP + 0.5);

    // if the point {x, y} exists, we should do something other than adding it
    this.points.push({ x, y });

    // clear added points when we add a new point
    this.addedPoints = [];
  }
  computeSuperset() {
    NLogNAlgo(this.points).forEach(({ x, newY }) =>
      this.addedPoints.push({ x, y: newY })
    );
  }
}

export { Store };
