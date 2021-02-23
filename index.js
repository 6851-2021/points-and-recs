import { Point } from "./Point.js";
import { Store } from "./store.js";
import { Graphics } from "./graphics.js";
import { STEP, CANVAS_HEIGHT, CANVAS_WIDTH, INITIAL_COLS, INITIAL_ROWS } from "./constants.js";

class PointsAndRecs {
  constructor(svg, rows, cols) {
    this.store = new Store();
    this.graphics = new Graphics(
      svg,
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      this.store,
      rows,
      cols
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
    const svg = this.graphics.svg;

    function eventPoint(e) {
      return new Point(Math.round(e.offsetX / STEP),
                       Math.round(e.offsetY / STEP));
    }

    svg.addEventListener("mousemove", (e) => {
      this.graphics.mouse = eventPoint(e);
    });
    svg.addEventListener("mouseleave", (e) => {
      this.graphics.mouse = null;
    });

    svg.addEventListener("click", (e) => {
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

function setup_svg(width, height) {
  const svg = document.getElementById("mainSVG");
  svg.setAttribute('width', width.toString());
  svg.setAttribute('height', height.toString());
  return svg;
}

function init(rows, cols) {
  const svg = setup_svg(CANVAS_WIDTH, CANVAS_HEIGHT);
  const pointsAndRecs = new PointsAndRecs(svg, rows, cols);
  pointsAndRecs.start();
}

init(INITIAL_ROWS, INITIAL_COLS);

const u = document.getElementById("update");
u.addEventListener("click", (e) => updateGrid());

function updateGrid() {
  const newRows = document.getElementById("rows").value;
  const newCols = document.getElementById("cols").value;
  init(Math.abs(parseInt(newRows)), Math.abs(parseInt(newCols)))
}
