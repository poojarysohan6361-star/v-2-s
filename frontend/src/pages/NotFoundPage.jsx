import { Compass, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import './NotFoundPage.css';

export function NotFoundPage() {
  return (
    <main className="not-found-page" id="main-content">
      <div className="not-found-card">
        <Compass size={48} className="not-found-icon" aria-hidden="true" />
        <h1 className="not-found-title">404 — Lost in the Uncharted Fog</h1>
        <p className="not-found-subtitle">
          The tile you are looking for does not exist on the Quest Board map.
        </p>
        <Link to="/" className="btn btn--primary btn--lg">
          <ArrowLeft size={18} aria-hidden="true" /> Return to Camp
        </Link>
      </div>
    </main>
  );
}
