import React, { useRef } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { BackTop } from './BackTop';

const meta = {
    component: BackTop,
    tags: ['ai-generated'],
} satisfies Meta<typeof BackTop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    render: () => {
        const scrollRef = useRef<HTMLDivElement>(null);
        return (
            <div>
                <div
                    ref={scrollRef}
                    data-testid="backtop-scroll-area"
                    style={{ height: 220, overflow: 'auto', border: '1px dashed #d4c4a8', borderRadius: 12, padding: 16 }}
                >
                    {Array.from({ length: 30 }, (_, i) => (
                        <p key={i} style={{ margin: '0 0 12px' }}>
                            Scrollable content line {i + 1}
                        </p>
                    ))}
                </div>
                <BackTop target={() => scrollRef.current ?? window} visibilityHeight={50} />
            </div>
        );
    },
};
