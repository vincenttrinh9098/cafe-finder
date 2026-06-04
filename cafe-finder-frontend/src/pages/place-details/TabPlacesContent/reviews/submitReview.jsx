import styles from '../PlaceReviews.module.css';
import { useState,useRef } from 'react';
import { submitRating, uploadReviewPhoto } from '../../../../api/placesApi.js';
import { useNavigate,useLocation } from 'react-router-dom';
import {useEffect} from 'react';
import supabase from '../../../../lib/supabase.js';

import smile5 from '../../../../assets/images/smile5.jpeg';
import moderate3 from '../../../../assets/images/moderate3.jpg';
import angry1 from '../../../../assets/images/angry1.png';

export function SubmitReview({ place, onReviewSubmitted }) {

    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    const handleOpenModal = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    console.log("session: ", session);
    if (!session) {
        // save current place so we can return after login
        navigate('/login', { state: { from: location } });
        return;
    }
    setUser(session.user);
    //console.log(user.id);
    //console.log(user.user_metadata.name);
    setShowModal(true);
    };

    const [showModal, setShowModal] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [comment, setComment] = useState("");
    const [photos, setPhotos] = useState([]);
    const MAX_PHOTOS = 5;

    const noiseOptions = ["Very quiet", "Quiet", "Moderate noise", "Loud", "Very loud"];
    const footTrafficOptions = ["Nearly empty", "Lightly busy", "Busy", "Very Busy"];
    const seatingCapacityOptions = ["Plenty of seats", "Some seats", "Limited seats", "Usually full"];
    const outletOptions = ["Plenty of outlets", "Some outlets available", "Limited outlets", "No visible outlets"];
    const parkingOptions = ["Plenty of parking", "Moderate parking", "Limited parking", "Very hard to park"];

    const scoreOptions = [
        {img: angry1, value:1},
        {img: moderate3, value:3},
        {img: smile5, value:5},
    ];
    const [scoreOption, setScoreOption] = useState(null);
    const [noiseOption, setNoiseOption] = useState("");
    const [footTrafficOption, setFootTrafficOption] = useState("");
    const [seatingCapacityOption, setSeatingCapacityOption] = useState("");
    const [outletOption, setOutletOptions] = useState("");
    const [parkingOption, setParkingOption] = useState("");


    const scoreRef = useRef(null);
    const noiseRef = useRef(null);
    const footTrafficRef = useRef(null);
    const seatingRef = useRef(null);
    const outletRef = useRef(null);
    const parkingRef = useRef(null);



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
        setShowModal(false);
    };

    const handleSubmit = async () => {
        setSubmitted(true);

        const missingFields = [];

        if (!scoreOption) missingFields.push(scoreRef);
        if (!noiseOption) missingFields.push(noiseRef);
        if (!footTrafficOption) missingFields.push(footTrafficRef);
        if (!seatingCapacityOption) missingFields.push(seatingRef);
        if (!outletOption) missingFields.push(outletRef);
        if (!parkingOption) missingFields.push(parkingRef);

        if (missingFields.length > 0) {
            missingFields[0].current?.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });
            return;
        }

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
                study_score: scoreOption,
                user_id: user.id,
                user_name:user.user_metadata.name
            });
            resetForm();
            onReviewSubmitted();
        } catch (err) {
            console.error("Failed to submit review:", err);
        } finally {
            setSubmitting(false);
        }
    };

    useEffect(() => {
        const getUser = async () => {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) setUser(session.user);
        };
        getUser();
      }, []);

    const person = {
        name: user?.user_metadata?.name || "",
        profileImage:
          user?.user_metadata?.avatar_url ||
          "https://www.m2i.nl/wp-content/uploads/2018/11/blank-profile-picture-973460_1280-e1559726803294.png",
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
                        <div className={styles.leaveReviewText} onClick={handleOpenModal}>
                            {user ? 
                                <p>Tap to leave a review...</p> 
                            : 
                                <p>Sign in to leave a review...</p>
                            }
                        </div>
                    </div>
                </div>
                {/*Create filter/sort options here */}
            </div>

        
            {showModal && (
                <div className={styles.overlay}>
                    <div className={styles.modal}>
                        <div className={styles.modalHeader}>
                            <span onClick={resetForm}>Back</span>
                            <span>Write a Review</span>
                        </div>

                        <div className={styles.modalContent}>



                            <div ref={scoreRef} className={styles.categoryReview}>
                                <h3 className={styles.categoryHeader}>
                                    Study Score
                                    {submitted && !scoreOption && (
                                        <span className={styles.requiredError}>* required</span>
                                    )}
                                </h3>
                                <div className = {styles.scoreContainer}>
                                    <div className={styles.scorePhoto}>
                                        {scoreOptions.map((option, index) => (
                                            <button
                                                type="button"
                                                key={index}
                                                onClick={() => setScoreOption(option.value)}
                                                className={`${styles.scoreOption} ${
                                                    scoreOption === option.value ? styles.scoreOptionActive : ""
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

                            <div ref = {noiseRef}className={styles.categoryReview}>
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

                            <div ref = {footTrafficRef}className={styles.categoryReview}>
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

                            <div ref = {seatingRef}className={styles.categoryReview}>
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

                            <div ref = {outletRef}className={styles.categoryReview}>
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

                            <div ref = {parkingRef}className={styles.categoryReview}>
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