import { useEffect } from 'react';
import styles from './ReviewDetailModal.module.css';
import { Link } from 'react-router';
import trashcan from '../../assets/images/trashcan.png';
import { deleteReview } from '../../api/PlacesApi';
import { useState } from 'react';
import { useSwipe } from '../../hooks/useSwipe';


export default function ReviewDetailModal({ review, onClose, isOwnProfile, onReviewDeleted }) {

  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);
  const [selectedPhotoSet, setSelectedPhotoSet] = useState([]);

    const swipeHandlers = useSwipe(
        // swipe left -> next photo
        () => {
            if (selectedPhotoIndex < selectedPhotoSet.length - 1) {
                setSelectedPhotoIndex(prev => prev + 1);
            }
        },
        // swipe right ->previous photo
        () => {
            if (selectedPhotoIndex > 0) {
                setSelectedPhotoIndex(prev => prev - 1);
            }
        }
    );
  useEffect(() => {
    // locks the page so user can't scroll while modal is open
    document.body.style.overflow = 'hidden';
    // when modal closes, resets overflow back to ''
    return () => { document.body.style.overflow = ''; };
  }, []);

  const selections = [
    review.noise,
    review.foot_traffic,
    review.seating,
    review.outlet,
    review.parking,
  ].filter(Boolean);

  /*const timeAgo = new Date(review.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });*/

  //console.log(review);

  const deleteOption = async (id) => {
    try {
      await deleteReview(id);
      onClose();
      onReviewDeleted(); // ← refresh the list
    } catch (err) {
      console.error("Failed to delete review:", err);
    }
  };
  return (
    <div className={styles.backdrop} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={styles.detailSheet}>

        <div className={styles.detailHeader}>
          <button className={styles.backBtn} onClick={onClose}>
            ←
          </button>

          {isOwnProfile && (
            <button
              className={styles.deleteBtn}
              onClick={() => deleteOption(review.id)}
            >
              <img className={styles.deleteBtnImg} src={trashcan} alt="Delete" />
            </button>
          )}
        </div>

        <div className={styles.detailContent}>
          <div className={styles.detailTopRow}>
            <Link
              key={review.google_place_id}
              to={`/place/${review.google_place_id}`}
              className={styles.reviewLink}
            >
              <p className={styles.detailSpotName}>
                {review.places?.name ?? "Unknown place"}
              </p>
              <p className={styles.detailMeta}> {review.places?.address} </p>
              {/*<p className={styles.detailMeta}> {timeAgo}</p>*/}
            </Link>
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
                  <img key={i} src={url} alt="review" className={styles.photoThumb} onClick={() => {
                    setSelectedPhotoSet(review.photos);
                    setSelectedPhotoIndex(i);
                  }} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      {selectedPhotoIndex !== null && (
        <div
          className={styles.photoModal}
          onClick={() => setSelectedPhotoIndex(null)}
          {...swipeHandlers}
        >
          <img
            src={selectedPhotoSet[selectedPhotoIndex]}
            className={styles.enlargedPhoto}
            alt="Enlarged review"
            onClick={(e) => e.stopPropagation()}
          />
          {selectedPhotoSet.length > 1 && (
            <div className={styles.photoDots}>
              {selectedPhotoSet.map((_, i) => (
                <span
                  key={i}
                  className={`${styles.photoDot} ${i === selectedPhotoIndex ? styles.photoDotActive : ""}`}
                  onClick={(e) => { e.stopPropagation(); setSelectedPhotoIndex(i); }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}