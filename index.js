import { Point } from "./Point.js";
import { Store } from "./store.js";
import { Graphics } from "./graphics.js";
import { STEP, CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.js";

const STEP = 100;
const CANVAS_WIDTH = 10 * STEP;
const CANVAS_HEIGHT = 6 * STEP;
const INITIAL_ROWS = CANVAS_HEIGHT / 100;
const INITIAL_COLUMNS = CANVAS_WIDTH / 100;

class PointsAndRecs {
  constructor(canvasCtx, rows, cols, step, stepX, stepY) {
    this.store = new Store();
    this.step = step;
    this.stepX = stepX;
    this.stepY = stepY;
    this.graphics = new Graphics(
      canvasCtx,
      this.store,
      this.step,
      this.stepX,
      this.stepY
    );
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

    function eventPoint(e) {
      return new Point(Math.round(e.offsetX / STEP),
                       Math.round(e.offsetY / STEP));
    }

    canvas.addEventListener("mousemove", (e) => {
      this.graphics.mouse = eventPoint(e);
    });
    canvas.addEventListener("mouseleave", (e) => {
      this.graphics.mouse = null;
    });

    canvas.addEventListener("click", (e) => {
      this.store.togglePoint(eventPoint(e));
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
    document.getElementById("save").addEventListener("click", (e) => {
      this.store.savePoints(document.getElementById("filename").value);
    });

    const inputFile = document.getElementById("inputFile");
    inputFile.addEventListener("change", (e) => {
      if (inputFile.files && inputFile.files[0]) {
        const file = inputFile.files[0];
        const reader = new FileReader();
        reader.onload = ()=>{
          this.store.clearPoints();
          for(const point of JSON.parse(reader.result)){
            this.store.togglePoint(point);
          }
          document.getElementById("filename").value = file.name
        };
        reader.readAsText(file);
      }
    })


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
  const width = canvasCtx.canvas.clientWidth;
  const height = canvasCtx.canvas.clientHeight;
  const stepX = width / cols
  const stepY = height / rows
  const step = Math.min(stepX, stepY)
  const pointsAndRecs = new PointsAndRecs(canvasCtx, rows, cols, step, stepX, stepY);
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
