import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './Place.module.css';
import { PlaceHeader } from './TabPlacesContent/PlaceHeader.jsx';
import { TabBar } from './TabBar.jsx';
import { TabContent } from './TabContent.jsx';

export function Place() {
  const [activeTab, setActiveTab] = useState("info");
  const { state } = useLocation()
  const place = state?.place;
  console.log("place:", place);

  return (
    <div className={styles.placePage}>
      <PlaceHeader place = {place}/>

      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className={styles.dynamicSection}>
        <TabContent activeTab={activeTab} />
      </div>
    </div>
  );
}