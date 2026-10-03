import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import {
    Avatar,
    AvatarGroup,
    BackTop,
    Background,
    Button,
    Card,
    Cursor,
    Drawer,
    Image,
    Notification,
    Progress,
    Rate,
    Skeleton,
    SkeletonAvatar,
    SkeletonButton,
    SkeletonInput,
    Tag,
    Upload,
} from '../src';
import type { UploadFile } from '../src';

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

// Inline SVG data-URI — no network required, loads instantly in any environment
const SAMPLE_SRC = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150'%3E%3Crect width='100%25' height='100%25' fill='%23a8d5c2'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='18' fill='%23fff'%3EIsland%3C/text%3E%3C/svg%3E";

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
                <div style={labelStyle}>Colors (bordered variant)</div>
                <div style={rowStyle}>
                    <Image src={SAMPLE_SRC} alt="default color" variant="bordered" color="default" width={120} height={90} />
                    <Image src={SAMPLE_SRC} alt="app-pink" variant="bordered" color="app-pink" width={120} height={90} />
                    <Image src={SAMPLE_SRC} alt="purple" variant="bordered" color="purple" width={120} height={90} />
                    <Image src={SAMPLE_SRC} alt="app-teal" variant="bordered" color="app-teal" width={120} height={90} />
                    <Image src={SAMPLE_SRC} alt="app-green" variant="bordered" color="app-green" width={120} height={90} />
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

// ─── Background ─────────────────────────────────────────────────────────────

export const BackgroundDots: Story = {
    name: 'Background (dots)',
    render: () => (
        <Background
            data-testid="background-dots"
            style={{ width: 360, height: 200, borderRadius: 16 }}
        >
            <div style={{ padding: 24, fontFamily: 'var(--animal-font-family)', color: '#4a3728', fontWeight: 700 }}>
                Dots background
            </div>
        </Background>
    ),
};

export const BackgroundSprinkles: Story = {
    name: 'Background (sprinkles)',
    render: () => (
        <Background
            type="sprinkles"
            data-testid="background-sprinkles"
            style={{ width: 360, height: 200, borderRadius: 16 }}
        >
            <div style={{ padding: 24, fontFamily: 'var(--animal-font-family)', color: '#4a3728', fontWeight: 700 }}>
                Sprinkles background
            </div>
        </Background>
    ),
};

export const BackgroundStable: Story = {
    name: 'Background (stable)',
    render: () => (
        <div style={{ display: 'flex', gap: 16 }}>
            <Background style={{ width: 200, height: 120, borderRadius: 12 }} />
            <Background type="sprinkles" style={{ width: 200, height: 120, borderRadius: 12 }} />
        </div>
    ),
};

// ─── Cursor raindrop ─────────────────────────────────────────────────────────

export const CursorRaindrop: Story = {
    name: 'Cursor (raindrop)',
    render: () => (
        <div style={{ display: 'flex', gap: 16 }}>
            <Cursor
                type="raindrop"
                data-testid="cursor-raindrop"
                style={{ padding: 32, background: '#e8f7ff', borderRadius: 12, fontFamily: 'var(--animal-font-family)' }}
            >
                Raindrop cursor area
            </Cursor>
            <Cursor
                type="default"
                data-testid="cursor-default"
                style={{ padding: 32, background: '#fdf3e3', borderRadius: 12, fontFamily: 'var(--animal-font-family)' }}
            >
                Default cursor area
            </Cursor>
        </div>
    ),
};

export const CursorRaindropScoped: Story = {
    render: () => (
        <Cursor type="raindrop" forceAll={false} data-testid="cursor-scoped">
            <span>Ordinary text</span>
            <button>Action</button>
            <input aria-label="Name" type="text" />
            <button disabled>Unavailable</button>
        </Cursor>
    ),
};

export const AvatarParity: Story = {
    name: 'Avatar',
    render: () => (
        <div style={pageStyle}>
            <div style={sectionStyle}>
                <div style={labelStyle}>Sizes</div>
                <div style={rowStyle}>
                    <Avatar size="small">S</Avatar>
                    <Avatar size="middle">M</Avatar>
                    <Avatar size="large">L</Avatar>
                    <Avatar size={64}>64</Avatar>
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Shape</div>
                <div style={rowStyle}>
                    <Avatar>Circle</Avatar>
                    <Avatar shape="square">Square</Avatar>
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>With image</div>
                <div style={rowStyle}>
                    <Avatar src="https://api.dicebear.com/7.x/fun-emoji/svg?seed=cat" alt="cat" size="large" />
                    <Avatar src="https://api.dicebear.com/7.x/fun-emoji/svg?seed=dog" alt="dog" size="large" />
                </div>
            </div>
            <div style={sectionStyle}>
                <div style={labelStyle}>Group</div>
                <div style={rowStyle}>
                    <AvatarGroup maxCount={3}>
                        <Avatar>A</Avatar>
                        <Avatar>B</Avatar>
                        <Avatar>C</Avatar>
                        <Avatar>D</Avatar>
                        <Avatar>E</Avatar>
                    </AvatarGroup>
                </div>
            </div>
        </div>
    ),
};

export const RateParity: Story = {
    name: 'Rate',
    render: () => {
        const [value, setValue] = useState(3);
        return (
            <div style={pageStyle}>
                <div style={sectionStyle}>
                    <div style={labelStyle}>Sizes</div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
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
                    <Rate value={4} readonly />
                </div>
                <div style={sectionStyle}>
                    <div style={labelStyle}>Custom count (10)</div>
                    <Rate count={10} defaultValue={7} />
                </div>
            </div>
        );
    },
};

export const UploadParity: Story = {
    name: 'Upload',
    render: () => {
        const [fileList, setFileList] = useState<UploadFile[]>([
            { uid: '1', name: 'photo.png', status: 'done', url: '#' },
            { uid: '2', name: 'report.pdf', status: 'uploading', percent: 60 },
            { uid: '3', name: 'error-file.txt', status: 'error' },
        ]);
        const [cardFiles, setCardFiles] = useState<UploadFile[]>([
            { uid: 'c1', name: 'img1.jpg', status: 'done', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=a' },
            { uid: 'c2', name: 'img2.jpg', status: 'done', url: 'https://api.dicebear.com/7.x/fun-emoji/svg?seed=b' },
        ]);
        return (
            <div style={pageStyle}>
                <div style={sectionStyle}>
                    <div style={labelStyle}>Text list</div>
                    <Upload
                        fileList={fileList}
                        onChange={({ fileList: fl }) => setFileList(fl)}
                        tip="支持上传 PDF、PNG 等格式"
                    >
                        <Button>选择文件</Button>
                    </Upload>
                </div>
                <div style={sectionStyle}>
                    <div style={labelStyle}>Picture card</div>
                    <Upload
                        listType="picture-card"
                        fileList={cardFiles}
                        onChange={({ fileList: fl }) => setCardFiles(fl)}
                    />
                </div>
                <div style={sectionStyle}>
                    <div style={labelStyle}>Drag zone</div>
                    <Upload drag>
                        <div />
                    </Upload>
                </div>
                <div style={sectionStyle}>
                    <div style={labelStyle}>Disabled</div>
                    <Upload disabled>
                        <Button disabled>上传（已禁用）</Button>
                    </Upload>
                </div>
            </div>
        );
    },
};
