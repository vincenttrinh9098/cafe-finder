import styles from '../PlaceReviews.module.css';

export function DisplayReview({ reviews, loadingReviews }) {
    if (loadingReviews) return <p>Loading reviews...</p>;

    const filtered = reviews.filter(r => r.comments || (r.photos && r.photos.length > 0));
    //console.log(filtered);

    if (filtered.length === 0) return <p></p>;

    return (
        <div className={styles.reviews}>
            {filtered.map((r) => (
                <div key={r.id} className={styles.reviewCard}>
                    <div className={styles.reviewGrid}>
                        <img
                            className={styles.avatar}
                            src="https://www.m2i.nl/wp-content/uploads/2018/11/blank-profile-picture-973460_1280-e1559726803294.png"
                            alt="user"
                        />
                        <div className={styles.reviewContent}>
                            <div className={styles.reviewsHeader}>
                                <h4>{r.user_name}</h4>
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