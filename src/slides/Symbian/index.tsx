import { useEffect, useRef, useState } from 'react';

import Stickers from './components/stickers';
import classNames from './styles.module.css';
import debounce from 'debounce';
import { config } from '../../data/config';
import Year from '../../components/year/year';

export default function Symbian() {
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const [slideContainer, setSlideContainer] = useState<HTMLDivElement>(null!);
  const [canvasContainer, setCanvasContainer] = useState<HTMLDivElement>(null!);
  const [showFullContent, setShowFullContent] = useState<boolean>(window.innerWidth > config.mobileWaxWidth);

  useEffect(() => {
    const handleWidth = debounce(() => {
      setShowFullContent(window.innerWidth > config.mobileWaxWidth);
    }, 10);

    window.addEventListener('resize', handleWidth);

    return () => {
      window.removeEventListener('resize', handleWidth);
    };
  }, [showFullContent]);

  useEffect(() => {
    if (!slideContainerRef?.current || !canvasContainerRef?.current) {
      return;
    }

    if (!slideContainer) {
      setSlideContainer(slideContainerRef.current);
    }
    if (!canvasContainer) {
      setCanvasContainer(canvasContainerRef.current);
    }
  }, [slideContainer, slideContainerRef, canvasContainer, canvasContainerRef]);

  return (
    <div className={classNames.container} ref={slideContainerRef}>
      <div className={classNames.content}>
        <section className={classNames.copyContainer}>
          <div className={classNames.copy}>
            <Year color="purple">2004</Year>
            <h1 className="text-4xl font-medium mb-3">SYMBIAN</h1>
            <p className="mb-3">
              Symbian was the first company to develop the "smartphone" OS, and was acquired by Nokia in 2008. At its
              peak, Symbian had a 73% share of the smarphone market and was used by companies including Motorola, LG,
              and Samsung.
            </p>
            <p className="mb-3">
              My work involved building the User Interfaces for Symbian's intranet tools, including their HR systems and
              software engineering microsites. I was also responsible for architecting and builing the front end for
              their Content Management System which was developed in collaboration with PA Systems.
            </p>
            <p>
              Notable successes include the launch of OneSymbian (a multi-million pound internal CMS that ran on IBM
              Websphere), and the internal Corporate Directory system which was used by all employees to manage their HR
              information.
            </p>
          </div>
        </section>
        <section className={classNames.art} style={{ display: showFullContent ? 'flex' : 'none' }}>
          <div className={classNames.artPadding}>
            <div className={classNames.artContainer} ref={canvasContainerRef}>
              <Stickers container={canvasContainer} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
