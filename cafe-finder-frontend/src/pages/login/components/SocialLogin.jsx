import supabase from '../../../lib/supabase'
import styles from '../Login.module.css'
import { GoogleIcon } from './GoogleIcon'

export function SocialLogin() {
  async function handleGoogleLogin() {
    console.log("VITE_APP_URL:", import.meta.env.VITE_APP_URL);
    console.log("redirectTo:", `${import.meta.env.VITE_APP_URL}/auth/callback`);
    
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${import.meta.env.VITE_APP_URL}/auth/callback`
      }
    })

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