import { Link } from 'react-router';
import styles from './Discovery.module.css';
import { SearchBar } from './SearchBar.jsx'
import { TopRatedPlaces } from './TopRatedPlaces.jsx'
import {SuggestedRatedPlaces} from './SuggestedRatedPlaces.jsx'

export function Discovery() {
  return (
    <div className={styles.discoveryPage}>
      <SearchBar/>
      <TopRatedPlaces/>
      <SuggestedRatedPlaces/>
    </div>
  );
}