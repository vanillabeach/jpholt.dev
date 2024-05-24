import classNames from './styles.module.css';
import { useEffect, useState, useRef } from 'react';
import Logo from './components/logo';
import AngledPage from './components/angledPage';
import BackgroundImage from './images/background.webp';
import debounce from 'debounce';
import { config } from '../../data/config';
import Year from '../../components/year/year';
import Background, { BackgroundVisibility } from '../../components/background';
import { Colors } from '../../styles';

export default function Channel4() {
  const parentContainerRef = useRef<HTMLDivElement>(null);
  const [parentContainer, setParentContainer] = useState<HTMLDivElement>(null!);
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
      color={Colors.White.toHexString}
      show={showFullContent ? BackgroundVisibility.backgroundColor : BackgroundVisibility.canvas}
      scroll={window.innerWidth < config.mobileWaxWidth}
    >
      <div className={classNames.container}>
        <div className={classNames.content} ref={parentContainerRef}>
          <section className={classNames.copyContainer}>
            <div className={classNames.copy}>
              <Year color="purple">2012</Year>
              <h1 className={`text-4xl font-medium mb-3 ${classNames.title}`}>CHANNEL 4</h1>
              <p className="mb-3">
                Channel 4 is one of UK's best known commercial television stations, with a strong internet presence
                thanks to their on-demand web and mobile applications.
              </p>
              <p className="mb-3">
                I joined their IT department as a contractor to help build and maintain their website, which at the time
                consisted of a series of microsites. My work involved creating image and media assets, working
                extensively with "plain" JavaScript application code, and working with multiple content management
                systems.
              </p>
              <p>
                Notable projects that I worked on include the{' '}
                <a
                  className={classNames.link}
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.channel4.com/media/documents/press/news/Paralympic%20Booklet.pdf"
                >
                  2012 Paralympics campaign
                </a>
                , building and integrating assets for the launch of{' '}
                <a
                  className={classNames.link}
                  href="https://en.wikipedia.org/wiki/4seven"
                  target="_blank"
                  rel="noreferrer"
                >
                  4Seven
                </a>
                , and implementing a unified login system for Channel4's audience.
              </p>
            </div>
          </section>
          {showFullContent && (
            <section className={classNames.art}>
              <AngledPage parentContainer={parentContainer} />
              <Logo parentContainer={parentContainer} />
            </section>
          )}
        </div>
      </div>
    </Background>
  );
}
