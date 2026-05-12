import styles from '../PlaceReviews.module.css';

export function DisplayReview({ reviews, loadingReviews }) {
    if (loadingReviews) return <p>Loading reviews...</p>;

    const filtered = reviews.filter(r => r.comments || (r.photos && r.photos.length > 0));

    if (filtered.length === 0) return <p>No reviews yet. Be the first!</p>;

    return (
        <div className={styles.reviews}>
            {filtered.map((r) => (
                <div key={r.id} className={styles.reviewCard}>
                    <div className={styles.reviewGrid}>
                        <img
                            className={styles.avatar}
                            src="https://randomuser.me/api/portraits/lego/1.jpg"
                            alt="user"
                        />
                        <div className={styles.reviewContent}>
                            <div className={styles.reviewsHeader}>
                                <h4>Anonymous</h4>
                            </div>

                            {r.comments && (
                                <div className={styles.reviewText}>
                                    <p>{r.comments}</p>
                                </div>
                            )}

                            {r.photos && r.photos.length > 0 && (
                                <div className={styles.reviewPhotos}>
                                    {r.photos.map((url, i) => (
                                        <img key={i} src={url} alt="review" />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}