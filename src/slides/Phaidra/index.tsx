import { useEffect, useRef, useState } from 'react';

import classNames from './styles.module.css';
import Background from './components/background';
import { config } from '../../data/config';
import debounce from 'debounce';
import Year from '../../components/year/year';

export default function Phaidra() {
  const slideContainerRef = useRef<HTMLDivElement>(null);
  const [slideContainer, setSlideContainer] = useState<HTMLDivElement>(null!);
  const [showFullContent, setShowFullContent] = useState<boolean>(window.innerWidth > config.mobileWaxWidth);

  useEffect(() => {
    const handleWidth = debounce(() => {
      setShowFullContent(window.innerWidth > config.mobileWaxWidth);
    }, 100);

    window.addEventListener('resize', handleWidth);

    return () => {
      window.removeEventListener('resize', handleWidth);
    };
  }, [showFullContent]);

  useEffect(() => {
    if (!slideContainerRef.current || slideContainer) {
      return;
    }

    setSlideContainer(slideContainerRef.current);
  }, [slideContainer]);

  return (
    <div className={classNames.container} ref={slideContainerRef}>
      {showFullContent && <Background slideContainer={slideContainer} />}
      <div className={classNames.content}>
        <section className={classNames.copyContainer}>
          <div className={classNames.copy}>
            <Year color="blue">2023</Year>
            <h2 className="text-4xl font-medium mb-3">PHAIDRA</h2>
            <p className="mb-3">
              Phaidra is an Artificial Intelligence company pioneering in energy saving and optimisation. Founded by two
              former DeepMind engineers, Phaidra is dedicated to using machine learning to predict and pre-empt energy
              usage in the industrial sector, especially around HVAC and refrigeration. Their work with Google's data
              centres resulted in a{' '}
              <a
                className={classNames.link}
                target="_blank"
                rel="noreferrer"
                href="https://deepmind.google/discover/blog/safety-first-ai-for-autonomous-data-centre-cooling-and-industrial-control/"
              >
                30% energy saving.
              </a>{' '}
            </p>
            <p className="mb-3">
              I was asked to join the startup in order to assist their efforts to build a{' '}
              <a
                className={classNames.link}
                target="_blank"
                rel="noreferrer"
                href="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*OVw592xp2YNpBz_Cihn5Hg.png"
              >
                web portal
              </a>{' '}
              that helped customers and research scientists alike understand the impact of the AI algorithms on energy
              usage for a given system. I worked within a React/Typescript framework, using a design system created in
              Figma by the in-house{' '}
              <a
                className={classNames.link}
                target="_blank"
                rel="noreferrer"
                href="https://medium.com/phaidra-design-radius/meet-the-phaidra-design-team-bed05c49f3a9"
              >
                UX Team.
              </a>{' '}
            </p>
            <p>
              My main contributions included building additional UI components for the charting system, implementing a
              comprehensive e2e testing system, and reviewing/fixing code issues. The portal has consistently met
              expectations and has recently undergone addtional expansion based on increased confidence.
            </p>
          </div>
        </section>
        {showFullContent && (
          <section className={classNames.art}>
            <div className={classNames.artPadding}></div>
          </section>
        )}
      </div>
    </div>
  );
}
