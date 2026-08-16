import React, { useState } from 'react';

interface ControlledHostProps<V, C> {
    initial: V;
    onChange?: (v: C) => void;
    children: (props: { value: V; onChange: (v: C) => void }) => React.ReactNode;
}

/**
 * Thin wrapper that holds state for controlled-component tests.
 * Mirrors the value the child emits via onChange back into the child as value.
 */
export function ControlledHost<V = unknown, C = unknown>({
    initial,
    onChange,
    children,
}: ControlledHostProps<V, C>) {
    const [value, setValue] = useState<V>(initial);
    const handleChange = (v: C) => {
        setValue(v as unknown as V);
        onChange?.(v);
    };
    return <>{children({ value, onChange: handleChange })}</>;
}
