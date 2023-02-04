class ScalePen {
  constructor(context) {
    this.context = context;
  }
  
  fillRectToScale(x, y, width, height, unit, stroke) {
    x = Math.floor(x*unit);
    y = Math.floor(y*unit);
    width = Math.ceil(width*unit)+1;
    height = Math.ceil(height*unit)+1;
    this.context.fillRect(x, y, width, height);
    if (stroke === true)
      this.context.strokeRect(x, y, width, height);
  }
  
}