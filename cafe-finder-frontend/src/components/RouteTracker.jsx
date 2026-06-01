import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';

export function RouteTracker() {
  const location = useLocation();

  useEffect(() => {
    // save any non-profile, non-login route as "last main route"
    const skip = ['/profile', '/login', '/saved'];
    if (!skip.some(path => location.pathname.startsWith(path))) {
      sessionStorage.setItem("lastMainRoute", location.pathname);
    }
  }, [location]);

  return null;
}