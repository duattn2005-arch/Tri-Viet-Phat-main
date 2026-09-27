import { useEffect } from 'react';

/** Elements that animate in when they scroll into view (styles in index.css). */
const REVEAL = '.reveal, .reveal-img, .reveal-text, .reveal-stagger';

/** Shared card/panel classes: on inner pages these fade up on their own, without per-screen markup. */
const AUTO_BLOCK = '.fx-card, .fx-panel, .card-3d, .card-3d-subtle';

/** Screens that animate themselves with motion components opt out with this attribute. */
const OPT_OUT = '[data-no-auto-reveal]';

/** Tag the cards, section headings and article images in <main> that have no reveal of their own. */
const autoTag = () => {
  const siblingIndex = new Map<Element, number>();
  document
    .querySelectorAll<HTMLElement>(`main ${AUTO_BLOCK}, main :is(h2, h3), main article.fx-panel img`)
    .forEach((el) => {
      // `closest` includes the element itself, so anything already tagged is skipped
      if (el.closest(OPT_OUT) || el.closest(REVEAL)) return;

      if (el.tagName === 'IMG') {
        el.classList.add('reveal-img');
      } else if (el.matches(AUTO_BLOCK)) {
        // Cards that share a parent (a grid) come in one after another
        const parent = el.parentElement;
        if (parent) {
          const i = siblingIndex.get(parent) ?? 0;
          siblingIndex.set(parent, i + 1);
          el.style.setProperty('--d', `${(i % 4) * 0.09}s`);
        }
        el.classList.add('reveal');
      } else if (!el.closest(AUTO_BLOCK)) {
        el.classList.add('reveal-text');
      }
    });
};

/**
 * Scroll-triggered entrance animations for the whole site. Content is only hidden once this
 * has run (the `js-reveal` class on <html>), so it stays visible without JavaScript and for
 * visitors who ask for reduced motion.
 */
export function useScrollReveal() {
  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const root = document.documentElement;
    root.classList.add('js-reveal');

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      },
      // Any part of the element inside the lower 92% of the screen, so very tall blocks still trigger
      { rootMargin: '0px 0px -8% 0px', threshold: 0 }
    );

    const scan = () => {
      autoTag();
      document.querySelectorAll(REVEAL).forEach((el) => {
        if (!el.classList.contains('is-in')) io.observe(el);
      });
    };
    scan();

    // Page changes, filters and "load more" add content: tag and watch it too (once per frame)
    let queued = false;
    const mo = new MutationObserver(() => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        scan();
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      root.classList.remove('js-reveal');
    };
  }, []);
}
