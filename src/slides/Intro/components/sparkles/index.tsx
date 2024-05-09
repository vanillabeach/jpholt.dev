import { useEffect, useMemo, useRef, useState } from 'react';

import classNames from './styles.module.css';
import Sparkle from './sparkle';

export interface SparklesProps {
  backgroundColor: string;
}

export default function Sparkles({ backgroundColor }: SparklesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [sparkle, setSparkle] = useState<Sparkle>(null!);

  const baseArgs = useMemo(
    () => ({
      backgroundColor: backgroundColor,
      distanceThreshold: 100,
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
          parentContainer: containerRef.current,
          canvasElement: canvasRef.current,
          colorA: [255, 255, 255],
          colorB: [192, 192, 212],
          ...baseArgs,
        })
      );
    }
  }, [canvasRef, containerRef, baseArgs, sparkle]);

  return (
    <div className={classNames.container} ref={containerRef}>
      <canvas className={classNames.canvas} ref={canvasRef}></canvas>
      <div className={classNames.overlay} />
    </div>
  );
}
