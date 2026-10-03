import { useEffect, useState } from 'react';
import { fetchHealth } from '../../api/endpoints.js';
import { Wifi, WifiOff } from 'lucide-react';
import './ConnectionBadge.css';

/**
 * Polls the health endpoint to show connection status.
 * Polls every 15s. Shows a small badge in the top nav.
 */
export function ConnectionBadge() {
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function check() {
      try {
        await fetchHealth();
        if (mounted) setConnected(true);
      } catch {
        if (mounted) setConnected(false);
      }
    }

    check();
    const interval = setInterval(check, 15_000);
    return () => { mounted = false; clearInterval(interval); };
  }, []);

  return (
    <span
      className={`connection-badge ${connected ? 'connection-badge--ok' : 'connection-badge--err'}`}
      role="status"
      aria-label={connected ? 'Connected to server' : 'Disconnected from server'}
    >
      {connected ? <Wifi size={14} aria-hidden="true" /> : <WifiOff size={14} aria-hidden="true" />}
      <span className="connection-badge__text">
        {connected ? 'Online' : 'Offline'}
      </span>
    </span>
  );
}
