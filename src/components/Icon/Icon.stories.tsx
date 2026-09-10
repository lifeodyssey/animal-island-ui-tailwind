import type { Meta, StoryObj } from '@storybook/react-vite';
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
            {ICON_LIST.map(({ name, label }) => (
                <div
                    key={name}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}
                >
                    <Icon name={name} size={32} />
                    <span style={{ fontSize: 12 }}>{label}</span>
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
                    <Icon name="Camera" size={s} />
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
                <Icon name="Star" size={40} bounce />
                <span style={{ fontSize: 12 }}>弹弹弹 bounce=true</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <Icon name="Star" size={40} />
                <span style={{ fontSize: 12 }}>静止 bounce=false</span>
            </div>
        </div>
    ),
};

export const AccessibleLabel: Story = {
    args: {
        name: 'ShoppingBag',
        size: 36,
        'aria-label': '集合啦商店',
    },
};

export const ColorAndStroke: Story = {
    render: () => (
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <Icon name="Heart" size={40} color="#E76F51" />
            <Icon name="Heart" size={40} color="#2A9D8F" strokeWidth={2} />
            <Icon name="Heart" size={40} color="#264653" strokeWidth={5} />
        </div>
    ),
};

export const SrcMode: Story = {
    args: {
        src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/SVG_Logo.svg/64px-SVG_Logo.svg.png',
        size: 48,
        'aria-label': 'SVG logo',
    },
};
