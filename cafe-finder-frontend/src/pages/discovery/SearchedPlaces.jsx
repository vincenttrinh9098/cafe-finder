import { Link } from 'react-router';
import styles from './SearchedPlaces.module.css'
import storeTestImg from './store-test.png';
import { useEffect, useState } from 'react';
import { getPlaceAttributes } from '../../api/placesApi.js';

export function SearchedPlaces({ places, query, searchResults }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!places || places.length === 0) return;

    const fetchAttributes = async () => {
      try {
        const withAttributes = await Promise.all(
          places.map(async (place) => {  
            const attributes = await getPlaceAttributes(place.google_place_id);
            return { ...place, attributes };
          })
        );
        setStores(withAttributes);
      } catch (err) {
        console.error("Failed to fetch attributes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAttributes();
  }, [places]); // ← re-run when places changes

  const displayPlaces = stores.length > 0 ? stores : places;
  if (loading) return <p>Loading searched places...</p>;

  return (
    <div className={styles.searchedRatedContainer}>
      {displayPlaces.map(place => (
        <Link
          key={place.google_place_id}
          to={`/place/${place.google_place_id}`}
          state={{ place, searchQuery: query, searchResults: searchResults }}
          className={styles.cardLink}
          onClick={() => sessionStorage.setItem("discoveryScroll", window.scrollY)}
        >
          <div className={styles.searchedRatedCard}>

            <div className={styles.searchedRatedCardImageWrapper}>
              {place.photo_reference ? (
                <img
                  src={`http://localhost:3000/api/places/photo?ref=${place.photo_reference}`}
                  alt={place.name}
                  className={styles.searchedRatedCardImage}
                />
              ) : (
                <img src={storeTestImg} alt="store" className={styles.searchedRatedCardImage} />
              )}
            </div>

            <div className={styles.searchedRatedCardContent}>
              <div className={styles.searchedRatedCardTop}>
                <div className={styles.searchedRatedCardLeft}>
                  <h2>{place.name.length > 13 ? place.name.slice(0, 13) + ".." : place.name}</h2>
                  {place.distance != null && (
                    <p className = {styles.distance}>{place.distance?.toFixed(1)} mi</p>
                  )}
                </div>
                <div className={styles.searchedRatedCardRight}>
                  <p>⭐ {place.rating}</p>
                </div>
              </div>

              <div className={styles.searchedRatedAttributeRow}>
                {place.attributes?.filter(attr => typeof attr !== "number").length > 0 ? (
                  place.attributes
                    .filter(attr => typeof attr !== "number")
                    .map((attr) => (
                      <span key={attr} className={styles.searchedAttributeChip}>
                        {attr}
                      </span>
                    ))
                ) : (
                  <span className={styles.searchedAttributeChip}>No reviews yet</span>
                )}
              </div>
            </div>

          </div>
        </Link>
      ))}
    </div>
  );
}