import { Link } from 'react-router';
import { useState } from 'react';
import storeTestImg from './store-test.png';
import styles from './Discovery.module.css';

export function Discovery() {
  const [search, setSearch] = useState('');

  const suggestion = [
    "Coffee",
    "Tea",
    "Bakery",
    "Matcha",
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

  const store2 = {
    name: "Greem Tea",
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

  const stores = [store1, store2, store1, store2, store1];

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

      {/* Discovery page top rated container */}
      <div className={styles.topRatedContainer}>
        {stores.map((store) => (
            <Link
              key={store.name}
              //to={`/place/${store.name}`}   // dynamic route
              to={'/place'}
              className={styles.cardLink}   // remove default link styles
            >
            <div className={styles.topRatedCard}>
            {/* Top half: image */}
            <div className={styles.topRatedCardImageWrapper}>
              <img
                src={store.image}
                alt={store.name}
                className={styles.topRatedCardImage}
              />
            </div>

            {/* Bottom half: info */}
            <div className={styles.topRatedCardContent}>

              {/* Top row */}
              <div className={styles.topRatedCardTop}>
                <div className={styles.topRatedCardLeft}>
                  <h2>{store.name}</h2>
                  <p>📍 {store.distance}</p>
                </div>

                <div className={styles.topRatedCardRight}>
                  <p>⭐ {store.rating}</p>
                </div>
              </div>

              {/* Attributes row */}
              <div className={styles.topRatedAttributeRow}>
                {store.attributes.map((attr) => (
                  <span key={attr} className={styles.topRatedAttributeChip}>
                    {attr}
                  </span>
                ))}
              </div>

            </div>


          </div>
          </Link>
        ))}
      </div>

      <div className={styles.suggestionRatedContainer}>
        {stores.map((store) => (
          <div className={styles.suggestionRatedCard}>

            {/* LEFT: image */}
            <div className={styles.suggestionRatedCardImageWrapper}>
              <img
                src={store.image}
                alt={store.name}
                className={styles.suggestionRatedCardImage}
              />
            </div>

            {/* RIGHT: content */}
            <div className={styles.suggestionRatedCardContent}>

              <div className={styles.suggestionRatedCardTop}>
                <div className={styles.suggestionRatedCardLeft}>
                  <h2>{store.name}</h2>
                  <p>📍 {store.distance}</p>
                </div>

                <div className={styles.suggestionRatedCardRight}>
                  <p>⭐ {store.rating}</p>
                </div>
              </div>

              <div className={styles.suggestionRatedAttributeRow}>
                {store.attributes.map((attr) => (
                  <span key={attr} className={styles.suggestionAttributeChip}>
                    {attr}
                  </span>
                ))}
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}