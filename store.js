import { getViolatingPoints } from "./algo/Check.js";
import { Point } from "./Point.js";
import { STEP } from "./constants.js";

class Store {

  constructor(points) {
    // list of points to be drawn as Point objects
    this.points = points || [];
    this.addedPoints = [];
    this.violatingPoints = [];
  }

  togglePoint(point, type) {
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

    if (type === "GRID") {
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
    return this.violatingPoints;
  }

  clearPoints() {
    this.points = [];
    this.addedPoints = [];
    this.violatingPoints = [];
  }

  toJsonString() {
    return JSON.stringify(this.store.points);
  }

  /**
   * Returns hash representation of list of points
   */
  hash() {
    return this.points.map(p => `(${p.x},${p.y})`).join(';');
  }

  /**
   * Parse hashed list of points
   *
   * @param {String} hashedPoints list of points formatted using `Store.hash`
   */
  static unhash(hashedPoints) {
    return hashedPoints
      .split(';')
      .map((p) => {
        const m = p.trim().match(/\((-?[\d]+),\s*(-?[\d]+)\)/);
        return m ? new Point(parseInt(m[1]), parseInt(m[2])) : null;
      })
      .filter(p => p);
  }
}

export { Store };
