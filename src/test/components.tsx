import React, { useState } from 'react';

interface ControlledHostProps<V, C> {
    initial: V;
    onChange?: (value: C) => void;
    children: (props: { value: V; onChange: (value: C) => void }) => React.ReactNode;
}

export function ControlledHost<V, C>({ initial, onChange, children }: ControlledHostProps<V, C>) {
    const [value, setValue] = useState<V>(initial);
    const handleChange = (v: C) => {
        setValue(v as unknown as V);
        onChange?.(v);
    };
    return <>{children({ value, onChange: handleChange })}</>;
}
