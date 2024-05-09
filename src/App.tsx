import { useState, useEffect } from 'react';
import scrollToElement from 'scroll-to-element';
import NavigationBar from './components/navigationBar';
import Slide from './components/slide';

import Channel4 from './slides/Channel4';
import DeepMind from './slides/DeepMind';
import GoogleHealth from './slides/GoogleHealth';
import Intro from './slides/Intro';
import Nokia from './slides/Nokia';
import Phaidra from './slides/Phaidra';
import Symbian from './slides/Symbian';
import BMG from './slides/BMG';

import { workPlaces } from './data/work';

import classNames from './styles.module.css';

const animate = true;

function App() {
  const [currentSlide, setCurrentSlide] = useState<string>(document.location.hash.substring(1));

  const scrollTo = (slide: string) => {
    const el = document.getElementById(`slide-${slide}`);

    if (el) {
      scrollToElement(el, { ease: 'outQuart', offset: 0 });
    }
  };

  useEffect(() => {
    scrollTo(currentSlide);
    if (document.location.hash !== currentSlide) {
      document.location.hash = currentSlide;
      setCurrentSlide(document.location.hash.substring(1));
    }
  }, [currentSlide]);

  const handleNavigation = (id: string): void => {
    setCurrentSlide(id);
    scrollTo(currentSlide);
  };

  return (
    <>
      <NavigationBar items={workPlaces} onNavigate={handleNavigation} currentSlide={currentSlide} />
      <section id="slides" className={classNames.portfolio}>
        <Slide id="">
          <Intro animate={animate} onNavigate={handleNavigation} />
        </Slide>
        <Slide id="phaidra">
          <Phaidra />
        </Slide>
        <Slide id="google-health">
          <GoogleHealth />
        </Slide>
        <Slide id="deepmind">
          <DeepMind />
        </Slide>
        <Slide id="channel4">
          <Channel4 />
        </Slide>
        <Slide id="nokia">
          <Nokia />
        </Slide>
        <Slide id="symbian">
          <Symbian />
        </Slide>
        <Slide id="bmg">
          <BMG />
        </Slide>
      </section>
    </>
  );
}

export default App;
