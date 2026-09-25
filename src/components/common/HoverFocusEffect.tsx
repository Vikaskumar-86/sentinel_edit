import React, { useEffect } from 'react';

/**
 * Minimal interaction effect:
 * - No global blur/dim overlay
 * - No 3D tilt, glow, reticle, or spotlight
 * - Only a subtle scale on hover
 * - Native :active state provides a small click/press response
 */
export const HoverFocusEffect: React.FC = () => {
  useEffect(() => {
    const interactiveSelector = `
      button,
      a,
      input,
      select,
      textarea,
      [role="button"],
      [role="menuitem"],
      [role="tab"],
      .interactive-btn,
      .interactive-card,
      [data-cursor-label],
      [data-interactive],
      nav a,
      header button,
      aside button,
      .hover-focus-item
    `;

    const handleMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const interactiveEl = target?.closest(interactiveSelector) as HTMLElement | null;

      if (!interactiveEl || !document.body.contains(interactiveEl)) return;

      // Remove the effect from the previously hovered element.
      document
        .querySelectorAll('[data-hover-focused="true"]')
        .forEach((element) => {
          if (element !== interactiveEl) {
            element.removeAttribute('data-hover-focused');
          }
        });

      interactiveEl.setAttribute('data-hover-focused', 'true');
    };

    const handleMouseOut = (event: MouseEvent) => {
      const relatedTarget = event.relatedTarget as HTMLElement | null;
      const focusedElements = document.querySelectorAll('[data-hover-focused="true"]');

      focusedElements.forEach((element) => {
        const interactiveEl = element as HTMLElement;

        if (!relatedTarget || !interactiveEl.contains(relatedTarget)) {
          interactiveEl.removeAttribute('data-hover-focused');
        }
      });
    };

    window.addEventListener('mouseover', handleMouseOver, { passive: true });
    window.addEventListener('mouseout', handleMouseOut, { passive: true });

    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);

      document
        .querySelectorAll('[data-hover-focused="true"]')
        .forEach((element) => element.removeAttribute('data-hover-focused'));
    };
  }, []);

  // The interaction is handled through CSS so it stays smooth and lightweight.
  return null;
};
