import { useEffect, useState } from 'react';
import Sparkles from './components/sparkles';

import { companies, links } from './data';
import classNames from './styles.module.css';

export type IntroProps = {
  animate?: boolean;
  onNavigate: (id: string) => void;
};

export default function Intro({ animate = true, onNavigate }: IntroProps) {
  const [scrollY, setScrollY] = useState<number>(0);

  useEffect(() => {
    const scrollEvent = () => {
      setScrollY(window.scrollY * -0.3);
    };
    window.addEventListener('scroll', scrollEvent);

    return () => {
      window.removeEventListener('scroll', scrollEvent);
    };
  });

  return (
    <div className={classNames.container}>
      <div className={classNames.background} style={{ top: `${scrollY}px` }}>
        {animate && <Sparkles backgroundColor="#ffffff" />}
      </div>
      <div className={classNames.foreground}>
        <div className={classNames.content}>
          <section className={classNames.copyPadding}></section>

          <section className={classNames.copy}>
            <header>
              <h1 className={`text-5xl font-medium ${classNames.header1}`}>John-Paul Holt</h1>
              <h2 className={`text-2xl font-medium ${classNames.header2}`}>
                Web Development | UX Engineering | Prototyping
              </h2>
              <p className={classNames.responsiveMessage}>
                This website is optimised for a laptop or tablet device. It will also show more visuals on a phone in
                landscape mode.
              </p>
            </header>
            <nav className={classNames.navigation}>
              <ul>
                {companies.map((company, index) => (
                  <li key={company.id}>
                    <a
                      href={`#${company.url}`}
                      key={`${index}-${company.id}`}
                      onClick={(ev) => {
                        ev.preventDefault();
                        onNavigate(company.url);
                      }}
                    >
                      <span className={classNames.listBullet}>▷</span>
                      <span>{company.name}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <ul>
                {links.map((link, index) => (
                  <li key={link.id}>
                    <a href={link.url} key={`${index}-${link.id}`} target={link.newTab ? '_blank' : undefined}>
                      <span
                        className={classNames.listBullet}
                        style={{ marginTop: link.bullet === '▽' ? '0.1rem' : '0' }}
                      >
                        {link.bullet}
                      </span>
                      <span>{link.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </section>
        </div>
      </div>
    </div>
  );
}
