import { useEffect, type RefObject } from 'react';

/**
 * Calls `onOutsideClick` on a mousedown outside every given ref's current
 * element. Pass multiple refs when the interactive content isn't all under
 * one container (e.g. a trigger button plus a portaled dropdown). Only
 * attaches the listener while `active` is true.
 */
export function useClickOutside(
  refs: RefObject<HTMLElement | null>[],
  onOutsideClick: () => void,
  active: boolean,
) {
  useEffect(() => {
    if (!active) return;
    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      const isInside = refs.some((ref) => ref.current?.contains(target));
      if (!isInside) onOutsideClick();
    }
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
    // `refs` is a fresh array literal from each caller every render; the ref
    // objects themselves are stable, and re-attaching this listener on every
    // render is harmless, so depending on the array would just add churn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, onOutsideClick]);
}
