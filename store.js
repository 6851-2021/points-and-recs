import { NLogNAlgo } from "./algo/nlogn.js";
import { getViolatingPoints } from "./algo/Check.js";
import { Point } from "./Point.js";
import { STEP } from "./constants.js";

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
    c.addEventListener("click", (e) => this.computeCheck());  }

  updateClick() {
    this.activeClick = true;

    const togglePoint = (source) => {
      // Try to find point
      const p = source.find(p => p.x === this.mouseX && p.y === this.mouseY);

      // Remove it if it exists
      if (p)
        source.splice(this.points.indexOf(p), 1);
      // Add it if it doesn't
      else
        source.push(new Point(this.mouseX, this.mouseY));
    }

    if (document.getElementById("add-grid-point").checked) {
      // clear added points when we add a new grid point
      this.addedPoints = [];
      togglePoint(this.points);
    } else {
      // cannot add a grid point to satisfied set
      if (this.points.find(p => p.x === this.mouseX && p.y === this.mouseY)) {
        return;
      }
      togglePoint(this.addedPoints);
    }

    // clear violating points on any add
    this.violatingPoints = [];
  }

  computeSuperset() {
    NLogNAlgo(this.points).forEach((point) =>
      this.addedPoints.push(point.getCopy())
    );
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

}

export { Store };
