import styles from './ReviewCard.module.css';


const CHAR_LIMIT = 150;

function truncate(text) {
  if (!text) return null;
  if (text.length <= CHAR_LIMIT) return { text, truncated: false };
  return { text: text.slice(0, CHAR_LIMIT).trimEnd() + '…', truncated: true };
}

function getRatingBadgeClass(score) {
  if (score >= 4) return styles.green;
  if (score >= 3) return styles.yellow;
  return styles.red;
}

function formatStudyScore(score) {
  if (!Number.isFinite(score)) return "N/A";
  return score.toFixed(1);
}

export default function ReviewCard({ review, onSelect}) {
  const preview = truncate(review.comments);
  const hasComment = review.comments && review.comments.trim() !== '';
  const studyScore = Number(review.study_score);

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
    <div className={styles.reviewCard} onClick={onSelect}>
      <div className={styles.reviewCardHeader}>
        <div>
          <p className={styles.spotName}>{review.places?.name ?? "Unknown place"}</p>
          <p className={styles.reviewMeta}>{timeAgo}</p>
        </div>
        <div className={`${styles.ratingBadge} ${getRatingBadgeClass(studyScore)}`}>
          <span>{formatStudyScore(studyScore)}</span>
        </div>
      </div>

      <div className={styles.selectionPills}>
        {selections.map((s) => (
          <span key={s} className={styles.pill}>{s}</span>
        ))}
      </div>
      {hasComment ? (
        <p className={styles.reviewComment}>
          {preview.text}
          {preview.truncated && (
            <span className={styles.readMoreHint}> read more</span>
          )}
        </p>
      ) : (
        console.log()
      )}

      {review.photos && review.photos.length > 0 && (
        <div className={styles.photoRow}>
          {review.photos.map((url, i) => (
            <img key={i} src={url} alt="review" className={styles.photoThumb} />
          ))}
        </div>
      )}
    </div>
  );
}
