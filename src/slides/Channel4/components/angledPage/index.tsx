import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { loadImage, isWithinViewport } from '../../../../utils';

import classNames from './styles.module.css';
import Image3DBase from './images/3d-base.png';
import Image3DBlueText from './images/3d-blue-text.png';
import Image3DLinkText from './images/3d-link-text.png';
import Image3DMy4oD from './images/3d-my4od.png';
import Image3DSlider1 from './images/3d-slider1.png';
import Image3DSlider2 from './images/3d-slider2.png';
import Image3DSlider3 from './images/3d-slider3.png';
import Image3DSlider4 from './images/3d-slider4.png';
import Image3DThumbnails from './images/3d-thumbnails.png';

export interface AngledPageParams {
  parentContainer: HTMLDivElement | null;
}

export default function AngledPage(params: AngledPageParams) {
  const { parentContainer } = params;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>();
  const [backgroundImages, setBackgroundImages] = useState<Array<HTMLImageElement>>(null!);
  const backgroundParallaxValues = useMemo(() => [1.35, 1.77, 1.48, 1.1, 1.56, 1.42, 1.67, 1.81, 1.95, 1.77], []);
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);

  const loadBackgroundImages = useCallback(async () => {
    setBackgroundImages([
      await loadImage(Image3DBase),
      await loadImage(Image3DBlueText),
      await loadImage(Image3DLinkText),
      await loadImage(Image3DMy4oD),
      await loadImage(Image3DSlider1),
      await loadImage(Image3DSlider2),
      await loadImage(Image3DSlider3),
      await loadImage(Image3DSlider4),
      await loadImage(Image3DThumbnails),
    ]);

    setImagesLoaded(true);
  }, []);

  const paintPieces = useCallback(() => {
    if (!ctx || !parentContainer || !backgroundImages) {
      return;
    }

    const { top } = parentContainer.getBoundingClientRect();
    const x = 0;

    backgroundImages.forEach((image, index) => {
      const y = top * backgroundParallaxValues[index] + parentContainer.offsetHeight / 4;
      ctx.drawImage(image, x, y, image.width, image.height);
    });
  }, [ctx, backgroundImages, backgroundParallaxValues, parentContainer]);

  const paint = useCallback(() => {
    if (!ctx || !parentContainer || !isWithinViewport(parentContainer)) {
      return;
    }

    ctx.clearRect(0, 0, parentContainer.offsetWidth, parentContainer.offsetHeight);
    paintPieces();
  }, [ctx, paintPieces, parentContainer]);

  useEffect(() => {
    if (canvasRef?.current) {
      setCtx(canvasRef.current.getContext('2d', { alpha: false }));
    }
  }, [canvasRef]);

  const resizeCanvas = useCallback(() => {
    if (!canvasRef?.current || !parentContainer) {
      return;
    }

    const canvas = canvasRef.current;
    canvas.setAttribute('width', '0');
    canvas.setAttribute('height', '0');
    canvas.style.width = '0px';
    canvas.style.height = '0px';

    requestAnimationFrame(() => {
      canvas.setAttribute('width', `${parentContainer.offsetWidth / 2}`);
      canvas.setAttribute('height', `${parentContainer.offsetHeight}`);
      canvas.style.width = `${parentContainer.offsetWidth / 2}px`;
      canvas.style.height = `${parentContainer.offsetHeight}px`;
      paint();
    });
  }, [paint, parentContainer]);

  useEffect(() => {
    if (imagesLoaded === false) {
      loadBackgroundImages();
      return;
    }

    resizeCanvas();
    paint();
    canvasRef.current?.classList.add(classNames.show);
  }, [canvasRef, imagesLoaded, loadBackgroundImages, paint, resizeCanvas]);

  useEffect(() => {
    const handleScroll = () => {
      paint();
    };

    const handleResize = () => {
      resizeCanvas();
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [paint, resizeCanvas]);

  return <canvas className={classNames.canvas} ref={canvasRef}></canvas>;
}
