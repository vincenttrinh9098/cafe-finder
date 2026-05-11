import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom'
import styles from './Discovery.module.css';
import { SearchBar } from './SearchBar.jsx'
import { TopRatedPlaces } from './TopRatedPlaces.jsx'
import { SuggestedRatedPlaces } from './SuggestedRatedPlaces.jsx'
import { SearchedPlaces } from './SearchedPlaces.jsx'
import { getDistance } from '../../utils/distance.js';
import { searchPlaces } from '../../api/placesApi.js';

export function Discovery() {
  const { state } = useLocation();

  const [results, setResults] = useState(() => {
    if (state?.searchResults) return state.searchResults;
    try {
      const saved = sessionStorage.getItem("searchResults");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [query, setQuery] = useState(() => {
    if (state?.searchQuery) return state.searchQuery;
    return sessionStorage.getItem("searchQuery") ?? "";
  });

  const [sort, setSort] = useState("rating");
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    sessionStorage.setItem("searchResults", JSON.stringify(results));
  }, [results]);

  useEffect(() => {
    sessionStorage.setItem("searchQuery", query);
  }, [query]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => console.error(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);


  const sortedResults = useMemo(() => {
    if (!results || !Array.isArray(results)) return [];
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


    useEffect(() => {
    const savedScroll = sessionStorage.getItem("discoveryScroll");
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll));
      sessionStorage.removeItem("discoveryScroll");
    }
  }, [sortedResults]); 
  
const [nextPageToken, setNextPageToken] = useState(null);
const [loadingMore, setLoadingMore] = useState(false);

// update handleSearch in SearchBar to return the token
// and in Discovery, update setResults to also save the token:
// you'll need to lift this into Discovery directly

  const loadMore = async () => {
    if (!nextPageToken || loadingMore) return;
    setLoadingMore(true);
    try {
      await new Promise(r => setTimeout(r, 2000)); // Google requires delay
      const { places, nextPageToken: newToken } = await searchPlaces(query, nextPageToken);
      setResults(prev => [...prev, ...places]);
      setNextPageToken(newToken);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  // detect scroll to bottom
  useEffect(() => {
    const handleScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      if (nearBottom) loadMore();
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [nextPageToken, loadingMore]); // ← re-register when these change

  return (
    <div className={styles.discoveryPage}>
      <SearchBar setResults={setResults} setSort={setSort} sort={sort} setQuery={setQuery} setNextPageToken={setNextPageToken} />
      {sortedResults.length > 0 ? (
        <>
          <SearchedPlaces places={sortedResults} query={query} searchResults={results} />
          {loadingMore && <p style={{ textAlign: "center", padding: "1rem" }}>Loading more...</p>}
        </>
      ) : (
        <>
          <TopRatedPlaces />
          <SuggestedRatedPlaces />
        </>
      )}
    </div>
  );
}