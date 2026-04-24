import { Link } from 'react-router';
//import { useState } from 'react';
import styles from './Place.module.css';

export function Place() {
   // const [count, setCount] = useState(0);
 
   return (
     <div className={styles.placePage}>
 
       {/* Discovery page search bar */}
       <div className={styles.header}>
         <div className={styles.searchWrapper}>
 
           <input
             className={styles.searchBar}
             placeholder="Search cafes, tea spots, bakeries..."
           />
 
           <div className={styles.searchSuggestions}>
             {/* suggestions go here */}
           </div>
 
         </div>
       </div>
 
       {/* Discovery page top rated container */}
       <div className={styles.topRatedContainer}>
         <div className={styles.topRatedCard}>
           {/* top rated content */}
         </div>
       </div>
 
       {/* Discovery page suggestions container */}
       <div className={styles.suggestionsContainer}>
         {/* suggestions content */}
       </div>
 
     </div>
   );
 }