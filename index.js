import { Store } from "./store.js";
import { Graphics } from "./graphics.js";

const CANVAS_WIDTH = 1000;
const CANVAS_HEIGHT = 600;
const INITIAL_ROWS = CANVAS_HEIGHT / 100;
const INITIAL_COLUMNS = CANVAS_WIDTH / 100;

class PointsAndRecs {
  constructor(canvasCtx, rows, cols) {
    this.store = new Store();
    this.graphics = new Graphics(canvasCtx, this.store, rows, cols);
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
    this.store.mouseX = e.offsetX;
    this.store.mouseY = e.offsetY;
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

function init(rows, cols) {
  const canvasCtx = setup_canvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  const pointsAndRecs = new PointsAndRecs(canvasCtx, rows, cols);
  pointsAndRecs.start();
}

init(INITIAL_ROWS, INITIAL_COLUMNS);

const u = document.getElementById("update");
u.addEventListener("click", (e) => updateGrid());

function updateGrid() {
  const newRows = document.getElementById("rows").value;
  const newCols = document.getElementById("cols").value;
  init(Math.abs(parseInt(newRows)), Math.abs(parseInt(newCols)))
}
