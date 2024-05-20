import { useRef, useState, useEffect } from 'react';

import IconStream from './components/iconStream';
import classNames from './styles.module.css';
import BackgroundImage from './images/nokia-bg.webp';
import Phone from './components/phone';
import debounce from 'debounce';
import { config } from '../../data/config';
import Year from '../../components/year/year';
import { Colors } from '../../styles';
import Background from '../../components/background';

export default function Nokia() {
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
    <Background url={BackgroundImage} color={Colors.Black.toHexString} scroll>
      <div className={classNames.container}>
        <div className={classNames.content}>
          <section className={classNames.copyContainer}>
            <div className={classNames.copy}>
              <Year color="blue">2009</Year>
              <h1 className={`text-4xl font-medium mb-3 ${classNames.title}`}>NOKIA</h1>
              <p className="mb-3">
                Nokia is a Finnish multinational company that specialises in telecommunications. Back in 2012 it was
                also a market leader in mobile smartphones.
              </p>
              <p className="mb-3">
                I worked within Nokia's IT department as a UX Engineer specialising in architecting and building User
                Interfaces based on Nokia's brand guidelines. As an individual contributor, I collaborated across a wide
                range of teams, culminating in a company-wide project with the global head of communications.
              </p>
              <p>
                Notable projects include creation of the "Media Bank" which unified Nokia's UI assets under a single,
                easy-to-use web application, a global "number of sales" ticker in every Nokia office worldwide, and the
                "Roving Reporter" campaign website.
              </p>
            </div>
          </section>
          <section className={classNames.art} style={{ display: showFullContent ? 'flex' : 'none' }}>
            <div className={classNames.artPadding}>
              <div className={classNames.artContainer} ref={parentContainerRef} style={{ position: 'relative' }}>
                <div
                  style={{
                    position: 'absolute',
                    zIndex: 0,
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                >
                  <Phone parentContainer={parentContainer} />
                </div>
                <div
                  style={{
                    position: 'absolute',
                    zIndex: 1,
                    width: '100%',
                    height: '100%',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  }}
                >
                  <IconStream parentContainer={parentContainer} />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </Background>
  );
}
