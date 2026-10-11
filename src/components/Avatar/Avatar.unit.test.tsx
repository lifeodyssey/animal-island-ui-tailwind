import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { Avatar } from './Avatar';

afterEach(cleanup);

describe('Avatar image fallback', () => {
    it('falls back on error and retries when src changes', () => {
        const onError = vi.fn();
        const { rerender } = render(<Avatar src="/broken.png" alt="Profile" onError={onError}>AB</Avatar>);
        fireEvent.error(screen.getByRole('img', { name: 'Profile' }));
        expect(screen.queryByRole('img', { name: 'Profile' })).not.toBeInTheDocument();
        expect(screen.getByText('AB')).toBeInTheDocument();
        expect(onError).toHaveBeenCalledTimes(1);

        rerender(<Avatar src="/replacement.png" alt="Profile" onError={onError}>AB</Avatar>);
        expect(screen.getByRole('img', { name: 'Profile' })).toHaveAttribute('src', '/replacement.png');
        expect(screen.queryByText('AB')).not.toBeInTheDocument();
    });

    it('allows the consumer to suppress fallback', () => {
        const onError = vi.fn(() => false);
        render(<Avatar src="/broken.png" alt="Profile" onError={onError}>AB</Avatar>);
        fireEvent.error(screen.getByRole('img', { name: 'Profile' }));
        expect(screen.getByRole('img', { name: 'Profile' })).toBeInTheDocument();
        expect(screen.queryByText('AB')).not.toBeInTheDocument();
    });

    it('collapses excess group members and preserves explicit child size', () => {
        render(
            <Avatar.Group maxCount={2} size={48}>
                <Avatar>A</Avatar>
                <Avatar size={24}>B</Avatar>
                <Avatar>C</Avatar>
            </Avatar.Group>
        );
        expect(screen.getByText('A').parentElement).toHaveStyle({ width: '48px', height: '48px' });
        expect(screen.getByText('B').parentElement).toHaveStyle({ width: '24px', height: '24px' });
        expect(screen.queryByText('C')).not.toBeInTheDocument();
        expect(screen.getByText('+1')).toBeInTheDocument();
    });
});
