import styles from './PlaceHeader.module.css'
import storeDetailTestImg from './store-details-test.png';
import { useNavigate } from "react-router-dom";

export function PlaceHeader() {
    const navigate = useNavigate();

    const store1 = {
        name: "Green Tea",
        image: storeDetailTestImg,
        phoneNumber: "(123) 456-7890",
        rating: 9.9,
        distance: "0.3mi",
        address: "123 Green Tea St",
        email: "test123@gmail.com",
        hours: {
            Monday: "8:00 AM - 6:00 PM",
            Tuesday: "8:00 AM - 6:00 PM",
            Wednesday: "8:00 AM - 6:00 PM",
            Thursday: "8:00 AM - 8:00 PM",
            Friday: "8:00 AM - 8:00 PM",
            Saturday: "9:00 AM - 9:00 PM",
            Sunday: "9:00 AM - 5:00 PM",
        },
        attributes: [
            "Low noise",
            "Low foot traffic",
            "Moderate seating capacity",
            "Parking lot"
        ]
    };

    return (
        <>
            <div className={styles.imageSection}>
                <img
                    src={store1.image}
                    alt="Store"
                    className={styles.image}
                />
                <button className={styles.backButton} onClick={() => navigate("/")}>
                    Back
                </button>
            </div>

            <div className={styles.contentSection}>
                <div className={styles.topRowContentSection}>
                    <h2>{store1.name}</h2>
                    <p>{store1.rating} ⭐</p>
                </div>

                <div className={styles.bottomRowAttributeRow}>
                    {store1.attributes.map((attr) => (
                        <span key={attr} className={styles.bottomRowAttributeChip}>
                            {attr}
                        </span>
                    ))}
                </div>
            </div>
        </>

    );
}