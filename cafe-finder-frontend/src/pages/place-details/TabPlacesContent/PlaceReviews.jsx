import styles from './PlaceReviews.module.css';
import { useState, useEffect, useCallback } from 'react';
import { getReviews } from '../../../api/placesApi.js';
import { SubmitReview } from './reviews/SubmitReview.jsx';
import { DisplayReview } from './reviews/DisplayReview.jsx';

export function PlaceReviews({ place }) {
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);

    const fetchReviews = useCallback(async () => {
        try {
            const data = await getReviews(place.google_place_id);
            setReviews(data);
        } catch (err) {
            console.error("Failed to fetch reviews:", err);
        } finally {
            setLoadingReviews(false);
        }
    }, [place.google_place_id]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    return (
        <div className={styles.dynamicReviewsSection}>
            <SubmitReview place={place} onReviewSubmitted={fetchReviews} />
            <DisplayReview reviews={reviews} loadingReviews={loadingReviews} onReviewDeleted={fetchReviews} />
        </div>
    );
}