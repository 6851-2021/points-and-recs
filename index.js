import { Point } from "./Point.js";
import { Store } from "./store.js";
import { Graphics } from "./graphics.js";
import { STEP, CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants.js";


class PointsAndRecs {
  constructor(canvasCtx) {
    this.store = new Store();
    this.graphics = new Graphics(canvasCtx, STEP, this.store);
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

function init() {
  const canvasCtx = setup_canvas(CANVAS_WIDTH, CANVAS_HEIGHT);
  const pointsAndRecs = new PointsAndRecs(canvasCtx);
  pointsAndRecs.start();
}

init();
