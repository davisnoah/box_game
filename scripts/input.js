class InputHandler {
  constructor(touchControls) {
    this.touchControls = touchControls;
    this.keys = {
      "up": false,
      "down": false,
      "left": false,
      "right": false,
      "a": false,
      "b": false,
    }

    if (touchControls)  {
      this.dPadHitBox = document.getElementById("dPadHitBox");
      this.aBtnHitBox = document.getElementById("aBtnHitBox");
      this.bBtnHitBox = document.getElementById("bBtnHitBox");
      
      this.#setDPadHitBox();
      this.#setABtnHitBox();
      this.#setBBtnHitBox();
      
      this.dPadHitBox.ontouchstart = (e) => {
        this.updateKeysMobile(e, "dPad");
      }
      this.dPadHitBox.ontouchmove = (e) => {
        this.updateKeysMobile(e, "dPad");
      }
      this.dPadHitBox.ontouchend = (e) => {
        this.updateKeysMobile(e, "dPad", true);
      }
      
      this.aBtnHitBox.ontouchstart = (e) => {
        this.updateKeysMobile(e, "aBtn");
      }
      this.aBtnHitBox.ontouchend = (e) => {
        this.updateKeysMobile(e, "aBtn", true);
      }
      
      this.bBtnHitBox.ontouchstart = (e) => {
        this.updateKeysMobile(e, "bBtn");
      }
      this.bBtnHitBox.ontouchend = (e) => {
        this.updateKeysMobile(e, "bBtn", true);
      }
    } else {
      window.onkeydown = (e) => {
        const key = e.key.toLowerCase();
        this.updateKeysDesktop(key);
      }

      window.onkeyup = (e) => {
        const key = e.key.toLowerCase();
        this.updateKeysDesktop(key, true);
      }
    }
  }
  
  resize(touchControls) {
    this.touchControls = touchControls;
    this.#setDPadHitBox();
    this.#setABtnHitBox();
    this.#setBBtnHitBox();
  }
  
  #setDPadHitBox() {
    let {x, y, width, height} = this.touchControls.dPad;
    x *= this.touchControls.unit;
    y *= this.touchControls.unit;
    width *= this.touchControls.unit;
    height *= this.touchControls.unit;
    this.dPadHitBox.style.position = "absolute";
    this.dPadHitBox.style.left = x+"px";
    this.dPadHitBox.style.top = y+"px";
    this.dPadHitBox.style.width = width+"px";
    this.dPadHitBox.style.height = height+"px";
  }
  
  #setABtnHitBox() {
    let { x, y, radius } = this.touchControls.aBtn;
    x *= this.touchControls.unit;
    y *= this.touchControls.unit;
    radius *= this.touchControls.unit;
    this.aBtnHitBox.style.position = "absolute";
    this.aBtnHitBox.style.left = x-radius+"px";
    this.aBtnHitBox.style.top = y-radius+"px";
    this.aBtnHitBox.style.width = radius*2+"px";
    this.aBtnHitBox.style.height = radius*2+"px";
  }
  
  #setBBtnHitBox() {
    let { x, y, radius } = this.touchControls.bBtn;
    x *= this.touchControls.unit;
    y *= this.touchControls.unit;
    radius *= this.touchControls.unit;
    this.bBtnHitBox.style.position = "absolute";
    this.bBtnHitBox.style.left = x-radius+"px";
    this.bBtnHitBox.style.top = y-radius+"px";
    this.bBtnHitBox.style.width = radius*2+"px";
    this.bBtnHitBox.style.height = radius*2+"px";
  }

  updateKeysMobile(e, type, touchend = false) {
    if (type === "dPad") {
      if (touchend) {
        this.keys.up = false;
        this.keys.left = false;
        this.keys.right = false;
        this.keys.down = false;
      } else {
        let { 
          x, 
          y, 
          width, 
          height,
        } = this.touchControls.dPad;
        
        x *= this.touchControls.unit;
        y *= this.touchControls.unit;
        width *= this.touchControls.unit;
        height *= this.touchControls.unit;
        
        let xCoords = e.touches[0].clientX-x;
        let yCoords = e.touches[0].clientY-y;
        let indexX = Math.floor(xCoords/(width/3));
        let indexY = Math.floor(yCoords/(height/3));
        switch(indexX) {
          case 0:
            this.keys.left = true;
            this.keys.right = false;
            break;
          case 2:
            this.keys.left = false;
            this.keys.right = true;
            break;
          default:
            this.keys.left = false;
            this.keys.right = false;
        }
        
        switch(indexY) {
          case 0:
            this.keys.up = true;
            this.keys.down = false;
            break;
          case 2:
            this.keys.up = false;
            this.keys.down = true;
            break;
          default:
            this.keys.up = false;
            this.keys.down = false;
        }
      }
    } else if (type === "aBtn") {
      if (touchend) {
        this.keys.a = false;
      } else {
        this.keys.a = true;
      }
    } else if (type === "bBtn") {
      if (touchend) {
        this.keys.b = false;
      } else {
        this.keys.b = true;
      }
    }
  }
  
  updateKeysDesktop(key, keyup = false) {
    if (keyup) {
      switch(key) {
        case "w":
          this.keys.up = false;
          break;
        case "s":
          this.keys.down = false;
          break;
        case "a":
          this.keys.left = false;
          break;
        case "d":
          this.keys.right = false;
          break;
        case "k":
          this.keys.a = false;
          break;
        case "l":
          this.keys.b = false;
          break;
      }
    } else {
      switch(key) {
        case "w":
          this.keys.up = true;
          break;
        case "s":
          this.keys.down = true;
          break;
        case "a":
          this.keys.left = true;
          break;
        case "d":
          this.keys.right = true;
          break;
        case "k":
          this.keys.a = true;
          break;
        case "l":
          this.keys.b = true;
          break;
      }
    }
  }

  get activeKeys() {
    let output = [];
    for (let key in this.keys) {
      if (this.keys[key] === true) {
        output.push(key);
      }
    }
    return output;
  }
}

console.log('class InputHandler created!');