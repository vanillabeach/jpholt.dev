import { useRef, useState, useEffect } from 'react';

import Soundwaves from './components/soundwaves';
import classNames from './styles.module.css';
import BackgroundImage from './images/background.svg';
import debounce from 'debounce';
import { config } from '../../data/config';
import Year from '../../components/year/year';
import Background from '../../components/background';
import { Colors } from '../../styles';

export default function BMG() {
  const [parentContainer, setParentContainer] = useState<HTMLDivElement>(null!);
  const parentContainerRef = useRef<HTMLDivElement>(null);
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
    if (parentContainerRef?.current && parentContainer === null) {
      setParentContainer(parentContainerRef.current);
    }
  }, [parentContainer, parentContainerRef]);

  return (
    <Background
      url={BackgroundImage}
      color={Colors.Black.toHexString}
      scroll={window.innerWidth < config.mobileWaxWidth}
    >
      <div className={classNames.container}>
        <div className={classNames.content}>
          <section className={classNames.copyContainer}>
            <div className={classNames.copy}>
              <Year color="blue">2002</Year>
              <h1 className={`text-4xl font-medium mb-3 ${classNames.title}`}>BERTELSMANN MEDIA GROUP</h1>
              <p className="mb-3">
                Berteslmann Media Group was one of the original "
                <a
                  className={classNames.link}
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.refinedmelody.com/blog/monopolization-in-music-how-the-big-six-became-the-big-three"
                >
                  Big Six
                </a>
                " media companies, before merging with Sony in 2004. It signed and colloborated with a wide range of
                artists, from Kylie Minogue to Busta Rhymes, from Elvis to Britney Spears.
              </p>
              <p className="mb-3">
                My role was to build the frontend for their "Workflow" system - a web app designed to manage the entire
                lifecycle of an artist's product from A&R, to tracklisting, to product forecasting, to inventory.
                Working alongside a dedicated team, I liased with label managers to help shape the user interface of the
                product and deliver according to their specifications.
              </p>
              <p>
                The product was successful, and my original three month contract ended up being extended by two years to
                allow the product to be built and launched on time.
              </p>
            </div>
          </section>
          <section className={classNames.art} style={{ display: showFullContent ? 'flex' : 'none' }}>
            <div className={classNames.artPadding}>
              <div className={classNames.artContainer} ref={parentContainerRef}>
                {parentContainer && <Soundwaves parentContainer={parentContainer} />}
              </div>
            </div>
          </section>
        </div>
      </div>
    </Background>
  );
}
