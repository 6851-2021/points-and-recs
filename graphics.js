import {
  GRID_BACKGROUND_COLOR,
  GRID_STROKE_COLOR,
  POINT_STROKE_COLOR,
  UNSATISFIED_LINE_COLOR,
  UNSATISFIED_GRID_POINT_COLOR,
  UNSATISFIED_ADDED_POINT_COLOR,
  GRID_POINT_COLOR,
  ADDED_POINT_COLOR,
  STEP,
} from "./constants.js";
import { Point } from "./Point.js";

class Graphics {
  constructor(svg, store, rows, cols) {
    this.svg = svg;
    this.store = store;

    this.radius = STEP / 4;
    // track mouse position to allow hover
    this.mouse = null;
    // namespace for svg
    this.namespace = "http://www.w3.org/2000/svg";
    this.initGroups();
    this.resize(rows, cols);
  }

  initGroups() {
    // Should be called before any other draw methods.
    // <g class="grid">
    this.gridGroup = document.createElementNS(this.namespace, 'g');
    this.gridGroup.setAttribute('class', 'grid');
    this.svg.appendChild(this.gridGroup);
    // <g class="points">
    this.unsatGroup = document.createElementNS(this.namespace, 'g');
    this.unsatGroup.setAttribute('class', 'unsat');
    this.svg.appendChild(this.unsatGroup);
    // <g class="points">
    this.pointGroup = document.createElementNS(this.namespace, 'g');
    this.pointGroup.setAttribute('class', 'points');
    this.svg.appendChild(this.pointGroup);
  }

  resize(rows, cols) {
    this.rows = rows;
    this.cols = cols;
    this.drawGrid();
    this.draw();
  }

  drawGrid() {
    this.svg.setAttribute('viewBox',
      `-1 -1 ${this.cols * STEP + 2} ${this.rows * STEP + 2}`);

    this.gridGroup.innerHTML = "";

    // draw columns
    for (let x = 0; x <= this.cols; x++) {
      const col = document.createElementNS(this.namespace, 'line');
      col.setAttribute('x1', x * STEP);
      col.setAttribute('y1', 0 * STEP);
      col.setAttribute('x2', x * STEP);
      col.setAttribute('y2', this.rows * STEP)
      col.setAttribute('stroke', GRID_STROKE_COLOR);
      this.gridGroup.appendChild(col);
    }
    // draw rows
    for (let y = 0; y <= this.rows; y++) {
      const row = document.createElementNS(this.namespace, 'line');
      row.setAttribute('x1', 0 * STEP);
      row.setAttribute('y1', y * STEP);
      row.setAttribute('x2', this.cols * STEP);
      row.setAttribute('y2', y * STEP)
      row.setAttribute('stroke', GRID_STROKE_COLOR);
      this.gridGroup.appendChild(row);
    }
  }

  drawPoint(point, color) {
    const circle = document.createElementNS(this.namespace, 'circle');
    circle.setAttribute('cx', point.x * STEP);
    circle.setAttribute('cy', point.y * STEP);
    circle.setAttribute('r', this.radius);
    circle.setAttribute('fill', color);
    circle.setAttribute('stroke', POINT_STROKE_COLOR);
    this.pointGroup.appendChild(circle);
  }

  drawUnsatisfiedPair(p1, p2) {
    // draw lines
    const line = document.createElementNS(this.namespace, 'line');
    line.setAttribute('x1', p1.x * STEP);
    line.setAttribute('y1', p1.y * STEP);
    line.setAttribute('x2', p2.x * STEP);
    line.setAttribute('y2', p2.y * STEP);
    line.setAttribute('stroke', UNSATISFIED_LINE_COLOR);
    line.setAttribute('stroke-width', 5);
    line.setAttribute('stroke-dasharray', [15, 15]);
    this.unsatGroup.appendChild(line);

    // draw points
    for (const point of [p1,p2]) {
      const color = point.type === Point.GRID
        ? UNSATISFIED_GRID_POINT_COLOR
        : UNSATISFIED_ADDED_POINT_COLOR;
      this.drawPoint(point, color);
    }
  }

  draw() {
    // Draw everything except grid; drawGrid() is called by resize()


    this.pointGroup.innerHTML = "";
    this.unsatGroup.innerHTML = "";

    // draw the store's points as black
    for (const point of Object.values(this.store.points)) {
      const color = point.type === Point.GRID
        ? GRID_POINT_COLOR
        : ADDED_POINT_COLOR;
      this.drawPoint(point, color);
    }

    // draw the violating points as pairs of colors
    // can be overwritten if a point is part of multiple pairs
    for (const [point_a, point_b] of this.store.violatingPoints) {
      this.drawUnsatisfiedPair(point_a, point_b);
    }    

    // draw the hovered point at a lower opacity
    const color = document.getElementById("add-grid-point").classList.contains("btn-outline-primary")
      ? GRID_POINT_COLOR
      : ADDED_POINT_COLOR;
    if (this.mouse)
      this.drawPoint(this.mouse, `${color}80`);
  }
}

export { Graphics };
