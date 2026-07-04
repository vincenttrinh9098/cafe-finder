import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import styles from './PlaceMap.module.css';
import { useRef, useState, useEffect } from 'react';

const containerStyle = { width: "100%", height: "220px" };
const LIBRARIES = []; //  must be outside component

export function PlaceMap({ place }) {

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const mapContainerRef = useRef(null);
  const [containerReady, setContainerReady] = useState(false);
  const setRef = (node) => {
    if (node) {
      mapContainerRef.current = node;
      setContainerReady(true);
    }
  };

  const center = { lat: place?.lat, lng: place?.lng };

  if (!place?.lat || !place?.lng) return <p>Location not available</p>;
  if (!isLoaded) return <p>Loading map...</p>;
  console.log("isLoaded:", isLoaded);
  /*console.log("API key first 10:", import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.slice(0, 10));
  console.log("center:", center);
  console.log("containerReady:", containerReady);*/

  return (
    <div>
      <div className={styles.dynamicMap}>
        <div className={styles.mapSectionImageWrapper} ref={setRef}>
          {containerReady && ( //  only render map when container is in DOM
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={15}
            >
              <Marker position={center} />
            </GoogleMap>
          )}
        </div>

        <div className={styles.mapDistance}>
          {place.distance != null && (
            <p>📍 {place.distance.toFixed(1)} mi</p>
          )}
        </div>

        <div className={styles.mapAddress}>
          <p>
            Address:{" "}
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.address)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {place.address}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}