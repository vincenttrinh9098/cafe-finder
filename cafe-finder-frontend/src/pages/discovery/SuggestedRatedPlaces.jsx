import { Link } from 'react-router';
import styles from './SuggestedRatedPlaces.module.css'
import storeTestImg from './store-test.png';
import { getNearbyPlaces, getPlaceAttributes } from '../../api/placesApi.js';
import { useState, useEffect, useRef } from 'react';
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

        const limited = places.slice(0, 15);

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
        {stores.map((place) => {
          const studyScore = typeof place.attributes?.[5] === 'number' ? place.attributes[5] : null;
          const pillAttrs = place.attributes?.filter(attr => typeof attr !== "number") ?? [];

          return (
            <Link
              key={place.google_place_id}
              to={`/place/${place.google_place_id}`}
              state={{ place }}
              className={styles.cardLink}
            >
              <div className={styles.suggestionRatedCard}>

                <div className={styles.suggestionRatedCardImageWrapper}>
                  {place.photo_reference ? (
                    <img
                      src={`http://localhost:3000/api/places/photo?ref=${place.photo_reference}`}
                      alt={place.name}
                      className={styles.suggestionRatedCardImage}
                    />
                  ) : (
                    <img
                      src={storeTestImg}
                      alt={place.name}
                      className={styles.suggestionRatedCardImage}
                    />
                  )}
                </div>

                <div className={styles.suggestionRatedCardContent}>

                  <div className={styles.suggestionRatedCardTop}>
                    <h2>{place.name.length > 18 ? place.name.slice(0, 18) + ".." : place.name}</h2>
                    {place.distance != null && (
                      <div className={styles.distanceBlock}>
                        <div className={styles.distanceRow}>
                          <span>{place.distance.toFixed(1)} mi</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className={styles.statsRow}>

                    <div className={styles.statBlock}>
                      <div className={styles.statTop}>
                        <Star size={18} fill="#F6A623" strokeWidth={1} color="#000000" />
                        <span className={styles.statValue}>{place.rating ?? "—"}<span className={styles.statOutOf}>/5</span></span>
                      </div>
                      <p className={styles.statLabel}>Google Rating</p>
                    </div>

                    <div className={styles.statDivider} />

                    <div className={styles.statBlock}>
                      <div className={styles.statTop}>
                        <BookOpenText size={18} stroke="#000000" fill="#e8f7f7" strokeWidth={1} />
                        <span className={styles.statValueLarge}>{studyScore ?? "N/A"}{studyScore != null && <span className={styles.statOutOf}>/5</span>}</span>
                      </div>
                      <p className={styles.statLabel}>Study Score</p>
                    </div>

                  </div>

                  <div className={styles.cardDivider} />

                  <div className={styles.suggestionRatedAttributeRow}>
                    {pillAttrs.length > 0 ? (
                      pillAttrs.map((attr) => {
                        const Icon = getAttributeIcon(attr);
                        return (
                          <span key={attr} className={styles.suggestionAttributeChip}>
                            <Icon size={15} strokeWidth={2} />
                            {attr}
                          </span>
                        );
                      })
                    ) : (
                      <span className={styles.suggestionAttributeChip}>No reviews yet</span>
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