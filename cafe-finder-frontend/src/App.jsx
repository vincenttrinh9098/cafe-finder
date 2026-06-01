import { Routes, Route } from 'react-router-dom';
import {Discovery} from './pages/discovery/Discovery';
import {Place} from './pages/place-details/Place';
import {Login} from './pages/login/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RouteTracker } from './components/RouteTracker';
import {Profile} from './pages/profile/Profile';

function App() {

  return (
    <>
    <RouteTracker />
    <Routes>
      <Route index element ={<Discovery/>} />
      <Route path="discovery" element = {<Discovery/>} />
      {/*<Route path="/place/:google_place_id" element={<Place />} />*/}
      <Route path="/place/:placeId" element={<Place />} />
      <Route path="login" element={<Login />} />
      <Route 
        path="profile" 
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } 
      />
    </Routes>
    </>
  );
}

export default App