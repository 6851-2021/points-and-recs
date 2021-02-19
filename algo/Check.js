
// checks if points i and j are satisfied with one another 
// per the given definition (some other point exists in their formed rect.)
// TODO: optimize (a quadtree or kd tree would make this faster)
export function checkPairSatisfied(i, j, points) {
  let lo_x = Math.min(points[i].x, points[j].x);
  let hi_x = Math.max(points[i].x, points[j].x);
  let lo_y = Math.min(points[i].y, points[j].y);
  let hi_y = Math.max(points[i].y, points[j].y);
  for (let k = 0; k < points.length; ++k) {
    if ((i != k) && (j != k)) {
      let [x, y] = [points[k].x, points[k].y];
      if ((lo_x <= x) && (x <= hi_x) && (lo_y <= y) && (y <= hi_y)) {
        return true;
      }
    }
  }
  return false;
}

// checks if points are satisfied
// returns a list of pairs of points that violate the above condition
// runtime: O(n^3)
export function getViolatingPoints(points) {
  let violating_pairs = [];
  for (let i = 0; i < points.length; ++i) {
    for (let j = i + 1; j < points.length; ++j) {
      let point_a = points[i];
      let point_b = points[j];
      if (point_a.isColinear(point_b)) {
        continue;
      }

      if (!checkPairSatisfied(i, j, points)) {
        violating_pairs.push([point_a, point_b]);
      }

    }
  }

  return violating_pairs;
}
