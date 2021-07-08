import { Point } from "../Point.js";
import { getViolatingPoints } from "./Check.js";

function DeferralAlgo(points) {
    /**
     * Deferral algorithm from C04 OPEN: BST Upper Bounds on Coauthor.
     * See https://coauthor.csail.mit.edu/6.851-2021/m/TWJtC6Tx4h4Nyj9Q5.
     * 
     * > We will proceed row by row: for each row, find a point which is not
     * > required in order to satisfy a rectangle below it.  (In other words,
     * > this point would not be added by Greedy.)  Defer this point and repeat
     * > until there are no more such points in the row.
     * 
     * > Deferring a point p in the current set consists of the following:
     *   1. Remove p from the current set
     *   2. Find the points l, u, and r immediately left, up, and right
     *      of p in the current set, and add the corner opposite p of the
     *      l,u and r,u rectangles if they aren’t already in the current set.
     *   3. For each added point q complete its column: for each unsatisfied
     *      rectangle from q to some x add a point in q;s column and x's row.
     * 
     * > We prioritize completion points: if there are points that were added
     * > by completions that can defer, defer them before other points in the
     * > same row.
     * 
     * > Clarifications: If u doesn’t exist, the point is removed without adding
     * > new points ("deferred to nowhere"). If l or r doesn’t exist, or if the
     * > opposite corner of the rectangle is already in the point set, nothing
     * > happens in that direction.
     */
    // Sort points by y (row) and then by x (column).
    points.sort((a, b) => a.y === b.y ? a.x - b.x : a.y - b.y);
    let T = deferPoints(points);
    while (getViolatingPoints(T).length > 0) {
        T = deferPoints(T);
    }
}

function deferPoints(points) {
    /* One round of deferral. */
}

function pointsByRow(points) {
    if (points.length === 0) {
        return [];
    }
    let lastY = points[0].y;
    let curRow = [];
    let rows = [];
    for (const point: points) {
        if (point.y === lastY) {
            curRow.push(point);
        }
    }
}