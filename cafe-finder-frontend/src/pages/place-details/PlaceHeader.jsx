import styles from './PlaceHeader.module.css'

import { useNavigate } from "react-router-dom";

export function PlaceHeader( {place}) {
    const navigate = useNavigate();


    if (!place) return <div>Loading...</div>;  

    //console.log(place);

    return (
        <>

            <div key={place.name}>
            <div className={styles.imageSection}>
                <img
                    src={`http://localhost:3000/api/places/photo?ref=${place.photo_reference}`}
                    alt="Store"
                    className={styles.image}
                />
                <button className={styles.backButton} onClick={() => navigate("/")}>
                    Back
                </button>
            </div>

            <div className={styles.contentSection}>
                <div className={styles.topRowContentSection}>
                    <h2>{place.name}</h2>
                    <p>{place.rating} ⭐</p>
                </div>

                {/*<div className={styles.bottomRowAttributeRow}>
                    {place.attributes.map((attr) => (
                        <span key={attr} className={styles.bottomRowAttributeChip}>
                            {attr}
                        </span>
                    ))}
                </div>*/}
            </div>
        </div>
        </>

    );
}