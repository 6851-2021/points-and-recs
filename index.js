import { Store } from "./store.js";
import { Graphics } from "./graphics.js";
import { NLogNAlgo } from "./algo/nlogn.js";
import { FPTAlgo } from "./algo/fpt.js";
import { STEP, INITIAL_COLS, INITIAL_ROWS } from "./constants.js";
import { Point } from "./Point.js";

class PointsAndRecs {
  constructor(svg, rows, cols) {
    let points = {};

    if (document.location.hash && document.location.hash[0] === '#') {
      points = Store.unhash(document.location.hash.slice(1));
    }
    this.store = new Store(points);
    this.store.computeCheck();

    this.graphics = new Graphics(
      svg,
      this.store,
      rows,
      cols
    );
  }
  update() {
    this.graphics.draw();

    // Update violating points message
    let notifString = "";
    if (this.store.violatingPoints.length === 0) {
      notifString = "satisfied!";
    } else {
      const pairs = this.store.violatingPoints.map(a =>
                      `( ${a[0].x}, ${a[0].y}) | (${a[1].x}, ${a[1].y})`
                    );
      notifString = "following pairs of points are violating: <br>" +
                      pairs.join(" <br>");
    }
    const checkResult = document.getElementById("checkResult");
    checkResult.innerHTML = notifString;
  }
  start() {
    const svg = this.graphics.svg;

    function eventPoint(e) {
      const type = document.getElementById("add-grid-point").checked
        ? Point.GRID
        : Point.ADDED;
      const matrix = svg.getScreenCTM().inverse();
      const pt = svg.createSVGPoint();
      pt.x = e.pageX;
      pt.y = e.pageY;
      const transformed = pt.matrixTransform(matrix);
      return new Point(
        Math.round(transformed.x / STEP), Math.round(transformed.y / STEP), type
      );
    }

    svg.addEventListener("mousemove", (e) => {
      const point = eventPoint(e);
      if (!(this.graphics.mouse && this.graphics.mouse.isCollocated(point))) {
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
      document.location.hash = this.store.hash();
      this.update();
    });

    document.getElementById("nlogsuperset").addEventListener("click", (e) => {
      this.store.computeSuperset(NLogNAlgo);
      this.update();
    });
    document.getElementById("msuperset").addEventListener("click", (e) => {
      this.store.computeSuperset(FPTAlgo);
      this.update();
    });
    document.getElementById("check").addEventListener("click", (e) => {
      this.store.computeCheck();
      this.update();
    });
    document.getElementById("clear").addEventListener("click", (e) => {
      this.store.clearPoints();
      document.location.hash = "";
      this.update();
    });
    document.getElementById("clear-satisfied").addEventListener("click", (e) => {
      this.store.clearAddedPoints();
      this.update();
    });
    document.getElementById("save").addEventListener("click", (_e) => {
      const dummyLink = document.createElement('a');
      dummyLink.setAttribute('href', `data:application/json,${encodeURIComponent(this.store.toJsonString())}`);
      dummyLink.setAttribute('download', document.getElementById("filename").value);

      if (document.createEvent) {
          var event = document.createEvent('MouseEvents');
          event.initEvent('click', true, true);
          dummyLink.dispatchEvent(event);
      } else {
          dummyLink.click();
      }
    });

    const inputFile = document.getElementById("inputFile");
    inputFile.addEventListener("change", (e) => {
      if (inputFile.files && inputFile.files[0]) {
        const file = inputFile.files[0];
        const reader = new FileReader();
        reader.onload = ()=>{
          this.store.clearPoints();
          for(const point of JSON.parse(reader.result)){
            this.store.togglePoint(new Point(point.x, point.y, Point.GRID));
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
