import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import styles from './Place.module.css';

import storeDetailTestImg from './store-details-test.png';
import mapTest from './map.png';

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


  const person = {
    id:99,
    name:"User T",
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


const mapDetails = {
  distance: 2.1,
  eta: 10
}


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
          <div className = {styles.dynamicInfoSection}>

            <div className = {styles.dynamicInfo}>
              <h2>Opening Hours</h2>
              {Object.entries(store1.hours).map(([day, time]) => (
                <p key={day}>
                  {day}: {time}
                </p>
              ))}
            </div>

            <div className = {styles.dynamicInfo}>
              <h2>Contact Infomation </h2>
              <p>Phone: {store1.phoneNumber}</p>
              <p>Email: {store1.email}</p>
            </div>

            <div className = {styles.dynamicInfo}>
              <h2>Facility Snapshot! </h2>
              <p>empty</p>
              <p>empty</p>
              <p>empty</p>
              <p>empty</p>
              <p>empty</p>
              <p>empty</p>
              <p>empty</p>
              <p>empty</p>
              <p>empty</p>
              <p>empty</p>
            </div>
            
          </div>
        )}




        {activeTab === "reviews" && (
          <div className = {styles.dynamicReviewsSection}>

          <div className = {styles.dynamicReviews}>
            <div className = {styles.postReviewsContainer}> 

              <div className = {styles.postReviewsCard}>

                  <div className = {styles.postReviewHeader}>
                    <img src={person.profileImage} alt={person.name}/>
                    <p>{person.name}</p>
                  </div>

                  <div className = {styles.leaveReviewText}>
                      <p>Tap to leave a review....</p>
                  </div>

              </div>
            </div>
          </div>

     
            <div className = {styles.reviews}>
              {reviews.map((r) => (
                <div key={r.id} className = {styles.dynamicReviews}>

                  <div className = {styles.reviewsHeader}>
                    <img src={r.profileImage} alt={r.name}/>
                    <h3>{r.name}</h3>
                    <p>Rating: {r.rating}</p>
                  </div>

                  <div className = {styles.reviewText}>
                   <p>{r.review}</p>
                  </div>

                  <div className = {styles.reviewPhotos}>
                    {r.photos.map((photo, i) => (
                      <img key={i} src={photo} alt="review" />
                    ))}
                  </div>
                </div>
              ))}
            </div>


          </div>
        )}



        {activeTab === "map" && (
          <div>

            <div className = {styles.dynamicMap}>

              <div className = {styles.mapSectionImageWrapper}>
                <img src={mapTest} alt="map" />
              </div>

              <div className={styles.mapDistance}>
                <p>{mapDetails.eta} min drive</p>
                <p>{mapDetails.distance} mi</p>
              </div>
              <div className={styles.mapAddress}>
                <p>Address: {store1.address}</p>
              </div>
             </div>


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