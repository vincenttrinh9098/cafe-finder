import { useState } from 'react';
import styles from './SearchBar.module.css'

export function SearchBar(){
  const [search, setSearch] = useState('');

  const suggestion = [
    "Coffee",
    "Tea",
    "Bakery",
    "Matcha",
    "Library",
  ];

    const handleSelect = (item) => {
    setSearch(item);
  };

    return(
    
      <div className={styles.header}>
        {/* Discovery page search bar */}

        <div className={styles.searchWrapper}>
          <input
            className={styles.searchBar}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cafes, tea spots, bakeries..."
          />
          {/*Discovery page search suggestion */}
          <div className={styles.searchSuggestions}>
            {suggestion.map((item) => (
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