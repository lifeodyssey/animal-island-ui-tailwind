import { useCallback, useState } from 'react';

export interface UseControllableStateOptions<T> {
    /** Controlled value. When not `undefined`, the component is controlled. */
    value?: T;
    /** Initial value used while uncontrolled. */
    defaultValue: T;
    /** Change callback. Fired after the internal state update in uncontrolled mode. */
    onChange?: (next: T) => void;
}

export interface UseControllableStateResult<T> {
    /** The current value (controlled value when controlled, internal state otherwise). */
    value: T;
    /** Commit a new value: update internal state (if uncontrolled) then fire `onChange`. */
    setValue: (next: T) => void;
    /** Whether the component is currently controlled. */
    isControlled: boolean;
}

/**
 * Shared controlled/uncontrolled state pattern.
 *
 * Mirrors the common idiom: when `value` is provided the component is
 * controlled and the internal state is ignored; otherwise the hook owns the
 * value via `useState(defaultValue)`. `setValue` always updates the internal
 * state first (only when uncontrolled) and then calls `onChange`, preserving
 * the exact fire order the components relied on previously.
 */
export function useControllableState<T>({
    value,
    defaultValue,
    onChange,
}: UseControllableStateOptions<T>): UseControllableStateResult<T> {
    const isControlled = value !== undefined;
    const [innerValue, setInnerValue] = useState<T>(defaultValue);
    const current = isControlled ? (value as T) : innerValue;

    const setValue = useCallback(
        (next: T) => {
            if (!isControlled) setInnerValue(next);
            onChange?.(next);
        },
        [isControlled, onChange],
    );

    return { value: current, setValue, isControlled };
}
