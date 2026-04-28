import { useState } from 'react';
import styles from './SearchBar.module.css';
import { searchPlaces } from '../../api/placesApi.js';

export function SearchBar({ onResults }) {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const suggestions = ["Coffee", "Tea", "Bakery", "Matcha", "Library"];

  const handleSelect = (item) => {
    setSearch(item);
    handleSearch(item);
  };

  const handleSearch = async (query) => {
    const searchQuery = query || search;

    if (!searchQuery.trim()) return;

    setLoading(true);
    try {
      const places = await searchPlaces(searchQuery);
      onResults(places);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.header}>
      <div className={styles.searchWrapper}>
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