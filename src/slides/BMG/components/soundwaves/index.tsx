import { useCallback, useEffect, useRef, useState } from "react";
import { isWithinViewport, loadImage } from "../../../../utils";

import ArtistImage from "./images/artist.webp";
import Soundwave1 from "./images/soundwave1.svg";
import Soundwave2 from "./images/soundwave2.svg";

const NAVIGATION_BAR_HEIGHT = 70;

export interface SoundwavesProps {
  parentContainer: HTMLElement;
}

export default function Soundwaves(props: SoundwavesProps) {
  const { parentContainer } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [artistImage, setArtistImage] = useState<HTMLImageElement>(null!);
  const [soundwave1, setSoundwave1] = useState<HTMLImageElement>(null!);
  const [soundwave2, setSoundwave2] = useState<HTMLImageElement>(null!);
  const [imagesReady, setImagesReady] = useState<boolean>(false);

  const loadImages = useCallback(async () => {
    setArtistImage(await loadImage(ArtistImage));
    setSoundwave1(await loadImage(Soundwave1));
    setSoundwave2(await loadImage(Soundwave2));
    setImagesReady(true);
  }, []);

  useEffect(() => {
    if (!imagesReady) {
      loadImages();
    }
  }, [imagesReady, loadImages]);

  const paintBackground = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!canvasRef?.current) {
        return;
      }
      const { offsetWidth: parentWidth, offsetHeight: parentHeight } =
        parentContainer;

      ctx.clearRect(0, 0, parentWidth, parentHeight);
    },
    [canvasRef, parentContainer]
  );

  const paintArtist = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!canvasRef?.current) {
        return;
      }
      const { offsetWidth: parentWidth, offsetHeight: parentHeight } =
        parentContainer;
      const { top } = parentContainer.getBoundingClientRect();

      const ratio = artistImage.height / artistImage.width;
      let width =
        artistImage.width > parentWidth ? parentWidth : artistImage.width;
      let height =
        artistImage.width > parentWidth
          ? parentWidth * ratio
          : artistImage.height;
      if (height > parentHeight - NAVIGATION_BAR_HEIGHT) {
        const scaleRatio = width / height;
        height = parentHeight - NAVIGATION_BAR_HEIGHT;
        width = height * scaleRatio;
      }

      const x = parentWidth / 2 - width / 2;
      const mobileY = top * 0.8;
      const y =
        window.innerHeight > 400
          ? parentHeight - height - top * -0.6
          : parentHeight - height - mobileY;

      ctx.drawImage(artistImage, x, y, width, height);
    },
    [artistImage, canvasRef, parentContainer]
  );

  const paintSampleWave = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      if (!canvasRef?.current) {
        return;
      }
      const { offsetWidth: parentWidth } = parentContainer;
      const { top } = parentContainer.getBoundingClientRect();
      const width = parentWidth / 2;
      const height = (soundwave1.height / soundwave1.width) * width;
      const x = width / 2;
      const y1 = top * 0.9;
      const y2 = y1 - height - height / 100;

      ctx.drawImage(soundwave1, x, y1, width, height);
      ctx.drawImage(soundwave1, x, y2, width, height);
      ctx.drawImage(soundwave2, x, y1 * 0.3 - height / 140, width, height);
      ctx.drawImage(soundwave2, x, y2 + 0.3 - height / 140, width, height);
    },
    [canvasRef, parentContainer, soundwave1, soundwave2]
  );

  const paint = useCallback(() => {
    if (!canvasRef?.current || !imagesReady) {
      return;
    }

    const canvas = canvasRef.current;
    if (!isWithinViewport(canvas)) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    paintBackground(ctx);
    paintSampleWave(ctx);
    paintArtist(ctx);
  }, [canvasRef, imagesReady, paintArtist, paintBackground, paintSampleWave]);

  const resize = useCallback(
    (canvas: HTMLCanvasElement) => {
      canvas.setAttribute("width", `0`);
      canvas.setAttribute("height", `0`);
      canvas.style.width = `${0}px`;
      canvas.style.height = `${0}px`;

      const { offsetWidth: parentWidth, offsetHeight: parentHeight } =
        parentContainer;

      requestAnimationFrame(() => {
        canvas.setAttribute("width", `${parentWidth}`);
        canvas.setAttribute("height", `${parentHeight}`);
        canvas.style.width = `${parentWidth}px`;
        canvas.style.height = `${parentHeight}px`;

        paint();
      });
    },
    [paint, parentContainer]
  );

  useEffect(() => {
    if (!canvasRef?.current) {
      return;
    }
    const canvas = canvasRef.current;
    const doResize = () => resize(canvas);

    doResize();
    window.addEventListener("resize", doResize);

    return () => {
      window.removeEventListener("resize", doResize);
    };
  }, [resize]);

  useEffect(() => {
    window.addEventListener("scroll", paint);

    return () => {
      window.removeEventListener("scroll", paint);
    };
  }, [paint]);

  return <canvas ref={canvasRef} />;
}
