import { useState, useEffect} from 'react';
import { useLocation,useParams } from 'react-router-dom';
import styles from './Place.module.css';
import { PlaceHeader } from './PlaceHeader.jsx';
import { TabBar } from './TabBar.jsx';
import { TabContent } from './TabContent.jsx';
import { NavBar } from '../navigation/NavBar.jsx';
import { getPlaceAttributes } from '../../api/placesApi.js';


export function Place() {
  const [activeTab, setActiveTab] = useState("info");
  const { state } = useLocation();
  const { placeId } = useParams();

  const [place, setPlace] = useState(state?.place ?? null);
  const [placeDetails, setPlaceDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!placeId) return;

    const fetchDetails = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/places/details?place_id=${placeId}`);
        const data = await res.json();
        setPlaceDetails(data);

        // if no state, build place object from details response
        //console.log("details data:", data);
        if (!state?.place) {
          const attributes = await getPlaceAttributes(placeId);
          setPlace({
            google_place_id: placeId,
            name: data.name,
            address: data.formatted_address,
            rating: data.rating,
            lat: data.lat,           // ← comes from backend now
            lng: data.lng,           // ← comes from backend now
            photo_reference: data.photo_reference,  // ← comes from backend now
            open_now: data.opening_hours?.open_now ?? null,
            distance: null,
            attributes: attributes,
          });
        }
      } catch (err) {
        console.error("Failed to fetch place details:", err);
      } finally {
        setLoadingDetails(false);
      }
    };

    fetchDetails();
  }, [placeId]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.error(err),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }, []);

  if (!place) return <p>Loading place...</p>;


  //console.log("placeId",placeId);
  //console.log("placeDetails",placeDetails);
  //console.log("place",place);

  return (
    <div className={styles.placePage}>
      <PlaceHeader place={place} />
      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className={styles.dynamicSection}>
        <TabContent
          activeTab={activeTab}
          place={place}
          placeDetails={placeDetails}
          loadingDetails={loadingDetails}
          userLocation={userLocation}
        />
      </div>

      <NavBar/>
      
    </div>
  );
}