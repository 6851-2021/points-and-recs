import { Store } from "./store.js";
import { Graphics } from "./graphics.js";
import { NLogNAlgo } from "./algo/nlogn.js";
import { deferralAlgo } from "./algo/deferral.js";
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
      let num_point=0,num_extra=0;
      for(const p of Object.values(this.store.points)) {
        if (p.type==Point.GRID) ++num_point;
        else ++num_extra;
      }
      notifString = "Satisfied! ("+num_point+" points, "+num_extra+" extra)";
    } else {
      const pairs = this.store.violatingPoints.map(a =>
                      `&nbsp;(${a[0].x}, ${a[0].y}) | (${a[1].x}, ${a[1].y})`
                    );
      notifString = "The following "+pairs.length+" pairs of points are violating: <br>" +
                      pairs.join(" <br>");
    }
    const checkResult = document.getElementById("checkResult");
    checkResult.innerHTML = notifString;
  }
  start() {
    const svg = this.graphics.svg;

    function eventPoint(e) {
      const type = document.getElementById("add-grid-point").classList.contains("btn-outline-primary")
        ? Point.GRID
        : Point.ADDED;
      const matrix = svg.getScreenCTM().inverse();
      const pt = svg.createSVGPoint();
      pt.x = e.pageX - window.scrollX;
      pt.y = e.pageY - window.scrollY;
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
    
    document.getElementById("add-grid-point").addEventListener("click", (e) => {
      if(document.getElementById("add-grid-point").classList.contains("btn-outline-primary")) return;
      document.getElementById("add-grid-point").classList.toggle("btn-outline-primary");
      document.getElementById("add-grid-point").classList.toggle("btn-outline-secondary");
      document.getElementById("add-extra-point").classList.toggle("btn-outline-primary");
      document.getElementById("add-extra-point").classList.toggle("btn-outline-secondary");
    });
    
    document.getElementById("add-extra-point").addEventListener("click", (e) => {
      if(!document.getElementById("add-grid-point").classList.contains("btn-outline-primary")) return;
      document.getElementById("add-grid-point").classList.toggle("btn-outline-primary");
      document.getElementById("add-grid-point").classList.toggle("btn-outline-secondary");
      document.getElementById("add-extra-point").classList.toggle("btn-outline-primary");
      document.getElementById("add-extra-point").classList.toggle("btn-outline-secondary");
    });

    document.getElementById("nlogsuperset").addEventListener("click", (e) => {
      this.store.computeSuperset(NLogNAlgo);
      document.location.hash = this.store.hash();
      this.update();
    });
    document.getElementById("deferralsuperset").addEventListener("click", (e) => {
      this.store.computeSuperset(deferralAlgo);
      document.location.hash = this.store.hash();
      this.update();
    });
    document.getElementById("msuperset").addEventListener("click", (e) => {
      this.store.computeSuperset(FPTAlgo);
      document.location.hash = this.store.hash();
      this.update();
    });
    document.getElementById("clear").addEventListener("click", (e) => {
      this.store.clearPoints();
      document.location.hash = "";
      this.update();
    });
    document.getElementById("clear-satisfied").addEventListener("click", (e) => {
      this.store.clearAddedPoints();
      document.location.hash = this.store.hash();
      this.update();
    });

    function manipulate_points(target, f) {
      const nxt = Object.values(target.store.points).map(f);
      let minx = 0, miny = 0;
      if (nxt.length) {
        minx = nxt[0].x, miny = nxt[0].y;
        for(const point of nxt) {
          minx = Math.min(minx, point.x);
          miny = Math.min(miny, point.y);
        }
      }
      target.store.clearPoints();
      for (const point of nxt)
        target.store.togglePoint(new Point(point.x-minx+1, point.y-miny+1, point.type));
      document.location.hash = target.store.hash();
      target.update();
      document.getElementById("adjust").click();
    }
    document.getElementById("rotate-left").addEventListener("click", (e) => {
      manipulate_points(this,p=>new Point(p.y,-p.x,p.type));
    });
    document.getElementById("rotate-right").addEventListener("click", (e) => {
      manipulate_points(this,p=>new Point(-p.y,p.x,p.type));
    });
    document.getElementById("flip-horizontal").addEventListener("click", (e) => {
      manipulate_points(this,p=>new Point(p.x,-p.y,p.type));
    });
    document.getElementById("flip-vertical").addEventListener("click", (e) => {
      manipulate_points(this,p=>new Point(-p.x,p.y,p.type));
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
          const result = JSON.parse(reader.result);
          for(const point of Object.values(result)) {
            const type = (point.type=='GRID')?(Point.GRID):(Point.ADDED);
            this.store.togglePoint(new Point(point.x, point.y, type));
          }
          document.getElementById("adjust").click();
          document.getElementById("filename").value = file.name;
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
    updateGrid();
  });

  function auto_adjust() {
    let newRows = Math.max(INITIAL_ROWS,Math.abs(parseInt(document.getElementById("rows").value)));
    let newCols = Math.max(INITIAL_COLS,Math.abs(parseInt(document.getElementById("cols").value)));
    for(const p of Object.values(pointsAndRecs.store.points)) {
      newRows = Math.max(newRows, p.y + 1);
      newCols = Math.max(newCols, p.x + 1);
    }
    document.getElementById("rows").value = newRows;
    document.getElementById("cols").value = newCols;
    pointsAndRecs.graphics.resize(newRows, newCols);
  };
  
  document.getElementById("adjust").addEventListener("click", (e) => {e.preventDefault(); auto_adjust();});
  auto_adjust();

  function updateGrid() {
    const newRows = Math.abs(parseInt(document.getElementById("rows").value));
    const newCols = Math.abs(parseInt(document.getElementById("cols").value));
    pointsAndRecs.graphics.resize(newRows, newCols);
  }
}

init(INITIAL_ROWS, INITIAL_COLS);
