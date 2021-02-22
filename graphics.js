import { Point } from "./Point.js";
import {
  GRID_BACKGROUND_COLOR,
  GRID_STROKE_COLOR,
  POINT_STROKE_COLOR,
  UNSATISFIED_POINT_COLOR,
  GRID_POINT_COLOR,
  ADDED_POINT_COLOR,
} from "./constants.js";

class Graphics {
  constructor(svg, width, height, store, step) {
    this.svg = svg;
    this.store = store;
    this.prevFrameTime = performance.now();

    this.step = step;
    this.radius = step / 4;
    this.width = width;
    this.height = height;
    // track mouse position to allow hover
    this.mouse = null;
    // namespace for svg
    this.namespace = "http://www.w3.org/2000/svg";
  }

  drawGrid() {
    // draw background
    const svgBackground = document.createElementNS(this.namespace, 'rect');
    svgBackground.setAttribute('width', this.width);
    svgBackground.setAttribute('height', this.height);
    svgBackground.setAttribute('x', 0);
    svgBackground.setAttribute('y', 0);
    svgBackground.setAttribute('fill', GRID_BACKGROUND_COLOR);
    this.svg.appendChild(svgBackground);

    // draw columns
    for (let x = 0; x <= this.width; x += this.step) {
      const col = document.createElementNS(this.namespace, 'line');
      col.setAttribute('x1', x);
      col.setAttribute('y1', 0);
      col.setAttribute('x2', x);
      col.setAttribute('y2', this.height)
      col.setAttribute('stroke', GRID_STROKE_COLOR);
      this.svg.appendChild(col);
    }
    // draw rows
    for (let y = 0; y <= this.height; y += this.step) {
      const row = document.createElementNS(this.namespace, 'line');
      row.setAttribute('x1', 0);
      row.setAttribute('y1', y);
      row.setAttribute('x2', this.width);
      row.setAttribute('y2', y)
      row.setAttribute('stroke', GRID_STROKE_COLOR);
      this.svg.appendChild(row);
    }
  }

  drawPoint(point, color) {
    let [x, y] = [point.x * this.step, point.y * this.step];

    const circle = document.createElementNS(this.namespace, 'circle');
    circle.setAttribute('cx', x);
    circle.setAttribute('cy', y);
    circle.setAttribute('r', this.radius);
    circle.setAttribute('fill', color);
    circle.setAttribute('stroke', POINT_STROKE_COLOR);
    this.svg.appendChild(circle);
  }

  drawUnsatisfiedPair(point_a, point_b) {
    // draw lines
    const line = document.createElementNS(this.namespace, 'line');
    line.setAttribute('x1', this.step * point_a.x);
    line.setAttribute('y1', this.step * point_a.y);
    line.setAttribute('x2', this.step * point_b.x);
    line.setAttribute('y2', this.step * point_b.y);
    line.setAttribute('stroke', UNSATISFIED_POINT_COLOR);
    line.setAttribute('stroke-width', 5);
    line.setAttribute('stroke-dasharray', [15, 15]);
    this.svg.appendChild(line);

    // draw points
    this.drawPoint(point_a, UNSATISFIED_POINT_COLOR);
    this.drawPoint(point_b, UNSATISFIED_POINT_COLOR);
  }

  draw() {
    this.drawGrid();

    // draw the store's points as black
    for (const point of this.store.points) {
      this.drawPoint(point, GRID_POINT_COLOR);
    }

    // draw the additional points as green
    for (const point of this.store.addedPoints) {
      this.drawPoint(point, ADDED_POINT_COLOR);
    }

    // draw the violating points as pairs of colors
    // can be overwritten if a point is part of multiple pairs
    for (const [point_a, point_b] of this.store.violatingPoints) {
      this.drawUnsatisfiedPair(point_a, point_b);
    }    

    // draw the hovered point at a lower opacity
    const color = document.getElementById("add-grid-point").checked
      ? GRID_POINT_COLOR
      : ADDED_POINT_COLOR;
    if (this.mouse)
      this.drawPoint(this.mouse, `${color}80`);
  }
}

export { Graphics };
