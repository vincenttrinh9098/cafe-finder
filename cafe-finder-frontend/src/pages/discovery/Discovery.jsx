import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom'
import styles from './Discovery.module.css';
import { SearchBar } from './SearchBar.jsx'
import { TopRatedPlaces } from './TopRatedPlaces.jsx'
import { SuggestedRatedPlaces } from './SuggestedRatedPlaces.jsx'
import { SearchedPlaces } from './SearchedPlaces.jsx'
import { getDistance } from '../../utils/distance.js';
import { searchPlaces, getPlaceAttributes } from '../../api/placesApi.js';
import { NavBar } from '../navigation/NavBar.jsx'

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

  const [sort, setSort] = useState(() => {
    return sessionStorage.getItem("sort") ?? "rating";
  });

  useEffect(() => {
    sessionStorage.setItem("sort", sort);
  }, [sort]);



  const [userLocation, setUserLocation] = useState(null);
  const [enrichedResults, setEnrichedResults] = useState([]);


  useEffect(() => {
    if (!results || results.length === 0) {
      setEnrichedResults([]);
      return;
    }

    const fetchAttributes = async () => {
      const withAttributes = await Promise.all(
        results.map(async (place) => {
          const attributes = await getPlaceAttributes(place.google_place_id);
          return { ...place, attributes };
        })
      );
      setEnrichedResults(withAttributes);
    };

    fetchAttributes();
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
    if (!enrichedResults || !Array.isArray(enrichedResults)) return [];
    console.log(enrichedResults);
    return [...enrichedResults]
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
        if (sort === "studyscore") {
          const aScore = a.attributes?.[5] ?? -1;
          const bScore = b.attributes?.[5] ?? -1;
          return bScore - aScore;
        }
        return 0;
      });
  }, [enrichedResults, sort, userLocation]);



  useEffect(() => {
    const savedScroll = sessionStorage.getItem("discoveryScroll");
    if (savedScroll) {
      window.scrollTo(0, parseInt(savedScroll));
      sessionStorage.removeItem("discoveryScroll");
    }
  }, [sortedResults]);

  const [nextPageToken, setNextPageToken] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);


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
  }, [nextPageToken, loadingMore]); // re-register when these change


  const [activeSuggestion, setActiveSuggestion] = useState(
    sessionStorage.getItem("activeSuggestion") ?? "All"
  );

  useEffect(() => {
    sessionStorage.setItem("activeSuggestion", activeSuggestion);
  }, [activeSuggestion]);

  const handleHome = () => {
    sessionStorage.clear();
    setResults([]);
    setQuery("");
    setActiveSuggestion("");
    setNextPageToken(null);
  };

  return (
    <div className={styles.discoveryPage}>
      <SearchBar
        setResults={setResults}
        setSort={setSort}
        sort={sort}
        setQuery={setQuery}
        setNextPageToken={setNextPageToken}
        activeSuggestion={activeSuggestion}
        setActiveSuggestion={setActiveSuggestion}
        onHome={handleHome}
      />      {sortedResults.length > 0 ? (
        <>
          <SearchedPlaces places={sortedResults} query={query} searchResults={results} />
          {loadingMore && <p style={{ textAlign: "center", padding: "1rem" }}>Loading more...</p>}
        </>
      )
        : (
          <>
            <TopRatedPlaces userLocation={userLocation} />
            <SuggestedRatedPlaces userLocation={userLocation} />
          </>
        )}
      <NavBar />
    </div>
  );
}