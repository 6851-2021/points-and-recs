import { Point } from "./Point.js";
import { Store } from "./store.js";
import { Graphics } from "./graphics.js";
import { STEP, INITIAL_COLS, INITIAL_ROWS } from "./constants.js";

class PointsAndRecs {
  constructor(svg, rows, cols) {
    this.store = new Store();
    this.graphics = new Graphics(
      svg,
      this.store,
      rows,
      cols
    );
  }
  update() {
    this.graphics.draw();
  }
  start() {
    const checkResult = document.getElementById("checkResult");
    const svg = this.graphics.svg;

    function eventPoint(e) {
      const matrix = svg.getCTM().inverse();
      const pt = svg.createSVGPoint();
      pt.x = e.offsetX;
      pt.y = e.offsetY;
      const transformed = pt.matrixTransform(matrix);
      return [Math.round(transformed.x / STEP), Math.round(transformed.y / STEP)];
    }

    svg.addEventListener("mousemove", (e) => {
      const point = eventPoint(e);
      if (!(this.graphics.mouse && this.graphics.mouse.equals(point))) {
        this.graphics.mouse = point;
        this.update();
      }
    });
    svg.addEventListener("mouseleave", (e) => {
      this.graphics.mouse = null;
      this.update();
    });

    svg.addEventListener("click", (e) => {
      this.store.togglePoint(eventPoint(e));
      checkResult.innerHTML = this.store.checkResult;
      this.update();
    });

    document.getElementById("superset").addEventListener("click", (e) => {
      this.store.computeSuperset();
      checkResult.innerHTML = this.store.checkResult;
      this.update();
    });
    document.getElementById("check").addEventListener("click", (e) => {
      this.store.computeCheck();
      checkResult.innerHTML = this.store.checkResult;
      this.update();
    });
    document.getElementById("clear").addEventListener("click", (e) => {
      this.store.clearPoints();
      checkResult.innerHTML = this.store.checkResult;
      this.update();
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
            this.store.togglePoint([point.x, point.y]);
          }
          document.getElementById("filename").value = file.name
        };
        reader.readAsText(file);
      }
    })
  }
}

function init(rows, cols) {
  const svg = document.getElementById("mainSVG");
  const pointsAndRecs = new PointsAndRecs(svg, rows, cols);
  pointsAndRecs.start();

  document.getElementById("update").addEventListener("click", (e) => {
    e.preventDefault();
    updateGrid()
  });

  function updateGrid() {
    const newRows = Math.abs(parseInt(document.getElementById("rows").value));
    const newCols = Math.abs(parseInt(document.getElementById("cols").value));
    pointsAndRecs.graphics.resize(newRows, newCols);
  }
}

init(INITIAL_ROWS, INITIAL_COLS);
