class Player {
  constructor(color, scene) {
    this.scene = scene;
    this.unit = this.scene.unit;
    this.width = 6;
    this.height = this.width;
    this.color = color;
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.ax = 0;
    this.initAX = 0.3;
    this.initJump = 3;
    this.initWeight = 0.1;
    this.maxVX = 1;
    this.maxVY = 3;
    this.maxJump = 3;
    this.weight = this.initWeight;
    this.friction = 0.1;
    this.corners = [
      { x: this.x, y: this.y },
      { x: this.x + this.width, y: this.y },
      { x: this.x + this.width, y: this.y + this.height },
      { x: this.x, y: this.y + this.height },
    ];
    this.states = [
      new PlayerEating(this),

      new PlayerStanding(this),
      new PlayerRunning(this),
      new PlayerJumping(this),
      new PlayerFalling(this),
      new PlayerLanding(this),

      new PlayerDashing(this),
      new PlayerSummoning(this),
      new PlayerFlying(this),
    ];
    this.activeStates = [1];
    this.flightSpeed = 1.5;
  }

  resize(scene) {
    this.scene = scene;
    this.unit = this.scene.unit;
  }

  detectPlatforms() {
    let onGroundSolved = false;
    this.onGround = false;
    let startChunkIndexX = Math.floor(this.x/this.level.chunkSize);
    let startChunkIndexY = Math.floor(this.y/this.level.chunkSize);
    let endChunkIndexX = Math.floor((this.x+this.vx)/this.level.chunkSize);
    let endChunkIndexY = Math.floor((this.y+this.vy)/this.level.chunkSize);

    let xDirection = (this.vx) ? this.vx/Math.abs(this.vx) : 1;
    let yDirection = (this.vy) ? this.vy/Math.abs(this.vy) : 1;

    let xLoopTerminator;
    let yLoopTerminator;

    let collisions = [];

    if (xDirection < 0) 
      xLoopTerminator = (start, counter) => (start + counter + 1 >= endChunkIndexX);
    else
      xLoopTerminator = (start, counter) => (start + counter - 1 <= endChunkIndexX);
    if (yDirection < 0) 
      yLoopTerminator = (start, counter) => (start + counter + 1 >= endChunkIndexY);
    else
      yLoopTerminator = (start, counter) => (start + counter - 1 <= endChunkIndexY);
    
    let chunkYCounter = 0;
    while (yLoopTerminator(startChunkIndexY, chunkYCounter)) {
      let currChunkIndexY = startChunkIndexY + chunkYCounter;

      let chunkXCounter = 0;
      while (xLoopTerminator(startChunkIndexX, chunkXCounter)) {
        let currChunkIndexX = startChunkIndexX + chunkXCounter;
        
        let currChunkValue = 
          this.level.chunks[currChunkIndexY] && 
          this.level.chunks[currChunkIndexY][currChunkIndexX];
        
        let currChunk = {
          x: currChunkIndexX * this.level.chunkSize,
          y: currChunkIndexY * this.level.chunkSize,
          width: this.level.chunkSize,
          height: this.level.chunkSize,
        }
        
        if (!onGroundSolved && 
            currChunkValue !== 0 && 
            chunkYCounter === 1 && 
            (chunkXCounter === 0 || chunkXCounter === 1) && 
            this.y+this.height >= currChunk.y-1 && 
            this.x+this.width > currChunk.x) {
          onGroundSolved = true;
          this.onGround = true;
        }

        let collisionResult = dynamicRectVsRect(this, currChunk);
        if (collisionResult) {
          collisionResult.rectValue = currChunkValue;
          collisions.push(collisionResult);
        }
        
        if (xDirection < 0) chunkXCounter--;
        else chunkXCounter++;
      }
      if (yDirection < 0) chunkYCounter--;
      else chunkYCounter++; 
    }
    
    collisions.sort((a, b) => a.tHitNear - b.tHitNear);
          
    for (let collision of collisions) {
      let { 
        contactPoint,
        contactNormal,
        tHitNear,
        rectValue,
      } = collision;

      if (rectValue !== 0) {
        this.vx += contactNormal.x * Math.abs(this.vx) * (1 - tHitNear);
        this.vy += contactNormal.y * Math.abs(this.vy) * (1 - tHitNear);
      }
    }
    
  }
  
  detectCollision() {
    this.detectPlatforms();
  }

  update(input) {
    for (let stateIndex of this.activeStates) {
      this.states[stateIndex].global(input);
      this.states[stateIndex].update(input);
    }
  }

  draw(context) {
    context.beginPath();
    context.save();
    context.translate(
      this.scene.x-this.scene.offsetX, 
      this.scene.y-this.scene.offsetY
    );
    context.scale(this.unit, this.unit);
    context.shadowColor = this.color;
    context.shadowBlur = 1*this.unit;
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, this.width, this.height);
    context.restore();
  }

  addState(state, input) {
    if (!this.activeStates.includes(state)) {
      this.activeStates.push(state);
    }
    this.states[state].enter(input);
  }

  removeState(state) {
    this.activeStates.splice(this.activeStates.indexOf(state), 1);
  }
  
  swapState(oldState, newState, input) {
    this.removeState(oldState);
    this.addState(newState, input);
  }
} 

console.log("class Player created!");
