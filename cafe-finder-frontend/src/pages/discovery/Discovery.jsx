import { Link } from 'react-router';
import { useState } from 'react';
import storeTestImg from './store-test.png';
import styles from './Discovery.module.css';

export function Discovery() {
  const [search, setSearch] = useState('');

  const suggestions = [
    "Coffee Shop",
    "Tea House",
    "Bakery",
    "Matcha Cafe",
    "Boba Spot"
  ];

  const store1 = {
    name: "Matcha House",
    image: storeTestImg,
    rating: 9.9,
    distance: "0.3mi",
    attributes: [
      "Low noise",
      "Low foot traffic",
      "Moderate seating capacity",
      "Parking lot"
    ]
  };

  const stores = [store1, store1, store1];

  const handleSelect = (item) => {
    setSearch(item);
  };

  return (
    <div className={styles.discoveryPage}>

      {/* Discovery page search bar */}
      <div className={styles.header}>
        <div className={styles.searchWrapper}>
          <input
            className={styles.searchBar}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cafes, tea spots, bakeries..."
          />

          {/*Discovery page search suggestions */}
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
      {/* Discovery page top rated container */}

      <div className={styles.topRatedContainer}>
        {stores.map((store) => (
          <div key={store.name} className={styles.topRatedCard}>

            {/* Top half: image */}
            <div className={styles.cardImageWrapper}>
              <img
                src={store.image}
                alt={store.name}
                className={styles.cardImage}
              />
            </div>

            {/* Bottom half: info */}
            <div className={styles.cardContent}>

              {/* Top row */}
              <div className={styles.cardTop}>
                <div className={styles.cardLeft}>
                  <h2>{store.name}</h2>
                  <p>📍 {store.distance}</p>
                </div>

                <div className={styles.cardRight}>
                  <p>⭐ {store.rating}</p>
                </div>
              </div>

              {/* Attributes row */}
              <div className={styles.attributeRow}>
                {store.attributes.map((attr) => (
                  <span key={attr} className={styles.attributeChip}>
                    {attr}
                  </span>
                ))}
              </div>

            </div>


          </div>
        ))}
      </div>

      {/* Discovery page suggestions container */}
      <div className={styles.suggestionsContainer}>
        <div className={styles.suggestionsCard}>

        </div>
      </div>

    </div>
  );
}