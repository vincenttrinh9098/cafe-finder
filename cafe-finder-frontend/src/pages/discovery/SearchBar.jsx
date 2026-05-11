import { useState } from 'react';
import styles from './SearchBar.module.css';
import { searchPlaces } from '../../api/placesApi.js';

import {FilterPopUp} from './search-bar/FilterPopUp.jsx';

export function SearchBar({ setResults, setSort, sort, setQuery, setNextPageToken })  {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const suggestions = ["Coffee", "Tea", "Bakery", "Matcha", "Library"];

  const handleSelect = (item) => {
    setSearch(item);
    handleSearch(item);
    
  };
  const handleSearch = async (query) => {
    const searchQuery = query || search;
    if (!searchQuery.trim()) return;

    setQuery(searchQuery);
    setLoading(true);
    try {
      const { places, nextPageToken: newToken } = await searchPlaces(searchQuery); // ← destructure
      setResults(places);
      setNextPageToken(newToken); // ← use the new token from the response
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
              onChange={(e) => setSearch(e.target.value)}
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
              className={styles.suggestionItem}
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