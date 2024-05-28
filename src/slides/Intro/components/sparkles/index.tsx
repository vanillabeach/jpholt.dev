import { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';

import classNames from './styles.module.css';
import Sparkle from './sparkle';
import { SparkleType } from './models';

export interface SparklesProps {
  backgroundColor: string;
  fillPolygons?: boolean;
  autoplay?: boolean;
  sparkleType?: SparkleType;
  style?: CSSProperties;
}

export default function Sparkles({
  backgroundColor,
  autoplay = true,
  sparkleType = SparkleType.Polygon,
  style,
}: SparklesProps) {
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
          parentContainer: containerRef.current,
          canvasElement: canvasRef.current,
          colorA: [0, 255, 255],
          colorB: [255, 0, 255],
          sparkleType,
          ...baseArgs,
        })
      );
    }
  }, [canvasRef, containerRef, baseArgs, sparkle]);

  return (
    <div className={classNames.container} ref={containerRef} style={style}>
      <canvas className={classNames.canvas} ref={canvasRef}></canvas>
      <div className={classNames.overlay} />
    </div>
  );
}
