import styles from './PlaceReviews.module.css';
import { submitRating,uploadReviewPhoto,getReviews} from '../../../api/placesApi.js';
import {useState,useEffect} from 'react';

export function PlaceReviews({place}) {


    const person = {
        id: 99,
        name: "User T",
        profileImage: "https://randomuser.me/api/portraits/men/32.jpg"
    }

    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);

    useEffect(() => {
    const fetchReviews = async () => {
        try {
        const data = await getReviews(place.google_place_id);
        setReviews(data);
        } catch (err) {
        console.error("Failed to fetch reviews:", err);
        } finally {
        setLoadingReviews(false);
        }
    };
    fetchReviews();
    }, [place.google_place_id]);



    const [showModal, setShowModal] = useState(false);
    const noiseOptions = ['very quiet', 'quiet', 'moderate', 'loud', 'very loud'];
    const footTrafficOptions = ['empty', 'test1', 'moderate', 'test', 'heavy traffic'];
    const seatingCapacityOptions = ["Plenty of seats", "Some seats", "Limited seats", "Usually full"];
    const outletOptions = [  "Plenty of outlets","Some outlets available","Limited outlets","No visible outlets"]
    const parkingOptions = [  "Plenty of parking", "Moderate parking", "Limited parking","Very hard to park"]
    const [noiseOption, setNoiseOption] = useState("");
    const [footTrafficOption, setFootTrafficOption] = useState("");
    const [seatingCapacityOption, setSeatingCapacityOption] = useState("");
    const [outletOption, setOutletOptions] = useState ("");
    const [parkingOption, setParkingOption] = useState ("");
    const [comment, setComment] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [photos, setPhotos] = useState([]); // { file, preview } objects
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

    const handleSubmit = async () => {
        setSubmitted(true);
    
        if(!noiseOption||!footTrafficOption||!outletOption||!seatingCapacityOption||!parkingOption){
           // setShowModal(false);
            return;
        }
        setSubmitting(true);
        try {
            /*console.log(place.name);
            console.log(place.address);
            console.log( place.google_place_id);
            console.log(noiseOptions.indexOf(noiseOption));*/

            const photoUrls = await Promise.all(
            photos.map(p => uploadReviewPhoto(p.file))
            );
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
            // reset form
            resetForm();

            const updatedReviews = await getReviews(place.google_place_id);
            setReviews(updatedReviews);
        } catch (err) {
            console.error("Failed to submit review:", err);
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = async () =>{
            setNoiseOption("");
            setFootTrafficOption("");
            setSeatingCapacityOption("");
            setOutletOptions("");
            setParkingOption("");
            setComment("");
            setPhotos([]);
            setSubmitted(false);
            setShowModal(false);
    }

    useEffect(() => {
    if (showModal) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }

    return () => {
        document.body.style.overflow = "auto";
    };
    }, [showModal]);


    return (
        <div className={styles.dynamicReviewsSection}>

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


                        {/*Modal Header */}
                        <div className = {styles.modalHeader}>
                            <span onClick={() => { resetForm(); }}>
                                Back
                            </span>                       
                            <span>Write a Review</span>
                        </div>


                    <div className={styles.modalContent}>
                        {/*Modal Category Review Section */}
                        <div className = {styles.categoryReview}>
                            <h3 className = {styles.categoryHeader}>Noise level
                                {submitted && !noiseOption && <span className={styles.requiredError}>* required</span>}
                            </h3>
                            
                            <div className = {styles.categoryPills}>
                                {noiseOptions.map((option) =>(
                                    <button type ="button" key={option} onClick={() => setNoiseOption(option)} className={`
                                        ${styles.pillOption}
                                        ${noiseOption === option ? styles.pillOptionActive : ""}
                                        `}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className = {styles.categoryReview}>
                            <h3 className = {styles.categoryHeader}>Foot Traffic
                                {submitted && !footTrafficOption && <span className={styles.requiredError}>* required</span>}                          
                            </h3>
                            <div className = {styles.categoryPills}>
                                {footTrafficOptions.map((option) =>(
                                    <button type ="button" key={option} onClick={() => setFootTrafficOption(option)} className={`
                                        ${styles.pillOption}
                                        ${footTrafficOption === option ? styles.pillOptionActive : ""}
                                        `}
                                    >
                                        {option}
                                    </button>      
                                ))}
                            </div>
                        </div>

                        <div className = {styles.categoryReview}>
                            <h3 className = {styles.categoryHeader}>Seating Capacity
                                {submitted && !seatingCapacityOption && <span className={styles.requiredError}>* required</span>}  
                            </h3>
                            <div className = {styles.categoryPills}>
                                {seatingCapacityOptions.map((option) =>(
                                    <button type ="button" key={option} onClick={() => setSeatingCapacityOption(option)} className={`
                                        ${styles.pillOption}
                                        ${seatingCapacityOption === option ? styles.pillOptionActive : ""}
                                        `}
                                    >
                                        {option}
                                    </button>                                 
                                ))}
                            </div>
                        </div>

                        <div className = {styles.categoryReview}>
                            <h3 className = {styles.categoryHeader}>Outlets Availability
                                {submitted && !outletOption && <span className={styles.requiredError}>* required</span>}  
                            </h3>
                            <div className = {styles.categoryPills}>
                                {outletOptions.map((option) =>(
                                    <button type ="button" key={option} onClick={() => setOutletOptions(option)} className={`
                                        ${styles.pillOption}
                                        ${outletOption === option ? styles.pillOptionActive : ""}
                                        `}
                                    >
                                        {option}
                                    </button>                              
                                ))}
                            </div>
                        </div>

                        <div className = {styles.categoryReview}>
                            <h3 className = {styles.categoryHeader}>Parking Availability
                                {submitted && !parkingOption && <span className={styles.requiredError}>* required</span>}  
                            </h3>
                            <div className = {styles.categoryPills}>
                                {parkingOptions.map((option) =>(
                                    <button type ="button" key={option} onClick={() => setParkingOption(option)} className={`
                                        ${styles.pillOption}
                                        ${parkingOption === option ? styles.pillOptionActive : ""}
                                        `}
                                    >
                                        {option}
                                    </button>                         
                                ))}
                            </div>
                        </div>


                        {/*Modal Free Response Text */}
                        <div className={styles.modalCommentsOuter}>
                            <textarea
                                className={styles.modalCommentsInner}
                                name="content"
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
                                    <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    style={{ display: "none" }}
                                    onChange={handlePhotoSelect}
                                    />
                                </label>
                                )}
                            </div>
                        </div>

                    </div>

                        {/*Modal Submit button */}
                        <div className = {styles.modalBottom}>
                            <button className={styles.submitButton} onClick={handleSubmit} disabled={submitting}>
                                {submitting ? "Posting..." : "Post Review"}
                            </button>
                        </div>

                    </div>
                </div>
            )}

            <div className={styles.reviews}>
            {loadingReviews ? (
                <p>Loading reviews...</p>
            ) : reviews.length === 0 ? (
                <p>No reviews yet. Be the first!</p>
            ) : (
                reviews.map((r) => (
                <div key={r.id} className={styles.reviewCard}>

                    <div className={styles.reviewGrid}>

                    {/* LEFT: avatar */}
                    <img
                        className={styles.avatar}
                        src="https://randomuser.me/api/portraits/lego/1.jpg"
                        alt="user"
                    />

                    {/* RIGHT: all content */}
                    <div className={styles.reviewContent}>

                        <div className={styles.reviewsHeader}>
                        <div>
                            <h4>Anonymous</h4>
                        </div>
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
                ))
            )}
            </div>

        </div>
    );
}