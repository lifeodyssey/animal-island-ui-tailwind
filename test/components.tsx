import { useState, type ReactNode } from 'react';

export type ControlledChildren<TValue, TChange> = (props: {
    value: TValue;
    onChange: (next: TChange) => void;
}) => ReactNode;

export type ControlledRenderProps<TValue, TChange> = {
    children: ControlledChildren<TValue, TChange>;
    initial?: TValue;
    onChange?: (next: TChange) => void;
};

export function ControlledHost<TValue, TChange>({
    children,
    initial,
    onChange,
}: ControlledRenderProps<TValue, TChange>) {
    const [v, setV] = useState<TValue | undefined>(initial);
    const setVAndNotify = (next: TChange) => {
        setV(next as unknown as TValue);
        onChange?.(next);
    };
    return <>{children({ value: v as TValue, onChange: setVAndNotify })}</>;
}
