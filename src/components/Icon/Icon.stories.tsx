import type { Meta, StoryObj } from '@storybook/react-vite';
import { HeartIcon } from './src';
import { Icon, ICON_LIST } from './Icon';

const meta = {
    component: Icon,
    tags: ['ai-generated'],
    args: { name: 'Heart' },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { name: 'Heart' },
};

export const AllIcons: Story = {
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'center' }}>
            {ICON_LIST.map(({ name }) => (
                <div
                    key={name}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
                >
                    <Icon name={name} size={32} />
                    <span style={{ fontSize: 11 }}>{name}</span>
                </div>
            ))}
        </div>
    ),
};

export const SizeNumeric: Story = {
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-end' }}>
            {[16, 24, 32, 48, 64].map((px) => (
                <div
                    key={px}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
                >
                    <Icon name="Flower" size={px} />
                    <span style={{ fontSize: 12 }}>{px}px</span>
                </div>
            ))}
        </div>
    ),
};

export const SizeString: Story = {
    render: () => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-end' }}>
            {['1rem', '1.5rem', '2rem', '3rem'].map((s) => (
                <div
                    key={s}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
                >
                    <Icon name="Star" size={s} />
                    <span style={{ fontSize: 12 }}>{s}</span>
                </div>
            ))}
        </div>
    ),
};

export const Bounce: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <Icon name="Rocket" size={40} bounce />
                <span style={{ fontSize: 12 }}>bounce=true</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <Icon name="Rocket" size={40} />
                <span style={{ fontSize: 12 }}>bounce=false</span>
            </div>
        </div>
    ),
};

export const AccessibleLabel: Story = {
    args: {
        name: 'Star',
        size: 36,
        'aria-label': 'Favourite',
    },
};

export const CustomComponent: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Icon icon={HeartIcon} size={48} />
            <Icon icon={HeartIcon} size={48} color="red" strokeWidth={2} />
        </div>
    ),
};

export const CustomSrc: Story = {
    render: () => (
        <Icon src="https://example.com/icon.png" size={40} aria-label="Custom icon" />
    ),
};
