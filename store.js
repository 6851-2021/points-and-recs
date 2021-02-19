class Store {
  constructor() {
    // list of points to be drawn (how do we store them?)
    this.points = [];

    this.mouseX = 0;
    this.mouseY = 0;
    this.hoverItem = null;
    this.activeClick = null;
  }
  updateClick() {
    this.activeClick = true;
    // add a point at coords specified by this.mouseX, this.mouseY?
    console.log(this.mouseX, this.mouseY);
  }
}

export { Store };
