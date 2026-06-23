import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useTrackLastRoute() {
  const location = useLocation();

  useEffect(() => {
    const path = location.pathname;
    // Save any route that isn't a profile page
    if (!path.startsWith('/profile')) {
      sessionStorage.setItem('lastNonProfileRoute', path);
    }
  }, [location.pathname]);
}