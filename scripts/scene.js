class Scene {
  constructor(canvas, trailTimingFunction, deviceType) {
    this.canvas = canvas;
    this.deviceType = deviceType;
    this.heightRatio = 9/16;
    this.widthRatio = 1/(this.heightRatio);
    this.blockersColor = "#000";
    
    this.trailTimingFunction = trailTimingFunction;
    this.trailFrames = 45;
    this.trailFrameCounter = 0;
    this.trailTimingFunctionCache = {};
    this.lastDistanceX = 0;
    this.lastDistanceY = 0;
    
    this.offsetX = 0;
    this.offsetY = 0;
    
    this.initialize(canvas);
  }
  
  initialize(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (canvas.height < canvas.width*this.heightRatio) {
      this.height = canvas.height;
      this.width = this.height*this.widthRatio;
      this.setCoords(canvas);
      this.blockers = [
        { x: 0, y: 0, width: this.x, height: this.height },
        { x: this.x + this.width, y: 0, width: canvas.width - (this.width + this.x), height: this.height },
      ];
    } else {
      this.width = canvas.width;
      this.height = this.width*this.heightRatio;
      this.setCoords(canvas);
      this.blockers = [
        { x: 0, y: 0, width: this.width, height: this.y },
        { x: 0, y: this.y + this.height, width: this.width, height: canvas.height-(this.y+this.height) },
      ];
    }

    this.offsetX /= this.unit;
    this.offsetY /= this.unit;
    
    this.unit = this.width/100;

    this.offsetX *= this.unit;
    this.offsetY *= this.unit;
  }
  
  resize(canvas) {
    this.initialize(canvas);
  }
  
  setCoords(canvas) {
    this.x = (canvas.width - this.width)/2;
    this.y = (this.deviceType === "Mobile") ? 0 : (canvas.height - this.height)/2;
  }
  
  get centerX() {
    return this.offsetX/this.unit + 50;
  }
  
  get centerY() {
    return this.offsetY/this.unit + 50*this.heightRatio;
  }
  
  initFocus(focus) {
    this.focus = focus;
    
    this.offsetX = (this.focus.x + this.focus.width - this.focus.width/2) * this.unit - this.width/2;
    this.offsetY = (this.focus.y + this.focus.height - this.focus.height/2) * this.unit - this.height/2;
  }
  
  set lastFocus(focus) {
    this.lastFocusX = focus.x;
    this.lastFocusY = focus.y;
    this.lastFocusWidth = focus.width;
    this.lastFocusHeight = focus.height;
  }
  
  trailFocus() {
    // if the position's focus has changed
    if (this.focus.x !== this.lastFocusX || 
        this.focus.y !== this.lastFocusY || 
        this.focus.width !== this.lastFocusWidth ||
        this.focus.height !== this.lastFocusHeight) {

      this.trailFrameCounter = 0;
      this.lastDistanceX = 0
      this.lastDistanceY = 0;
      
      this.trailLengthX = (this.focus.x+this.focus.width/2) - this.centerX;
      this.trailLengthY = (this.focus.y+this.focus.height/2) - this.centerY;
    }
    
    if (this.trailFrameCounter === this.trailFrames) return;
    
    this.trailFrameCounter++;
    let t = (this.trailFrameCounter/this.trailFrames).toFixed(3);
    let tString = String(t);
      
    if (!this.trailTimingFunctionCache[tString])
      this.trailTimingFunctionCache[tString] = this.trailTimingFunction(t);
      
    let bezierOutput = this.trailTimingFunctionCache[tString];
      
    let trailProgressX = bezierOutput*this.trailLengthX;
    let trailProgressY = bezierOutput*this.trailLengthY;
      
    this.offsetX += (trailProgressX - this.lastDistanceX) * this.unit;
    this.offsetY += (trailProgressY - this.lastDistanceY) * this.unit;
    
    this.lastDistanceX = trailProgressX;
    this.lastDistanceY = trailProgressY;
    
    this.lastFocus = this.focus;
  }
  
  drawBlockers(context) {
    context.beginPath();
    context.fillStyle = this.blockersColor;
    for (let blocker of this.blockers) {
      context.fillRect(blocker.x, blocker.y, blocker.width, blocker.height);
    }
  }
}

console.log("class Scene created!");
