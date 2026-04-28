import { Link } from 'react-router';
import styles from './TopRatedPlaces.module.css'
import storeTestImg from './store-test.png';


export function TopRatedPlaces(){
  const store1 = {
    id:1,
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
    id:2,
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


  const stores = [store1, store2]// store1, store2, store1];


    //{/* Discovery page top rated container */}
    return(
      <div className={styles.topRatedContainer}>
        
        {stores.map((store) => (
            <Link
              key={store.id}
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

    );
}