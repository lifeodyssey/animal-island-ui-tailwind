import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button, Card, Collapse, Modal, Tabs } from '../src';
import type { TabItem } from '../src';

const meta = {
    title: 'Regression/Parity/Surface Tabs',
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
    fontFamily: 'Times',
} satisfies CSSProperties;

const sectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
} satisfies CSSProperties;

const rowStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: 16,
} satisfies CSSProperties;

const boxStyle = {
    padding: 16,
    background: '#faf8f3',
    border: '1px solid #e8e2d6',
    borderRadius: 12,
} satisfies CSSProperties;

const matrixGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 16,
    alignItems: 'start',
} satisfies CSSProperties;

const tabsMatrixGridStyle = {
    ...matrixGridStyle,
    gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
} satisfies CSSProperties;

const labelStyle = {
    color: '#a0936e',
    fontFamily: 'var(--animal-font-family)',
    fontSize: 14,
    fontWeight: 500,
} satisfies CSSProperties;

const items: TabItem[] = [
    {
        key: 'tab1',
        label: '岛屿概况',
        children: (
            <div>
                <p style={{ marginBottom: 12 }}>这里是一座无人岛，环境优美，气候宜人。</p>
                <p>可以钓鱼、捉虫、种植各种植物。</p>
            </div>
        ),
    },
    {
        key: 'tab2',
        label: '商店',
        children: (
            <div>
                <p style={{ marginBottom: 12 }}>狸然超市营业中！</p>
                <p>各种商品应有尽有，价格实惠。</p>
            </div>
        ),
    },
    {
        key: 'tab3',
        label: '服务台',
        children: (
            <div>
                <p style={{ marginBottom: 12 }}>欢迎来到服务台！</p>
                <p>可以办理各种服务业务。</p>
            </div>
        ),
    },
];

const cardColors = [
    ['default', 'Default', '默认奶油色'],
    ['app-pink', 'App Pink', '应用粉'],
    ['purple', 'Purple', '紫色'],
    ['app-blue', 'App Blue', '应用蓝'],
    ['app-yellow', 'App Yellow', '应用黄'],
    ['app-orange', 'App Orange', '应用橙'],
    ['app-teal', 'App Teal', '应用青'],
    ['app-green', 'App Green', '应用绿'],
    ['app-red', 'App Red', '应用红'],
    ['lime-green', 'Lime Green', '青柠绿'],
    ['yellow-green', 'Yellow-Green', '黄绿色'],
    ['brown', 'Brown', '棕色'],
    ['warm-peach-pink', 'Warm Peach Pink', '暖桃粉'],
] as const;

const TabsSection = () => {
    const [activeKey, setActiveKey] = useState('tab1');

    return (
        <section data-testid="tabs-parity-region" style={sectionStyle}>
            <div style={labelStyle}>shadow control</div>
            <div style={rowStyle}>
                <div style={boxStyle}>
                    <Tabs items={[{ key: 'a', label: '鱼类', children: <p>鲈鱼、鲷鱼...</p> }, { key: 'b', label: '昆虫', children: <p>蝴蝶、瓢虫...</p> }]} defaultActiveKey="a" />
                </div>
                <div style={boxStyle}>
                    <Tabs items={[{ key: 'a', label: '鱼类', children: <p>鲈鱼、鲷鱼...</p> }, { key: 'b', label: '昆虫', children: <p>蝴蝶、瓢虫...</p> }]} defaultActiveKey="a" shadow={false} />
                </div>
            </div>
            <div style={labelStyle}>uncontrolled mode</div>
            <div data-testid="tabs-uncontrolled" style={boxStyle}>
                <Tabs items={[{ key: 'a', label: '鱼类', children: <p>鲈鱼、鲷鱼、河童...</p> }, { key: 'b', label: '昆虫', children: <p>蝴蝶、瓢虫、蜻蜓...</p> }, { key: 'c', label: '海洋生物', children: <p>海星、珊瑚、小丑鱼...</p> }]} defaultActiveKey="a" />
            </div>
            <div style={labelStyle}>controlled mode</div>
            <div style={boxStyle}>
                <Tabs items={items} activeKey={activeKey} onChange={setActiveKey} />
            </div>
            <div data-testid="tabs-selected-label" style={{ fontSize: 13, lineHeight: '18px', color: '#a08060' }}>
                当前选中: <span style={{ color: '#19c8b9', fontWeight: 600 }}>{items.find((item) => item.key === activeKey)?.label}</span>
            </div>
            <div style={labelStyle}>leafAnimation control</div>
            <div style={rowStyle}>
                <div style={boxStyle}>
                    <Tabs items={[{ key: 'a', label: '鱼类', children: <p>鲈鱼、鲷鱼...</p> }, { key: 'b', label: '昆虫', children: <p>蝴蝶、瓢虫...</p> }]} defaultActiveKey="a" leafAnimation />
                    <div style={{ fontSize: 12, lineHeight: '15px', color: '#a0936e', marginTop: 8 }}>leafAnimation=true (默认)</div>
                </div>
                <div style={boxStyle}>
                    <Tabs items={[{ key: 'a', label: '鱼类', children: <p>鲈鱼、鲷鱼...</p> }, { key: 'b', label: '昆虫', children: <p>蝴蝶、瓢虫...</p> }]} defaultActiveKey="a" leafAnimation={false} />
                    <div style={{ fontSize: 12, lineHeight: '15px', color: '#a0936e', marginTop: 8 }}>leafAnimation=false</div>
                </div>
            </div>
        </section>
    );
};

