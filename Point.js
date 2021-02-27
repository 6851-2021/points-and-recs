class Point {

  constructor(xcoor, ycoor, type) {
    this.x = xcoor;
    this.y = ycoor;
    this.type = type;
  }

  equals(other) {
    return (this.x === other.x) && (this.y === other.y);
  }

  isColinear(other) {
    return (this.x === other.x) || (this.y === other.y);
  }

  copy() {
    return new Point(this.x, this.y);
  }

  toString() {
      // Formatted same way as Array.protoType.toString
      return `${this.x},${this.y}`;
  }
}

export { Point };