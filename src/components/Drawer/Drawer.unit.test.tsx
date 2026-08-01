import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { fireEvent, act } from '@testing-library/react';
import { Drawer } from './Drawer';

afterEach(() => {
    cleanup();
});

describe('Drawer', () => {
    describe('rendering', () => {
        it('renders without crashing when closed', () => {
            const { container } = render(<Drawer open={false} onClose={vi.fn()} />);
            expect(container).toBeInTheDocument();
        });

        it('renders panel with base animal-drawer-panel class', () => {
            render(<Drawer open onClose={vi.fn()} />);
            expect(document.querySelector('.animal-drawer-panel')).not.toBeNull();
        });

        it('renders title when provided', () => {
            render(<Drawer open title="Drawer Title" onClose={vi.fn()} />);
            expect(screen.getByText('Drawer Title')).toBeInTheDocument();
        });

        it('renders children in drawer body', () => {
            render(
                <Drawer open onClose={vi.fn()}>
                    <p>Drawer content</p>
                </Drawer>
            );
            expect(screen.getByText('Drawer content')).toBeInTheDocument();
        });

        it('renders footer when provided', () => {
            render(
                <Drawer open footer={<button type="button">OK</button>} onClose={vi.fn()} />
            );
            expect(document.querySelector('.animal-drawer-footer')).not.toBeNull();
        });
    });

    describe('placement classes', () => {
        it('applies animal-drawer-panel-right by default', () => {
            render(<Drawer open onClose={vi.fn()} />);
            expect(document.querySelector('.animal-drawer-panel-right')).not.toBeNull();
        });

        it('applies animal-drawer-panel-left for left placement', () => {
            render(<Drawer open placement="left" onClose={vi.fn()} />);
            expect(document.querySelector('.animal-drawer-panel-left')).not.toBeNull();
        });

        it('applies animal-drawer-panel-top for top placement', () => {
            render(<Drawer open placement="top" onClose={vi.fn()} />);
            expect(document.querySelector('.animal-drawer-panel-top')).not.toBeNull();
        });

        it('applies animal-drawer-panel-bottom for bottom placement', () => {
            render(<Drawer open placement="bottom" onClose={vi.fn()} />);
            expect(document.querySelector('.animal-drawer-panel-bottom')).not.toBeNull();
        });

        it('applies animal-drawer-panel-open when open=true', () => {
            render(<Drawer open onClose={vi.fn()} />);
            expect(document.querySelector('.animal-drawer-panel-open')).not.toBeNull();
        });

        it('does not apply animal-drawer-panel-open when open=false', () => {
            render(<Drawer open={false} onClose={vi.fn()} />);
            expect(document.querySelector('.animal-drawer-panel-open')).toBeNull();
        });
    });

    describe('mask', () => {
        it('renders mask element', () => {
            render(<Drawer open onClose={vi.fn()} />);
            expect(document.querySelector('.animal-drawer-mask')).not.toBeNull();
        });

        it('applies animal-drawer-mask-open when open=true', () => {
            render(<Drawer open onClose={vi.fn()} />);
            expect(document.querySelector('.animal-drawer-mask-open')).not.toBeNull();
        });

        it('calls onClose when mask clicked and maskClosable=true', () => {
            const onClose = vi.fn();
            render(<Drawer open maskClosable onClose={onClose} />);
            fireEvent.click(document.querySelector('.animal-drawer-mask')!);
            expect(onClose).toHaveBeenCalledTimes(1);
        });

        it('does not call onClose when mask clicked and maskClosable=false', () => {
            const onClose = vi.fn();
            render(<Drawer open maskClosable={false} onClose={onClose} />);
            fireEvent.click(document.querySelector('.animal-drawer-mask')!);
            expect(onClose).not.toHaveBeenCalled();
        });
    });

    describe('ESC key', () => {
        it('calls onClose when ESC is pressed while open', () => {
            const onClose = vi.fn();
            render(<Drawer open onClose={onClose} />);
            act(() => {
                fireEvent.keyDown(document, { key: 'Escape' });
            });
            expect(onClose).toHaveBeenCalledTimes(1);
        });

        it('does not call onClose when ESC is pressed while closed', () => {
            const onClose = vi.fn();
            render(<Drawer open={false} onClose={onClose} />);
            act(() => {
                fireEvent.keyDown(document, { key: 'Escape' });
            });
            expect(onClose).not.toHaveBeenCalled();
        });
    });

    describe('close button', () => {
        it('calls onClose when close button is clicked', () => {
            const onClose = vi.fn();
            render(<Drawer open title="Test" onClose={onClose} />);
            fireEvent.click(document.querySelector('.animal-drawer-close')!);
            expect(onClose).toHaveBeenCalledTimes(1);
        });
    });

    describe('accessibility', () => {
        it('renders with role=dialog', () => {
            render(<Drawer open title="Test" onClose={vi.fn()} />);
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        it('renders with aria-modal=true', () => {
            render(<Drawer open title="Test" onClose={vi.fn()} />);
            expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
        });
    });
});
