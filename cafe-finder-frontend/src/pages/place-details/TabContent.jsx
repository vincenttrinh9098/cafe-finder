import { PlaceInfo } from './TabPlacesContent/PlaceInfo.jsx';
import { PlaceReviews } from './TabPlacesContent/PlaceReviews.jsx';
import { PlaceMap } from './TabPlacesContent/PlaceMap.jsx';

export function TabContent({ activeTab }) {
  switch (activeTab) {
    case "info":
      return <PlaceInfo />;
    case "reviews":
      return <PlaceReviews />;
    case "map":
      return <PlaceMap />;
    case "attribute":
      return (
        <div>
          <h2>Attribute</h2>
          <p>TBD...</p>
        </div>
      );
    default:
      return null;
  }
}