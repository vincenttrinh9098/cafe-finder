import styles from './FilterPopUp.module.css';

export function FilterPopUp({ sort, setSort, onClose }) {
  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.dragHandle}></div>
        <div className={styles.innerModal}>
          <div className={styles.filterSection}>
            <p className={styles.filterTitle}>Sort</p>

            <label className={styles.filterRow}>
              <span>Distance</span>
              <input
                type="radio"
                name="sort"
                value="distance"
                checked={sort === "distance"}
                onChange={(e) => setSort(e.target.value)}
              />
            </label>

            <label className={styles.filterRow}>
              <span>Rating</span>
              <input
                type="radio"
                name="sort"
                value="rating"
                checked={sort === "rating"}
                onChange={(e) => setSort(e.target.value)}
              />
            </label>

            <label className={styles.filterRow}>
              <span>Study Score</span>
              <input
                type="radio"
                name="sort"
                value="studyScore"
                checked={sort === "studyScore"}
                onChange={(e) => setSort(e.target.value)}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}