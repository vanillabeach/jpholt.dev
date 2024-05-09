import { useRef, useState, useEffect } from 'react';

import classNames from './styles.module.css';
import DeepMindBackgroundImage from './images/deepmind-bg.webp';
import DeepMindCubes from './components/deepmindCubes';
import debounce from 'debounce';
import { config } from '../../data/config';
import Year from '../../components/year/year';

export default function DeepMind() {
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const [slideContainer, setSlideContainer] = useState<HTMLDivElement>(null!);
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
    if (!slideContainerRef?.current || slideContainer) {
      return;
    }

    setSlideContainer(slideContainerRef.current);
  }, [slideContainer, slideContainerRef]);

  return (
    <div
      className={classNames.container}
      ref={slideContainerRef}
      style={{ backgroundImage: `url(${DeepMindBackgroundImage})` }}
    >
      <div className={classNames.content}>
        <section className={classNames.copyContainer}>
          <div className={classNames.copy}>
            <Year color="blue">2013</Year>
            <h1 className="text-4xl font-medium mb-3">DEEPMIND</h1>
            <p className="mb-3">
              DeepMind is one of the foremost organisations in field of Artificial General Intelligence. Founded in
              2010, DeepMind was an early pioneer in researching and applying the modern implementations of both deep
              learning and reinforcement learning. It was acquired by Google in 2014.
            </p>
            <p className="mb-3">
              I joined DeepMind during its "startup" phase, and helped build a number of different web and mobile UIs,
              ranging from websites exploring the commmercialisation of AI, to chrome extensions designed to aid
              researchers in visualising their algorithms.
            </p>
            <p>
              Notable projects include building the first Google DeepMind website, creating and maintaining their
              intranet, and building the{' '}
              <a
                className={classNames.link}
                target="_blank"
                rel="noreferrer"
                href="https://lacritica.eu/fotos/5/alphago-superJumbo.jpg"
              >
                clock timing system
              </a>{' '}
              used during the AlphaGo tournament.
            </p>
          </div>
        </section>
        {showFullContent && <DeepMindCubes slideContainer={slideContainer} />}
      </div>
    </div>
  );
}
