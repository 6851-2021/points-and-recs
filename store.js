const STEP = 100;

class Store {
  constructor() {
    // list of points to be drawn as {x, y}
    this.points = [];

    this.mouseX = 0;
    this.mouseY = 0;
    this.hoverItem = null;
    this.activeClick = null;
  }
  updateClick() {
    this.activeClick = true;

    // this is bad; should probably have a STEP / 2 somewhere
    const x = Math.floor(this.mouseX / STEP);
    const y = Math.floor(this.mouseY / STEP);

    // if the point {x, y} exists, we should do something else
    this.points.push({x, y});
  }
}

export { Store };
