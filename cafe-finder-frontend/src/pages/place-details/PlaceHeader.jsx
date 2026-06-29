import styles from './PlaceHeader.module.css'
import { getPlaceAttributes } from '../../api/placesApi.js';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react'
import {
    BookOpenText,
    Star,
    StarHalf,
} from "lucide-react";

export function PlaceHeader({ place }) {

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
                    </div>
                    <div className={styles.scoreRow}>

                        <div className={styles.studyCard}>
                            <div className={styles.scoreHeader}>
                                <div className={styles.scoreTitle}>
                                    <BookOpenText size={20} />
                                    <h3>STUDY SCORE</h3>
                                </div>
                            </div>

                            <div className={styles.scoreBottom}>
                                <div className={styles.stars}>
                                    <RatingStars rating={attributes[5]} />
                                </div>

                                <div className={styles.scoreNumber}>
                                    <span>{attributes[5]}/5</span> 
                                </div>
                            </div>
                        </div>

                        <div className={styles.googleCard}>
                            <div className={styles.scoreHeader}>
                                <div className={styles.scoreTitle}>
                                    <h1 className={styles.googleG}>G</h1>
                                    <h3>GOOGLE RATING</h3>
                                </div>

                                <Star fill="#F6A623" color="#000000" strokeWidth={1} size={18} />
                            </div>

                            <div className={styles.scoreBottom}>
                                <div className={styles.stars}>
                                    <RatingStars rating={place.rating} />
                                </div>

                                <div className={styles.scoreNumber}>
                                    4.6 <span>/ 5</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </>

    );
}

function RatingStars({ rating }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;

  return (
    <div className={styles.stars}>
      {[...Array(5)].map((_, i) => {
        if (i < full)
          return (
            <Star
              key={i}
              fill="black"
              color="black"
              size={40}
            />
          );

        if (i === full && half)
          return (
            <StarHalf
              key={i}
              fill="black"
              color="black"
              size={40}
            />
          );

        return (
          <Star
            key={i}
            size={40}
          />
        );
      })}
    </div>
  );
}