import { useEffect } from 'react';
import styles from './ReviewDetailModal.module.css';

export default function ReviewDetailModal({ review, onClose }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  const selections = [
    review.noise,
    review.foot_traffic,
    review.seating,
    review.outlet,
    review.parking,
  ].filter(Boolean);

  const timeAgo = new Date(review.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  return (
    <div className={styles.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.detailSheet}>

        <div className={styles.detailHeader}>
          <button className={styles.backBtn} onClick={onClose}>←</button>
        </div>

        <div className={styles.detailContent}>
          <div className={styles.detailTopRow}>
            <div>
              <p className={styles.detailSpotName}>{review.places?.name ?? "Unknown place"}</p>
              <p className={styles.detailMeta}>{review.places?.address} · {timeAgo}</p>
            </div>
          </div>

          <div className={styles.detailDivider} />

          <p className={styles.detailSectionLabel}>Selections</p>
          <div className={styles.selectionPills}>
            {selections.map((s) => (
              <span key={s} className={styles.pill}>{s}</span>
            ))}
          </div>

          {review.comments && review.comments.trim() !== '' && (
            <>
              <div className={styles.detailDivider} />
              <p className={styles.detailSectionLabel}>Comment</p>
              <p className={styles.detailComment}>{review.comments}</p>
            </>
          )}

          {review.photos && review.photos.length > 0 && (
            <>
              <div className={styles.detailDivider} />
              <p className={styles.detailSectionLabel}>Photos</p>
              <div className={styles.photoRow}>
                {review.photos.map((url, i) => (
                  <img key={i} src={url} alt="review" className={styles.photoThumb} />
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}