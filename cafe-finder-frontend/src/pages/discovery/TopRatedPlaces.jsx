import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import styles from './TopRatedPlaces.module.css';
import noImageFound from '../../assets/images/noImageFound.png';
import { getTopRatedPlaces, getPlaceAttributes } from '../../api/placesApi.js';
import { getDistance } from '../../utils/distance.js';
import {
  BookOpenText,
  Star,
  VolumeX,
  Volume1,
  Volume2,
  User,
  Users,
  Armchair,
  Plug,
  PlugZap,
  Car,
} from 'lucide-react';

function getAttributeIcon(attr) {
  const a = attr.toLowerCase();
  if (a.includes('quiet') || a.includes('noise') || a.includes('loud')) {
    if (a.includes('very quiet') || a.includes('quiet')) return VolumeX;
    if (a.includes('loud')) return Volume2;
    return Volume1;
  }
  if (a.includes('empty') || a.includes('busy') || a.includes('traffic')) return User;
  if (a.includes('seat')) return Armchair;
  if (a.includes('outlet')) return a.includes('no') || a.includes('limited') ? Plug : PlugZap;
  if (a.includes('parking')) return Car;
  return Users;
}

export function TopRatedPlaces({ userLocation }) {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLocation) return;
    const cached = sessionStorage.getItem("topRatedPlaces");
    if (cached) {
      setStores(JSON.parse(cached));
      setLoading(false);
      return; // 
    }
    const fetchTopRated = async () => {
      try {
        const places = await getTopRatedPlaces(userLocation?.lat, userLocation?.lng);
        const top = places.slice(0, 10).map(place => ({
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

  if (loading) return <div className={styles.loadingContainer}>
    <p className={styles.loadingText}>Finding top rated places near you...</p>
  </div>;


  return (
    <div className={styles.topRatedSection}>
      <div className={styles.topRatedHeader}>
        <h2>Top Rated</h2>
      </div>

      <div className={styles.topRatedContainer}>
        {stores.map((place) => {
          const studyScore = typeof place.attributes?.[5] === 'number' ? place.attributes[5] : null;
          const pillAttrs = place.attributes?.filter(attr => typeof attr !== "number") ?? [];

          return (
            <Link
              key={place.google_place_id}
              to={`/place/${place.google_place_id}`}
              state={{ place: place }}
              className={styles.cardLink}
              onClick={() => sessionStorage.setItem("discoveryScroll", window.scrollY)}
            >
              <div className={styles.topRatedCard}>
                <div className={styles.topRatedCardImageWrapper}>
                  {place.photo_reference ? (
                    <img
                      src={`${import.meta.env.VITE_API_BASE_URL}/api/places/photo?ref=${place.photo_reference}`}
                      alt={place.name}
                      className={styles.topRatedCardImage}
                    />
                  ) : (
                    <img src={noImageFound} alt={place.name} className={styles.topRatedCardImage} />
                  )}
                </div>

                <div className={styles.topRatedCardContent}>

                  <div className={styles.topRatedCardTop}>
                    <h2>{place.name.length > 18 ? place.name.slice(0, 18) + ".." : place.name}</h2>
                    {place.distance != null && (
                      <div className={styles.distanceRow}>
                        <span>{place.distance.toFixed(1)} mi</span>
                      </div>
                    )}
                  </div>

                  <div className={styles.statsRow}>
                    <div className={styles.statBlock}>
                      <div className={styles.statTop}>
                        <Star size={16} fill="#F6A623" strokeWidth={1} color="#000000" />
                        <span className={styles.statValue}>{place.rating ?? "—"}<span className={styles.statOutOf}>/5</span></span>
                      </div>
                      <p className={styles.statLabel}>Google Rating</p>
                    </div>

                    <div className={styles.statDivider} />

                    <div className={styles.statBlock}>
                      <div className={styles.statTop}>
                        <BookOpenText size={16} stroke="#000000" fill="#e8f7f7" strokeWidth={1} />
                        <span className={styles.statValueLarge}>{studyScore ?? "N/A"}{studyScore != null && <span className={styles.statOutOf}>/5</span>}</span>
                      </div>
                      <p className={styles.statLabel}>Study Score</p>
                    </div>
                  </div>

                  <div className={styles.cardDivider} />

                  <div className={styles.topRatedAttributeRow}>
                    {pillAttrs.length > 0 ? (
                      pillAttrs.map((attr) => {
                        const Icon = getAttributeIcon(attr);
                        return (
                          <span key={attr} className={styles.topRatedAttributeChip}>
                            <Icon size={13} strokeWidth={2} />
                            {attr}
                          </span>
                        );
                      })
                    ) : (
                      <span className={styles.topRatedAttributeChip}>No reviews yet</span>
                    )}
                  </div>

                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}