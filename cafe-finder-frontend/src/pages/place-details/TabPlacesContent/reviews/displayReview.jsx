//import styles from '../PlaceReviews.module.css';
import styles from './DisplayReview.module.css';
import editIcon from '../../../../assets/images/editIcon.png'
import smile5 from '../../../../assets/images/smile5.jpeg';

import supabase from '../../../../lib/supabase.js';


import { useEffect, useState } from 'react';

export function DisplayReview({ reviews, loadingReviews }) {

    const [selectedReview, setSelectedReview] = useState(null);
    const [user, setUser] = useState(null);
    const filtered = reviews.filter(r => r.comments || (r.photos && r.photos.length > 0));

    console.log(filtered);

    const handleOpenModal = (review) => {
        setSelectedReview(review);
    };
    useEffect(() => {
        async function loadUser() {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                setUser(session.user);
            }
        }

        loadUser();
    }, []);
    if (loadingReviews) return <p>Loading reviews...</p>;

    //Put Option
    const editOption = () => {
    }
    //Delete option
    const deleteOption = () => {

    }

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
                        <div>
                            {user?.id === r.user_id && (
                                <button
                                    onClick={() => handleOpenModal(r)}
                                    className={styles.editButton}
                                >
                                    <img
                                        src={editIcon}
                                        alt="Edit"
                                        className={styles.editIcon}
                                    />
                                </button>
                            )}
                            {selectedReview && (
                                <div
                                    className={styles.overlay}
                                    onClick={() => setSelectedReview(null)}
                                >
                                    <div
                                        className={styles.modal}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <h2>Edit Review</h2>

                                        <p>{selectedReview.comments}</p>

                                        <button onClick={() => setSelectedReview(null)}>
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}