class Point {

  constructor(x_cor, y_cor) {
    
    this.x = x_cor;
    this.y = y_cor;

  }

  equals(other) {
    return (this.x === other.x) && (this.y === other.y);
  }

  isColinear(other) {
    return (this.x === other.x) || (this.y === other.y);
  }

  getCopy() {
    let cp = new Point(this.x, this.y); 
    return cp;
  }

}

export { Point };
