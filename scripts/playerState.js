const playerStates = {
  EATING: 0,
  STANDING: 1,
  RUNNING: 2,
  JUMPING: 3,
  FALLING: 4,
  LANDING: 5,
  DASHING: 6,
  SUMMONING: 7,
  FLYING: 8,
}

class State {
  constructor(name) {
    this.name = name;
    this.deviceType = detectDeviceType();
  }
}

console.log("class State created!");

class PlayerState extends State {
  constructor(state, player) {
    super(state);
    this.player = player;
  }
  
  global(input) {
    // Does flight mode toggle check
    if (input.b) {
      if (!this.preventRapidBToggle) {
        if (this.player.activeStates.indexOf(playerStates.FLYING) === -1) {
          this.preventRapidBToggle = true;
          this.player.activeStates = [playerStates.FLYING];
          this.player.states[playerStates.FLYING].enter();
        } else {
          this.preventRapidBToggle = true;
          this.player.weight = this.player.initWeight;
          this.player.activeStates = [playerStates.STANDING];
          this.player.states[playerStates.STANDING].enter();
        }
      }
    } else {
      this.preventRapidBToggle = false;
    }
    // Add acceleration to player velocity
    this.player.vx += this.player.ax;
    
    // Calculate x direction of player
    let xDirection;
    if (this.player.vx) xDirection = this.player.vx/Math.abs(this.player.vx);
    else xDirection = 0;

    // Calculate y direction of player
    let yDirection;
    if (this.player.vy) yDirection = this.player.vy/Math.abs(this.player.vy);
    else yDirection = 0;

    // Calculate player friction
    let oldVX = this.player.vx;
    this.player.vx = this.player.vx - xDirection * this.player.friction;
    // Prevent friction direction swapping
    if (Math.abs(oldVX) < Math.abs(this.player.vx)) this.player.vx = 0;
    
    // Apply weight to player
    this.player.vy += this.player.weight;

    // Apply cap to player speed
    if (Math.abs(this.player.vx) > Math.abs(this.player.maxVX)) this.player.vx = xDirection * this.player.maxVX;
    if (Math.abs(this.player.vy) > Math.abs(this.player.maxVY)) this.player.vy = yDirection * this.player.maxVY;

    // Prevent player speed from being numbers between 0.01 and 0 
    if (Math.abs(this.player.vx) < 0.01) this.player.vx = 0;
    if (Math.abs(this.player.vy) < 0.01) this.player.vy = 0;

    // Detect collision to player
    this.player.detectCollision();

    // Apply velocity to player
    this.player.x += this.player.vx;
    this.player.y += this.player.vy;
  }
}

console.log("class PlayerState created!");

class PlayerEating extends PlayerState {
  constructor(player) {
    super("EATING", player);
    this.colorInit = player.color;
    this.timer = 0;
    this.timerMax = 20;
    this.glow = "#faa";
  }

  enter() {}

  update(input) {
    switch (this.timer) {
      case 0:
        this.player.color = this.glow;
        break;
      case parseInt(this.timerMax*0.25):
        this.player.color = this.colorInit;
        break;
      case parseInt(this.timerMax*0.5):
        this.player.color = this.glow;
        break;
      case parseInt(this.timerMax*.75):
        this.player.color = this.colorInit;
    }

    if (this.timer === this.timerMax) {
      this.player.removeState(playerStates.EATING);
      this.timer = 0;
    } else {
      this.timer++;
    }
  }
}

class PlayerStanding extends PlayerState {
  constructor(player) {
    super("STANDING", player);
  }

  enter() {}

  update(input) {
    if (this.player.vy > 0 && !this.player.onGround) {
      this.player.swapState(
        playerStates.STANDING,
        playerStates.FALLING,
        input
      );
    }
    if (input.right) {
      this.player.swapState(
        playerStates.STANDING,
        playerStates.RUNNING,
        input
      );
    } else if (input.left) {
      this.player.swapState(
        playerStates.STANDING, 
        playerStates.RUNNING,
        input
      );
    } else if (input.up) {
      this.player.swapState(
        playerStates.STANDING,
        playerStates.JUMPING,
        input
      );
    }
    
    if (this.vy > 0) this.player.swapState(
        playerStates.STANDING,
        playerStates.FALLING,
        input
    );
  }
}

class PlayerRunning extends PlayerState {
  constructor(player) {
    super("RUNNING", player);
  }

  enter(input) {
    if (input.right) {
      this.player.ax = this.player.initAX;
    } else if (input.left) {
      this.player.ax = -this.player.initAX;
    }
  }

  update(input) {
    if (input.right) {
      this.player.ax = this.player.initAX;
    } else if (input.left) {
      this.player.ax = -this.player.initAX;
    } else {
      this.player.ax = 0;
      this.player.swapState(
        playerStates.RUNNING,
        playerStates.STANDING,
        input
      );
    }
    if (input.up) {
      this.player.swapState(
        playerStates.RUNNING,
        playerStates.JUMPING,
        input
      );
    }
    
    if (this.player.y > 0 && this.player.onGround === false) {
      this.player.swapState(
        playerStates.RUNNING,
        playerStates.FALLING,
        input
      );
    }
  }
}

class PlayerJumping extends PlayerState {
  constructor(player) {
    super("JUMPING", player);
  }

  enter() {
    this.player.vy = -this.player.initJump;
  }

  update(input) {
    if (input.right) {
      this.player.ax = this.player.initAX;
    } else if (input.left) {
      this.player.ax = -this.player.initAX;
    } else {
      this.player.ax = 0;
    }
    
    if (this.player.vy >= 0) {
      this.player.swapState(
        playerStates.JUMPING,
        playerStates.FALLING,
        input
      );
    }
  }
}

class PlayerFalling extends PlayerState {
  constructor(player) {
    super("FALLING", player);
  }

  enter() {}

  update(input) {
    if (input.right) {
      this.player.ax = this.player.initAX;
    } else if (input.left) {
      this.player.ax = -this.player.initAX;
    } else {
      this.player.ax = 0;
    }
    
    if (this.player.onGround) {
      this.player.swapState(
        playerStates.FALLING,
        playerStates.LANDING,
        input
      );
    }
    
  }
}

class PlayerLanding extends PlayerState {
  constructor(player) {
    super("LANDING", player);
  }

  enter(input) {
    if (this.player.vx !== 0) {
      this.player.swapState(
        playerStates.LANDING,
        playerStates.RUNNING,
        input,
      );
    } else {
      this.player.swapState(
        playerStates.LANDING,
        playerStates.STANDING,
        input
      );
    }
  }

  update() {}
}

class PlayerDashing extends PlayerState {
  constructor(player) {
    super("DASHING", player);
  }

  enter() {}

  update() {}
}

class PlayerSummoning extends PlayerState {
  constructor(player) {
    super("SUMMONING", player);
  }

  enter() {}

  update() {}
}

class PlayerFlying extends PlayerState {
  constructor(player) {
    super("FLYING", player);
  }

  enter() {
    this.player.ax = 0;
    this.player.vx = 0;
    this.player.ay = 0;
    this.player.vy = 0;
    this.player.weight = 0;
  }

  update(input) {
    if (input.up) this.player.vy = -this.player.flightSpeed;
    else if (input.down) this.player.vy = this.player.flightSpeed;
    else this.player.vy = 0;
    if (input.left) this.player.vx = -this.player.flightSpeed;
    else if (input.right) this.player.vx = this.player.flightSpeed;
    else this.player.vx = 0;
  }
}
