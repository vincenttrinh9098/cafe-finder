export function setLastPlaceRoute(path) {
  sessionStorage.setItem('lastPlaceRoute', path);
}

export function getLastPlaceRoute() {
  return sessionStorage.getItem('lastPlaceRoute') || '/places';
}