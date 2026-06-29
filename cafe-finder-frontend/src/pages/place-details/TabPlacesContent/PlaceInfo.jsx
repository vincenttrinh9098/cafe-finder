import styles from './PlaceInfo.module.css'
import { getPlaceAttributes } from '../../../api/placesApi.js';
import { useState, useEffect } from 'react';
//import storeDetailTestImg from './store-details-test.png';

export function PlaceInfo({ place, placeDetails, loadingDetails }) {
  //console.log("placeDetails:", placeDetails);
  //console.log("loadingDetails:", loadingDetails);
  //console.log(place.google_place_id);

  const [attributes, setAttributes] = useState({});
  const [loadingAttributes, setLoadingAttributes] = useState(true);

  useEffect(() => {
    if (!place?.google_place_id) return;
    const fetch = async () => {
      try {
        const data = await getPlaceAttributes(place.google_place_id);
        setAttributes(data);
      } catch (err) {
        console.error("Failed to fetch attributes:", err);
      } finally {
        setLoadingAttributes(false);
      }
    };
    fetch();
  }, [place?.google_place_id]);


  console.log(attributes);

  return (
    <div className={styles.dynamicInfoSection}>

      <div className={styles.dynamicInfo}>
        <h2>Facility Snapshot</h2>
        {loadingAttributes ? (
          <p>Loading...</p>
        ) : attributes.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          <div className={styles.attributeBars}>
            <AttributeBar category="noise" value={attributes[0]} />
            <AttributeBar category="foot_traffic" value={attributes[1]} />
            <AttributeBar category="seating" value={attributes[2]} />
            <AttributeBar category="outlet" value={attributes[3]} />
            <AttributeBar category="parking" value={attributes[4]} />
          </div>
        )}
      </div>

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
            <a href={placeDetails.website} target="_blank" rel="noreferrer" className={styles.infomation}>
              {placeDetails.website}
            </a>
          )
            : (
              <span className={styles.information}>Not available</span>
            )}

        </div>
      </div>

    </div>
  );


}

const attributeConfig = {
  noise: {
    label: "Noise Level",
    levels: ["very quiet", "quiet", "moderate noise", "loud", "very loud"],
    colors: ["#4caf50", "#8bc34a", "#ffc107", "#ff9800", "#f44336"],
  },

  foot_traffic: {
    label: "Foot Traffic",
    levels: ["nearly empty", "lightly busy", "busy", "very Busy"],
    colors: ["#4caf50", "#8bc34a", "#ffc107", "#ff9800", "#f44336"],
  },

  seating: {
    label: "Seating",
    levels: ["plenty of seats", "some seats", "limited seats", "usually full"],
    colors: ["#4caf50", "#8bc34a", "#ff9800", "#f44336"],
  },

  outlet: {
    label: "Outlets",
    levels: ["plenty of outlets", "some outlets available", "limited outlets", "no visible outlets"],
    colors: ["#4caf50", "#8bc34a", "#ff9800", "#f44336"],
  },

  parking: {
    label: "Parking",
    levels: ["plenty of parking", "moderate parking", "limited parking", "very hard to park"],
    colors: ["#4caf50", "#8bc34a", "#ff9800", "#f44336"],
  },
};

function AttributeBar({ category, value }) {
  const config = attributeConfig[category];
  if (!config || !value) return null;

  const index = config.levels
    .map(v => v.toLowerCase())
    .indexOf(value.toLowerCase());

  //console.log("category:", category, "value:", value, "index:", index);
  //console.log("RAW value:", JSON.stringify(value));
  //console.log("LEVELS:", config.levels.map(v => JSON.stringify(v)));
  if (index === -1) return null;

  const total = config.levels.length;
  const reversedIndex = total - 1 - index; // 
  const percentage = ((reversedIndex + 1) / total) * 100; 
  const color = config.colors[index]; 

  return (
    <div className={styles.attributeCard}>
      <div className={styles.attributeCardTop}>
        <span className={styles.attributeLabel}>{config.label}</span>
        <span className={styles.attributeValue}>{value}</span>
      </div>
      <div className={styles.barBackground}>
        <div
          className={styles.barFill}
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}