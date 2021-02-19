import { Point } from "./Point.js";
import {
  STEP,
  RADIUS,
  STORE_POINT_COLOR,
  ADDED_POINT_COLOR,
  VIOLATING_POINT_COLOR,
} from "./constants.js";


class Graphics {
  constructor(canvasCtx, store) {
    this.canvasCtx = canvasCtx;
    this.store = store;
    this.prevFrameTime = performance.now();

    this.width = this.canvasCtx.canvas.clientWidth;
    this.height = this.canvasCtx.canvas.clientHeight;
  }
  drawGrid() {
    // canvas is really low level... this should probably be factored out
    this.canvasCtx.save();

    // draw background
    this.canvasCtx.beginPath();
    this.canvasCtx.rect(0, 0, this.width, this.height);
    this.canvasCtx.fillStyle = "#ffffff";
    this.canvasCtx.fill();

    // draw grid
    this.canvasCtx.beginPath();
    for (let x = 0; x <= this.width; x += STEP) {
      this.canvasCtx.moveTo(x, 0);
      this.canvasCtx.lineTo(x, this.height);
    }
    for (let y = 0; y <= this.height; y += STEP) {
      this.canvasCtx.moveTo(0, y);
      this.canvasCtx.lineTo(this.width, y);
    }
    this.canvasCtx.strokeStyle = "#000000";
    this.canvasCtx.lineWidth = 1;
    this.canvasCtx.stroke();

    this.canvasCtx.restore();
  }
  drawPoint(point, color) {
    let [x, y] = [point.x, point.y];
    this.canvasCtx.save();
    this.canvasCtx.beginPath();
    this.canvasCtx.arc(STEP * x, STEP * y, RADIUS, 0, 2 * Math.PI);
    this.canvasCtx.fillStyle = color;
    this.canvasCtx.fill();
    this.canvasCtx.strokeStyle = "#000000";
    this.canvasCtx.lineWidth = 1;
    this.canvasCtx.stroke();
    this.canvasCtx.restore();
  }
  
  draw() {
    this.drawGrid();

    // draw the intersection hovered over with lower opacity
    const color = document.getElementById("add-grid-point").checked
      ? STORE_POINT_COLOR
      : ADDED_POINT_COLOR;

    this.drawPoint(
      new Point(this.store.mouseX, this.store.mouseY),
      `${color}80`
    );

    // draw the store's points
    for (const point of this.store.points) {
      this.drawPoint(point, STORE_POINT_COLOR);
    }

    // draw the additional points
    for (const point of this.store.addedPoints) {
      this.drawPoint(point, ADDED_POINT_COLOR);
    }

    // draw the violating points as pairs of colors
    // can be overwritten if a point is part of multiple pairs
    for (const [point_a, point_b] of this.store.violatingPoints) {
      this.drawPoint(point_a, VIOLATING_POINT_COLOR);
      this.drawPoint(point_b, VIOLATING_POINT_COLOR);
    }    
  }
}

export { Graphics };
