import { useState, useEffect } from 'react';
import { useParams } from "react-router";

import styles from './Profile.module.css';
import { useNavigate } from "react-router-dom";
import ReviewCard from './ReviewCard';
import ReviewDetailModal from './ReviewDetailModal';
import supabase from '../../lib/supabase';
import { NavBar } from '../navigation/NavBar';

export function Profile() {
  const { profileId } = useParams();
  const [user, setUser] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [avgReviews, setAvgReviews] = useState(null);
  const [profileOwner, setProfileOwner] = useState(null);


  const navigate = useNavigate();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error(error);
      return;
    }

    navigate("/");
  }

  const fetchReviews = async () => {
    if (!profileId) return;

    const { data: reviewsData, error } = await supabase
      .from("ratings")
      .select("*, places(name, address)")
      .eq("user_id", profileId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      return;
    }

    if (!reviewsData) return;

    // Set profile owner from first review
    if (reviewsData.length > 0) {
      setProfileOwner({
        name: reviewsData[0].user_name,
        initials: reviewsData[0].user_name?.[0]?.toUpperCase() ?? "?",
      });
    }

    // Calculate average safely
    const avgStudy =
      reviewsData.length > 0
        ? reviewsData.reduce(
          (sum, r) => sum + Number(r.study_score || 0),
          0
        ) / reviewsData.length
        : 0;

    setReviews(reviewsData);
    setAvgReviews(avgStudy.toFixed(2));
  };


  useEffect(() => {
    const getData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        setIsOwnProfile(session.user.id === profileId);
      } else {
        setIsOwnProfile(false);
      }

      await fetchReviews();
      setLoading(false);
    };

    getData();
  }, [profileId]);




  if (loading) return <p>Loading...</p>;
  if (!profileOwner && reviews.length === 0) return <p>Profile not found</p>;

  const displayName = isOwnProfile
    ? user?.user_metadata?.name
    : profileOwner?.name ?? "Unknown User";

  const displayInitials = isOwnProfile
    ? user?.email?.[0].toUpperCase()
    : profileOwner?.initials ?? "?";

  const memberSince = isOwnProfile && user
    ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : null;

  return (
    <div className={styles.page}>
      <div className={styles.profileHeader}>
        <div className={styles.headerRow}>
          <p className={styles.sectionLabel}>Profile</p>
          {isOwnProfile && (  // only show sign out on own profile
            <button className={styles.signOutButton} onClick={handleLogout}>
              Sign Out
            </button>
          )}
        </div>

        <div className={styles.userRow}>
          <div className={styles.avatar}>{displayInitials}</div>
          <div>
            <h1 className={styles.displayName}>{displayName}</h1>
            {memberSince && (
              <p className={styles.memberSince}>Member since {memberSince}</p>
            )}
          </div>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <p className={styles.statNumber}>{reviews.length}</p>
            <p className={styles.statLabel}>{reviews.length === 1 ? 'review' : 'reviews'}</p>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <p className={styles.statNumber}>{avgReviews}</p>
            <p className={styles.statLabel}>avg rating given</p>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            {/*<p className={styles.statNumber}>0</p>
            <p className={styles.statLabel}>saved spots</p>*/}
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
              isOwnProfile={isOwnProfile}
            />
          ))
        )}
      </div>

      {selectedReview && (
        <ReviewDetailModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
          isOwnProfile={isOwnProfile}
          onReviewDeleted={fetchReviews}
        />
      )}
      <NavBar />
    </div>

  );
}