import debounce from 'debounce';
import { useEffect, useCallback, useRef, useState } from 'react';

import classNames from './styles.module.css';
import { WorkPlace, StyleData } from '../../data/work';
import { config } from '../../data/config';

export interface NavigationItem {
  backgroundColor: string | null;
  name: string;
  id: string;
}

export interface NavigationBarProps {
  items: WorkPlace[];
  currentSlide: string;
  onNavigate: (id: string) => void;
}

export default function NavigationBar(props: NavigationBarProps) {
  const { currentSlide, items, onNavigate } = props;
  const headerRef = useRef<HTMLHeadElement>(null);
  const selectedRef = useRef<HTMLDivElement>(null);
  const [selectedId, setSelectedId] = useState<string>(currentSlide);
  const [selectedStyle, setSelectedStyle] = useState<StyleData | null>(null);
  const [backgroundColor, setBackgroundColor] = useState<string>('transparent');
  const [foregroundColor, setForegroundColor] = useState<string>('transparent');

  const changeStyle = useCallback(() => {
    if (!headerRef?.current || !selectedRef?.current) {
      return;
    }

    const header = headerRef.current;
    const selected = selectedRef.current;
    const { style } = items.filter((x) => x.id === selectedId)[0] || undefined;

    setSelectedStyle(style === undefined ? null : style);

    if (style === null) {
      header.classList.remove(classNames.show);
      return;
    }

    if (selectedStyle) {
      setBackgroundColor(
        window.innerWidth >= config.mobileNavigatorWidth
          ? style.navigationBar.fullWidth.backgroundColor
          : style.navigationBar.mobile.backgroundColor
      );

      setForegroundColor(
        window.innerWidth >= config.mobileNavigatorWidth
          ? style.navigationBar.fullWidth.foregroundColor
          : style.navigationBar.mobile.foregroundColor
      );

      selected.style.backgroundColor = backgroundColor;
      header.style.backgroundColor = backgroundColor;
      header.style.color = foregroundColor;
      header.classList.add(classNames.show);
    }
  }, [items, selectedStyle, backgroundColor, foregroundColor, selectedId]);

  useEffect(() => {
    changeStyle();
  }, [changeStyle]);

  useEffect(() => {
    const handleScroll = debounce(() => {
      if (!headerRef?.current) {
        return;
      }

      const idPrefix = 'slide-';
      const slides = Array.from(document.querySelectorAll(`#slides [id^="${idPrefix}"]`));
      const nearestSlideId = slides
        .map((slide) => ({
          id: slide.getAttribute('id'),
          y: Math.abs(slide.getBoundingClientRect().top),
        }))
        .sort((a, b) => {
          if (a.y < b.y) {
            return -1;
          }
          if (a.y > b.y) {
            return 1;
          }
          return 0;
        })[0].id;

      if (nearestSlideId) {
        const id = nearestSlideId.substring(idPrefix.length);
        setSelectedId(id);
      }
    }, 50);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  useEffect(() => {
    const handleResize = () => {
      changeStyle();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [changeStyle, selectedId]);

  return (
    <header className={classNames.outerContainer} ref={headerRef}>
      {items.map((item, index) => (
        <span
          key={`${index}-${item.id}`}
          className={classNames.item}
          onClick={() => {
            onNavigate(item.id);
          }}
        >
          <span
            className={index === 0 ? classNames.homePage : classNames.maxName}
            style={{
              borderColor: foregroundColor,
            }}
          >
            {item.name}
          </span>
          {index > 0 && (
            <div
              className={selectedId === item.id ? classNames.minNameSelected : classNames.minName}
              style={{
                borderColor: foregroundColor,
                backgroundColor: selectedId === item.id ? foregroundColor : 'transparent',
              }}
            />
          )}
          <div
            ref={selectedRef}
            className={selectedId === item.id ? `${classNames.selected} ${classNames.show}` : `${classNames.selected}`}
            style={{
              backgroundColor: backgroundColor,
            }}
          />
        </span>
      ))}
    </header>
  );
}
