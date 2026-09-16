import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon, ICON_LIST } from './Icon';

const meta = {
    component: Icon,
    tags: ['ai-generated'],
    args: { name: 'icon-map' },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: { name: 'icon-map' },
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
                    <span style={{ fontSize: 12 }}>{name}</span>
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
                    <Icon name="icon-encyclopedia" size={px} />
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
                    <Icon name="icon-camera" size={s} />
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
                <Icon name="icon-design" size={40} bounce />
                <span style={{ fontSize: 12 }}>弹弹弹 bounce=true</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <Icon name="icon-design" size={40} />
                <span style={{ fontSize: 12 }}>静止 bounce=false</span>
            </div>
        </div>
    ),
};

export const AccessibleLabel: Story = {
    args: {
        name: 'icon-shopping',
        size: 36,
        'aria-label': '集合啦商店',
    },
};

export const ArtworkSurfaces: Story = {
    render: () => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {['#ffffff', '#fff9ed', '#344b43'].map((background) => (
                <div key={background} style={{ background, borderRadius: 16, padding: 20, display: 'flex', flexWrap: 'wrap', gap: 20 }}>
                    {(['icon-camera', 'icon-travel', 'icon-encyclopedia', 'icon-diy', 'icon-design', 'icon-map', 'icon-passport', 'icon-helicopter', 'icon-chat'] as const).map((name) => (
                        <div key={name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                            <Icon name={name} size={48} aria-label={name} />
                            <Icon name={name} size={32} />
                            <Icon name={name} size={24} />
                        </div>
                    ))}
                </div>
            ))}
        </div>
    ),
};
