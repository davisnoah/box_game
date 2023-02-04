const rayVsRect = (rayOrigin, rayDirection, target) => {
  let tNearX = (target.x - rayOrigin.x) / rayDirection.x || 0;
  let tNearY = (target.y - rayOrigin.y)  / rayDirection.y || 0;
  
  let tFarX = (target.x + target.width - rayOrigin.x) / rayDirection.x || 0;
  let tFarY = (target.y + target.height - rayOrigin.y) / rayDirection.y || 0;
  
  if (tNearX > tFarX) {
    let temp = tNearX;
    tNearX = tFarX;
    tFarX = temp;
  }
  
  if (tNearY > tFarY) {
    let temp = tNearY;
    tNearY = tFarY;
    tFarY = temp;
  }

  if (tNearX > tFarY || tNearY > tFarX) return false;
  
  const tHitNear = Math.max(tNearX, tNearY);
  const tHitFar = Math.min(tFarX, tFarY);

  if (tHitFar < 0) return false;
  
  const contactPoint = {};
  contactPoint.x = rayOrigin.x + tHitNear * rayDirection.x;
  contactPoint.y = rayOrigin.y + tHitNear * rayDirection.y;
  
  let contactNormal;
  if (tNearX > tNearY) 
    if (rayDirection.x < 0) 
      contactNormal = { x: 1, y: 0 };
    else 
      contactNormal = { x: -1, y: 0 };
  else if (tNearX < tNearY)
    if (rayDirection.y < 0) 
      contactNormal = { x: 0, y: 1 };
    else
      contactNormal = { x: 0, y: -1 };
    else contactNormal = { x: 0, y: 0 };
  
  const result = { contactPoint, contactNormal, tHitNear };
  
  return result;
  
}

const dynamicRectVsRect = (initial, target) => {
  if (!initial.vx && !initial.vy) return false;
  
  let expandedTarget = {
    x: target.x - initial.width/2,
    y: target.y - initial.width/2,
    width: target.width + initial.width,
    height: target.height + initial.height,
  }
  
  let rayOrigin = {
    x: initial.x + initial.width/2,
    y: initial.y + initial.height/2,
  }
  
  let rayDirection =  {
    x: initial.vx,
    y: initial.vy,
  }
  
  const rayVsRectResult = rayVsRect(
    rayOrigin, 
    rayDirection, 
    expandedTarget
  );
  
  if (!rayVsRectResult || rayVsRectResult.tHitNear > 1) 
    return false;

  return rayVsRectResult;
}
