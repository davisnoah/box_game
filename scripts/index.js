window.onload = () => {
  const canvas = document.getElementById('gameCanvas');
  const context = canvas.getContext('2d');
  const deviceType = detectDeviceType();
  
  const cubicBezier = new CubicBezier();
  const pen = new ScalePen(context);
  
  const scene = new Scene(canvas, cubicBezier.easeOut, deviceType);
  
  const fps = new FPS(scene);
  const gameInfo = new GameInfo(scene);
  
  const touchControls = (deviceType === "Mobile") ? new TouchControls(canvas) : false;
  const input = new InputHandler(touchControls);
  const player = new Player('#f00', scene);
  const level = new TestLevel(scene);
  
  player.level = level;
  player.x = player.level.spawn.x - player.width/2;
  player.y = player.level.spawn.y - player.height/2;

  scene.initFocus(player);

  window.onresize = () => {
    scene.resize(canvas);
    level.resize(scene);
    player.resize(scene);
    if (deviceType === "Mobile") {
      touchControls.resize(canvas);
      input.resize(touchControls);
    }
    gameInfo.resize(scene);
    fps.resize(scene);
  };

  let lastTime = 0;
  let i = 0;
  const animate = (timeStamp) => {
    let deltaTime = timeStamp - lastTime;
    lastTime = timeStamp;
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    level.update();
    player.update(input.keys);
    scene.trailFocus();
    
    level.draw(context, pen);
    player.draw(context);
    scene.drawBlockers(context);
    if (deviceType === "Mobile") touchControls.draw(context);

    // utils
    gameInfo.log(context, [
      `player.activeStates: [${player.activeStates.map(i => player.states[i].name)}]`,
      `player.onGround: ${player.onGround}`,
      `player.x: ${player.x}`,
      `player.y: ${player.y}`,
      `player.vx: ${player.vx}`,
      `player.vy: ${player.vy}`,
      `input.activeKeys: [ ${input.activeKeys} ]`,
      `playerStateIndexes: [ ${player.activeStates} ]`,
      `scene.offsetX: ${parseInt(scene.offsetX)}`,
      `scene.offsetY: ${parseInt(scene.offsetY)}`,
      `unit: ${scene.unit.toFixed(2)}`,
      `gameInfo.fontSize: ${gameInfo.fontSize * scene.unit}`,
    ]);
    fps.draw(context, deltaTime);
   
    if (i >= 0) requestAnimationFrame(animate);
    i++;
  }

  animate(0);
}

console.log("index.js end");
