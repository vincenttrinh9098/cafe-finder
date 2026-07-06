import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../lib/supabase.js';
import styles from './AuthCallBack.module.css'

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
  
    const handleCallback = async () => {
      console.log("full URL:", window.location.href);
      console.log("search params:", window.location.search);
      console.log("hash:", window.location.hash);

      const code = new URLSearchParams(window.location.search).get('code');
      console.log("code:", code ? "present" : "missing");

      if (code) {
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);
        console.log("exchange result:", data?.session?.user?.id, error?.message);

        if (data?.session) {
          navigate(`/profile/${data.session.user.id}`, { replace: true });
          return;
        }
      }

      const { data: { session }, error } = await supabase.auth.getSession();
      console.log("getSession result:", session?.user?.id, error?.message);

      if (session) {
        navigate(`/profile/${session.user.id}`, { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    };

    handleCallback();
  }, []);

  return <div className={styles.loadingContainer}>
    <p className={styles.loadingText}>Loading profile standby...</p>
  </div>;
}
