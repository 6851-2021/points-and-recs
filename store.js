import { getViolatingPoints } from "./algo/Check.js";
import { Point } from "./Point.js";
import { STEP } from "./constants.js";

class Store {

  constructor() {
    // list of points to be drawn as Point objects
    this.points = [];
    this.addedPoints = [];
    this.violatingPoints = [];

    this.checkResult = "";

    if (document.location.hash && document.location.hash[0] === '#') {
      this.points = document.location.hash.slice(1).split(';').map(p => {
        const m = p.trim().match(/\((-?[\d]+),\s*(-?[\d]+)\)/);
        return m ? new Point(parseInt(m[1]), parseInt(m[2])) : null;
      }).filter(p => p);
      this.computeCheck();
    }
  }

  togglePoint(point) {
    const isPoint = (p) => p.equals(point);
    
    const updateSource = (source) => {
      // Try to find point
      const index = source.findIndex(isPoint);
      // Remove it if it exists
      if (index !== -1)
        source.splice(index, 1);
      // Add it if it doesn't
      else
        source.push(new Point(point.x, point.y));
    };

    if (document.getElementById("add-grid-point").checked) {
      // clear added points when we add a new grid point
      this.addedPoints = [];
      updateSource(this.points);
    } else {
      // cannot add a grid point to satisfied set
      if (this.points.find(isPoint)) {
        return;
      }
      updateSource(this.addedPoints);
    }
    
    // clear violating points on any add
    this.violatingPoints = [];

    document.location.hash = this.points.map(p => `(${p.x},${p.y})`).join(';');

    // check violations interactively
    this.computeCheck();
  }

  computeSuperset(algorithm) {
    this.addedPoints = [];
    algorithm(this.points).forEach((point) =>
      this.addedPoints.push(point.getCopy())
    );
    this.computeCheck();
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
    this.checkResult = notif_string;
  }

  clearPoints() {
    this.points = [];
    this.addedPoints = [];
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
