import React from 'react';
import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

afterEach(cleanup);
import { Avatar, AvatarGroup } from './Avatar';
import { User as UserIcon } from 'lucide-react';

const rootOf = (el: HTMLElement | null): HTMLElement | null => (el ? (el.parentElement as HTMLElement | null) : null);

describe('Avatar', () => {
    it('renders a placeholder with the default user icon when no src', () => {
        render(<Avatar />);
        const avatar = screen.getByRole('img', { name: 'avatar' });
        expect(avatar.className).toContain('animal-avatar');
        expect(avatar.className).toContain('animal-avatar-placeholder');
    });

    it('renders text children as the placeholder content', () => {
        render(<Avatar>U</Avatar>);
        expect(screen.getByText('U').className).toContain('animal-avatar-string');
    });

    it('renders a naive-icons style component child as an icon avatar', () => {
        const FishMock = () => <svg data-testid="fish-icon" aria-hidden="true" />;
        render(
            <Avatar>
                <FishMock />
            </Avatar>
        );
        const icon = screen.getByTestId('fish-icon');
        expect(rootOf(rootOf(icon))?.className).toContain('animal-avatar');
        expect(rootOf(rootOf(icon))?.className).toContain('animal-avatar-placeholder');
        const wrapper = icon.closest('span');
        expect(wrapper).not.toBeNull();
        expect(wrapper?.getAttribute('style')).toBeNull();
    });

    it('renders a custom icon node as the placeholder content', () => {
        render(<Avatar icon={<UserIcon data-testid="custom-icon" />} />);
        expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
    });

    it('applies the numeric size to width/height', () => {
        render(<Avatar size={56}>A</Avatar>);
        const avatar = rootOf(screen.getByText('A'));
        expect(avatar).toHaveStyle({ width: '56px', height: '56px' });
    });

    it('applies square shape class', () => {
        render(<Avatar shape="square" />);
        const avatar = screen.getByRole('img', { name: 'avatar' });
        expect(avatar.className).toContain('animal-avatar-shape-square');
    });

    it('renders an img with alt text when src is provided', () => {
        render(<Avatar src="/u.png" alt="U" />);
        expect(screen.getByRole('img', { name: 'U' })).toBeInTheDocument();
    });

    it('falls back to placeholder on image load error', () => {
        render(<Avatar src="/bad.png" />);
        const img = document.querySelector('img') as HTMLImageElement;
        fireEvent.error(img);
        expect(screen.getByRole('img', { name: 'avatar' })).toBeInTheDocument();
        expect(document.querySelector('img')).toBeNull();
    });

    it('onError returning false keeps the image rendered', () => {
        render(<Avatar src="/bad.png" onError={() => false} />);
        const img = document.querySelector('img') as HTMLImageElement;
        fireEvent.error(img);
        expect(document.querySelector('img')).not.toBeNull();
    });

    it('className is forwarded to the root span', () => {
        render(<Avatar className="extra" />);
        expect(screen.getByRole('img', { name: 'avatar' }).className).toContain('extra');
    });
});

describe('AvatarGroup', () => {
    it('renders all children when within maxCount', () => {
        render(
            <AvatarGroup maxCount={3}>
                <Avatar>A</Avatar>
                <Avatar>B</Avatar>
                <Avatar>C</Avatar>
            </AvatarGroup>
        );
        expect(screen.getByText('A')).toBeInTheDocument();
        expect(screen.getByText('B')).toBeInTheDocument();
        expect(screen.getByText('C')).toBeInTheDocument();
        expect(screen.queryByText(/^\+/)).toBeNull();
    });

    it('shows +N overflow badge when children exceed maxCount', () => {
        render(
            <AvatarGroup maxCount={2}>
                <Avatar>A</Avatar>
                <Avatar>B</Avatar>
                <Avatar>C</Avatar>
                <Avatar>D</Avatar>
            </AvatarGroup>
        );
        expect(screen.getByText('A')).toBeInTheDocument();
        expect(screen.getByText('B')).toBeInTheDocument();
        expect(screen.queryByText('C')).toBeNull();
        expect(screen.getByText('+2')).toBeInTheDocument();
    });

    it('root element has animal-avatar-group class', () => {
        const { container } = render(
            <AvatarGroup>
                <Avatar>X</Avatar>
            </AvatarGroup>
        );
        expect(container.firstChild).toHaveClass('animal-avatar-group');
    });
});
