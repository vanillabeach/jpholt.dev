import { useEffect, useMemo, useRef, useState } from 'react';

import classNames from './styles.module.css';
import Sparkle from './sparkle';

export interface SparklesProps {
  backgroundColor: string;
  fillPolygons?: boolean;
  autoplay?: boolean;
}

export default function Sparkles({ backgroundColor, fillPolygons = true, autoplay = true }: SparklesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sparkle, setSparkle] = useState<Sparkle>(null!);

  const baseArgs = useMemo(
    () => ({
      backgroundColor: backgroundColor,
      distanceThreshold: 110,
      resolution: 0.5,
      speedRange: 1,
    }),
    [backgroundColor]
  );

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) {
      return;
    }

    if (!sparkle) {
      setSparkle(
        new Sparkle({
          autoplay,
          fillPolygons,
          parentContainer: containerRef.current,
          canvasElement: canvasRef.current,
          colorA: [0, 255, 255],
          colorB: [255, 0, 255],
          ...baseArgs,
        })
      );
    }
  }, [canvasRef, containerRef, baseArgs, sparkle]);

  return (
    <div className={classNames.container} ref={containerRef}>
      <canvas className={classNames.canvas} ref={canvasRef} style={{ transform: 'scale3d(1,1,1)' }}></canvas>
      <div className={classNames.overlay} />
    </div>
  );
}
