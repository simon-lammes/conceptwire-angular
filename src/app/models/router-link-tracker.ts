import { signal } from '@angular/core';

/**
 * Wraps all functionality for tracking which router link is active.
 * The reason this exists is that Angular gives us the routerLinkActive directive
 * which can only be used for adding (CSS) classes to HTML elements. Sometimes,
 * however, we want to know programmatically whether a link is active.
 * This class gives us the tools to track the active link programmatically.
 */
export class RouterLinkTracker {
  /**
   * The class that "routerLinkActive" should add to the element if active,
   * so that we can then recognize this change. We will see that the
   * element has this class and then we know that this route is active.
   */
  readonly routerLinkActiveClass = 'my-router-link-active-signal';

  /**
   * Signal that tracks the currently active route.
   */
  readonly activeLink = signal('');
}
