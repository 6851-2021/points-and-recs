import { Point } from "../Point.js";
import { pointType } from "../constants.js";

// points is a list of unique Points
// Returns a list of points to add
// Based on D&C
function NLogNAlgo(points) {
    // Sort points by x then by y
    points.sort((a, b) => a.x === b.x ? a.y - b.y : a.x - b.x);
    return dnc(points)[1];
}

// Returns [unique sorted y coordinates, points to add]
function dnc(points) {
    // Empty list
    if (!points.length)
        return [[], []];
    // Find median by x
    const p = Math.floor(points.length / 2);
    // Find all points on the same vertical line
    let pl = p, pr = p;
    while (pl >= 0 && points[pl].x === points[p].x) --pl;
    while (pr < points.length && points[pr].x === points[p].x) ++pr;
    // pl and pr should point to last and first points with different x
    // Recurse
    const [yl, rl] = dnc(points.slice(0, pl + 1)), [yr, rr] = dnc(points.slice(pr));
    const r = [...rl, ...rr];
    // Merge the y coordinates
    let y = [];
    ++pl;
    // pl should point to first point on vertical line
    for (let il = 0, ir = 0, lastY = null; il < yl.length || ir < yr.length; ) {
        let newY;
        // Choose the smaller y from the left and the right partitions
        if (il < yl.length && (ir >= yr.length || yl[il] < yr[ir])) newY = yl[il++];
        else newY = yr[ir++];
        // Check for duplicate
        if (newY == lastY) continue;
        // Add all points on vertical line with y less than newY
        while (pl < pr && points[pl].y < newY) y.push(points[pl++].y);
        // Skip over points with the same y to avoid duplicates
        if (pl < pr && points[pl].y === newY) ++pl;
        // Otherwise we should add this point
        else r.push(new Point(points[p].x, newY, pointType.ADDED));
        y.push(newY);
        lastY = newY;
    }
    // May have some points on vertical line remaining (those with y greater than the greatest y not on the line)
    y = [...y, ...points.slice(pl, pr).map(p => p.y)];
    return [y, r];
}

export { NLogNAlgo };