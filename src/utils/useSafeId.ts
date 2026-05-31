import { useId } from 'react';

/**
 * Call React's `useId()` once and return a DOM-safe id.
 *
 * React's generated ids contain characters (`:`) that are invalid in DOM id
 * attributes and CSS selectors. This hook strips everything outside
 * `[a-zA-Z0-9_-]` (the canonical, stricter rule across the library) and,
 * when a `prefix` is supplied, returns `animal-<prefix>-<id>` to mirror the
 * id shape the components already produced so existing selectors and aria
 * wiring continue to match.
 */
export function useSafeId(prefix?: string): string {
    const safe = useId().replace(/[^a-zA-Z0-9_-]/g, '');
    return prefix ? `animal-${prefix}-${safe}` : safe;
}
