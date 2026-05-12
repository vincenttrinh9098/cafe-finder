import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import styles from './PlaceMap.module.css';

const containerStyle = { width: "100%", height: "220px" };
const LIBRARIES = []; // ← must be outside component

export function PlaceMap({ place }) {

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const center = { lat: place?.lat, lng: place?.lng };

  if (!place?.lat || !place?.lng) return <p>Location not available</p>;
  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div>
      <div className={styles.dynamicMap}>
        <div className={styles.mapSectionImageWrapper}>
          <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={15}>
            <Marker position={center} />
          </GoogleMap>
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