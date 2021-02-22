import { NLogNAlgo } from "./algo/nlogn.js";
import { getViolatingPoints } from "./algo/Check.js";
import { Point } from "./Point.js";
import { STEP } from "./constants.js";

class Store {

  constructor() {
    // mapping of x,y coordinates to its Point instance
    this.points = {};
    this.violatingPoints = [];

    this.checkResult = "";

    if (document.location.hash && document.location.hash[0] === '#') {
      this.points = {};
      document.location.hash.slice(1).split(';').map(p => {
        const m = p.trim().match(/\((-?[\d]+),\s*(-?[\d]+)\)/);
        if (m) {
          const coor = [m[1], m[2]];
          this.points[coor] = "GRID";
        }
      });
      this.computeCheck();
    }
  }

  togglePoint(point) {
    const isGridPoint = document.getElementById("add-grid-point").checked;
    const type = isGridPoint ? "GRID" : "ADDED";

    // Remove/add from the mapping
    if (point in this.points) {
      // cannot overwrite a grid point with added point
      if (!isGridPoint) return;
      delete this.points[point];
    } else {
      this.points[point] = type;
    }

    // clear added points when we add a new grid point
    if (isGridPoint) {
      for (const p in {...this.points}) {
        if (this.points[p] === "ADDED") delete this.points[p];
      }
    };
    this.violatingPoints = [];

    // Hash only grid points
    document.location.hash = Object.keys(this.points)
      .filter(p => this.points[p] !== "ADDED")
      .map(p => {
        console.log(typeof p);
        return(`(${p[0]},${p[1]})`)
      }
      ).join(';');

    // check violations interactively
    this.computeCheck();
  }

  computeSuperset() {
    NLogNAlgo(Object.keys(this.points)).forEach((point) =>
      this.points[point] = "ADDED"
    );
    this.computeCheck();
  }

  computeCheck() {
    this.violatingPoints = getViolatingPoints(Object.keys(this.points));
    let notif_string;
    if (this.violatingPoints.length === 0) {
      notif_string = "satisfied!";
    } else {
      let string_arr = this.violatingPoints.map(a =>
                       "(" + a[0].x + ", " + a[0].y + ") | (" + a[1].x + ", " + a[1].y + ")");
      notif_string = "following pairs of points are violating: <br>" +
                      string_arr.join(" <br>");
    }
    this.checkResult = notif_string;
  }

  clearPoints() {
    this.points = {};
    this.violatingPoints = [];
    this.checkResult = "";
    document.location.hash = "";
  }

  savePoints(filename){
    var dummyLink = document.createElement('a');
    dummyLink.setAttribute('href', 'data:application/json,' + encodeURIComponent(JSON.stringify(this.points)));
    dummyLink.setAttribute('download', filename);
    console.log(dummyLink)
    if (document.createEvent) {
        var event = document.createEvent('MouseEvents');
        event.initEvent('click', true, true);
        dummyLink.dispatchEvent(event);
    }
    else {
        dummyLink.click();
    }
  }

}

export { Store };
