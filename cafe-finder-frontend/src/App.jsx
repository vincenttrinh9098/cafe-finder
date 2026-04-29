import { Routes, Route } from 'react-router-dom';
import {Discovery} from './pages/discovery/Discovery';
import {Place} from './pages/place-details/Place';
import Profile from './pages/profile/Profile';

function App() {

  return (
    
    <Routes>
      <Route index element ={<Discovery/>} />
      <Route path="place" element={<Place/>} />
      <Route path="profile" element={<Profile />} />
    </Routes>

  )
}

export default App
