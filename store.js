import { getViolatingPoints } from "./algo/Check.js";
import { Point } from "./Point.js";

class Store {

  constructor(points) {
    // mapping of x,y coordinates to its type
    this.points = points || {};
    this.violatingPoints = [];
  }

  togglePoint(point) {
    const existingPoint = this.points[point.toString()];

    // Remove/add from the mapping
    if (existingPoint) {
      // cannot overwrite a grid point with added point
      if (point.type === Point.ADDED && existingPoint.type === Point.GRID) return;
      delete this.points[existingPoint.toString()];
    } else {
      this.points[point.toString()] = point;
    }

    this.violatingPoints = [];
    // check violations interactively
    this.computeCheck();
  }

  computeSuperset(algorithm) {
    algorithm(Object.values(this.points)).forEach((point) =>
      this.points[point.toString()] = point
    );
    this.computeCheck();
  }
  
  computeCheck() {
    this.violatingPoints = getViolatingPoints(Object.values(this.points));
    return this.violatingPoints;
  }

  clearPoints() {
    this.points = {};
    this.violatingPoints = [];
  }

  clearAddedPoints() {
    for (const point of Object.values(this.points)) {
      if (point.type === Point.ADDED) {
        delete this.points[point.toString()];
      }
    }
    this.computeCheck();
  }

  toJsonString() {
    return JSON.stringify(this.points);
  }

  /**
   * Returns hash representation of list of points
   */
  hash() {
    return Object.values(this.points)
      .filter(p => p.type === Point.GRID)
      .map(p => `(${p.x},${p.y})`).join(';');
  }

  /**
   * Parse hashed list of points
   *
   * @param {String} hashedPoints list of points formatted using `Store.hash`
   */
  static unhash(hashedPoints) {
    return hashedPoints
      .split(';')
      .reduce((points, p) => {
        const m = p.trim().match(/\((-?[\d]+),\s*(-?[\d]+)\)/);
        if (m) {
          const point = new Point(parseInt(m[1]), parseInt(m[2]), Point.GRID);
          points[point.toString()] = point;
        }
        return points;
      }, {});
  }
}

export { Store };
