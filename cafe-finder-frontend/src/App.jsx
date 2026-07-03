import { Routes, Route,useNavigate } from 'react-router-dom';
import {useEffect} from 'react';
import { Discovery } from './pages/discovery/Discovery';
import { Place } from './pages/place-details/Place';
import { Login } from './pages/login/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RouteTracker } from './components/RouteTracker';
import { AuthCallback } from './pages/auth/AuthCallBack';
import { Profile } from './pages/profile/Profile';
import { useTrackLastRoute } from './hooks/useTrackLastRoute';
import ErrorBoundary from './components/ErrorBoundary';
import supabase from './lib/supabase';


function App() {
  useTrackLastRoute();
  const navigate = useNavigate();
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        console.log('Auth event:', event);
      }
      if (!session && event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  return (
    <>
      <ErrorBoundary>
        <Routes>
          <Route index element={<Discovery />} />
          <Route path="discovery" element={<Discovery />} />
          {/*<Route path="/place/:google_place_id" element={<Place />}/>*/}
          <Route path="/place/:placeId" element={<Place />} />
          <Route path="login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="profile/:profileId" element={<Profile />}
          />
        </Routes>
      </ErrorBoundary>

    </>
  );
}

export default App