import styles from './PlaceReviews.module.css';
import { submitRating } from '../../../api/placesApi.js';
import {useState,useEffect} from 'react';

export function PlaceReviews({place}) {

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
    const [submitting, setSubmitting] = useState(false);
    const handleSubmit = async () => {
        if (!noiseOption || !footTrafficOption || !seatingCapacityOption || !outletOption) {
            alert("Please fill out all categories before submitting.");
            return;
        }

        setSubmitting(true);
        try {
            console.log(place.name);
            console.log(place.address);
            console.log( place.google_place_id);
            console.log(noiseOptions.indexOf(noiseOption));
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
            });
            // reset form
            setNoiseOption("");
            setFootTrafficOption("");
            setSeatingCapacityOption("");
            setOutletOptions("");
            setComment("");
            setShowModal(false);
        } catch (err) {
            console.error("Failed to submit review:", err);
        } finally {
            setSubmitting(false);
        }
    };

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
                            <span onClick={() => setShowModal(false)}>
                                Back
                            </span>                       
                            <span>Write a Review</span>
                        </div>


                    <div className={styles.modalContent}>
                        {/*Modal Category Review Section */}
                        <div className = {styles.categoryReview}>
                            <h3 className = {styles.categoryHeader}q>Noise level</h3>
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
                            <h3 className = {styles.categoryHeader}>Foot Traffic</h3>
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
                            <h3 className = {styles.categoryHeader}>Seating Capacity</h3>
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
                            <h3 className = {styles.categoryHeader}>Outlets Availability</h3>
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
                            <h3 className = {styles.categoryHeader}>Parking Availability</h3>
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