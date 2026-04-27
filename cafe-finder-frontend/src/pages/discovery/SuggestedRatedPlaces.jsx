import { Link } from 'react-router';
import styles from './SuggestedRatedPlaces.module.css'
import storeTestImg from './store-test.png';

export function SuggestedRatedPlaces(){

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

    return(

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

    );
}