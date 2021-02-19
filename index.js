import { Store } from "./store.js";
import { Graphics } from "./graphics.js";
import { STEP, CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.js";


class PointsAndRecs {
  constructor(canvasCtx) {
    this.store = new Store();
    this.graphics = new Graphics(canvasCtx, this.store);
  }
  update() {
    this.graphics.draw();
  }
  updateLoop() {
    this.update();
    window.requestAnimationFrame(() => {
      this.updateLoop();
    });
  }
  startUpdateLoop() {
    window.requestAnimationFrame(() => {
      this.updateLoop();
    });
  }
  onMouseDown(e) {
    this.store.updateClick();
  }
  onMouseUp(e) {
    this.store.activeClick = null;
  }
  onMouseMove(e) {
    const x = Math.floor(e.offsetX / STEP + 0.5);
    const y = Math.floor(e.offsetY / STEP + 0.5);

    this.store.mouseX = x;
    this.store.mouseY = y;
  }
  start() {
    this.startUpdateLoop();

    const canvas = this.graphics.canvasCtx.canvas;
    canvas.addEventListener("mousemove", this.onMouseMove.bind(this));
    canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
  }
}

function setup_canvas(width, height) {
  const c = document.getElementById("mainCanvas");
  const ctx = c.getContext("2d");
  c.width = width;
  c.height = height;
  return ctx;
}

function init() {
  const canvasCtx = setup_canvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  const pointsAndRecs = new PointsAndRecs(canvasCtx);
  pointsAndRecs.start();
}

init();
