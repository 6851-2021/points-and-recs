import { Store } from "./store.js";
import { Graphics } from "./graphics.js";

const STEP = 100;
const CANVAS_WIDTH = 10 * STEP;
const CANVAS_HEIGHT = 6 * STEP;

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
  start() {
    this.startUpdateLoop();

    const checkResult = document.getElementById("checkResult");
    const canvas = this.graphics.canvasCtx.canvas;

    canvas.addEventListener("click", (e) => {
      this.store.togglePoint(Math.round(e.offsetX / STEP), Math.round(e.offsetY / STEP));
      checkResult.innerHTML = this.store.checkResult;
    });

    document.getElementById("superset").addEventListener("click", (e) => {
      this.store.computeSuperset();
      checkResult.innerHTML = this.store.checkResult;
    });
    document.getElementById("check").addEventListener("click", (e) => {
      this.store.computeCheck();
      checkResult.innerHTML = this.store.checkResult;
    });
    document.getElementById("clear").addEventListener("click", (e) => {
      this.store.clearPoints();
      checkResult.innerHTML = this.store.checkResult;
    });
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
