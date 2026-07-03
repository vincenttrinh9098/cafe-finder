import { Link } from 'react-router';
import styles from './SearchedPlaces.module.css';
import storeTestImg from './store-test.png';
import { useEffect, useState } from 'react';
import { getPlaceAttributes } from '../../api/placesApi.js';
import {
  BookmarkPlus,
  BookOpenText,
  MapPin,
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
  }, [places]);

  const displayPlaces = stores.length > 0 ? stores : places;

  if (loading) return <p>Loading searched places...</p>;

  return (
    <div className={styles.searchedRatedContainer}>
      {displayPlaces.map(place => {
        const studyScore = typeof place.attributes?.[5] === 'number' ? place.attributes[5] : null;
        const pillAttrs = place.attributes?.filter(attr => typeof attr !== "number") ?? [];
        // distance bar: scale 0-10mi to 0-100% (closer = fuller), capped
        {/*const distancePct = place.distance != null
          ? Math.max(0, Math.min(100, 100 - (place.distance / 10) * 100))
          : 0; */}

        return (
          <Link
            key={place.google_place_id}
            to={`/place/${place.google_place_id}`}
            state={{ place, searchQuery: query, searchResults: searchResults }}
            className={styles.cardLink}
            onClick={() => {
              //console.log("saving scroll:", window.scrollY);

              sessionStorage.setItem("discoveryScroll", window.scrollY)
            }}
          >
            <div className={styles.searchedRatedCard}>

              <div className={styles.searchedRatedCardImageWrapper}>
                {place.photo_reference ? (
                  <img
                    src={`${import.meta.env.VITE_API_BASE_URL}/api/places/photo?ref=${place.photo_reference}`}
                    alt={place.name}
                    className={styles.searchedRatedCardImage}
                  />
                ) : (
                  <img src={storeTestImg} alt="store" className={styles.searchedRatedCardImage} />
                )}
              </div>

              <div className={styles.searchedRatedCardContent}>

                <div className={styles.searchedRatedCardTop}>
                  <h2>{place.name.length > 18 ? place.name.slice(0, 18) + ".." : place.name}</h2>
                  {place.distance != null && (
                    <div className={styles.distanceBlock}>
                      <div className={styles.distanceRow}>
                        <span>{place.distance.toFixed(1)} mi</span>
                      </div>
                    </div>
                  )}
                  {/*<BookmarkPlus className={styles.bookmarkIcon} strokeWidth={1.75} />*/}
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

                <div className={styles.searchedRatedAttributeRow}>
                  {pillAttrs.length > 0 ? (
                    pillAttrs.map((attr) => {
                      const Icon = getAttributeIcon(attr);
                      return (
                        <span key={attr} className={styles.searchedAttributeChip}>
                          <Icon size={15} strokeWidth={2} />
                          {attr}
                        </span>
                      );
                    })
                  ) : (
                    <span className={styles.searchedAttributeChip}>No reviews yet</span>
                  )}
                </div>

              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

// maps each attribute string to its icon
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
