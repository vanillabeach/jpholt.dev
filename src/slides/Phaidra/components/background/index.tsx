import { useCallback, useEffect, useRef, useState } from 'react';

import { isWithinViewport, isSafari, decimalToHexString } from '../../../../utils';

import classNames from './styles.module.css';
import BackgroundImage from './images/phaidra-tech.svg';
import ForegroundImage from './images/circuits.webp';
// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/filter#browser_compatibility
import ForegroundImageSafari from './images/circuits-safari.webp';

import NoiseImage from './images/noise.webp';

const BLUR_MAX = 6;

interface BackgroundProps {
  slideContainer: HTMLDivElement | null;
}

export default function Background(props: BackgroundProps) {
  const { slideContainer } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>();

  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement>();
  const [foregroundImage, setForegroundImage] = useState<HTMLImageElement>();
  const [noiseImage, setNoiseImage] = useState<HTMLImageElement>();

  const resizeCanvas = useCallback((canvasContainer: HTMLElement, canvas: HTMLCanvasElement) => {
    canvas.setAttribute('width', `0px`);
    canvas.setAttribute('height', `0px`);
    canvas.setAttribute('width', `${canvasContainer.offsetWidth}px`);
    canvas.setAttribute('height', `${canvasContainer.offsetHeight}px`);
  }, []);

  const paintSchematics = useCallback(
    (
      container: HTMLElement,
      ctx: CanvasRenderingContext2D,
      backgroundImage: HTMLImageElement,
      offsetY: number,
      offsetWidth: number,
      offsetHeight: number
    ) => {
      const focusRatio = container.getBoundingClientRect().top / container.offsetHeight;
      const blur = BLUR_MAX * (1 - focusRatio);
      const scale = 2;
      const ratio =
        backgroundImage.width > backgroundImage.height
          ? backgroundImage.height / backgroundImage.width
          : backgroundImage.width / backgroundImage.height;

      ctx.filter = `blur(${BLUR_MAX - blur < 0 ? 0 : BLUR_MAX - blur}px)`;

      ctx.drawImage(
        backgroundImage,
        offsetWidth * 0.55,
        (offsetY + offsetHeight / 1.5) * 0.3,
        offsetWidth * scale,
        offsetWidth * ratio * scale
      );
    },
    []
  );

  const paintCircuits = useCallback(
    (
      container: HTMLElement,
      ctx: CanvasRenderingContext2D,
      foregroundImage: HTMLImageElement,
      offsetY: number,
      offsetWidth: number,
      offsetHeight: number
    ) => {
      const focusRatio = container.getBoundingClientRect().top / container.offsetHeight;
      const focus = Math.log(focusRatio) * -1;
      const scale = 1.5;
      const ratio =
        foregroundImage.width > foregroundImage.height
          ? foregroundImage.height / foregroundImage.width
          : foregroundImage.width / foregroundImage.height;
      const blur = focus > BLUR_MAX || focus === Infinity ? BLUR_MAX : focus;

      ctx.filter = `blur(${blur || BLUR_MAX}px)`;
      ctx.drawImage(
        foregroundImage,
        0,
        (offsetY + offsetHeight * 0.25) * 0.17,
        foregroundImage.width > foregroundImage.height ? offsetWidth * scale : offsetHeight * ratio * scale,
        foregroundImage.width > foregroundImage.height ? offsetWidth * ratio * scale : offsetHeight * scale
      );
    },
    []
  );

  const paintBars = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvasWidth: number,
      canvasHeight: number,
      containerHeight: number,
      offsetY: number
    ) => {
      ctx.filter = 'none';
      const barWidth = 30;
      const amount = Math.round(canvasWidth / barWidth);
      const barMargin = barWidth / 5;

      new Array(amount).fill(1).forEach((_, index) => {
        const throttle = Math.abs(offsetY - containerHeight) / containerHeight;

        const y = (1 + (throttle > 1 ? 1 : throttle)) ** (index / Math.round(canvasWidth / 350));

        ctx.fillStyle = `#ff00ff${decimalToHexString(Math.round((index / amount) * 64))}`;
        ctx.fillRect(index * barWidth, canvasHeight, barWidth - barMargin, y * -1);
        ctx.fillStyle = `#ffffff`;
        ctx.fillRect(index * barWidth, canvasHeight, barWidth - barMargin, y * -0.3);
      });
    },
    []
  );

  const paintNoise = useCallback(
    (ctx: CanvasRenderingContext2D, canvasWidth: number, canvasHeight: number) => {
      if (!noiseImage) {
        return;
      }
      ctx.filter = 'none';
      ctx.drawImage(noiseImage, 0, 0, canvasWidth, canvasHeight);
    },
    [noiseImage]
  );

  const paint = useCallback(
    (resize = true) => {
      if (
        !ctx ||
        !slideContainer ||
        !isWithinViewport(slideContainer) ||
        !canvasRef?.current ||
        !backgroundImage ||
        !foregroundImage ||
        !noiseImage
      ) {
        return;
      }

      const canvas = canvasRef.current;
      const offsetY = slideContainer.getBoundingClientRect().top - window.scrollY;

      if (resize === true) {
        resizeCanvas(slideContainer, canvas);
      }

      const { offsetWidth, offsetHeight } = canvasRef.current;
      ctx.fillStyle = '#0a0f07';
      ctx.fillRect(0, 0, offsetWidth, offsetHeight);

      paintSchematics(slideContainer, ctx, backgroundImage, offsetY, offsetWidth, offsetHeight);

      paintCircuits(slideContainer, ctx, foregroundImage, offsetY, offsetWidth, offsetHeight);

      paintNoise(ctx, canvasRef.current.offsetWidth, canvasRef.current.offsetHeight);

      paintBars(
        ctx,
        canvasRef.current.offsetWidth,
        canvasRef.current.offsetHeight,
        slideContainer.offsetHeight,
        slideContainer.getBoundingClientRect().top
      );
    },
    [
      backgroundImage,
      ctx,
      foregroundImage,
      noiseImage,
      paintBars,
      paintCircuits,
      paintNoise,
      paintSchematics,
      resizeCanvas,
      slideContainer,
    ]
  );

  const loadImages = () => {
    const background = new Image();
    background.src = BackgroundImage;
    background.onload = () => {
      setBackgroundImage(background);
    };

    const foreground = new Image();
    foreground.src = isSafari() ? ForegroundImageSafari : ForegroundImage;
    foreground.onload = () => {
      setForegroundImage(foreground);
    };

    const noise = new Image();
    noise.src = NoiseImage;
    noise.onload = () => {
      setNoiseImage(noise);
    };
  };

  useEffect(() => {
    const handleScroll = () => {
      paint();
    };

    const handleResize = () => {
      paint();
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [paint]);

  useEffect(() => {
    paint();
  }, [ctx, paint]);

  useEffect(() => {
    if (canvasRef?.current) {
      setCtx(canvasRef.current.getContext('2d', { alpha: false }));
    }
  }, [canvasRef]);

  useEffect(() => {
    loadImages();
  }, []);

  useEffect(() => {
    if (canvasRef?.current && backgroundImage && foregroundImage && noiseImage) {
      if (canvasRef.current.classList.contains(classNames.show) === false) {
        canvasRef.current.classList.add(classNames.show);
      }
    }
  }, [backgroundImage, foregroundImage, noiseImage, canvasRef]);

  return <canvas className={classNames.canvas} ref={canvasRef}></canvas>;
}
