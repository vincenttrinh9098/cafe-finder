import {useState} from 'react';
import styles from './Discovery.module.css';
import { SearchBar } from './SearchBar.jsx'
import { TopRatedPlaces } from './TopRatedPlaces.jsx'
import {SuggestedRatedPlaces} from './SuggestedRatedPlaces.jsx'
import {SearchedPlaces} from './SearchedPlaces.jsx'

export function Discovery() {
  const [results, setResults] = useState([]);

  return (
    <div className={styles.discoveryPage}>
      <SearchBar onResults={setResults} />

      {results.length > 0 ? 
      (
        <SearchedPlaces places={results} />
      ) 
      : 
      (
        <>
          <TopRatedPlaces />
          <SuggestedRatedPlaces />
        </>
      )}
    </div>
  );
}