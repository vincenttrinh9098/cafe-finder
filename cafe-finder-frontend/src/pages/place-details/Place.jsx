import { useState } from 'react';
import styles from './Place.module.css';

import { PlaceHeader } from './TabPlacesContent/PlaceHeader.jsx';
import { TabBar } from './TabBar.jsx';
import { TabContent } from './TabContent.jsx';

export function Place() {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <div className={styles.placePage}>
      <PlaceHeader />

      <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className={styles.dynamicSection}>
        <TabContent activeTab={activeTab} />
      </div>
    </div>
  );
}