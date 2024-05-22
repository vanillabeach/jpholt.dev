import { isWithinViewport } from '../../utils';
import classNames from './styles.module.css';
import { useEffect, useRef, useState, useCallback } from 'react';

export enum BackgroundVisibility {
  all,
  backgroundColor,
  backgroundImage,
  canvas,
  hide,
}

export interface BackgroundProps {
  children: React.ReactNode;
  color?: string;
  overscan?: number;
  scroll?: boolean;
  show?: BackgroundVisibility;
  url: string;
}

export default function Background(props: BackgroundProps) {
  const { color = 'transparent', url, scroll = false, show = BackgroundVisibility.all, overscan, children } = props;
  const parentContainerRef = useRef<HTMLDivElement>(null!);
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement>();
  const [backgroundMediaLoaded, setBackgroundMediaLoaded] = useState<boolean>(false);
  const [backgroundOverscan, setBackgroundOverscan] = useState<number>(overscan !== undefined ? overscan : 0);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>();
  const [showCanvas, setShowCanvas] = useState<boolean>(
    (show === BackgroundVisibility.all || show === BackgroundVisibility.canvas) && scroll
  );

  useEffect(() => {
    setShowCanvas(show === BackgroundVisibility.all || show === BackgroundVisibility.canvas);
  }, [scroll, show]);

  useEffect(() => {
    if (overscan !== undefined || !canvasRef?.current) {
      return;
    }

    setBackgroundOverscan(canvasRef.current.offsetHeight);
  }, [overscan]);

  const paintBackground = useCallback(() => {
    if (!ctx || !backgroundMediaLoaded || !backgroundImage || !canvasRef?.current) {
      return;
    }

    const canvas = canvasRef.current;
    if (!isWithinViewport(canvas)) {
      return;
    }

    const imageWidth = backgroundImage.width;
    const imageHeight = backgroundImage.height;
    const canvasWidth = canvas.offsetWidth;
    const canvasHeight = canvas.offsetHeight;
    let imageRatio: number;
    let newImageWidth = 0;
    let newImageHeight = 0;

    if (imageWidth > imageHeight) {
      imageRatio = imageHeight / imageWidth;
      newImageWidth = canvasWidth;
      newImageHeight = newImageWidth * imageRatio;
    } else {
      imageRatio = imageWidth / imageHeight;
      newImageHeight = canvasHeight;
      newImageWidth = newImageHeight * imageRatio;
    }

    if (newImageHeight < canvasHeight) {
      const delta = canvasHeight / newImageHeight;
      newImageHeight *= delta;
      newImageWidth *= delta;
    }

    setBackgroundOverscan(newImageHeight * 0.2);

    newImageWidth += backgroundOverscan;
    newImageHeight += backgroundOverscan;

    const x = (canvasWidth - newImageWidth) / 2;
    const y =
      -((canvas.offsetHeight - canvas.getBoundingClientRect().top) / canvas.offsetHeight) * (backgroundOverscan / 2);

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(backgroundImage, x, y, newImageWidth, newImageHeight);
  }, [backgroundImage, backgroundMediaLoaded, backgroundOverscan, color, ctx]);

  useEffect(() => {
    if (show && scroll && backgroundMediaLoaded === true) {
      paintBackground();
    }
  }, [show, scroll, backgroundMediaLoaded, paintBackground]);

  const resize = useCallback(() => {
    if (!canvasRef?.current || !parentContainerRef?.current) {
      return;
    }

    const canvas = canvasRef.current;
    const parentContainer = parentContainerRef.current;

    canvas.setAttribute('width', '0');
    canvas.setAttribute('height', '0');
    window.requestAnimationFrame(() => {
      canvas.setAttribute('width', `${parentContainer.offsetWidth}`);
      canvas.setAttribute('height', `${parentContainer.offsetHeight}`);
      paintBackground();
    });
  }, [canvasRef, paintBackground]);

  useEffect(() => {
    if (backgroundMediaLoaded === false) {
      const image = new Image();
      image.src = url;
      image.onload = () => {
        setBackgroundImage(image);
        setBackgroundMediaLoaded(true);
      };
      paintBackground();
      return;
    }

    resize();
  }, [backgroundImage, backgroundMediaLoaded, paintBackground, resize, url]);

  useEffect(() => {
    if (!canvasRef?.current || !backgroundMediaLoaded) {
      return;
    }
    const canvas = canvasRef.current;
    setCtx(canvas.getContext('2d', { alpha: false }));
  }, [backgroundMediaLoaded, canvasRef, ctx]);

  useEffect(() => {
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', paintBackground);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', paintBackground);
    };
  }, [resize, paintBackground]);

  const containerStyle: React.CSSProperties = {
    backgroundImage:
      show === BackgroundVisibility.all || show === BackgroundVisibility.backgroundImage ? `url(${url})` : 'none',
    backgroundColor: BackgroundVisibility.all || show === BackgroundVisibility.backgroundColor ? color : 'transparent',
  };
  const contentStyle: React.CSSProperties = { position: 'relative' };

  return (
    <div className={classNames.container} style={containerStyle} ref={parentContainerRef}>
      <canvas className={classNames.canvas} ref={canvasRef} style={{ display: showCanvas ? 'block' : 'none' }}></canvas>
      <div className={classNames.content} style={contentStyle}>
        {children}
      </div>
    </div>
  );
}
