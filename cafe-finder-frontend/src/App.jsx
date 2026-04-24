import { Routes, Route } from 'react-router-dom';
import {Discovery} from './pages/discovery/Discovery';
import {Place} from './pages/place-details/Place';

function App() {

  return (
    
    <Routes>
      <Route index element ={<Discovery/>} />
      <Route path="place" element={<Place/>} />
    </Routes>

  )
}

export default App
