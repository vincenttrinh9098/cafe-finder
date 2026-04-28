import styles from './PlaceMap.module.css';
import mapTest from './map.png';

export function PlaceMap(){
  const store1 = {
    name: "Green Tea",
    image: 'na',
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

const mapDetails = {
  distance: 2.1,
  eta: 10
}

    return(
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
    );
}