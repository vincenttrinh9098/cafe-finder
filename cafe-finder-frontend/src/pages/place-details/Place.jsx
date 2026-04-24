import { Link } from 'react-router';
import { useState } from 'react';
import './Place.css';

export function Place() {
  const [count, setCount] = useState(0);

  return (
    <>
    <div className="place-page">
      <div className="place-header">
        <a href="https://vite.dev" target="_blank">
          <img src={''} className="place-logo place-vite" alt="Vite logo" />
        </a>

        <a href="https://react.dev" target="_blank">
          <img src={''} className="place-logo place-react" alt="React logo" />
        </a>
      </div>

      <h1 className="place-title">Place Page</h1>

      <Link className="place-link" to="/">
        Go to Home
      </Link>

      <div className="place-card">
        <button
          className="place-button"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>

        <p className="place-text">
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <p className="place-footer">
        Click on the Vite and React logos to learn more
      </p>
    </div>
    </>
  );
}