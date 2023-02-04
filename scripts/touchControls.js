class TouchControls {
  constructor(canvas) {
    this.canvas = canvas;
    this.unit = this.canvas.width/100;
    this.createButtons();
  }

  resize(canvas) {
    this.canvas = canvas;
    this.unit = window.innerWidth/100;
    this.createButtons();
  }
  
  createButtons() {
    this.overallHeight = 150/this.unit;
    this.edgeOffset = 15/this.unit;
    this.topOffset = this.canvas.height/this.unit - this.edgeOffset - this.overallHeight;
    
    this.dPad = {
      x: this.edgeOffset,
      y: this.topOffset,
      width: this.overallHeight,
      height: this.overallHeight,
      thickness: this.overallHeight/3,
      color: "#aaa8",
    };
    
    this.bBtn = {
      x: 100 - this.edgeOffset - 7,
      y: this.topOffset + this.dPad.height/2,
      radius: 40/this.unit,
      color: "#0f08",
      textColor: "#fff",
      name: "B",
    };
    
    this.aBtn = {
      x: this.bBtn.x - this.edgeOffset - this.bBtn.radius*2,
      y: this.bBtn.y,
      radius: this.bBtn.radius,
      color: "#f008",
      textColor: "#fff",
      name: "A",
    };
  }

  drawDPad(context, pad) {
    context.beginPath();
    context.save();
    context.scale(this.unit, this.unit);
    context.lineWidth = pad.thickness;
    context.strokeStyle = pad.color;
    context.moveTo(pad.x,pad.y+pad.height/2);
    context.lineTo(pad.x+pad.width,pad.y+pad.height/2);
    context.moveTo(pad.x+pad.width/2,pad.y);
    context.lineTo(pad.x+pad.width/2,pad.y+pad.height);
    context.stroke();
    context.restore();
  }

  drawActionBtn(context, btn) {
    context.beginPath();
    context.save();
    context.scale(this.unit, this.unit);
    context.fillStyle = btn.color;
    context.arc(btn.x, btn.y, btn.radius, 0, Math.PI*2);
    context.fill();
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.font = `${btn.radius}px Arial`;
    context.fillStyle = btn.textColor;
    context.fillText(btn.name, btn.x, btn.y);
    context.restore();
  }

  draw(context) {
    this.drawDPad(context, this.dPad);
    this.drawActionBtn(context, this.aBtn);
    this.drawActionBtn(context, this.bBtn);
  }
}

console.log("class TouchControls created!");
