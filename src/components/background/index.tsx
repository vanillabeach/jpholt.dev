import { isWithinViewport } from '../../utils';
import classNames from './styles.module.css';
import { useEffect, useRef, useState, useCallback } from 'react';

export interface BackgroundProps {
  children: React.ReactNode;
  color?: string;
  overscan?: number;
  scroll?: boolean;
  url: string;
}

export default function Background(props: BackgroundProps) {
  const { color = 'transparent', url, scroll = false, overscan = 100, children } = props;
  const parentContainerRef = useRef<HTMLDivElement>(null!);
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement>();
  const [backgroundMediaLoaded, setBackgroundMediaLoaded] = useState<boolean>(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>();

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
    const canvasWidth = canvas.offsetWidth + overscan;
    const canvasHeight = canvas.offsetHeight + overscan;
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
      newImageWidth = newImageWidth * delta;
      newImageHeight = newImageHeight * delta;
    }

    const x = canvasWidth - newImageWidth;
    const y = -((canvas.offsetHeight - canvas.getBoundingClientRect().top) / canvas.offsetHeight) * (overscan / 2);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(backgroundImage, x, y, newImageWidth, newImageHeight);
  }, [backgroundImage, backgroundMediaLoaded, ctx]);

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
  }, [backgroundImage, backgroundMediaLoaded, paintBackground, url]);

  useEffect(() => {
    if (!canvasRef?.current || !backgroundMediaLoaded) {
      return;
    }
    const canvas = canvasRef.current;
    setCtx(canvas.getContext('2d', { alpha: false }));
  }, [backgroundMediaLoaded, canvasRef, ctx]);

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
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', paintBackground);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', paintBackground);
    };
  }, [resize]);

  const containerStyle: React.CSSProperties = scroll
    ? {}
    : {
        backgroundImage: `url(${url})`,
        backgroundColor: color,
      };
  const contentStyle: React.CSSProperties = scroll ? { position: 'relative' } : {};

  return (
    <div className={classNames.container} style={containerStyle} ref={parentContainerRef}>
      {scroll && backgroundMediaLoaded && <canvas className={classNames.canvas} ref={canvasRef}></canvas>}
      <div className={classNames.content} style={contentStyle}>
        {children}
      </div>
    </div>
  );
}
