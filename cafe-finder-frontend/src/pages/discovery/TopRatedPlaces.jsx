import { Link } from 'react-router';
import { useState, useEffect} from 'react';
import styles from './TopRatedPlaces.module.css';
import storeTestImg from './store-test.png';
import { getTopRatedPlaces, getPlaceAttributes } from '../../api/placesApi.js';
import { getDistance } from '../../utils/distance.js';

export function TopRatedPlaces({userLocation}) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchTopRated = async () => {
      try {
        const places = await getTopRatedPlaces();
        const top = places.slice(0, 5).map(place => ({
          ...place,
          distance: userLocation 
            ? getDistance(userLocation.lat, userLocation.lng, place.lat, place.lng)
            : null
        }));

        const withAttributes = await Promise.all(
          top.map(async (place) => {
            const attributes = await getPlaceAttributes(place.google_place_id);
            return { ...place, attributes };
          })
        );

        setStores(withAttributes);
      } catch (err) {
        console.error("Failed to fetch top rated:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopRated();
  }, [userLocation]);



  if (loading) return <p>Loading top rated...</p>;


  return (
    <div className={styles.topRatedSection}>
      <div className={styles.topRatedHeader}>
        <h2>Top Rated</h2>
      </div>

      <div className={styles.topRatedContainer}>
        {stores.map((store) => (
          <Link
            key={store.google_place_id}
            to="/place"
            state={{ place: store }}
            className={styles.cardLink}
          >
            <div className={styles.topRatedCard}>
              <div className={styles.topRatedCardImageWrapper}>
                {store.photo_reference ? (
                  <img
                    src={`http://localhost:3000/api/places/photo?ref=${store.photo_reference}`}
                    alt={store.name}
                    className={styles.topRatedCardImage}
                  />
                ) : (
                  <img src={storeTestImg} alt={store.name} className={styles.topRatedCardImage} />
                )}
              </div>

              <div className={styles.topRatedCardContent}>

                <div className={styles.topRatedCardTop}>
                  <div className={styles.topRatedCardLeft}>
                    <h2>{store.name.length > 15 ? store.name.slice(0, 15) + ".." : store.name}</h2>
                  </div>

                  <div className={styles.topRatedCardRight}>
                    <p>⭐ {store.rating}</p>
                  </div>
                </div>

                <div className={styles.topRatedAttributeRow}>
                  {store.attributes?.filter(attr => typeof attr !== "number").length > 0 ? (
                    store.attributes
                      .filter(attr => typeof attr !== "number")
                      .map((attr) => (
                        <span key={attr} className={styles.topRatedAttributeChip}>
                          {attr}
                        </span>
                      ))
                  ) 
                  :(
                    <span className={styles.topRatedAttributeChip}>No reviews yet</span>
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