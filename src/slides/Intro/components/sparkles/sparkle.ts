import debounce from 'debounce';
import Point from './point';
import { isWithinViewport, decimalToHexString, isAndroid, isFirefox } from '../../../../utils';

export interface SparkleArgs {
  backgroundColor?: string;
  canvasElement: HTMLCanvasElement;
  parentContainer: HTMLElement;
  colorA: number[];
  colorB: number[];
  distanceThreshold: number;
  resolution: number;
  speedRange: number;
}

export default class Sparkle {
  backgroundColor?: string;
  canvasElement: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;
  distanceThreshold: number;
  colorA: number[];
  colorB: number[];
  intervalId: number;
  numberOfPoints: number;
  parentContainer: HTMLElement;
  pointsArray: Point[];
  resolution: number;
  speedRange: number;

  static getNumberOfPoints(canvasElement: HTMLCanvasElement) {
    const throttle = 2500;
    const result = Math.max((canvasElement.offsetWidth * canvasElement.offsetHeight) / throttle, 75);
    return result;
  }

  constructor(args: SparkleArgs) {
    this.canvasElement = args.canvasElement;
    if (!this.canvasElement) {
      console.log('error, cannot find canvas!');
    }

    this.numberOfPoints = Sparkle.getNumberOfPoints(this.canvasElement);
    this.colorA = args.colorA;
    this.colorB = args.colorB;
    this.distanceThreshold = args.distanceThreshold;
    this.canvasContext = args.canvasElement.getContext('2d')!;
    this.parentContainer = args.parentContainer;
    this.resolution = args.resolution || 1;
    this.speedRange = args.speedRange || 1;
    this.intervalId = -1;
    this.pointsArray = [];
    this.backgroundColor = args.backgroundColor || '#222222';

    this.setSize();
    this.start();
    this.bindEvents();
  }

  bindEvents() {
    window.addEventListener('resize', debounce(this.setSize.bind(this), 100));
    window.addEventListener('scroll', () => {
      if (isAndroid() && isFirefox()) {
        this.stop();
        return;
      }

      if (!isWithinViewport(this.canvasElement)) {
        if (this.intervalId !== -1) {
          this.stop();
        }
      } else {
        if (this.intervalId === -1) {
          this.start();
        }
      }
    });

    window.addEventListener('scrollend', () => {
      if (isAndroid() && isFirefox()) {
        this.start();
        return;
      }
    });
  }

  drawVector(
    pointAx: number,
    pointAy: number,
    pointBx: number,
    pointBy: number,
    pointCx: number,
    pointCy: number,
    intensity: number,
    colorToggle: boolean
  ) {
    const ctx = this.canvasContext;
    const alpha = decimalToHexString(Math.round(intensity * 100));
    ctx.strokeStyle = '#000000' + alpha;
    ctx.beginPath();
    ctx.moveTo(pointAx, pointAy);
    ctx.lineTo(pointBx, pointBy);
    ctx.lineTo(pointCx, pointCy);
    ctx.stroke();
    ctx.closePath();
    //ctx.fill();
  }

  animate() {
    const maxWidth = Number(this.canvasElement.offsetWidth) / this.resolution;
    const maxHeight = Number(this.canvasElement.offsetHeight) / this.resolution;
    const distanceThreshold = this.distanceThreshold;

    this.paintBackground();

    this.pointsArray.forEach((pointA, index) => {
      for (let pointB of this.pointsArray) {
        const abx = pointA.x - pointB.x;
        const aby = pointA.y - pointB.y;
        const distanceAB = Math.sqrt(abx * abx + aby * aby);
        if (distanceAB > distanceThreshold) {
          continue;
        }

        for (let pointC of this.pointsArray) {
          const acx = pointA.x - pointC.x;
          const acy = pointA.y - pointC.y;
          const distanceAC = Math.sqrt(acx * acx + acy * acy);
          if (distanceAC > distanceThreshold) {
            continue;
          }

          const bcx = pointB.x - pointC.x;
          const bcy = pointB.y - pointC.y;
          const distanceBC = Math.sqrt(bcx * bcx + bcy * bcy);
          if (distanceBC > distanceThreshold) {
            continue;
          }
          const longestDistance = [distanceAB, distanceAC, distanceBC].reduce((x, y) => Math.max(x, y));
          const intensity = 1 - longestDistance / distanceThreshold;

          this.drawVector(pointA.x, pointA.y, pointB.x, pointB.y, pointC.x, pointC.y, intensity, index % 2 === 0);
        }
      }

      pointA.x = (pointA.x + pointA.xSpeed) % (maxWidth + maxWidth * 0.1);
      pointA.y = (pointA.y + pointA.ySpeed) % (maxHeight + maxHeight * 0.1);

      if (pointA.x < maxWidth / -10) pointA.x = maxWidth;
      if (pointA.y < maxHeight / -10) pointA.y = maxHeight;
    });
  }

  paintBackground() {
    this.canvasElement.width = this.canvasElement.width;
  }

  setSize() {
    this.canvasElement.setAttribute('width', `${this.parentContainer.offsetWidth / this.resolution}`);
    this.canvasElement.setAttribute('height', `${this.parentContainer.offsetHeight / this.resolution}`);
    this.numberOfPoints = Sparkle.getNumberOfPoints(this.canvasElement);
    this.resetPoints();
  }

  start() {
    this.intervalId = window.requestAnimationFrame(() => {
      this.animate();
      this.start();
    });
  }

  stop() {
    window.cancelAnimationFrame(this.intervalId);
    this.intervalId = -1;
  }

  resetPoints() {
    const isEven = () => Math.round(Math.random() * 10) % 2 === 0;
    const maxWidth = Number(this.parentContainer.offsetWidth);
    const maxHeight = Number(this.parentContainer.offsetHeight);

    this.pointsArray = [];

    for (let count = 0; count < this.numberOfPoints; count += 1) {
      const startX = (Math.random() * maxWidth) / this.resolution;
      const startY = (Math.random() * maxHeight) / this.resolution;
      const xSpeed = Math.random() * this.speedRange * (isEven() ? 1 : -1);
      const ySpeed = Math.random() * this.speedRange * (isEven() ? 1 : -1);

      this.pointsArray.push(new Point({ x: startX, y: startY, xSpeed: xSpeed, ySpeed: ySpeed }));
    }
  }
}
