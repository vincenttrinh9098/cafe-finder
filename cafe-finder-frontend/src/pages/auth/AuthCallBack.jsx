import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../lib/supabase.js';

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate(`/profile/${session.user.id}`, { replace: true });
      } else {
        navigate('/login', { replace: true });
      }
    };
    handleCallback();
  }, []);

  return <p>Logging you in...</p>;
}