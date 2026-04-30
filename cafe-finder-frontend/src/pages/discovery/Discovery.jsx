import { useState, useEffect, useMemo } from 'react';
import styles from './Discovery.module.css';
import { SearchBar } from './SearchBar.jsx'
import { TopRatedPlaces } from './TopRatedPlaces.jsx'
import {SuggestedRatedPlaces} from './SuggestedRatedPlaces.jsx'
import {SearchedPlaces} from './SearchedPlaces.jsx'
import {getDistance} from '../../utils/distance.js';

export function Discovery() {
  const [results, setResults] = useState([]);
  const [sort, setSort] = useState("rating");
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("✅ location:", pos.coords.latitude, pos.coords.longitude);
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        console.error("❌ Location error code:", err.code, err.message);
      }
    );
  }, []);

  const sortedResults = useMemo(() => {
  return [...results]
    .map(place => {
      const distance = userLocation
        ? getDistance(userLocation.lat, userLocation.lng, place.lat, place.lng)
        : null;
      return { ...place, distance };
    })
    .sort((a, b) => {
      if (sort === "rating") return b.rating - a.rating;
      if (sort === "distance") {
        if (a.distance === null) return 1;
        if (b.distance === null) return -1;
        return a.distance - b.distance;
      }
      return 0;
    });
}, [results, sort, userLocation]);

  return (
    <div className={styles.discoveryPage}>
      <SearchBar setResults={setResults} setSort={setSort} sort={sort} />
      {sortedResults.length > 0 ? (
        <SearchedPlaces places={sortedResults} />
      ) : (
        <>
          <TopRatedPlaces />
          <SuggestedRatedPlaces />
        </>
      )}
    </div>
  );
}