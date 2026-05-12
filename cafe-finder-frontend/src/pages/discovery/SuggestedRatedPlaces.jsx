import { Link } from 'react-router';
import styles from './SuggestedRatedPlaces.module.css'
import storeTestImg from './store-test.png';
import { getNearbyPlaces, getPlaceAttributes } from '../../api/placesApi.js';
import { useState, useEffect,useRef } from 'react';
import { getDistance } from '../../utils/distance.js';

export function SuggestedRatedPlaces({ userLocation }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

const hasFetched = useRef(false);

useEffect(() => {
  if (!userLocation || hasFetched.current) return;
  hasFetched.current = true;

  const fetchNearby = async () => {
    try {
      const { places } = await getNearbyPlaces(userLocation.lat, userLocation.lng);
      
      // limit to 20 places before fetching attributes
      const limited = places.slice(0, 10);
      
      const withAttributes = await Promise.all(
        limited.map(async (place) => {
          const attributes = await getPlaceAttributes(place.google_place_id);
          return { 
            ...place, 
            distance: getDistance(userLocation.lat, userLocation.lng, place.lat, place.lng),
            attributes 
          };
        })
      );
      setStores(withAttributes);
    } catch (err) {
      console.error("Failed to fetch nearby:", err);
    } finally {
      setLoading(false);
    }
  };
  fetchNearby();
  }, [userLocation]);


  if (loading) return <p>Loading nearby places...</p>;
  if (stores.length === 0) return <p>No nearby places found.</p>;

  return (
    <div className={styles.suggestionRatedSection}>
      <div className={styles.suggestionRatedHeader}>
        <h2>Nearby</h2>
      </div>

      <div className={styles.suggestionRatedContainer}>
        {stores.map((store) => (
          <Link
            key={store.google_place_id}
            to={'/place'}
            state={{ place: store }}
            className={styles.cardLink}
          >
            <div className={styles.suggestionRatedCard}>

              {/* LEFT: image */}
              <div className={styles.suggestionRatedCardImageWrapper}>
                {store.photo_reference ? (
                  <img
                    src={`http://localhost:3000/api/places/photo?ref=${store.photo_reference}`}
                    alt={store.name}
                    className={styles.suggestionRatedCardImage}
                  />
                ) : (
                  <img
                    src={storeTestImg}
                    alt={store.name}
                    className={styles.suggestionRatedCardImage}
                  />
                )}
              </div>

              {/* RIGHT: content */}
              <div className={styles.suggestionRatedCardContent}>
                <div className={styles.suggestionRatedCardTop}>
                  <div className={styles.suggestionRatedCardLeft}>
                    <h2>{store.name.length > 13 ? store.name.slice(0, 13) + ".." : store.name}</h2>
                    
                    {store.distance != null && (
                      <p className = {styles.distance}>{store.distance.toFixed(1)} mi</p>
                    )}
                  </div>
                  <div className={styles.suggestionRatedCardRight}>
                    <p>⭐ {store.rating}</p>
                  </div>
                </div>

                <div className={styles.suggestionRatedAttributeRow}>
                  {store.attributes?.length > 0 ? (
                    store.attributes.map((attr) => (
                      <span key={attr} className={styles.suggestionAttributeChip}>
                        {attr}
                      </span>
                    ))
                  ) : (
                    <span className={styles.suggestionAttributeChip}>No reviews yet</span>
                  )}
                </div>

              </div>

            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}