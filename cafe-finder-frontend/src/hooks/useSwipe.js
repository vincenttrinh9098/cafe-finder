import { useRef } from 'react';

export function useSwipe(onSwipeLeft, onSwipeRight, threshold = 50) {
  const touchStartX = useRef(null);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchMove = (e) => {
    e.stopPropagation();
  };

  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) < threshold) return;
    if (diff > 0) onSwipeLeft?.();
    else onSwipeRight?.();
    touchStartX.current = null;
  };

  return { onTouchStart, onTouchMove, onTouchEnd };
}