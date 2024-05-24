import { useEffect, useRef, useState } from 'react';

import GoogleHealthDevices from './components/googleHealthDevices';
import BackgroundImage from './images/background.webp';
import classNames from './styles.module.css';
import debounce from 'debounce';
import { config } from '../../data/config';
import Year from '../../components/year/year';
import Background, { BackgroundVisibility } from '../../components/background';
import { Colors } from '../../styles';

export default function GoogleHealth() {
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
    <Background
      url={BackgroundImage}
      color={Colors.White.toHexString}
      show={showFullContent ? BackgroundVisibility.backgroundColor : BackgroundVisibility.canvas}
      scroll={window.innerWidth < config.mobileWaxWidth}
    >
      <div className={classNames.container} ref={slideContainerRef}>
        <div className={classNames.content}>
          <section className={classNames.copyContainer}>
            <div className={classNames.copy}>
              <Year color="purple">2019</Year>
              <h1 className={`text-4xl font-medium mb-3 ${classNames.title}`}>GOOGLE HEALTH</h1>
              <p className="mb-3">
                Google Health is a division of Alphabet dedicated to improving patient outcomes through better hardware
                and software applications.
              </p>
              <p className="mb-3">
                I was part of the original{' '}
                <a
                  className={classNames.link}
                  rel="noreferrer"
                  target="_blank"
                  href="https://deepmind.google/discover/blog/deepminds-health-team-joins-google-health/"
                >
                  DeepMind Health
                </a>{' '}
                team, spun up by Mustafa Suleyman. After DeepMind was acquired by Google, I was asked to build a health
                app that could detect kidney injury and deteriation in patients. The app was successfully tested by
                clinicians, and laid the foundation of the{' '}
                <a
                  className={classNames.link}
                  rel="noreferrer"
                  target="_blank"
                  href="https://www.youtube.com/watch?v=ik9ps7L-p2E&t=75s"
                >
                  Streams
                </a>{' '}
                project.
              </p>
              <p>
                Later, I joined the{' '}
                <a
                  className={classNames.link}
                  rel="noreferrer"
                  target="_blank"
                  href="https://health.google/caregivers/care-studio/"
                >
                  Care Studio
                </a>{' '}
                team and built the UI architecture for their{' '}
                <a
                  className={classNames.link}
                  target="_blank"
                  rel="noreferrer"
                  href="https://www.youtube.com/watch?v=8iR8VNchpoE"
                >
                  mobile application
                </a>{' '}
                based on the "Health Material" design language conceived by our Design team. Around this time, I was
                also seconded to the{' '}
                <a
                  className={classNames.link}
                  rel="noreferrer"
                  target="_blank"
                  href="https://www.gov.uk/government/organisations/department-of-health-and-social-care"
                >
                  Department of Health
                </a>{' '}
                to help build hospital dashboards outlining the spread of CoVid during the pandemic. I was given an
                award by Google for my contribution.
              </p>
            </div>
          </section>

          <section className={classNames.art} style={{ display: showFullContent ? 'flex' : 'none' }}>
            <div className={classNames.artPadding}>
              <div className={classNames.artContainer} ref={canvasContainerRef}>
                <GoogleHealthDevices slideContainer={slideContainer} canvasContainer={canvasContainer} />
              </div>
            </div>
          </section>
        </div>
      </div>
    </Background>
  );
}
