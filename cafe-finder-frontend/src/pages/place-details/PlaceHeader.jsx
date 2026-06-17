import styles from './PlaceHeader.module.css'
import { getPlaceAttributes } from '../../api/placesApi.js';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react'


export function PlaceHeader( {place}) {

    const navigate = useNavigate();
    const [attributes, setAttributes] = useState({});
    const [loadingAttributes, setLoadingAttributes] = useState(true);

    useEffect(() => {
        if (!place?.google_place_id) return;
        const fetch = async () => {
        try {
            const data = await getPlaceAttributes(place.google_place_id);
            setAttributes(data);
        } catch (err) {
            console.error("Failed to fetch attributes:", err);
        } finally {
            setLoadingAttributes(false);
        }
        };
        fetch();
    }, [place?.google_place_id]);
  
    //const studyScore = place.attributes.find(attr => typeof attr === "number");
    //console.log(studyScore);

    if (!place) return <div>Loading...</div>;  

    //console.log(place.photo_reference);

    //console.log(place);
    console.log(place);

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
                    {loadingAttributes ? (
                    <p>Loading...</p>
                    ) : attributes.length === 0 ? (
                    <p>Study Scrore: No reviews yet</p>
                    ) : (
                    <p>Study Scrore: {attributes[5].toFixed(1)}</p>
                    )}
                    <p>Google: {place.rating} ⭐</p>
                    
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