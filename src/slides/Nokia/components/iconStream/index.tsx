import { useCallback, useEffect, useRef, useState } from 'react';
import { isWithinViewport, loadImage } from '../../../../utils';

import classNames from './styles.module.css';
import Icon1 from './images/icon01.webp';
import Icon2 from './images/icon03.webp';
import Icon3 from './images/icon06.webp';
import Icon4 from './images/icon09.webp';
import Icon5 from './images/icon12.webp';
import Icon6 from './images/icon15.webp';
import Icon7 from './images/icon18.webp';
import Icon8 from './images/icon21.webp';
import Icon9 from './images/icon24.webp';
import Icon10 from './images/icon27.webp';
import Icon11 from './images/icon30.webp';
import Icon12 from './images/icon33.webp';
import Icon13 from './images/icon36.webp';
import Icon14 from './images/icon39.webp';
import Icon15 from './images/icon42.webp';
import Icon16 from './images/icon45.webp';
import Icon17 from './images/icon48.webp';

export interface IconStreamProps {
  parentContainer: HTMLDivElement | null;
}

export interface IconData {
  x: number;
  y: number;
  speed: number;
  scale: number;
  blur: number;
}

const NUMBER_OF_ICONS = 17;
const iconData: IconData[] = Array(NUMBER_OF_ICONS)
  .fill(null)
  .map((_, index) => {
    const inverse = NUMBER_OF_ICONS - index;
    const inverseRatio = inverse / NUMBER_OF_ICONS;

    return {
      x: Math.random(),
      y: Math.random(),
      speed: inverseRatio * 4,
      scale: inverseRatio,
      blur: Math.abs(Math.log(inverseRatio)),
    };
  })
  .reverse();

export default function IconStream(props: IconStreamProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>();
  const { parentContainer } = props;
  const [icons, setIcons] = useState<HTMLImageElement[]>(null!);
  const [iconsLoaded, setIconsLoaded] = useState<boolean>(false);

  const resizeCanvas = useCallback(() => {
    if (!parentContainer || !canvasRef?.current) {
      return;
    }

    const canvas = canvasRef.current;

    canvas.setAttribute('width', `0px`);
    canvas.setAttribute('height', `0px`);
    canvas.setAttribute('width', `${parentContainer.offsetWidth}px`);
    canvas.setAttribute('height', `${parentContainer.offsetHeight}px`);
  }, [parentContainer]);

  const paint = useCallback(() => {
    if (!parentContainer || !canvasRef?.current || !ctx || !isWithinViewport(parentContainer) || !icons) {
      return;
    }

    const canvas = canvasRef.current;
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    const { top } = parentContainer.getBoundingClientRect();

    iconData.forEach((iconDatum, index) => {
      const icon = icons[index];
      let x = canvas.offsetWidth * iconDatum.x;
      if (x > canvas.offsetWidth - 75) {
        x -= 75;
      }
      let y = top * iconDatum.speed + canvas.offsetHeight * iconDatum.y;
      if (y > canvas.offsetHeight) {
        y = y - canvas.offsetHeight - 50;
      } else if (y < 0) {
        y = y + canvas.offsetHeight + 50;
      }
      ctx.filter = `blur(${iconDatum.blur}px)`;
      ctx.drawImage(icon, x, y, icon.width * iconDatum.scale, icon.height * iconDatum.scale);
    });
  }, [icons, parentContainer, ctx]);

  const loadIcons = useCallback(async () => {
    setIcons([
      await loadImage(Icon1),
      await loadImage(Icon2),
      await loadImage(Icon3),
      await loadImage(Icon4),
      await loadImage(Icon5),
      await loadImage(Icon6),
      await loadImage(Icon7),
      await loadImage(Icon8),
      await loadImage(Icon9),
      await loadImage(Icon10),
      await loadImage(Icon11),
      await loadImage(Icon12),
      await loadImage(Icon13),
      await loadImage(Icon14),
      await loadImage(Icon15),
      await loadImage(Icon16),
      await loadImage(Icon17),
    ]);

    setIconsLoaded(true);
  }, []);

  useEffect(() => {
    if (!iconsLoaded) {
      loadIcons();
      return;
    }

    resizeCanvas();
    requestAnimationFrame(paint);
  }, [iconsLoaded, loadIcons, paint, resizeCanvas]);

  useEffect(() => {
    if (canvasRef?.current) {
      setCtx(canvasRef.current.getContext('2d', { alpha: true }));
    }
  }, [canvasRef]);

  useEffect(() => {
    const handleScroll = () => {
      if (!parentContainer) {
        return;
      }

      resizeCanvas();
      requestAnimationFrame(paint);
    };

    const handleResize = () => {
      if (!parentContainer) {
        return;
      }
      resizeCanvas();
      requestAnimationFrame(paint);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [paint, parentContainer, resizeCanvas]);

  return <canvas ref={canvasRef} className={classNames.canvas}></canvas>;
}
