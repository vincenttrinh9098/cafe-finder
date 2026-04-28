import styles from './TabBar.module.css';

export function TabBar({ activeTab, setActiveTab }) {
  const tabs = ["info", "reviews", "map", "attribute"];

  return (
    <div className={styles.tabBar}>
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`${styles.tabBarButton} ${
            activeTab === tab ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab(tab)}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  );
}