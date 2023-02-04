class Level {
  constructor(scene) {
    this.scene = scene;
    this.unit = this.scene.unit;
  }
}

console.log("class Level created!");

class TestLevel extends Level {
  constructor(scene) {
    super(scene);
    this.x = 0;
    this.y = 0;
    this.chunkSize = 3 * 6;
    this.renderDistance = {
      x: Math.ceil(100/this.chunkSize)+1,
      y: Math.ceil(100*this.scene.heightRatio/this.chunkSize)+1,
    };
    
    this.bgColor = "#999";
    this.blockFillColor = "#333";
    this.borderFillStyle = "#000";
    this.borderStrokeStyle = "#FFF";
    this.chunks = [
      [0, 0, 0, 0, 0,],
      [1, 1, 0, 1, 1,],
      [0, 0, 0, 0, 1,],
      [0, 1, 0, 0, 0,],
      [1, 1, 1, 0, 0,],
    ];
    this.width = this.chunks[0].length * this.chunkSize;
    this.height = this.chunks.length * this.chunkSize;
    
    this.spawn = {
      x: this.width/2,
      y: this.height/2,
    }

    this.floor = {
      y: this.height,
    }
  }
  
  resize(scene) {
    this.scene = scene;
    this.unit = this.scene.unit;
  }
  
  update() {}
  
  draw(context, pen) {
    context.beginPath();
    context.save();
    context.translate(
      this.scene.x-this.scene.offsetX, 
      this.scene.y-this.scene.offsetY
    );
    
    context.lineWidth = .3;
    
    let middleChunkX = Math.floor(this.scene.centerX/this.chunkSize);
    let middleChunkY = Math.floor(this.scene.centerY/this.chunkSize);
    
    let startingChunkX = middleChunkX - Math.floor(this.renderDistance.x/2);
    let startingChunkY = middleChunkY - Math.floor(this.renderDistance.y/2);
    
    let chunkYCounter = 0;
    while (chunkYCounter < this.renderDistance.y) {
      let currChunkIndexY = startingChunkY+chunkYCounter;
      let chunkXCounter = 0;
      while (chunkXCounter < this.renderDistance.x) {
        let currChunkIndexX = startingChunkX+chunkXCounter;
        
        let currChunkValue;
        if (this.chunks[currChunkIndexY] !== undefined) {
          currChunkValue = this.chunks[currChunkIndexY][currChunkIndexX];
        }
        
        let currChunkX = currChunkIndexX*this.chunkSize;
        let currChunkY = currChunkIndexY*this.chunkSize;
        
        switch (currChunkValue) {
          case 0:
            context.strokeStyle = "transparent";
            context.fillStyle = this.bgColor;
            break;
          case 1:
            context.strokeStyle = "transparent";
            context.fillStyle = this.blockFillColor;
            break;
          case undefined:
            context.strokeStyle = this.borderStrokeStyle;
            context.fillStyle = this.borderFillStyle;
            break;
          default:
            context.strokeStyle = "transparent";
            context.fillStyle = "#0F0";
        }
        
        pen.fillRectToScale(currChunkX, currChunkY, this.chunkSize, this.chunkSize, this.unit, true);
        
        chunkXCounter++;
      }
      chunkYCounter++;
    }
    
    context.restore();
  }
}

console.log("class TestLevel created!");
