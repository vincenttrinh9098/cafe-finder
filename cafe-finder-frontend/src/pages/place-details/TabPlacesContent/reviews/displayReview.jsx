import styles from './DisplayReview.module.css';
import editIcon from '../../../../assets/images/editIcon.png'
import smile5 from '../../../../assets/images/smile5.jpeg';
import moderate3 from '../../../../assets/images/moderate3.jpg';
import angry1 from '../../../../assets/images/angry1.png';
import supabase from '../../../../lib/supabase.js';
import { deleteReview, updateReview } from '../../../../api/placesApi.js';


import { useEffect, useState } from 'react';

export function DisplayReview({ reviews, loadingReviews, onReviewDeleted }) {

    const noiseOptions = ["Very quiet", "Quiet", "Moderate noise", "Loud", "Very loud"];
    const footTrafficOptions = ["Nearly empty", "Lightly busy", "Busy", "Very Busy"];
    const seatingCapacityOptions = ["Plenty of seats", "Some seats", "Limited seats", "Usually full"];
    const outletOptions = ["Plenty of outlets", "Some outlets available", "Limited outlets", "No visible outlets"];
    const parkingOptions = ["Plenty of parking", "Moderate parking", "Limited parking", "Very hard to park"];

    const scoreOptions = [
        { img: angry1, value: 1 },
        { img: moderate3, value: 3 },
        { img: smile5, value: 5 },
    ];
    const [scoreOption, setScoreOption] = useState(null);
    const [noiseOption, setNoiseOption] = useState("");
    const [footTrafficOption, setFootTrafficOption] = useState("");
    const [seatingCapacityOption, setSeatingCapacityOption] = useState("");
    const [outletOption, setOutletOptions] = useState("");
    const [parkingOption, setParkingOption] = useState("");
    const [selectedReview, setSelectedReview] = useState(null);
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [photos, setPhotos] = useState([]);
    const MAX_PHOTOS = 5;

    const handlePhotoSelect = (e) => {
        const files = Array.from(e.target.files);
        const remaining = MAX_PHOTOS - photos.length;
        const toAdd = files.slice(0, remaining).map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setPhotos(prev => [...prev, ...toAdd]);
    };

    const removePhoto = (index) => {
        setPhotos(prev => prev.filter((_, i) => i !== index));
    };


    const resetForm = () => {
        setNoiseOption("");
        setFootTrafficOption("");
        setSeatingCapacityOption("");
        setOutletOptions("");
        setParkingOption("");
        setComment("");
        setPhotos([]);
        setScoreOption(null);
        setSubmitted(false);
        setSelectedReview(null)

    };

    const deleteOption = async (id) => {
    try {
        await deleteReview(id);
        onReviewDeleted(); // refresh reviews after delete
        setSelectedReview(null);
    } catch (err) {
        console.error("Failed to delete review:", err);
        setSelectedReview(null);
    }
    };

    const editOption = async () => {
    try {
        await updateReview(selectedReview.id, { comments: comment });
        setSelectedReview(null);
        onReviewDeleted(); // reuse same refresh callback
    } catch (err) {
        console.error("Failed to update review:", err);
    }
    };

    useEffect(() => {
        if (!selectedReview) return;
        setScoreOption(selectedReview.study_score|| "");
        setNoiseOption(selectedReview.noise || "");
        setFootTrafficOption(selectedReview.foot_traffic || "");
        setSeatingCapacityOption(selectedReview.seating || "");
        setOutletOptions(selectedReview.outlet || "");
        setParkingOption(selectedReview.parking || "");
        setComment(selectedReview.comments || "");
        setPhotos(
            (selectedReview.photos || []).map(url => ({
                file: null,
                preview: url
            }))
        );
        selectedReview.photos.forEach(photo => {
            console.log(photo);
        });

    }, [selectedReview]);

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
                                <div className={styles.overlay} onClick={() => setSelectedReview(null)}>
                                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>

                                        <div className={styles.modalHeader}>
                                            <span className={styles.left} onClick={resetForm}>Back</span>
                                            <span className={styles.title}>Edit Review</span>
                                            <span className={styles.right} onClick={() => deleteOption(selectedReview.id)} disabled={submitting}>Delete</span>
                                        </div>
                                        <div className={styles.modalContent}>

                                            <div className={styles.categoryReview}>
                                                <h3 className={styles.categoryHeader}>
                                                    Study Score
                                                    {submitted && !scoreOption && (
                                                        <span className={styles.requiredError}>* required</span>
                                                    )}
                                                </h3>
                                                <div className={styles.scoreContainer}>
                                                    <div className={styles.scorePhoto}>
                                                        {scoreOptions.map((option, index) => (
                                                            <button
                                                                type="button"
                                                                key={index}
                                                                onClick={() => setScoreOption(option.value)}
                                                                className={`${styles.scoreOption} ${scoreOption === option.value ? styles.scoreOptionActive : ""
                                                                    }`}
                                                            >
                                                                <img
                                                                    src={option.img}
                                                                    alt={`score option ${option.value}`}
                                                                    className={styles.scoreImage}
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className={styles.categoryReview}>
                                                <h3 className={styles.categoryHeader}>Noise level
                                                    {submitted && !noiseOption && <span className={styles.requiredError}>* required</span>}
                                                </h3>
                                                <div className={styles.categoryPills}>
                                                    {noiseOptions.map(option => (
                                                        <button type="button" key={option} onClick={() => setNoiseOption(option)}
                                                            className={`${styles.pillOption} ${noiseOption === option ? styles.pillOptionActive : ""}`}>
                                                            {option}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className={styles.categoryReview}>
                                                <h3 className={styles.categoryHeader}>Foot Traffic
                                                    {submitted && !footTrafficOption && <span className={styles.requiredError}>* required</span>}
                                                </h3>
                                                <div className={styles.categoryPills}>
                                                    {footTrafficOptions.map(option => (
                                                        <button type="button" key={option} onClick={() => setFootTrafficOption(option)}
                                                            className={`${styles.pillOption} ${footTrafficOption === option ? styles.pillOptionActive : ""}`}>
                                                            {option}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className={styles.categoryReview}>
                                                <h3 className={styles.categoryHeader}>Seating Capacity
                                                    {submitted && !seatingCapacityOption && <span className={styles.requiredError}>* required</span>}
                                                </h3>
                                                <div className={styles.categoryPills}>
                                                    {seatingCapacityOptions.map(option => (
                                                        <button type="button" key={option} onClick={() => setSeatingCapacityOption(option)}
                                                            className={`${styles.pillOption} ${seatingCapacityOption === option ? styles.pillOptionActive : ""}`}>
                                                            {option}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className={styles.categoryReview}>
                                                <h3 className={styles.categoryHeader}>Outlets Availability
                                                    {submitted && !outletOption && <span className={styles.requiredError}>* required</span>}
                                                </h3>
                                                <div className={styles.categoryPills}>
                                                    {outletOptions.map(option => (
                                                        <button type="button" key={option} onClick={() => setOutletOptions(option)}
                                                            className={`${styles.pillOption} ${outletOption === option ? styles.pillOptionActive : ""}`}>
                                                            {option}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className={styles.categoryReview}>
                                                <h3 className={styles.categoryHeader}>Parking Availability
                                                    {submitted && !parkingOption && <span className={styles.requiredError}>* required</span>}
                                                </h3>
                                                <div className={styles.categoryPills}>
                                                    {parkingOptions.map(option => (
                                                        <button type="button" key={option} onClick={() => setParkingOption(option)}
                                                            className={`${styles.pillOption} ${parkingOption === option ? styles.pillOptionActive : ""}`}>
                                                            {option}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className={styles.modalCommentsOuter}>
                                                <textarea
                                                    className={styles.modalCommentsInner}
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                />
                                            </div>

                                            <div className={styles.categoryReview}>
                                                <h3 className={styles.categoryHeader}>Add Photos (up to 5)</h3>
                                                <div className={styles.photoPreviewRow}>
                                                    {photos.map((p, i) => (
                                                        <div key={i} className={styles.photoPreviewWrapper}>
                                                            <img
                                                                src={p.preview}
                                                                alt="preview"
                                                                className={styles.photoPreview}
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removePhoto(i)}
                                                                className={styles.removePhoto}
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    ))}
                                                    {photos.length < MAX_PHOTOS && (
                                                        <label className={styles.photoUploadLabel}>
                                                            +
                                                            <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handlePhotoSelect}/>
                                                        </label>
                                                    )}
                                                </div>
                                            </div>

                                        </div>
                                        <div className={styles.modalBottom}>
                                            <button className={styles.submitButton} onClick={() => editOption()} disabled={submitting}>
                                                {submitting ? "Posting..." : "Post Review"}
                                            </button>
                                        </div>
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