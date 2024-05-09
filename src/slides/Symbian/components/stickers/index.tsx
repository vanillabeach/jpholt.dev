import { useCallback, useEffect, useRef, useState } from 'react';
import { isWithinViewport, loadImage } from '../../../../utils';

import BaseImage from './images/base.svg';
import Sticker1 from './images/art-1.svg';
import Sticker2 from './images/art-2.svg';
import Sticker3 from './images/art-3.svg';
import Sticker4 from './images/art-4.svg';
import Sticker5 from './images/art-5.svg';
import Sticker6 from './images/art-6.svg';
import Sticker7 from './images/art-7.svg';
import Sticker8 from './images/art-8.svg';
import Sticker9 from './images/art-9.svg';
import Sticker10 from './images/art-10.svg';
import Sticker11 from './images/art-11.svg';
import Sticker12 from './images/art-12.svg';
import Sticker13 from './images/art-13.svg';
import Sticker14 from './images/art-14.svg';
import Sticker15 from './images/art-15.svg';

const BLUR_MAX = 10;

export interface StickersProps {
  container: HTMLDivElement | null;
}

interface Sticker {
  x: number;
  y: number;
  speed: number;
  scale: number;
  image: HTMLImageElement;
}

export default function Stickers(props: StickersProps) {
  const { container } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [baseImage, setBaseImage] = useState<HTMLImageElement>(null!);
  const [stickers, setStickers] = useState<Array<Sticker>>(null!);
  const [imagesLoaded, setImagesLoaded] = useState<boolean>(false);

  const drawImageWithRotation = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      img: HTMLImageElement,
      x: number,
      y: number,
      width: number,
      height: number,
      deg: number
    ) => {
      ctx.save();
      const rad = (deg * Math.PI) / 180;
      ctx.translate(x + width / 2, y + height / 2);
      ctx.rotate(rad);
      ctx.drawImage(img, (width / 2) * -1, (height / 2) * -1, width, height);
      ctx.restore();
    },
    []
  );

  const loadImages = useCallback(async () => {
    const imageCoordinates = [
      [0.05, 0.05],
      [0.2, 0.1],
      [0.1, 0.5],
      [0.67, 0.3],
      [0.25, 0.7],
      [0.33, 0.3],
      [0.6, 0.2],
      [0.4, 0.7],
      [0.4, 0.1],
      [0.55, 0.6],
      [0.6, 0.8],
      [0.7, 0.8],
      [0.15, 0.8],
      [0.8, 0.45],
      [0.8, 0.1],
    ];

    setBaseImage(await loadImage(BaseImage));
    const stickerImages = [
      await loadImage(Sticker1),
      await loadImage(Sticker2),
      await loadImage(Sticker3),
      await loadImage(Sticker4),
      await loadImage(Sticker5),
      await loadImage(Sticker6),
      await loadImage(Sticker7),
      await loadImage(Sticker8),
      await loadImage(Sticker9),
      await loadImage(Sticker10),
      await loadImage(Sticker11),
      await loadImage(Sticker12),
      await loadImage(Sticker13),
      await loadImage(Sticker14),
      await loadImage(Sticker15),
    ];

    setStickers(
      stickerImages.map((stickerImage, index) => ({
        image: stickerImage,
        x: imageCoordinates[index][0],
        y: imageCoordinates[index][1],
        speed: Math.random(),
        scale: 0.1,
      }))
    );

    setImagesLoaded(true);
  }, []);

  const paintBase = useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      const ratio = baseImage.height / baseImage.width;
      const imageWidth = canvas.offsetWidth;
      const imageHeight = imageWidth * ratio;
      const { top } = canvas.getBoundingClientRect();
      const heightRatio = Math.max(0, top / canvas.offsetHeight);
      const offset = canvas.offsetHeight / 2;
      const y = top * heightRatio + offset;

      ctx.drawImage(baseImage, 0, y, imageWidth, imageHeight);
    },
    [baseImage]
  );

  const paintStickers = useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
      if (!stickers) {
        return;
      }

      ctx.save();
      const { top } = canvas.getBoundingClientRect();
      const canvasWidth = canvas.offsetWidth;
      const canvasHeight = canvas.offsetHeight;
      const margin = 50;
      const focusRatio = top / canvasHeight;
      const blur = BLUR_MAX * (1 - focusRatio);

      stickers.forEach((sticker, index) => {
        ctx.filter = `blur(${BLUR_MAX - blur < 0 ? 0 : BLUR_MAX - blur}px)`;
        const stickerImage = sticker.image;
        const stickerWidth = stickerImage.width * sticker.scale;
        const stickerHeight = stickerImage.height * sticker.scale;
        let x = canvasWidth * sticker.x;
        if (x > canvasWidth - margin) {
          x -= margin;
        } else if (x < margin) {
          x += margin;
        }
        const heightRatio = Math.max(0, top / canvas.offsetHeight);
        const offset = (canvas.offsetHeight / 2) * sticker.y;
        const y = top * heightRatio + offset;

        drawImageWithRotation(ctx, stickerImage, x, y, stickerWidth, stickerHeight, top * sticker.speed);
      });
      ctx.restore();
    },
    [stickers, drawImageWithRotation]
  );

  const paint = useCallback(() => {
    if (!ctx || !imagesLoaded || !isWithinViewport(container) || !canvasRef?.current) {
      return;
    }

    const canvas = canvasRef.current;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    paintStickers(ctx, canvas);
    paintBase(ctx, canvas);
  }, [container, ctx, imagesLoaded, paintBase, paintStickers]);

  useEffect(() => {
    if (!imagesLoaded) {
      loadImages();
    }
  }, [imagesLoaded, loadImages]);

  useEffect(() => {
    if (!canvasRef.current || ctx) {
      return;
    }

    setCtx(canvasRef.current.getContext('2d', { alpha: false }));
  }, [ctx]);

  useEffect(() => {
    if (!container || !canvasRef.current) {
      return;
    }

    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }
      canvas.setAttribute('width', '0');
      canvas.setAttribute('height', '0');
      canvas.style.width = '0px';
      canvas.style.height = '0px';

      window.requestAnimationFrame(() => {
        const { offsetWidth, offsetHeight } = container;
        canvas.setAttribute('width', `${offsetWidth}`);
        canvas.setAttribute('height', `${offsetHeight}`);
        canvas.style.width = `${offsetWidth}px`;
        canvas.style.height = `${offsetHeight}px`;
        paint();
      });
    };

    resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, [container, canvasRef, paint]);

  useEffect(() => {
    window.addEventListener('scroll', paint);

    return () => {
      window.removeEventListener('scroll', paint);
    };
  }, [paint]);

  return <canvas ref={canvasRef} />;
}
