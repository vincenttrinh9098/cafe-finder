import styles from './ReviewCard.module.css';

const CHAR_LIMIT = 150;

function truncate(text) {
  if (!text) return null;
  if (text.length <= CHAR_LIMIT) return { text, truncated: false };
  return { text: text.slice(0, CHAR_LIMIT).trimEnd() + '…', truncated: true };
}

export default function ReviewCard({ review, onSelect }) {
  const preview = truncate(review.comment);
  const hasComment = review.comment && review.comment.trim() !== '';

  return (
    <div className={styles.reviewCard} onClick={onSelect}>
      <div className={styles.reviewCardHeader}>
        <div>
          <p className={styles.spotName}>{review.spotName}</p>
          <p className={styles.reviewMeta}>{review.neighborhood} · {review.timeAgo}</p>
        </div>
        <div className={styles.ratingBadge}>
          <span>{review.rating}</span>
        </div>
      </div>

      {hasComment ? (
        <p className={styles.reviewComment}>
          {preview.text}
          {preview.truncated && (
            <span className={styles.readMoreHint}> read more</span>
          )}
        </p>
      ) : (
        <div className={styles.selectionPills}>
          {review.selections.map((s) => (
            <span key={s} className={styles.pill}>{s}</span>
          ))}
        </div>
      )}
    </div>
  );
}
