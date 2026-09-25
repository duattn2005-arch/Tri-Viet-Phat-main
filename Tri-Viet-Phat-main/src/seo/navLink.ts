import type React from 'react';
import { routePath, type Route } from './routes';

/**
 * Props for an in-app <a>: a real href that crawlers can follow and that opens in a new tab on
 * Ctrl/Cmd/middle click, while a plain click navigates inside the app without a page reload.
 */
export function navLink(route: Route, go: () => void) {
  return {
    href: routePath(route),
    onClick: (e: React.MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      go();
    },
  };
}
