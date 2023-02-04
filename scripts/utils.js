class GameInfo {
  constructor(scene) {
    this.scene = scene;
    this.unit = this.scene.unit;
    this.minUnit = 6;
    this.fontSize = 1.5;
    this.minFontSize = 13.6;
    this.color = "#fff";
    this.edgeOffset = 1;
    this.rowSpacers = 0.5;
  }

  resize(scene) {
    this.scene = scene;
    this.unit = this.scene.unit;
  }
  
  log(context, messages) {
    if (this.unit < this.minUnit) this.unit = this.minUnit;

    context.save();
    context.translate(this.scene.x, this.scene.y);
    context.scale(this.unit, this.unit);
    context.font = this.fontSize + "px Arial";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillStyle = this.color;

    let x = this.edgeOffset;
    let y = this.edgeOffset - this.fontSize - this.rowSpacers;
    let i = 0;
    while (i <= messages.length - 1) {
      let msg = messages[i];
      y += this.rowSpacers + this.fontSize;
      context.fillText(msg, x, y);
      i++;
    }
    context.restore();
  }
}

console.log("class GameInfo created!");

class FPS {
  constructor(scene) {
    this.scene = scene;
    this.unit = this.scene.unit;
    this.minUnit = 6;
    this.fps = 0;
    this.fontSize = 1.5;
    this.color = "#fff";
    this.textAlign = "right";
    this.edgeOffset = 1;

    this.y = this.edgeOffset + this.fontSize;
    
    this.updateDelay = 60;
    this.updateCounter = 0;
  }

  resize(scene) {
    this.scene = scene;
    this.unit = this.scene.unit;
  }

  get x() {
    return this.scene.width / this.unit - this.edgeOffset;  
  }

  draw(context, deltaTime) {
    if (this.updateCounter === this.updateDelay) {
      this.updateCounter = 0;
      this.fps = (1000/deltaTime).toFixed(2);
    } else {
      this.updateCounter++;
    }

    if (this.unit < this.minUnit) this.unit = this.minUnit;
    
    context.beginPath();
    context.save();
    context.translate(this.scene.x, this.scene.y);
    context.scale(this.unit, this.unit);
    context.fillStyle = this.color;
    context.font = this.fontSize + "px Arial";
    context.textAlign = this.textAlign;
    context.fillText(this.fps+" fps", this.x, this.y);
    context.restore();
    
  }
}

const detectDeviceType = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) ? 'Mobile' : 'Desktop';

console.log("class FPS created!");