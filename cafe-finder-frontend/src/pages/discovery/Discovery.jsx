import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'
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
  const location = useLocation();
  const navigate = useNavigate();
  const [nearbyLoaded, setNearbyLoaded] = useState(false);

  const [results, setResults] = useState(() => {
    try {
      const saved = sessionStorage.getItem("searchResults");
      if (saved) return JSON.parse(saved); // ← prioritize sessionStorage
      if (state?.searchResults) return state.searchResults;
      return [];
    } catch {
      return [];
    }
  });

  const [query, setQuery] = useState(() => {
    return sessionStorage.getItem("searchQuery")
      ?? state?.searchQuery
      ?? "";
  });

  const [sort, setSort] = useState(() => {
    return sessionStorage.getItem("sort") ?? "rating";
  });

  useEffect(() => {
    sessionStorage.setItem("sort", sort);
  }, [sort]);

  const [userLocation, setUserLocation] = useState(null);
  const [enrichedResults, setEnrichedResults] = useState([]);

  // Update the enrichedResults useEffect:
  useEffect(() => {
    if (!results || results.length === 0) {
      setEnrichedResults([]);
      return;
    }

    try {
      const cached = sessionStorage.getItem("enrichedResults");
      const cachedQuery = sessionStorage.getItem("searchQuery");
      if (cached && cachedQuery === query) {
        setEnrichedResults(JSON.parse(cached));
        return;
      }
    } catch { }

    const fetchAttributes = async () => {
      const withAttributes = await Promise.all(
        results.map(async (place) => {
          const attributes = await getPlaceAttributes(place.google_place_id);
          return { ...place, attributes };
        })
      );
      setEnrichedResults(withAttributes);
      // cache enriched results
      sessionStorage.setItem("enrichedResults", JSON.stringify(withAttributes));
    };
    fetchAttributes();
  }, [results]);

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
    if (!enrichedResults || !Array.isArray(enrichedResults)) return [];
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
    if (!savedScroll || sortedResults.length === 0) return;

    const targetScroll = parseInt(savedScroll);

    // keep trying until page is tall enough to scroll there
    const attemptScroll = (attempts = 0) => {
      if (attempts > 20) {
        sessionStorage.removeItem("discoveryScroll");
        return;
      }

      if (document.body.offsetHeight >= targetScroll) {
        window.scrollTo(0, targetScroll);
        sessionStorage.removeItem("discoveryScroll");
      } else {
        setTimeout(() => attemptScroll(attempts + 1), 200);
      }
    };

    attemptScroll();
  }, [sortedResults]);

  const [nextPageToken, setNextPageToken] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMore = async () => {
    if (!nextPageToken || loadingMore) return;
    setLoadingMore(true);
    try {
      await new Promise(r => setTimeout(r, 2000));
      const { places, nextPageToken: newToken } = await searchPlaces(query, nextPageToken);
      setResults(prev => [...prev, ...places]);
      setNextPageToken(newToken);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
      if (nearBottom) loadMore();
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [nextPageToken, loadingMore]);

  const [activeSuggestion, setActiveSuggestion] = useState(
    sessionStorage.getItem("activeSuggestion") ?? "All"
  );

  useEffect(() => {
    sessionStorage.setItem("activeSuggestion", activeSuggestion);
  }, [activeSuggestion]);


  useEffect(() => {
  if (sortedResults.length > 0) return;
  const savedScroll = sessionStorage.getItem("discoveryScroll");
  if (!savedScroll || !nearbyLoaded) return;

  const targetScroll = parseInt(savedScroll);
  const attemptScroll = (attempts = 0) => {
    if (attempts > 20) {
      sessionStorage.removeItem("discoveryScroll");
      return;
    }
    if (document.body.offsetHeight >= targetScroll) {
      window.scrollTo(0, targetScroll);
      sessionStorage.removeItem("discoveryScroll");
    } else {
      setTimeout(() => attemptScroll(attempts + 1), 150);
    }
  };
  attemptScroll();
}, [nearbyLoaded]);

  const handleHome = () => {
    sessionStorage.removeItem("searchResults");
    sessionStorage.removeItem("searchQuery");
    sessionStorage.removeItem("enrichedResults");
    sessionStorage.removeItem("activeSuggestion");
    sessionStorage.removeItem("lastNonProfileRoute");
    setResults([]);
    setQuery("");
    setEnrichedResults([]);
    setActiveSuggestion("All");
    setNextPageToken(null);
    navigate('/', { replace: true });
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
      />
      {sortedResults.length > 0 ? (
        <>
          <SearchedPlaces places={sortedResults} query={query} searchResults={results} />
          {loadingMore && <p style={{ textAlign: "center", padding: "1rem" }}>Loading more...</p>}
        </>
      ) : (
        <>
          <TopRatedPlaces userLocation={userLocation} />
          <SuggestedRatedPlaces userLocation={userLocation} onLoaded={() => setNearbyLoaded(true)} />
        </>
      )}
      <NavBar />
    </div>
  );
}