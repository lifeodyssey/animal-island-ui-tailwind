import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import {
    BackTop,
    Button,
    Card,
    Drawer,
    Image,
    Notification,
    Progress,
    Skeleton,
    SkeletonAvatar,
    SkeletonButton,
    SkeletonInput,
    Tag,
} from '../src';

const meta = {
    title: 'Regression/Parity/New Components',
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
    gap: 16,
} satisfies CSSProperties;

const labelStyle = {
    color: '#a0936e',
    fontSize: 14,
    fontWeight: 700,
} satisfies CSSProperties;

export const TagParity: Story = {
    name: 'Tag',
    render: () => (
        <div style={pageStyle}>
            <div style={sectionStyle}>
                <div style={labelStyle}>Size</div>
                <div style={rowStyle}>
                    <Tag size="small">Small</Tag>
                    <Tag size="medium">Medium</Tag>
                    <Tag size="large">Large</Tag>
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Variant (default color)</div>
                <div style={rowStyle}>
                    <Tag variant="solid">Solid</Tag>
                    <Tag variant="outlined">Outlined</Tag>
                    <Tag variant="dashed">Dashed</Tag>
                    <Tag variant="soft">Soft</Tag>
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Colors (solid)</div>
                <div style={rowStyle}>
                    <Tag color="app-pink" variant="solid">app-pink</Tag>
                    <Tag color="purple" variant="solid">purple</Tag>
                    <Tag color="app-blue" variant="solid">app-blue</Tag>
                    <Tag color="app-yellow" variant="solid">app-yellow</Tag>
                    <Tag color="app-orange" variant="solid">app-orange</Tag>
                    <Tag color="app-teal" variant="solid">app-teal</Tag>
                    <Tag color="app-green" variant="solid">app-green</Tag>
                    <Tag color="app-red" variant="solid">app-red</Tag>
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Closable</div>
                <div style={rowStyle}>
                    <Tag closable onClose={() => {}}>可关闭标签</Tag>
                    <Tag closable color="app-pink" variant="solid" onClose={() => {}}>Pink</Tag>
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Disabled</div>
                <div style={rowStyle}>
                    <Tag disabled>Disabled</Tag>
                </div>
            </div>
        </div>
    ),
};

export const TagStable: Story = {
    name: 'Tag (stable)',
    render: () => (
        <div style={rowStyle}>
            <Tag>默认标签</Tag>
            <Tag color="app-teal" variant="solid">Teal</Tag>
            <Tag variant="outlined">Outlined</Tag>
        </div>
    ),
};

export const NotificationParity: Story = {
    name: 'Notification',
    render: () => {
        const NotificationDemo = () => {
            return (
                <div style={pageStyle}>
                    <div style={sectionStyle}>
                        <div style={labelStyle}>Notification API</div>
                        <div style={rowStyle}>
                            <Button onClick={() => Notification.success({ message: '保存成功', description: '文件已上传至云端' })}>
                                Success
                            </Button>
                            <Button onClick={() => Notification.info({ message: '提示信息', description: '这是一条普通通知' })}>
                                Info
                            </Button>
                            <Button onClick={() => Notification.warning({ message: '警告', description: '磁盘空间不足' })}>
                                Warning
                            </Button>
                            <Button onClick={() => Notification.error({ message: '操作失败', description: '网络连接超时' })}>
                                Error
                            </Button>
                        </div>
                    </div>
                </div>
            );
        };
        return <NotificationDemo />;
    },
};

export const DrawerParity: Story = {
    name: 'Drawer',
    render: () => {
        const DrawerDemo = () => {
            const [open, setOpen] = useState(false);
            return (
                <div style={pageStyle}>
                    <div style={sectionStyle}>
                        <div style={labelStyle}>Drawer</div>
                        <div style={rowStyle}>
                            <Button onClick={() => setOpen(true)}>打开抽屉</Button>
                        </div>
                    </div>
                    <Drawer
                        open={open}
                        title="侧边栏标题"
                        onClose={() => setOpen(false)}
                        footer={
                            <div style={{ display: 'flex', gap: 12 }}>
                                <Button onClick={() => setOpen(false)}>取消</Button>
                                <Button type="primary" onClick={() => setOpen(false)}>确认</Button>
                            </div>
                        }
                    >
                        <p>这是抽屉的内容区域</p>
                    </Drawer>
                </div>
            );
        };
        return <DrawerDemo />;
    },
};

