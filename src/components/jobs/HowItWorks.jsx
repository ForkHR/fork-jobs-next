'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

/**
 * A story told in drawings: the heading, then one drawing at a time in a row that scrolls
 * sideways (swipe on a phone, the arrows on a desktop). The next drawing peeks in from the
 * right so the row reads as more to see. Same pattern as forkhr.com's illustration stories.
 */
export default function HowItWorks({ id = 'how-it-works', eyebrow, title, lede, slides }) {
  const track = useRef(null);
  const [index, setIndex] = useState(0);

  // Distance between two slides' left edges (slide width + gap), read off the layout.
  const step = useCallback(() => {
    const el = track.current;
    if (!el || el.children.length < 2) return el?.clientWidth || 1;
    const [a, b] = el.children;
    return b.offsetLeft - a.offsetLeft || 1;
  }, []);

  const sync = useCallback(() => {
    const el = track.current;
    if (!el) return;
    const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 2;
    const next = atEnd ? slides.length - 1 : Math.round(el.scrollLeft / step());
    setIndex(Math.max(0, Math.min(slides.length - 1, next)));
  }, [slides.length, step]);

  useEffect(() => {
    const el = track.current;
    if (!el) return undefined;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(sync);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(frame);
      el.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [sync]);

  const go = (i) => {
    const el = track.current;
    if (!el) return;
    const target = Math.max(0, Math.min(slides.length - 1, i));
    el.scrollTo({ left: Math.min(target * step(), el.scrollWidth - el.clientWidth), behavior: 'smooth' });
  };

  return (
    <section id={id} className="jb-section jb-band jb-story" aria-roledescription="carousel" aria-label={title}>
      <div className="jb-wrap">
        <div className="jb-story__head">
          <div className="jb-sechead__text">
            {eyebrow && <span className="jb-eyebrow">{eyebrow}</span>}
            <h2 className="jb-h2">{title}</h2>
            {lede && <p className="jb-lede" style={{ marginTop: 12 }}>{lede}</p>}
          </div>
          <div className="jb-story__nav">
            <span className="jb-story__count" aria-live="polite">
              {index + 1} / {slides.length}
            </span>
            <button
              type="button"
              className="jb-story__arrow"
              onClick={() => go(index - 1)}
              disabled={index === 0}
              aria-label="Previous step"
            >
              <ChevronLeftIcon size={18} />
            </button>
            <button
              type="button"
              className="jb-story__arrow"
              onClick={() => go(index + 1)}
              disabled={index === slides.length - 1}
              aria-label="Next step"
            >
              <ChevronRightIcon size={18} />
            </button>
          </div>
        </div>

        <ol ref={track} className="jb-story__track">
          {slides.map((s, i) => (
            <li
              key={s.src}
              className="jb-story__slide"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${slides.length}: ${s.title}`}
            >
              <figure>
                <div className="jb-story__frame">
                  <img
                    src={s.src}
                    width={s.width}
                    height={s.height}
                    alt={s.alt}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                    sizes="(min-width: 1024px) 860px, 88vw"
                  />
                </div>
                <figcaption className="jb-story__cap">
                  <div className="jb-story__step">
                    {String(i + 1).padStart(2, '0')} · {s.step}
                  </div>
                  <h3 className="jb-story__title">{s.title}</h3>
                  <p className="jb-story__text">{s.text}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ol>

        <div className="jb-story__dots" aria-hidden="true">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              tabIndex={-1}
              className={`jb-story__dot${i === index ? ' jb-story__dot--on' : ''}`}
              onClick={() => go(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
