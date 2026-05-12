import styles from '../PlaceReviews.module.css';
import { useState } from 'react';
import { submitRating, uploadReviewPhoto } from '../../../../api/placesApi.js';

export function SubmitReview({ place, onReviewSubmitted }) {
    const [showModal, setShowModal] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [comment, setComment] = useState("");
    const [photos, setPhotos] = useState([]);
    const MAX_PHOTOS = 5;

    const noiseOptions = ["Very quiet", "Quiet", "Moderate noise", "Loud", "Very loud"];
    const footTrafficOptions = ["Empty","Light foot traffic","Moderate foot traffic","Busy","Heavy foot traffic"];
    const seatingCapacityOptions = ["Plenty of seats","Some seats","Limited seats","Usually full"];
    const outletOptions = ["Plenty of outlets","Some outlets available","Limited outlets","No visible outlets"];
    const parkingOptions = ["Plenty of parking","Moderate parking","Limited parking","Very hard to park"];

    const [noiseOption, setNoiseOption] = useState("");
    const [footTrafficOption, setFootTrafficOption] = useState("");
    const [seatingCapacityOption, setSeatingCapacityOption] = useState("");
    const [outletOption, setOutletOptions] = useState("");
    const [parkingOption, setParkingOption] = useState("");

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
        setSubmitted(false);
        setShowModal(false);
    };

    const handleSubmit = async () => {
        setSubmitted(true);
        if (!noiseOption || !footTrafficOption || !outletOption || !seatingCapacityOption || !parkingOption) return;

        setSubmitting(true);
        try {
            const photoUrls = await Promise.all(photos.map(p => uploadReviewPhoto(p.file)));
            await submitRating({
                google_place_id: place.google_place_id,
                name: place.name,
                address: place.address,
                noise: noiseOption,
                foot_traffic: footTrafficOption,
                outlet: outletOption,
                seating: seatingCapacityOption,
                parking: parkingOption,
                comments: comment,
                photos: photoUrls,
            });
            resetForm();
            onReviewSubmitted(); 
        } catch (err) {
            console.error("Failed to submit review:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const person = {
        name: "User T",
        profileImage: "https://randomuser.me/api/portraits/men/32.jpg"
    };

    return (
        <>
            <div className={styles.dynamicReviews}>
                <div className={styles.postReviewsContainer}>
                    <div className={styles.postReviewsCard}>
                        <div className={styles.postReviewHeader}>
                            <img src={person.profileImage} alt={person.name} />
                            <p>{person.name}</p>
                        </div>
                        <div className={styles.leaveReviewText} onClick={() => setShowModal(true)}>
                            <p>Tap to leave a review....</p>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <span onClick={resetForm}>Back</span>
                            <span>Write a Review</span>
                        </div>

                        <div className={styles.modalContent}>
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
                                    placeholder="Tell us about your experience...."
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </div>

                            <div className={styles.categoryReview}>
                                <h3 className={styles.categoryHeader}>Add Photos (up to 5)</h3>
                                <div className={styles.photoPreviewRow}>
                                    {photos.map((p, i) => (
                                        <div key={i} className={styles.photoPreviewWrapper}>
                                            <img src={p.preview} alt="preview" className={styles.photoPreview} />
                                            <button type="button" onClick={() => removePhoto(i)} className={styles.removePhoto}>✕</button>
                                        </div>
                                    ))}
                                    {photos.length < MAX_PHOTOS && (
                                        <label className={styles.photoUploadLabel}>
                                            +
                                            <input type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handlePhotoSelect} />
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={styles.modalBottom}>
                            <button className={styles.submitButton} onClick={handleSubmit} disabled={submitting}>
                                {submitting ? "Posting..." : "Post Review"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}