import supabase from '../../../lib/supabase.js'
import styles from '../Login.module.css'
import { GoogleIcon } from './GoogleIcon'

export function SocialLogin() {

async function handleGoogleLogin() {
  const appUrl = import.meta.env.VITE_APP_URL || window.location.origin;
  console.log("redirectTo:", `${appUrl}/auth/callback`); //temporary debug log
  
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${appUrl}/auth/callback`,
      queryParams: {
        prompt: 'select_account',
      }
    }
  });
  if (error) console.error('Google login error:', error.message);
}

  return (
    <div className={styles.socialLogin}>
      {/* 
      <div className={styles.divider}>
        <span>or</span>
      </div> 
      */}

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