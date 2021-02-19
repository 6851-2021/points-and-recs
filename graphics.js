import { Point } from "./Point.js";


const STEP = 100;
const RADIUS = STEP / 4;

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

    // draw the store's points as black
    for (const point of this.store.points) {
      this.drawPoint(point, "#888888");
    }

    // draw the additional points as green
    for (const point of this.store.addedPoints) {
      this.drawPoint(point, "#00ff00");
    }

    // draw the violating points as pairs of colors
    // can be overwritten if a point is part of multiple pairs
    for (const [point_a, point_b] of this.store.violatingPoints) {
      this.drawPoint(point_a, "#800000");
      this.drawPoint(point_b, "#800000");
    }    
  }
}

export { Graphics };