const CardSection = () => (
    <section data-testid="card-parity-region" style={sectionStyle}>
        <div style={labelStyle}>type="default"</div>
        <div style={rowStyle}>
            <Card>
                <p>基础卡片</p>
            </Card>
            <Card style={{ maxWidth: 560, width: '100%' }}>
                <p>在Nintendo 3DS《Animal Island: New Leaf》和《Animal Island: Happy Home Designer》中製作的「我的設計」QR Code，以智慧型裝置讀取就能通過狸端機入口站下載至《集合啦！動物森友會》。</p>
            </Card>
        </div>
        <div style={labelStyle}>type="title"</div>
        <div style={rowStyle}>
            <Card type="title">
                <p>Title标题卡片</p>
            </Card>
            <Card type="title" style={{ maxWidth: 360, width: '100%' }}>
                <p>欢迎来到无人岛！在Nintendo 3DS《Animal Island: New Leaf》和《Animal Island: Happy Home Designer》中製作的「我的設計」QR Code。</p>
            </Card>
        </div>
        <div style={labelStyle}>type="dashed"</div>
        <div style={rowStyle}>
            <Card type="dashed">
                <p>虚线边框卡片</p>
            </Card>
            <Card type="dashed" style={{ maxWidth: 360, width: '100%' }}>
                <p>欢迎来到无人岛！虚线边框适合用于轻量提示或次要信息展示。</p>
            </Card>
        </div>
        <div style={labelStyle}>color — NookPhone palette</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 16 }}>
            {cardColors.map(([color, en, cn]) => (
                <Card key={color} color={color} style={{ padding: '16px 20px' }}>
                    <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>{en}</div>
                    <div style={{ fontSize: 12, opacity: 0.85 }}>{cn}</div>
                </Card>
            ))}
        </div>
        <div style={labelStyle}>color + type="title"</div>
        <div style={rowStyle}>
            <Card type="title" color="app-blue" style={{ width: 240 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>蓝色标题卡片</div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>type="title" + color="app-blue"</div>
            </Card>
            <Card type="title" color="app-green" style={{ width: 250 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>绿色标题卡片</div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>type="title" + color="app-green"</div>
            </Card>
            <Card type="title" color="purple" style={{ width: 240 }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>紫色标题卡片</div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>type="title" + color="purple"</div>
            </Card>
        </div>
    </section>
);

const CollapseSection = () => (
    <section data-testid="collapse-parity-region" style={sectionStyle}>
        <div style={labelStyle}>basic usage</div>
        <div style={{ maxWidth: 720 }}>
            <Collapse question="1個島嶼可以登錄多少名用戶?" answer={<p>1座島嶼最多可以容納8位居民（用戶）。</p>} />
            <Collapse question="可以多少人一起玩?" answer={<p>同住1個島的居民可以最多4人一起遊玩。透過通訊最多8人一起遊玩。</p>} />
        </div>
        <div style={labelStyle}>defaultExpanded</div>
        <div style={{ maxWidth: 720 }}>
            <Collapse question="这个问题默认展开" answer={<p>答案已经展示出来了！可以点击收起。</p>} defaultExpanded />
        </div>
        <div style={labelStyle}>disabled state</div>
        <div style={{ maxWidth: 720 }}>
            <Collapse question="这个问题已被禁用（无法展开）" answer={<p>这段文字不应该被看到。</p>} disabled />
        </div>
    </section>
);

const ModalSection = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [titleModalOpen, setTitleModalOpen] = useState(false);
    const [customFooterOpen, setCustomFooterOpen] = useState(false);
    const [noTypewriterOpen, setNoTypewriterOpen] = useState(false);

    return (
        <section data-testid="modal-parity-region" style={sectionStyle}>
            <div style={labelStyle}>basic modal</div>
            <div style={rowStyle}>
                <Button type="primary" onClick={() => setModalOpen(true)}>基础 Modal</Button>
                <Button onClick={() => setTitleModalOpen(true)}>带标题 Modal</Button>
                <Button type="dashed" onClick={() => setCustomFooterOpen(true)}>自定义 Footer</Button>
            </div>
            <div style={labelStyle}>typewriter disabled</div>
            <div style={rowStyle}>
                <Button type="primary" onClick={() => setNoTypewriterOpen(true)}>关闭打字机效果</Button>
            </div>
            <Modal open={modalOpen} onClose={() => setModalOpen(false)} onOk={() => setModalOpen(false)}>
                <div style={{ textAlign: 'center', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <span>钓到<span style={{ color: '#FD9303' }}>石头</span>了!</span>
                    <span>竟然连这种都能钓起来...</span>
                </div>
            </Modal>
            <Modal open={titleModalOpen} title="博物馆捐赠" onClose={() => setTitleModalOpen(false)} onOk={() => setTitleModalOpen(false)}>
                是否愿意将这条鱼捐赠给博物馆呢？傅达会好好照顾它的！这可是博物馆的新展品哦~
            </Modal>
            <Modal
                open={customFooterOpen}
                title="确认操作"
                onClose={() => setCustomFooterOpen(false)}
                footer={
                    <>
                        <Button onClick={() => setCustomFooterOpen(false)}>再想想</Button>
                        <Button type="primary" danger onClick={() => setCustomFooterOpen(false)}>确认搬家</Button>
                    </>
                }
            >
                确定要让这位居民搬走吗？这个操作不可撤销。
            </Modal>
            <Modal open={noTypewriterOpen} title="天气预报" onClose={() => setNoTypewriterOpen(false)} onOk={() => setNoTypewriterOpen(false)} typewriter={false}>
                明天天气晴朗，气温 20-28°C，适合外出活动！
            </Modal>
        </section>
    );
};

const tabsMatrixItems: TabItem[] = [
    {
        key: 'fish',
        label: '鱼类',
        children: <p>鲈鱼、鲷鱼、河童...</p>,
    },
    {
        key: 'bugs',
        label: '昆虫',
        children: <p>蝴蝶、瓢虫、蜻蜓...</p>,
    },
    {
        key: 'museum',
        label: <span>🏛 博物馆</span>,
        children: <p>化石、艺术品、海洋生物展区开放中。</p>,
    },
];

const TabsMatrixSection = () => {
    const [activeKey, setActiveKey] = useState('fish');

    return (
        <section data-testid="tabs-matrix-region" style={sectionStyle}>
            <div style={labelStyle}>Tabs props matrix</div>
            <div style={tabsMatrixGridStyle}>
                <div data-testid="tabs-default-active-matrix" style={boxStyle}>
                    <Tabs items={tabsMatrixItems} defaultActiveKey="bugs" />
                    <div style={{ fontSize: 12, color: '#a0936e', marginTop: 8 }}>defaultActiveKey="bugs"</div>
                </div>
                <div data-testid="tabs-shadow-off-matrix" style={boxStyle}>
                    <Tabs items={tabsMatrixItems.slice(0, 2)} defaultActiveKey="fish" shadow={false} />
                    <div style={{ fontSize: 12, color: '#a0936e', marginTop: 8 }}>shadow=false</div>
                </div>
                <div data-testid="tabs-leaf-static-matrix" style={boxStyle}>
                    <Tabs items={tabsMatrixItems.slice(0, 2)} defaultActiveKey="fish" leafAnimation={false} />
                    <div style={{ fontSize: 12, color: '#a0936e', marginTop: 8 }}>leafAnimation=false</div>
                </div>
                <div data-testid="tabs-controlled-matrix" style={boxStyle}>
                    <Tabs items={tabsMatrixItems} activeKey={activeKey} onChange={setActiveKey} />
                    <div data-testid="tabs-matrix-selected-label" style={{ fontSize: 12, color: '#a0936e', marginTop: 8 }}>
                        selected: {activeKey}
                    </div>
                </div>
            </div>
        </section>
    );
};

const CardEdgeSection = () => (
    <section data-testid="card-edge-region" style={sectionStyle}>
        <div style={labelStyle}>Card edge combinations</div>
        <div style={matrixGridStyle}>
            <Card data-testid="card-rest-props" className="parity-extra-card" style={{ width: 220, padding: '18px 26px' }}>
                <div style={{ fontWeight: 700 }}>rest props card</div>
                <div style={{ fontSize: 12 }}>className / style / data-* passthrough</div>
            </Card>
            <Card type="dashed" color="app-yellow" data-testid="card-dashed-color" style={{ width: 220 }}>
                <div style={{ fontWeight: 700 }}>dashed + color</div>
                <div style={{ fontSize: 12 }}>组合态</div>
            </Card>
            <Card type="title" color="warm-peach-pink" data-testid="card-title-color" style={{ width: 220 }}>
                <div style={{ fontWeight: 700 }}>title + color</div>
                <div style={{ fontSize: 12 }}>暖桃粉</div>
            </Card>
        </div>
    </section>
);

const CollapseRichSection = () => (
    <section data-testid="collapse-rich-region" style={sectionStyle}>
        <div style={labelStyle}>Collapse rich answer</div>
        <div style={{ maxWidth: 720 }}>
            <Collapse
                question="富文本答案如何展示?"
                defaultExpanded
                answer={
                    <div>
                        <p>这里包含段落、链接和列表，用来锁定详情内容的排版。</p>
                        <p>
                            参考 <a href="https://example.com">岛民手册</a> 获取更多说明。
                        </p>
                        <ul>
                            <li>第一条：保留段落间距。</li>
                            <li>第二条：列表缩进稳定。</li>
                        </ul>
                    </div>
                }
            />
        </div>
    </section>
);

const ModalEdgeSection = () => {
    const [noFooterOpen, setNoFooterOpen] = useState(false);
    const [lockedOpen, setLockedOpen] = useState(false);
    const [narrowOpen, setNarrowOpen] = useState(false);

    return (
        <section data-testid="modal-edge-region" style={sectionStyle}>
            <div style={labelStyle}>Modal props edge cases</div>
            <div style={rowStyle}>
                <Button type="primary" onClick={() => setNoFooterOpen(true)}>footer null</Button>
                <Button onClick={() => setLockedOpen(true)}>mask locked</Button>
                <Button type="dashed" onClick={() => setNarrowOpen(true)}>narrow width</Button>
            </div>
            <Modal open={noFooterOpen} title="无按钮弹窗" footer={null} onClose={() => setNoFooterOpen(false)} typewriter={false}>
                这个弹窗没有底部按钮。
            </Modal>
            <Modal open={lockedOpen} title="遮罩不可关闭" maskClosable={false} onClose={() => setLockedOpen(false)} onOk={() => setLockedOpen(false)} typewriter={false}>
                点击遮罩不会关闭，只能使用按钮或 Escape。
            </Modal>
            <Modal open={narrowOpen} title="窄弹窗" width={360} onClose={() => setNarrowOpen(false)} onOk={() => setNarrowOpen(false)} typewriter={false}>
                宽度固定为 360px，用来对齐迁移后的尺寸。
            </Modal>
        </section>
    );
};

export const TabsParity: Story = {
    render: () => <TabsSection />,
    play: async ({ canvas }) => {
        await expect(canvas.getByTestId('tabs-selected-label')).toHaveTextContent('岛屿概况');
        await userEvent.click(
            within(canvas.getByTestId('tabs-uncontrolled')).queryByRole('button', { name: /海洋生物/ }) ??
                within(canvas.getByTestId('tabs-uncontrolled')).getByRole('tab', { name: /海洋生物/ }),
        );
        await expect(within(canvas.getByTestId('tabs-uncontrolled')).getByText('海星、珊瑚、小丑鱼...')).toBeInTheDocument();
        await userEvent.click(
            canvas.queryByRole('button', { name: /商店/ }) ??
                canvas.getByRole('tab', { name: /商店/ }),
        );
        await expect(canvas.getByTestId('tabs-selected-label')).toHaveTextContent('商店');
        await userEvent.click(
            canvas.queryByRole('button', { name: /岛屿概况/ }) ??
                canvas.getByRole('tab', { name: /岛屿概况/ }),
        );
        await expect(canvas.getByTestId('tabs-selected-label')).toHaveTextContent('岛屿概况');
        await expect(canvas.getByText('leafAnimation=false')).toBeVisible();
    },
};

export const SurfaceParity: Story = {
    render: () => (
        <div style={pageStyle}>
            <CardSection />
            <CollapseSection />
            <ModalSection />
        </div>
    ),
    play: async ({ canvas }) => {
        const body = within(document.body);

        await expect(canvas.getByText('基础卡片')).toBeVisible();
        const firstCollapse = canvas.getByRole('button', { name: /1個島嶼可以登錄多少名用戶/ });
        await expect(firstCollapse).toHaveAttribute('aria-expanded', 'false');
        await userEvent.click(firstCollapse);
        await expect(firstCollapse).toHaveAttribute('aria-expanded', 'true');
        await userEvent.click(firstCollapse);
        await expect(firstCollapse).toHaveAttribute('aria-expanded', 'false');
        await expect(canvas.getByText('答案已经展示出来了！可以点击收起。')).toBeVisible();
        await expect(canvas.getByRole('button', { name: /这个问题已被禁用/ })).toBeDisabled();

        await userEvent.click(canvas.getByRole('button', { name: '基础 Modal' }));
        await expect(await body.findByRole('dialog')).toBeInTheDocument();
        await userEvent.keyboard('{Escape}');
        await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());

        await userEvent.click(canvas.getByRole('button', { name: '带标题 Modal' }));
        await expect(await body.findByText('博物馆捐赠')).toBeInTheDocument();
        await userEvent.keyboard('{Escape}');
        await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());

        await userEvent.click(canvas.getByRole('button', { name: '自定义 Footer' }));
        await expect(await body.findByText('确认搬家')).toBeInTheDocument();
        await userEvent.click(body.getByRole('button', { name: '再想想' }));

        await userEvent.click(canvas.getByRole('button', { name: '关闭打字机效果' }));
        await expect(document.body).toHaveTextContent('天气预报');
        await userEvent.click(body.getByRole('button', { name: '取消' }));
    },
};

export const TabsMatrixParity: Story = {
    render: () => <TabsMatrixSection />,
    play: async ({ canvas }) => {
        await expect(canvas.getByTestId('tabs-default-active-matrix')).toHaveTextContent('蝴蝶、瓢虫、蜻蜓');
        await expect(canvas.getByTestId('tabs-shadow-off-matrix')).toHaveTextContent('shadow=false');
        await expect(canvas.getByTestId('tabs-leaf-static-matrix')).toHaveTextContent('leafAnimation=false');
        await expect(canvas.getByTestId('tabs-matrix-selected-label')).toHaveTextContent('selected: fish');
        await userEvent.click(
            within(canvas.getByTestId('tabs-controlled-matrix')).queryByRole('button', { name: /博物馆/ }) ??
                within(canvas.getByTestId('tabs-controlled-matrix')).getByRole('tab', { name: /博物馆/ }),
        );
        await expect(canvas.getByTestId('tabs-matrix-selected-label')).toHaveTextContent('selected: museum');
        await userEvent.click(
            within(canvas.getByTestId('tabs-controlled-matrix')).queryByRole('button', { name: /鱼类/ }) ??
                within(canvas.getByTestId('tabs-controlled-matrix')).getByRole('tab', { name: /鱼类/ }),
        );
        await expect(canvas.getByTestId('tabs-matrix-selected-label')).toHaveTextContent('selected: fish');
    },
};

export const SurfaceEdgeParity: Story = {
    render: () => (
        <div style={pageStyle}>
            <CardEdgeSection />
            <CollapseRichSection />
            <ModalEdgeSection />
        </div>
    ),
    play: async ({ canvas }) => {
        const body = within(document.body);

        await expect(canvas.getByTestId('card-rest-props')).toHaveTextContent('rest props card');
        await expect(canvas.getByTestId('card-dashed-color')).toHaveTextContent('dashed + color');
        await expect(canvas.getByRole('button', { name: /富文本答案如何展示/ })).toHaveAttribute('aria-expanded', 'true');
        await expect(canvas.getByRole('link', { name: '岛民手册' })).toBeVisible();
        await expect(canvas.getByText('第二条：列表缩进稳定。')).toBeVisible();

        await userEvent.click(canvas.getByRole('button', { name: 'footer null' }));
        await expect(await body.findByText('无按钮弹窗')).toBeInTheDocument();
        await expect(body.queryByRole('button', { name: '取消' })).not.toBeInTheDocument();
        await userEvent.keyboard('{Escape}');
        await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());

        await userEvent.click(canvas.getByRole('button', { name: 'mask locked' }));
        await expect(await body.findByText('遮罩不可关闭')).toBeInTheDocument();
        await userEvent.keyboard('{Escape}');
        await waitFor(() => expect(body.queryByRole('dialog')).not.toBeInTheDocument());

        await userEvent.click(canvas.getByRole('button', { name: 'narrow width' }));
        await expect(await body.findByText('窄弹窗')).toBeInTheDocument();
        await userEvent.click(body.getByRole('button', { name: '确定' }));
    },
};
