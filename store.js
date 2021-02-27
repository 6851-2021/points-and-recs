import { NLogNAlgo } from "./algo/nlogn.js";
import { getViolatingPoints } from "./algo/Check.js";
import { pointType } from "./constants.js";
import { Point } from "./Point.js";

class Store {

  constructor() {
    // mapping of x,y coordinates to its type
    this.points = {};
    this.violatingPoints = [];

    this.checkResult = "";

    if (document.location.hash && document.location.hash[0] === '#') {
      this.points.clear();
      document.location.hash.slice(1).split(';').forEach(p => {
        const m = p.trim().match(/\((-?[\d]+),\s*(-?[\d]+)\)/);
        if (m) {
          const point = new Point(parseInt(m[1]), parseInt(m[2]), pointType.GRID);
          this.points[point.toString()] = point;
        }
      });
      this.computeCheck();
    }
  }

  togglePoint(point) {
    const addingGridPoint = document.getElementById("add-grid-point").checked;
    const type = addingGridPoint ? pointType.GRID : pointType.ADDED;
    const existingPoint = this.points[point.toString()];

    // Remove/add from the mapping
    if (existingPoint) {
      // cannot overwrite a grid point with added point
      if (!addingGridPoint && existingPoint.type === pointType.GRID) return;
      delete this.points[existingPoint.toString()];
    } else {
      point.type = point.type || type;
      this.points[point.toString()] = point;
    }

    this.violatingPoints = [];
    // Hash only grid points
    document.location.hash = Object.values(this.points)
      .filter((p) => p.type === pointType.GRID)
      .map((p) => `(${p.x},${p.y})`)
      .join(';');

    // check violations interactively
    this.computeCheck();
  }

  computeSuperset() {
    NLogNAlgo(Object.values(this.points)).forEach((point) =>
      this.points[point.toString()] = point
    );
    this.computeCheck();
  }

  computeCheck() {
    this.violatingPoints = getViolatingPoints(Object.values(this.points));
    let notif_string;
    if (this.violatingPoints.length === 0) {
      notif_string = "satisfied!";
    } else {
      let string_arr = this.violatingPoints.map(([p1, p2]) =>
                       "(" + p1.x + ", " + p1.y + ") | (" + p2.x + ", " + p2.y + ")");
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
