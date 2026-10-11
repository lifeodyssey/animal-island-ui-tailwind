import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { Avatar, AvatarGroup, Badge, Button, CountUp, Rate, Upload } from '../src';

const meta = {
    title: 'Regression/Parity/Upstream Sync',
    tags: ['!dev', '!autodocs'],
    parameters: {
        layout: 'padded',
    },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

const pageStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 28,
    maxWidth: 980,
    fontFamily: 'var(--animal-font-family)',
} satisfies CSSProperties;

const sectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
} satisfies CSSProperties;

const rowStyle = {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
} satisfies CSSProperties;

const labelStyle = {
    fontSize: 13,
    color: 'var(--animal-color-text-secondary, #8c7a6e)',
    marginBottom: 4,
} satisfies CSSProperties;

export const BadgeStory: Story = {
    name: 'Badge',
    render: () => (
        <div style={pageStyle}>
            <div style={sectionStyle}>
                <div style={labelStyle}>Count badges</div>
                <div style={rowStyle}>
                    <Badge count={5}><Button>Messages</Button></Badge>
                    <Badge count={99}><Button>Notifications</Button></Badge>
                    <Badge count={100} overflowCount={99}><Button>Overflow</Button></Badge>
                    <Badge count={0} showZero><Button>Zero</Button></Badge>
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Dot badge</div>
                <div style={rowStyle}>
                    <Badge dot><Button>Updates</Button></Badge>
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Standalone badges</div>
                <div style={rowStyle}>
                    <Badge count={5} />
                    <Badge count={99} />
                    <Badge dot />
                    <Badge count={5} size="small" />
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Colors</div>
                <div style={rowStyle}>
                    {(['app-red', 'app-orange', 'app-yellow', 'app-green', 'app-teal', 'app-blue', 'app-purple', 'app-pink'] as const).map((color) => (
                        <Badge key={color} count={color} color={color} />
                    ))}
                </div>
            </div>
        </div>
    ),
};

export const AvatarStory: Story = {
    name: 'Avatar',
    render: () => (
        <div style={pageStyle}>
            <div style={sectionStyle}>
                <div style={labelStyle}>Sizes</div>
                <div style={rowStyle}>
                    <Avatar size="small">A</Avatar>
                    <Avatar size="middle">B</Avatar>
                    <Avatar size="large">C</Avatar>
                    <Avatar size={64}>D</Avatar>
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Shapes</div>
                <div style={rowStyle}>
                    <Avatar>Circle</Avatar>
                    <Avatar shape="square">Sq</Avatar>
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>With image</div>
                <div style={rowStyle}>
                    <Avatar src="https://api.dicebear.com/7.x/adventurer/svg?seed=Felix" alt="Felix" />
                    <Avatar src="/bad-url.png" alt="fallback test">FB</Avatar>
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Avatar Group</div>
                <AvatarGroup maxCount={3} gap={12}>
                    <Avatar>A</Avatar>
                    <Avatar>B</Avatar>
                    <Avatar>C</Avatar>
                    <Avatar>D</Avatar>
                    <Avatar>E</Avatar>
                </AvatarGroup>
            </div>
        </div>
    ),
};

export const RateStory: Story = {
    name: 'Rate',
    render: () => {
        const [value, setValue] = useState(3);
        return (
            <div style={pageStyle}>
                <div style={sectionStyle}>
                    <div style={labelStyle}>Sizes</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <Rate size="small" defaultValue={3} />
                        <Rate size="middle" defaultValue={3} />
                        <Rate size="large" defaultValue={3} />
                    </div>
                </div>
                <div style={sectionStyle}>
                    <div style={labelStyle}>Controlled (value: {value})</div>
                    <Rate value={value} onChange={setValue} />
                </div>
                <div style={sectionStyle}>
                    <div style={labelStyle}>Readonly</div>
                    <Rate defaultValue={4} readonly />
                </div>
                <div style={sectionStyle}>
                    <div style={labelStyle}>Allow clear disabled</div>
                    <Rate defaultValue={3} allowClear={false} />
                </div>
                <div style={sectionStyle}>
                    <div style={labelStyle}>Count = 10</div>
                    <Rate count={10} defaultValue={7} />
                </div>
            </div>
        );
    },
};

export const UploadStory: Story = {
    name: 'Upload',
    render: () => (
        <div style={pageStyle}>
            <div style={sectionStyle}>
                <div style={labelStyle}>Default (text list)</div>
                <Upload />
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Drag zone</div>
                <Upload drag tip="支持 PNG / JPG / PDF，单文件不超过 10MB" accept="image/*,.pdf" />
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Picture card</div>
                <Upload listType="picture-card" multiple />
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Disabled</div>
                <Upload disabled />
            </div>
        </div>
    ),
};

export const CountUpStory: Story = {
    name: 'CountUp',
    render: () => {
        const [isCounting, setIsCounting] = useState(false);
        return (
            <div style={pageStyle}>
                <div style={sectionStyle}>
                    <div style={labelStyle}>Basic</div>
                    <div style={rowStyle}>
                        <Button onClick={() => setIsCounting((v) => !v)}>
                            {isCounting ? 'Pause' : 'Start'}
                        </Button>
                        <CountUp start={0} end={12345} duration={2} isCounting={isCounting} thousandsSeparator="," />
                    </div>
                </div>
                <div style={sectionStyle}>
                    <div style={labelStyle}>Sizes</div>
                    <div style={rowStyle}>
                        <CountUp end={9999} size="small" isCounting />
                        <CountUp end={9999} size="middle" isCounting />
                        <CountUp end={9999} size="large" isCounting />
                    </div>
                </div>
                <div style={sectionStyle}>
                    <div style={labelStyle}>Island variant with celebrate</div>
                    <CountUp
                        end={100}
                        variant="island"
                        isCounting
                        celebrate={{ text: '🎉 达成！' }}
                        prefix="¥"
                        suffix=" 分"
                    />
                </div>
                <div style={sectionStyle}>
                    <div style={labelStyle}>Bordered</div>
                    <CountUp end={42} bordered isCounting />
                </div>
            </div>
        );
    },
};
