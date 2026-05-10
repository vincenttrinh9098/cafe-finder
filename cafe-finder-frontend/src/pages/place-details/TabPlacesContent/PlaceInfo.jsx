import styles from './PlaceInfo.module.css'
//import storeDetailTestImg from './store-details-test.png';

export function PlaceInfo({placeDetails, loadingDetails }){
    console.log("placeDetails:", placeDetails);
    console.log("loadingDetails:", loadingDetails);
    return(
            <div className = {styles.dynamicInfoSection}>

            <div className={styles.dynamicInfo}>
              <h2>Opening Hours</h2>
              {loadingDetails ? (
                <p>Loading hours...</p>
              ) : placeDetails?.opening_hours?.weekday_text ? (
                placeDetails.opening_hours.weekday_text.map((day) => {
                  const [dayName, hours] = day.split(/:\s(.+)/);
                  return (
                    <div className={styles.infoRow} key={day}>
                      <span className={styles.highlight}>{dayName}:</span>
                      <span className={styles.infomation}>{hours}</span>
                    </div>
                  );
                })
              ) : (
                <p>Hours not available</p>
              )}
            </div>

            <div className={styles.dynamicInfo}>
              <h2>Contact Information</h2>
              <div className={styles.infoRow}>
                <span className={styles.highlight}>Phone:</span>
                <span className={styles.information}>{placeDetails?.formatted_phone_number ?? "Not available"}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.highlight}>Website:</span>
                {placeDetails?.website ? (
                  <a href={placeDetails.website} target="_blank" rel="noreferrer">
                    {placeDetails.website}
                  </a>
                ) 
                :(
                  <span className={styles.information}>Not available</span>
                )}

              </div>
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