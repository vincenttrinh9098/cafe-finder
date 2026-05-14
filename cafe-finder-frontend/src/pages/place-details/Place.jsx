import { useState, useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Place.module.css';
import { PlaceHeader } from './PlaceHeader.jsx';
import { TabBar } from './TabBar.jsx';
import { TabContent } from './TabContent.jsx';

export function Place() {
  const [activeTab, setActiveTab] = useState("info");
  const { state } = useLocation()
  const place = state?.place;
  //console.log("place:", place);
  //console.log

  const [placeDetails, setPlaceDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!place?.google_place_id) return;

    const fetchDetails = async () => {
        try {
            const res = await fetch(`http://localhost:3000/api/places/details?place_id=${place.google_place_id}`);
            const data = await res.json();
            setPlaceDetails(data); 
        } catch (err) {
            console.error("Failed to fetch place details:", err);
        } finally {
            setLoadingDetails(false);
        }
    };

    fetchDetails();
  }, [place?.google_place_id]);

  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      (err) => console.error(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);
  return (
    <div className={styles.placePage}>
      <PlaceHeader place = {place}/>

      <TabBar activeTab={activeTab} setActiveTab={setActiveTab}/>

      <div className={styles.dynamicSection}>
      <TabContent activeTab={activeTab} place={place} placeDetails={placeDetails} loadingDetails={loadingDetails} userLocation={userLocation} />
      </div>
    </div>
  );
}