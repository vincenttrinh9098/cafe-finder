import styles from '../Login.module.css'

export function SocialLogin() {
  function handleGoogleLogin() {
    // Supabase Google OAuth will go here
  }

  return (
    <div className={styles.socialLogin}>
      <div className={styles.divider}>
        <span>or</span>
      </div>
      <button type="button" className={styles.googleBtn} onClick={handleGoogleLogin}>
        Continue with Google
      </button>
    </div>
  )
}