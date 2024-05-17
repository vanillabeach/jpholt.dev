import { isWithinViewport } from '../../utils';
import classNames from './styles.module.css';
import { useEffect, useRef, useState, useCallback } from 'react';

export interface BackgroundProps {
  url: string;
  scroll?: boolean;
  children: React.ReactNode;
  color?: string;
}

export default function Background(props: BackgroundProps) {
  const { color = 'transparent', url, scroll = false, children } = props;
  const parentContainerRef = useRef<HTMLDivElement>(null!);
  const canvasRef = useRef<HTMLCanvasElement>(null!);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement>();
  const [backgroundMediaLoaded, setBackgroundMediaLoaded] = useState<boolean>(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>();

  const paintBackground = useCallback(() => {
    console.log('paintBackground', ctx, backgroundMediaLoaded, canvasRef);

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
      newImageWidth = newImageWidth * delta;
      newImageHeight = newImageHeight * delta;
    }

    ctx.drawImage(backgroundImage, 0, 0, newImageWidth, newImageHeight);
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
    console.log('setting ctx....');
    const canvas = canvasRef.current;
    setCtx(canvas.getContext('2d', { alpha: true }));
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

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [resize]);

  return (
    <div className={classNames.container} style={{ backgroundColor: color }} ref={parentContainerRef}>
      {scroll && backgroundMediaLoaded && <canvas className={classNames.canvas} ref={canvasRef}></canvas>}
      <div className={classNames.content}>{children}</div>
    </div>
  );
}
