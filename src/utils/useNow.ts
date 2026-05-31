import { useEffect, useState } from 'react';

/**
 * Return the current `Date`, re-rendering on a fixed interval (default 1s).
 *
 * Extracted from Time and Phone, which both kept an identical
 * `useState(new Date())` + `setInterval` clock tick with cleanup.
 */
export function useNow(intervalMs = 1000): Date {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setNow(new Date()), intervalMs);
        return () => clearInterval(timer);
    }, [intervalMs]);

    return now;
}
