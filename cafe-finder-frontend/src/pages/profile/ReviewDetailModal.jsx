import { useEffect } from 'react';
import styles from './ReviewDetailModal.module.css';

export default function ReviewDetailModal({ review, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className={styles.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.detailSheet}>

        <div className={styles.detailHeader}>
          <button className={styles.backBtn} onClick={onClose}>←</button>
        </div>

        <div className={styles.detailContent}>
          <div className={styles.detailTopRow}>
            <div>
              <p className={styles.detailSpotName}>{review.spotName}</p>
              <p className={styles.detailMeta}>{review.neighborhood} · {review.timeAgo}</p>
            </div>
            <div className={styles.ratingBadge}>
              <span>{review.rating}</span>
            </div>
          </div>

          <div className={styles.detailDivider} />

          <p className={styles.detailSectionLabel}>Selections</p>
          <div className={styles.selectionPills}>
            {review.selections.map((s) => (
              <span key={s} className={styles.pill}>{s}</span>
            ))}
          </div>

          {review.comment && review.comment.trim() !== '' && (
            <>
              <div className={styles.detailDivider} />
              <p className={styles.detailSectionLabel}>Comment</p>
              <p className={styles.detailComment}>{review.comment}</p>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
