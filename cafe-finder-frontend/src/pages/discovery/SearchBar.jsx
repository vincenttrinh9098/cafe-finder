import { useState } from 'react';
import styles from './SearchBar.module.css';
import { searchPlaces } from '../../api/placesApi.js';

import {FilterPopUp} from './search-bar/FilterPopUp.jsx';

export function SearchBar({ setResults, setSort, sort, setQuery, setNextPageToken, activeSuggestion, setActiveSuggestion,onHome}) {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const suggestions = ["All", "Coffee", "Tea", "Bakery", "Matcha", "Library"];


  const handleSelect = (item) => {
    if (item === "All") {
    onHome();
    setActiveSuggestion("All");
    return;
  }
    setSearch(item);
    setActiveSuggestion(item);
    handleSearch(item);
    
  };
  const handleSearch = async (query) => {
    const searchQuery = query || search;
    if (!searchQuery.trim()) return;

    setQuery(searchQuery);
    setLoading(true);
    try {
      const { places, nextPageToken: newToken } = await searchPlaces(searchQuery); 
      setResults(places);
      setNextPageToken(newToken); 
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  //console.log("render activeSuggestion:", activeSuggestion);
  return (
    <div className={styles.header}>
      <div className={styles.searchWrapper}>
          <div className={styles.inputContainer}>

            <i className={`fa-solid fa-bars ${styles.icon}`}
            onClick={() => setShowModal(true)}
            />
          {showModal && (
            <FilterPopUp
              sort={sort}
              setSort={setSort}
              onClose={() => setShowModal(false)}
            />
          )}
            <input
              className={styles.searchBar}
              value={search}
              onChange={(e) => {setSearch(e.target.value); setActiveSuggestion("");}}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search cafes, tea spots, bakeries..."
            />
              <button onClick={handleSearch} disabled={loading}>
                {loading ? "Searching..." : ""}
              </button>
            </div>
      
        <div className={styles.searchSuggestions}>
          {suggestions.map((item) => (
            <div
              key={item}
              className={`${styles.suggestionItem} ${activeSuggestion === item ? styles.suggestionItemActive : ""}`}
              onClick={() => handleSelect(item)}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}