export const DrawerStable: Story = {
    name: 'Drawer (stable)',
    render: () => (
        <Drawer open={false} title="抽屉" onClose={() => {}}>
            <p>内容</p>
        </Drawer>
    ),
};

export const ProgressParity: Story = {
    name: 'Progress',
    render: () => (
        <div style={{ ...pageStyle, maxWidth: 600 }}>
            <div style={sectionStyle}>
                <div style={labelStyle}>Size</div>
                <Progress percent={60} size="small" aria-label="small progress" />
                <Progress percent={60} size="middle" aria-label="middle progress" />
                <Progress percent={60} size="large" aria-label="large progress" />
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Info position</div>
                <Progress percent={75} infoPosition="right" aria-label="right info" />
                <Progress percent={75} infoPosition="top" aria-label="top info" />
                <Progress percent={75} infoPosition="inside" size="large" aria-label="inside info" />
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Hide info</div>
                <Progress percent={45} showInfo={false} aria-label="no info" />
            </div>
        </div>
    ),
};

export const ProgressStable: Story = {
    name: 'Progress (stable)',
    render: () => (
        <div style={{ maxWidth: 400 }}>
            <Progress percent={65} aria-label="任务进度" />
        </div>
    ),
};

export const SkeletonParity: Story = {
    name: 'Skeleton',
    render: () => (
        <div style={pageStyle}>
            <div style={sectionStyle}>
                <div style={labelStyle}>Variants</div>
                <Skeleton variant="text" width={200} />
                <Skeleton variant="circle" width={48} heightValue={48} />
                <Skeleton variant="rect" width={200} heightValue={80} />
                <Skeleton variant="paragraph" rows={3} width={300} />
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Active shimmer</div>
                <Skeleton variant="text" width={200} active />
                <Skeleton variant="paragraph" rows={3} width={300} active />
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Sub-components</div>
                <div style={rowStyle}>
                    <SkeletonButton />
                    <SkeletonInput />
                    <SkeletonAvatar />
                </div>
            </div>
        </div>
    ),
};

export const SkeletonStable: Story = {
    name: 'Skeleton (stable)',
    render: () => (
        <div style={sectionStyle}>
            <Skeleton variant="text" width={200} active />
            <Skeleton variant="paragraph" rows={3} width={300} active />
        </div>
    ),
};

export const CardHoverable: Story = {
    name: 'Card hoverable',
    render: () => (
        <div style={rowStyle}>
            <Card hoverable style={{ padding: 16 }}>悬停卡片</Card>
            <Card style={{ padding: 16 }}>普通卡片</Card>
            <Card type="dashed" hoverable style={{ padding: 16 }}>虚线悬停</Card>
        </div>
    ),
};

export const BackTopStable: Story = {
    name: 'BackTop (stable)',
    render: () => (
        <div style={{ height: 200, position: 'relative' }}>
            <p>BackTop 组件 (固定定位，仅在页面滚动后显示)</p>
            <BackTop visibilityHeight={0} />
        </div>
    ),
};

// ─── Image ──────────────────────────────────────────────────────────────────

const SAMPLE_SRC = 'https://picsum.photos/seed/animal-island/200/150';

export const ImageStory: Story = {
    name: 'Image',
    render: () => (
        <div style={pageStyle}>
            <div style={sectionStyle}>
                <div style={labelStyle}>Default (white frame, preview)</div>
                <div style={rowStyle}>
                    <Image src={SAMPLE_SRC} alt="Animal Island scenery" width={200} height={150} />
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Colors</div>
                <div style={rowStyle}>
                    <Image src={SAMPLE_SRC} alt="default color" color="default" width={120} height={90} />
                    <Image src={SAMPLE_SRC} alt="app-pink" color="app-pink" width={120} height={90} />
                    <Image src={SAMPLE_SRC} alt="purple" color="purple" width={120} height={90} />
                    <Image src={SAMPLE_SRC} alt="app-teal" color="app-teal" width={120} height={90} />
                    <Image src={SAMPLE_SRC} alt="app-green" color="app-green" width={120} height={90} />
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>No preview</div>
                <div style={rowStyle}>
                    <Image src={SAMPLE_SRC} alt="no preview" preview={false} width={160} height={120} />
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Lazy</div>
                <div style={rowStyle}>
                    <Image src={SAMPLE_SRC} alt="lazy image" lazy width={160} height={120} />
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Error state</div>
                <div style={rowStyle}>
                    <Image src="/this-image-does-not-exist-404.png" alt="broken image" width={160} height={120} />
                </div>
            </div>
        </div>
    ),
};
