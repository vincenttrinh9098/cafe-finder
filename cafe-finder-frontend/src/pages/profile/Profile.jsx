import { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import { useNavigate } from "react-router-dom";
import ReviewCard from './ReviewCard';
import ReviewDetailModal from './ReviewDetailModal';
import supabase from '../../lib/supabase';

export function Profile() {
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState(null);

  const navigate = useNavigate();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      return;
    }

    navigate("/login"); // or your route
  }
  
  useEffect(() => {
    const getData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { setLoading(false); return; }

      setUser(session.user);

      const { data: reviewsData, error: reviewsError } = await supabase
        .from("ratings")
        .select("*, places(name, address)")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false });

      console.log("reviews:", reviewsData, reviewsError);
      if (reviewsData) setReviews(reviewsData);

      setLoading(false);
    };
    getData();
  }, []);
  
  /*
  const formatAvgRating = (count, avg) => {
    if (!count || count === 0 || avg == null) return '—';
    return avg.toFixed(1);
  };*/

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Not logged in</p>;

  const memberSince = new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  const initials = user.email?.[0].toUpperCase();

  return (
    <div className={styles.page}>
      <div className={styles.profileHeader}>
        <div className={styles.headerRow}>
          <p className={styles.sectionLabel}>Profile</p>
          <button className={styles.signOutButton} onClick={handleLogout}>Sign Out</button>
        </div>

        <div className={styles.userRow}>
          <div className={styles.avatar}>{initials}</div>
          <div>
            <h1 className={styles.displayName}>{user.email}</h1>
            <p className={styles.memberSince}>Member since {memberSince}</p>
          </div>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <p className={styles.statNumber}>{reviews.length}</p>
            <p className={styles.statLabel}>{reviews.length === 1 ? 'review' : 'reviews'}</p>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <p className={styles.statNumber}>—</p>
            <p className={styles.statLabel}>avg rating given</p>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <p className={styles.statNumber}>0</p>
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