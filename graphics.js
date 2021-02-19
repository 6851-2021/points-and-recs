const STEP = 100;

class Graphics {
  constructor(canvasCtx, store) {
    this.canvasCtx = canvasCtx;
    this.store = store;
    this.prevFrameTime = performance.now();

    this.width = this.canvasCtx.canvas.clientWidth;
    this.height = this.canvasCtx.canvas.clientHeight;
  }
  drawGrid() {
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
  }
  drawPoint(point) {
    // can use this.store, to, say, determine if being hovered on slash if it's being clicked right now
    // what should the points look like?
  }
  draw() {
    this.drawGrid();

    // draw the store's points
    for (const point in this.store.points) {
      this.drawPoint(point);
    }
  }
}

export { Graphics };
