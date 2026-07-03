import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useTrackLastRoute() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    const skip = ['/profile', '/login', '/auth', '/saved', '/place'];
    if (!skip.some(p => path.startsWith(p))) {
      sessionStorage.setItem('lastNonProfileRoute', path);
    }
  }, [location.pathname]);
}