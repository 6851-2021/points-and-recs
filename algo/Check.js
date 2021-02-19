class Check {

  checkIsSatisfied(points) {
    for (let i = 0; i < points.length; ++i) {
      for (let j = i + 1; j < points.length; ++j) {
        let point_a = points[i];
        let point_b = points[j];
        if (point_a.isColinear(point_b)) {
          continue;
        }
        
      }
    }
  }

}

export { checkIsSatisfied };