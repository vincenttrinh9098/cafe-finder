import styles from './PlaceReviews.module.css';

export function PlaceReviews() {


    const person = {
        id: 99,
        name: "User T",
        profileImage: "https://randomuser.me/api/portraits/men/32.jpg"
    }

    const reviews = [
        {
            id: 1,
            name: "Alex Chen",
            profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
            rating: 8.5,
            review: "Great spot to study. It’s usually quiet in the mornings and the seating is comfortable. WiFi was solid too.",
            photos: [
                "https://images.unsplash.com/photo-1509042239860-f550ce710b93",
                "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085"
            ]
        },
        {
            id: 2,
            name: "Maya Rodriguez",
            profileImage: "https://randomuser.me/api/portraits/women/44.jpg",
            rating: 6.2,
            review: "Nice aesthetic but it gets pretty loud in the afternoon. Coffee was good though.",
            photos: [
                "https://images.unsplash.com/photo-1521017432531-fbd92d768814"
            ]
        },
        {
            id: 3,
            name: "Jordan Lee",
            profileImage: "https://randomuser.me/api/portraits/men/65.jpg",
            rating: 9.1,
            review: "One of my favorite cafes. Super chill vibe, not too crowded, and plenty of outlets.",
            photos: []
        },
        {
            id: 4,
            name: "Sofia Patel",
            profileImage: "https://randomuser.me/api/portraits/women/68.jpg",
            rating: 4.8,
            review: "Way too noisy for me. Hard to focus. Might be better for casual hangouts.",
            photos: [
                "https://images.unsplash.com/photo-1554118811-1e0d58224f24"
            ]
        },
        {
            id: 5,
            name: "Ethan Walker",
            profileImage: "https://randomuser.me/api/portraits/men/12.jpg",
            rating: 7.3,
            review: "Decent place overall. Not too loud, not too quiet. Kind of a middle ground.",
            photos: [
                "https://images.unsplash.com/photo-1511920170033-f8396924c348",
                "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb",
                "https://images.unsplash.com/photo-1498804103079-a6351b050096"
            ]
        }
    ];


    return (
        <div className={styles.dynamicReviewsSection}>

            <div className={styles.dynamicReviews}>
                <div className={styles.postReviewsContainer}>

                    <div className={styles.postReviewsCard}>

                        <div className={styles.postReviewHeader}>
                            <img src={person.profileImage} alt={person.name} />
                            <p>{person.name}</p>
                        </div>

                        <div className={styles.leaveReviewText}>
                            <p>Tap to leave a review....</p>
                        </div>

                    </div>
                </div>
            </div>


            <div className={styles.reviews}>
                {reviews.map((r) => (
                    <div key={r.id} className={styles.dynamicReviews}>

                        <div className={styles.reviewsHeader}>
                            <img src={r.profileImage} alt={r.name} />
                            <h3>{r.name}</h3>
                            <p>Rating: {r.rating}</p>
                        </div>

                        <div className={styles.reviewText}>
                            <p>{r.review}</p>
                        </div>

                        <div className={styles.reviewPhotos}>
                            {r.photos.map((photo, i) => (
                                <img key={i} src={photo} alt="review" />
                            ))}
                        </div>
                    </div>
                ))}
            </div>


        </div>
    );
}