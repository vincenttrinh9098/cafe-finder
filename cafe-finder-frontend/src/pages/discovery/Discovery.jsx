import { Link } from 'react-router';
import { useState } from 'react';
import './Discovery.css';

export function Discovery() {
  const [count, setCount] = useState(0);

  return (
    <>
    <div className="discovery-page">
      <div className="discovery-header">
        <a href="https://vite.dev" target="_blank">
          <img src={''} className="discovery-logo discovery-vite" alt="Vite logo" />
        </a>

        <a href="https://react.dev" target="_blank">
          <img src={''} className="discovery-logo discovery-react" alt="React logo" />
        </a>
      </div>

      <h1 className="discovery-title">Vite + React</h1>

      <Link className="discovery-link" to="/place">
        Go to Place
      </Link>

      <div className="discovery-card">
        <button
          className="discovery-button"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>

        <p className="discovery-text">
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>

      <p className="discovery-footer">
        Click on the Vite and React logos to learn more
      </p>
    </div>
    </>
  );
}