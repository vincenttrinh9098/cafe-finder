import supabase from '../../../lib/supabase'
import styles from '../Login.module.css'
import { GoogleIcon } from './GoogleIcon'

export function SocialLogin() {
  async function handleGoogleLogin() {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback` // ← callback page
      }
    });
    if (error) {
      console.error('Google login error:', error.message)
    }
  }

  return (
    <div className={styles.socialLogin}>
      <div className={styles.divider}>
        <span>or</span>
      </div>

      <button
        type="button"
        className={styles.googleBtn}
        onClick={handleGoogleLogin}
      >
        <GoogleIcon />
        Continue with Google
      </button>
    </div>
  )
}