import { useCallback, useEffect, useRef, useState } from 'react';
import { isWithinViewport } from '../../../../utils';
import DesignImage from './images/design-alt.webp';
import Laptop from './images/device-laptop.webp';
import Tablet from './images/device-tablet.webp';
import Phone from './images/device-phone.webp';

import classNames from './styles.module.css';

export interface GoogleHealthDevicesProps {
  slideContainer: HTMLDivElement | null;
  canvasContainer: HTMLDivElement | null;
}

export default function GoogleHealthDevices(props: GoogleHealthDevicesProps) {
  const { slideContainer, canvasContainer } = props;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>();

  const [designImage, setDesignImage] = useState<HTMLImageElement>();
  const [laptopImage, setLaptopImage] = useState<HTMLImageElement>();
  const [tabletImage, setTabletImage] = useState<HTMLImageElement>();
  const [phoneImage, setPhoneImage] = useState<HTMLImageElement>();

  const getImageRatio = useCallback(
    (image: HTMLImageElement) => (image.width > image.height ? image.height / image.width : image.width / image.height),
    []
  );

  useEffect(() => {
    if (canvasRef?.current && laptopImage) {
      if (canvasRef.current.classList.contains(classNames.show) === false) {
        canvasRef.current.classList.add(classNames.show);
      }
    }
  }, [canvasRef, laptopImage]);

  const loadImages = useCallback(() => {
    if (!designImage) {
      const img = new Image();
      img.src = DesignImage;
      img.onload = () => {
        setDesignImage(img);
      };
    }
    if (!laptopImage) {
      const img = new Image();
      img.src = Laptop;
      img.onload = () => {
        setLaptopImage(img);
      };
    }
    if (!phoneImage) {
      const img = new Image();
      img.src = Phone;
      img.onload = () => {
        setPhoneImage(img);
      };
    }
    if (!tabletImage) {
      const img = new Image();
      img.src = Tablet;
      img.onload = () => {
        setTabletImage(img);
      };
    }
  }, [designImage, laptopImage, phoneImage, tabletImage]);

  const resizeCanvas = useCallback((canvasContainer: HTMLElement, canvas: HTMLCanvasElement) => {
    canvas.setAttribute('width', `0px`);
    canvas.setAttribute('height', `0px`);
    canvas.setAttribute('width', `${canvasContainer.offsetWidth * 2}`);
    canvas.setAttribute('height', `${canvasContainer.offsetHeight * 2}`);
  }, []);

  const paintDevices = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement,
      designImage: HTMLImageElement,
      laptopImage: HTMLImageElement,
      phoneImage: HTMLImageElement,
      tabletImage: HTMLImageElement
    ) => {
      const offsetY = canvas.getBoundingClientRect().top;

      if (designImage) {
        const designImageWidth = canvas.width;
        const designImageHeight = canvas.width * getImageRatio(designImage);
        const opacity = (1 - canvas.getBoundingClientRect().top / canvas.offsetHeight) * 2.5;
        ctx.filter = `opacity(${opacity > 1 ? 1 : opacity})`;
        ctx.drawImage(designImage, 0, offsetY * 1.1 + canvas.height / 12, designImageWidth, designImageHeight);
      }

      if (laptopImage) {
        const laptopWidth = canvas.width;
        const laptopHeight = canvas.width * getImageRatio(laptopImage);
        const opacity = 1 - (canvas.getBoundingClientRect().top / canvas.offsetHeight) * 1.3;
        ctx.filter = `opacity(${opacity > 1 ? 1 : opacity})`;
        ctx.drawImage(laptopImage, 0, offsetY * 1.3 + canvas.height / 4, laptopWidth, laptopHeight);
      }

      if (tabletImage) {
        const tabletWidth = canvas.width;
        const tabletHeight = canvas.width * getImageRatio(tabletImage);
        const opacity = 1 - (canvas.getBoundingClientRect().top / canvas.offsetHeight) * 1.1;
        ctx.filter = `opacity(${opacity > 1 ? 1 : opacity})`;
        ctx.drawImage(tabletImage, 0, offsetY * 1.8 + canvas.height / 2.2, tabletWidth, tabletHeight);
      }

      if (phoneImage) {
        const opacity = 1 - canvas.getBoundingClientRect().top / canvas.offsetHeight;
        ctx.filter = `opacity(${opacity > 1 ? 1 : opacity})`;
        const phoneWidth = canvas.width;
        const phoneHeight = canvas.width * getImageRatio(phoneImage);
        ctx.drawImage(phoneImage, 0, offsetY * 2.5 + canvas.height / 2.2, phoneWidth, phoneHeight);
      }

      ctx.filter = 'none';
    },
    [getImageRatio]
  );

  const paint = useCallback(
    (resize = true) => {
      if (
        !ctx ||
        !slideContainer ||
        !canvasContainer ||
        !canvasRef?.current ||
        !isWithinViewport(slideContainer) ||
        !designImage ||
        !laptopImage ||
        !phoneImage ||
        !tabletImage
      ) {
        return;
      }
      const canvas = canvasRef.current;
      if (resize === true) {
        resizeCanvas(canvasContainer, canvas);
      }

      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.offsetWidth * 2, canvas.offsetHeight * 2);
      paintDevices(ctx, canvasRef.current, designImage, laptopImage, phoneImage, tabletImage);
    },
    [
      resizeCanvas,
      ctx,
      laptopImage,
      paintDevices,
      designImage,
      phoneImage,
      tabletImage,
      slideContainer,
      canvasContainer,
    ]
  );

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
  }, [loadImages]);

  useEffect(() => {
    if (canvasRef?.current && laptopImage) {
      if (canvasRef.current.classList.contains(classNames.show) === false) {
        canvasRef.current.classList.add(classNames.show);
      }
    }

    if (laptopImage) {
      paint(true);
    }
  }, [laptopImage, canvasRef, paint]);

  return <canvas ref={canvasRef} className={classNames.canvas}></canvas>;
}
