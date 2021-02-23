import { NLogNAlgo } from "./algo/nlogn.js";
import { getViolatingPoints } from "./algo/Check.js";
import { pointType } from "./constants.js";
import PointMap from "./PointMap.js";

class Store {

  constructor() {
    // mapping of x,y coordinates to its type
    this.points = new PointMap();
    this.violatingPoints = [];

    this.checkResult = "";

    if (document.location.hash && document.location.hash[0] === '#') {
      const type = pointType.GRID;
      this.points.clear();
      document.location.hash.slice(1).split(';').forEach(p => {
        const m = p.trim().match(/\((-?[\d]+),\s*(-?[\d]+)\)/);
        if (m) {
          const coor = [parseInt(m[1]), parseInt(m[2])];
          this.points.set(coor, type);
        }
      });
      this.computeCheck();
    }
  }

  togglePoint(point) {
    const addingGridPoint = document.getElementById("add-grid-point").checked;
    const type = addingGridPoint ? pointType.GRID : pointType.ADDED;
    const existingPoint = this.points.get(point);

    // Remove/add from the mapping
    if (existingPoint) {
      // cannot overwrite a grid point with added point
      if (!addingGridPoint && existingPoint === pointType.GRID) return;
      this.points.delete(point);
    } else {
      this.points.set(point, type);
    }

    // clear added points when we add a new grid point
    if (addingGridPoint) {
      for (const [p, type] of [...this.points]) {
        if (type === pointType.ADDED) {
          this.points.delete(p);
        };
      }
    };
    this.violatingPoints = [];
    // Hash only grid points
    document.location.hash = this.points
      .entries()
      .filter(([_, type]) => type === pointType.GRID)
      .map(([p, _]) => `(${p[0]},${p[1]})`)
      .join(';');

    // check violations interactively
    this.computeCheck();
  }

  computeSuperset() {
    NLogNAlgo(this.points.keys()).forEach((point) =>
      this.points.set(point, pointType.ADDED)
    );
    this.computeCheck();
  }

  computeCheck() {
    this.violatingPoints = getViolatingPoints(this.points.keys());
    let notif_string;
    if (this.violatingPoints.length === 0) {
      notif_string = "satisfied!";
    } else {
      let string_arr = this.violatingPoints.map(([p1, p2]) =>
                       "(" + p1[0] + ", " + p1[1] + ") | (" + p2[0] + ", " + p2[1] + ")");
      notif_string = "following pairs of points are violating: <br>" +
                      string_arr.join(" <br>");
    }
    this.checkResult = notif_string;
  }

  clearPoints() {
    this.points.clear();
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
