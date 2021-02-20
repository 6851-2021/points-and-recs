import { NLogNAlgo } from "./algo/nlogn.js";
import { getViolatingPoints } from "./algo/Check.js";
import { Point } from "./Point.js";

// this shouldn't be duplicated between files...
const STEP = 100;

class Store {

  constructor() {
    // list of points to be drawn as Point objects
    this.points = [];
    this.addedPoints = [];
    this.violatingPoints = [];

    this.mouseX = 0;
    this.mouseY = 0;
    this.hoverItem = null;
    this.activeClick = null;

    const b = document.getElementById("superset");
    b.addEventListener("click", (e) => this.computeSuperset());

    const c = document.getElementById("check");
    c.addEventListener("click", (e) => this.computeCheck());

    const d = document.getElementById("clear");
    d.addEventListener("click", (e) => this.clearPoints());
  }

  updateClick() {
    this.activeClick = true;

    const x = Math.floor(this.mouseX / STEP + 0.5);
    const y = Math.floor(this.mouseY / STEP + 0.5);

    // Try to find point
    const p = this.points.find(p => p.x === x && p.y === y);
    // Remove it if it exists
    if (p)
      this.points.splice(this.points.indexOf(p), 1);
    // Add it if it doesn't
    else
      this.points.push(new Point(x, y));

    // clear added points when we add a new point
    this.addedPoints = [];
    this.violatingPoints = [];

    // check violations interactively
    this.computeCheck()

    // remove violation/success message if exists
    document.getElementById("checkResult").innerHTML = "";
  }

  computeSuperset() {
    NLogNAlgo(this.points).forEach((point) =>
      this.addedPoints.push(point.getCopy())
    );
    document.getElementById("checkResult").innerHTML = "";
  }

  computeCheck() {
    let all_points = this.points.concat(this.addedPoints);
    this.violatingPoints = getViolatingPoints(all_points);
    let notif_string;
    if (this.violatingPoints.length === 0) {
      notif_string = "satisfied!";
    } else {
      let string_arr = this.violatingPoints.map(a =>
                       "(" + a[0].x + ", " + a[0].y + ") | (" + a[1].x + ", " + a[1].y + ")");
      notif_string = "following pairs of points are violating: <br>" +
                      string_arr.join(" <br>");
    }
    document.getElementById("checkResult").innerHTML = notif_string;
  }

  clearPoints() {
    this.points = [];
    this.addedPoints = [];
    this.violatingPoints = [];
    document.getElementById("checkResult").innerHTML = "";
  }

}

export { Store };
