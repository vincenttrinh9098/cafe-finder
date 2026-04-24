import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './Place.module.css';

import storeDetailTestImg from './store-details-test.png';

export function Place() {
  const navigate = useNavigate();
  /*
  const details = {
    id: 1,
    name: "Matcha House",
    rating: 9.9,
    distance: "0.3mi",
    address: "123 Green Tea St",

    hours: {
      monday: "8:00 AM - 6:00 PM",
      tuesday: "8:00 AM - 6:00 PM",
      wednesday: "8:00 AM - 6:00 PM",
      thursday: "8:00 AM - 8:00 PM",
      friday: "8:00 AM - 8:00 PM",
      saturday: "9:00 AM - 9:00 PM",
      sunday: "9:00 AM - 5:00 PM",
    },

    phone: "(123) 456-7890",
  };
  const [store, setStore] = useState(details);*/
  const store1 = {
    name: "Green Tea",
    image: storeDetailTestImg,
    rating: 9.9,
    distance: "0.3mi",
    attributes: [
      "Low noise",
      "Low foot traffic",
      "Moderate seating capacity",
      "Parking lot"
    ]
  };


  const [activeTab, setActiveTab] = useState("info");

  return (
    <div className={styles.placePage}>


      {/*Top half of content (35%): Image,back button */}
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


      <div className={styles.tabBar}>
        <button
          className={`${styles.tabBarButton} ${activeTab === "info" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("info")}>
          Info
        </button>

        <button
          className={`${styles.tabBarButton} ${activeTab === "reviews" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("reviews")}>
          Reviews
        </button>

        <button
          className={`${styles.tabBarButton} ${activeTab === "map" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("map")}>
          Map
        </button>

        <button
          className={`${styles.tabBarButton} ${activeTab === "attribute" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("attribute")}>
          Attribute
        </button>

      </div>

      <div className={styles.dynamicSection}>
        {activeTab === "info" && (
          <div>
            <h2>Store Info</h2>
            <p>Hours, address, phone...</p>
          </div>
        )}

        {activeTab === "reviews" && (
          <div>
            <h2>Reviews</h2>
            <p>No reviews yet</p>
          </div>
        )}

        {activeTab === "map" && (
          <div>
            <h2>Map</h2>
            <p>Map goes here</p>
          </div>
        )}

        {activeTab === "attribute" && (
          <div>
            <h2>attribute</h2>
            <p>TBD...</p>
          </div>
        )}

      </div>
    </div>
  );

}