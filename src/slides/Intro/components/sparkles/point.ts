interface PointArgs {
  x: number
  y: number
  xSpeed: number
  ySpeed: number
}

export default class Point {
  x: number;
  y: number;
  xSpeed: number;
  ySpeed: number;

  constructor(args: PointArgs) {
    const { x, y, xSpeed, ySpeed } = args;
    this.x = x;
    this.y = y;
    this.xSpeed = xSpeed;
    this.ySpeed = ySpeed;
  }
}