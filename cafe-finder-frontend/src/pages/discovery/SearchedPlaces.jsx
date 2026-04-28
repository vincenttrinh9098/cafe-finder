import { Link } from 'react-router';
import styles from './SearchedPlaces.module.css'
import storeTestImg from './store-test.png';

export function SearchedPlaces({ places }){

  console.log("places:", places);

    return(

      <div className={styles.searchedRatedContainer}>
        {places.map(place => (

            <Link
              key={place.google_place_id}
          
              //to={`/place/${store.name}`}   // dynamic route
              to={'/place'}
              state={{ place }} 
              className={styles.cardLink}   // remove default link styles
            >
          <div className={styles.searchedRatedCard}>

            {/* LEFT: image */}
              <div className={styles.searchedRatedCardImageWrapper}>
                {place.photo_reference ? (
                  <img
                    src={`http://localhost:3000/api/places/photo?ref=${place.photo_reference}`}
                    alt={place.name}
                    className={styles.searchedRatedCardImage}
                  />
                ) : (
                  <img
                  src={storeTestImg}
                  alt={"null"}
                  className={styles.searchedRatedCardImage}
                  />
                )}
              </div>

            {/* RIGHT: content */}
            <div className={styles.searchedRatedCardContent}>

              <div className={styles.searchedRatedCardTop}>
                <div className={styles.searchedRatedCardLeft}>
                  {place.name.length > 20 ? (
                    <h2>{place.name.slice(0,20) + ".."}</h2>
                  )
                  :
                  (
                    <h2>{place.name}</h2>
                  )}

                  {/* <p>📍 {place.distance}</p>*/}
                </div>

                <div className={styles.searchedRatedCardRight}>
                  <p>⭐ {place.rating}</p>
                </div>
              </div>

             {/* <div className={styles.searchedRatedAttributeRow}>
                {place.attributes.map((attr) => (
                  <span key={attr} className={styles.searchedAttributeChip}>
                    {attr}
                  </span>
                ))}
              </div>*/} 

            </div>

          </div>
        </Link>
        ))}
      </div>

    );
}