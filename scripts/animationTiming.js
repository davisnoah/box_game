class CubicBezier {
  constructor() {};
  
  easeOut(t) {
    return 1 - (1-t)**3;
  }
}