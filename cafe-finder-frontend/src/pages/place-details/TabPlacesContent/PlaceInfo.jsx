import styles from './PlaceInfo.module.css'
import storeDetailTestImg from './store-details-test.png';

export function PlaceInfo(){

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

    return(
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

        
    );


}