import { NLogNAlgo } from "./algo/nlogn.js";

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
    b.addEventListener("click", this.computeSuperset.bind(this));
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
  computeSuperset(e) {
    NLogNAlgo(this.points).forEach(({ x, newY }) =>
      this.addedPoints.push({ x, y: newY })
    );
  }
}

export { Store };
