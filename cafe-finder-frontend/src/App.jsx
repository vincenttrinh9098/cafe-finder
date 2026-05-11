import { Routes, Route } from 'react-router-dom';
import {Discovery} from './pages/discovery/Discovery';
import {Place} from './pages/place-details/Place';
import {Login} from './pages/login/Login';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {

  return (
    
    <Routes>
      <Route index element ={<Discovery/>} />
      <Route path="place" element={<Place/>} />
      <Route path="login" element={<Login />} />
      <Route></Route>
    </Routes>

  )
}

export default App
