import { useState } from 'react';
import styles from './Profile.module.css';
import ReviewCard from './ReviewCard';
import ReviewDetailModal from './ReviewDetailModal';

const DUMMY_USER = {
  displayName: 'Josh M.',
  initials: 'JM',
  memberSince: 'Sep 2024',
  reviewCount: 8,
  avgRating: 4.6,
  savedSpots: 3,
};

const DUMMY_REVIEWS = [
  {
    id: 1,
    spotName: 'Almanac Coffee',
    neighborhood: 'Little Italy',
    timeAgo: '2 days ago',
    rating: 5,
    comment: `This place has become my absolute go-to for any serious study session. The noise level is consistently low — even on weekends — and I've never struggled to find a seat. The WiFi is rock solid, I regularly pull 100+ Mbps which is more than enough for video calls or large file uploads. Outlets are everywhere, like seriously every table has at least one. The staff are super relaxed about how long you stay, no passive aggressive "are you going to order anything else" energy. Only minor gripe is parking can get tricky after noon but there's street parking a block away if you're patient. Would recommend to any student in the area without hesitation.`,
    selections: ['Quiet', 'Excellent wifi', 'Spacious'],
  },
  {
    id: 2,
    spotName: 'Matcha House',
    neighborhood: 'College Ave',
    timeAgo: '1 week ago',
    rating: 3,
    comment: null,
    selections: ['Quiet', 'Free lot', 'Excellent wifi', 'Spacious'],
  },
  {
    id: 3,
    spotName: 'Boba & Co.',
    neighborhood: 'Mission Valley',
    timeAgo: '2 weeks ago',
    rating: 3,
    comment: 'Great late-night option. A bit lively but the outlets are reliable.',
    selections: ['Moderate noise', 'Few outlets', 'Street parking'],
  },
  {
    id: 4,
    spotName: 'The Press',
    neighborhood: 'Hillcrest',
    timeAgo: '3 weeks ago',
    rating: 5,
    comment: 'Natural light is incredible in the morning. Gets busier after lunch but still manageable.',
    selections: ['Quiet', 'Free lot', 'Fast wifi', 'Moderate noise', 'Few outlets', 'Street parking'],
  },
  {
    id: 5,
    spotName: 'Blueprint Coffee',
    neighborhood: 'North Park',
    timeAgo: '1 month ago',
    rating: 1,
    comment: null,
    selections: ['Moderate noise', 'Limited parking', 'Few outlets'],
  },
  {
    id: 6,
    spotName: 'Caffeine & Coconuts',
    neighborhood: 'Pacific Beach',
    timeAgo: '1 month ago',
    rating: 3,
    comment: 'Chill beach town energy. Not the quietest but the vibe makes up for it. Good wifi speed.',
    selections: ['Lively', 'Street parking', 'Fast wifi'],
  },
  {
    id: 7,
    spotName: 'Study Grounds',
    neighborhood: 'Mission Hills',
    timeAgo: '2 months ago',
    rating: 5,
    comment: 'Hidden gem. Never crowded, tons of outlets, and the staff are super chill about staying long.',
    selections: ['Very quiet', 'Many outlets', 'Free lot'],
  },
  {
    id: 8,
    spotName: 'Rosso Coffee',
    neighborhood: 'East Village',
    timeAgo: '2 months ago',
    rating: 1,
    comment: null,
    selections: ['Loud', 'No parking', 'Moderate wifi',],
  },
];

export function Profile() {
  const [selectedReview, setSelectedReview] = useState(null);
  const user = DUMMY_USER;
  const reviews = DUMMY_REVIEWS;

  const formatAvgRating = (count, avg) => {
    if (count === 0) return '—';
    return avg.toFixed(1);
  };

  return (
    <div className={styles.page}>

      <div className={styles.profileHeader}>
        <p className={styles.sectionLabel}>Profile</p>
        <div className={styles.userRow}>
          <div className={styles.avatar}>{user.initials}</div>
          <div>
            <h1 className={styles.displayName}>{user.displayName}</h1>
            <p className={styles.memberSince}>Member since {user.memberSince}</p>
          </div>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <p className={styles.statNumber}>{user.reviewCount}</p>
            <p className={styles.statLabel}>{user.reviewCount === 1 ? 'review' : 'reviews'}</p>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <p className={styles.statNumber}>{formatAvgRating(user.reviewCount, user.avgRating)}</p>
            <p className={styles.statLabel}>avg rating given</p>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <p className={styles.statNumber}>{user.savedSpots}</p>
            <p className={styles.statLabel}>saved spots</p>
          </div>
        </div>
      </div>

      <div className={styles.reviewsSection}>
        <p className={styles.sectionLabel}>Reviews</p>

        {reviews.length === 0 ? (
          <p className={styles.emptyState}>No reviews yet</p>
        ) : (
          reviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              onSelect={() => setSelectedReview(review)}
            />
          ))
        )}
      </div>

      {selectedReview && (
        <ReviewDetailModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
        />
      )}
    </div>
  );
}
