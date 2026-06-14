import type { Meta, StoryObj } from '@storybook/react';
import type { CSSProperties } from 'react';
import { useRef, useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
    Button,
    CodeBlock,
    Cursor,
    Divider,
    Footer,
    Icon,
    ICON_LIST,
    Loading,
    Phone,
    Time,
    Typewriter,
    WeddingInvitation,
    WeddingInvitationExportButton,
    type WeddingInvitationRef,
} from '../src';

const meta = {
    title: 'Regression/Parity/Display Utilities',
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

const panelStyle = {
    padding: 16,
    background: '#faf8f3',
    border: '1px solid #e8e2d6',
    borderRadius: 12,
} satisfies CSSProperties;

const dividerTypes = [
    'line-brown',
    'line-teal',
    'line-white',
    'line-yellow',
    'wave-yellow',
    'dashed-brown',
    'dashed-teal',
    'dashed-white',
    'dashed-yellow',
] as const;
const footerTypes = ['sea', 'tree'] as const;

const codeSample = `import React, { useState } from 'react';

// island counter
export const Counter = () => {
    const [count, setCount] = useState(3);
    return <Button disabled={false}>{count + 1}</Button>;
};`;

const DividerFooterSection = () => (
    <section data-testid="divider-footer-region" style={sectionStyle}>
        <div style={labelStyle}>Divider variants</div>
        <div data-testid="divider-matrix" style={{ ...panelStyle, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {dividerTypes.map((type) => (
                <div key={type} style={{ display: 'grid', gridTemplateColumns: '130px 1fr', gap: 12, alignItems: 'center' }}>
                    <span style={{ color: '#725d42', fontWeight: 700 }}>{type}</span>
                    <Divider type={type} className={`parity-divider-${type}`} />
                </div>
            ))}
            <Divider type="line-teal" className="parity-divider-custom" style={{ width: 220 }} />
        </div>
        <div style={labelStyle}>Footer variants</div>
        <div data-testid="footer-matrix" style={{ ...panelStyle, display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
            {footerTypes.flatMap((type) => [
                { type, seamless: false, label: type },
                { type, seamless: true, label: `${type} seamless` },
            ]).map(({ type, seamless, label }) => (
                <div key={label}>
                    <div style={{ color: '#725d42', fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{label}</div>
                    <Footer type={type} seamless={seamless} className={`parity-footer-${type}${seamless ? '-seamless' : ''}`} style={{ width: 520 }} />
                </div>
            ))}
        </div>
    </section>
);

const IconSection = () => (
    <section data-testid="icon-region" style={sectionStyle}>
        <div style={labelStyle}>Icon list and sizing</div>
        <div data-testid="icon-grid" style={{ ...panelStyle, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(112px, 1fr))', gap: 14 }}>
            {ICON_LIST.map((icon) => (
                <div key={icon.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <Icon name={icon.name} size={36} />
                    <span style={{ color: '#794f27', fontSize: 12, fontWeight: 700 }}>{icon.label}</span>
                </div>
            ))}
        </div>
        <div data-testid="icon-size-row" style={rowStyle}>
            <Icon name="icon-camera" size={24} />
            <Icon name="icon-camera" size={40} />
            <Icon name="icon-camera" size="56px" bounce className="parity-icon-bounce" style={{ backgroundColor: '#fff9e3', borderRadius: 12 }} />
        </div>
    </section>
);

const CodeCursorTypewriterSection = () => {
    const [trigger, setTrigger] = useState(0);
    const [doneCount, setDoneCount] = useState(0);

    return (
        <section data-testid="code-cursor-typewriter-region" style={sectionStyle}>
            <div style={labelStyle}>CodeBlock</div>
            <div data-testid="code-block-region">
                <CodeBlock code={codeSample} className="parity-code-block" style={{ width: 720, maxHeight: 260 }} />
            </div>
            <div style={labelStyle}>Cursor</div>
            <Cursor className="parity-cursor" style={{ ...panelStyle, width: 360 }} data-testid="cursor-force-region">
                <button type="button" data-testid="cursor-force-button">
                    cursor target
                </button>
                <span style={{ marginLeft: 12 }}>custom cursor wraps descendants</span>
            </Cursor>
            <Cursor
                className="parity-cursor"
                forceAll={false}
                style={{ ...panelStyle, width: 480, display: 'flex', gap: 12, alignItems: 'center' }}
                data-testid="cursor-scoped-region"
            >
                <button type="button" data-testid="cursor-scoped-button">
                    scoped button
                </button>
                <input data-testid="cursor-scoped-input" type="text" defaultValue="scoped input" aria-label="scoped cursor demo input" />
                <button type="button" data-testid="cursor-scoped-disabled" disabled>
                    disabled
                </button>
                <span>scoped cursor preserves interaction semantics</span>
            </Cursor>
            <div style={labelStyle}>Typewriter</div>
            <div data-testid="typewriter-region" style={{ ...panelStyle, minHeight: 90 }}>
                <div data-testid="typewriter-static">
                    <Typewriter autoPlay={false}>
                        <span>Instant </span>
                        <strong>message</strong>
                    </Typewriter>
                </div>
                <div data-testid="typewriter-live" style={{ marginTop: 12 }}>
                    <Typewriter speed={1} trigger={trigger} onDone={() => setDoneCount((count) => count + 1)}>
                        <span>Island </span>
                        <strong>typing</strong>
                    </Typewriter>
                </div>
                <div style={{ ...rowStyle, marginTop: 12 }}>
                    <Button onClick={() => setTrigger((value) => value + 1)}>Replay typewriter</Button>
                    <span data-testid="typewriter-done-count" style={{ color: '#725d42', fontSize: 13, fontWeight: 700 }}>
                        done: {doneCount}
                    </span>
                </div>
            </div>
        </section>
    );
};

const StatusSceneSection = () => {
    const [loadingActive, setLoadingActive] = useState(true);

    return (
        <section data-testid="status-scene-region" style={sectionStyle}>
            <div style={labelStyle}>Time</div>
            <div data-testid="time-region" style={panelStyle}>
                <Time className="parity-time" />
            </div>
            <div style={labelStyle}>Phone</div>
            <div data-testid="phone-region" style={{ ...panelStyle, width: 600 }}>
                <Phone className="parity-phone" />
            </div>
            <div style={labelStyle}>Loading</div>
            <div data-testid="loading-region" style={{ ...panelStyle, width: 420 }}>
                <div style={{ position: 'relative', width: 360, height: 240 }}>
                    <Loading active={loadingActive} className="parity-loading" />
                </div>
                <Button onClick={() => setLoadingActive(false)} style={{ marginTop: 12 }}>
                    Hide loading
                </Button>
            </div>
        </section>
    );
};

const WeddingInvitationSection = () => {
    const invitationRef = useRef<WeddingInvitationRef>(null);

    return (
        <section data-testid="wedding-invitation-region" style={sectionStyle}>
            <div style={labelStyle}>WeddingInvitation</div>
            <div data-testid="wedding-invitation-card" style={{ ...panelStyle, width: 'fit-content' }}>
                <WeddingInvitation ref={invitationRef} className="parity-wedding-invitation" />
            </div>
            <div data-testid="wedding-invitation-export" style={rowStyle}>
                <WeddingInvitationExportButton targetRef={invitationRef} filename="storybook-wedding-invitation">
                    保存为图片
                </WeddingInvitationExportButton>
            </div>
        </section>
    );
};

export const AssetsParity: Story = {
    render: () => (
        <div style={pageStyle}>
            <DividerFooterSection />
            <IconSection />
        </div>
    ),
    play: async ({ canvas }) => {
        await waitFor(() => {
            expect(canvas.getByTestId('divider-matrix').querySelectorAll('div[class*="divider"]').length).toBeGreaterThanOrEqual(10);
        });
        await waitFor(() => {
            expect(canvas.getByTestId('footer-matrix').querySelectorAll('div[class*="footer"]').length).toBeGreaterThanOrEqual(4);
        });
        for (const icon of ICON_LIST) {
            await expect(canvas.getByText(icon.label)).toBeVisible();
        }
        await waitFor(() => {
            const icons = canvas.getByTestId('icon-grid').querySelectorAll('span[class*="icon"]');
            expect(icons.length).toBe(ICON_LIST.length);
        });
    },
};

export const TextUtilityParity: Story = {
    render: () => <CodeCursorTypewriterSection />,
    play: async ({ canvas }) => {
        await expect(canvas.getByTestId('code-block-region')).toHaveTextContent('useState');
        await expect(canvas.getByTestId('cursor-force-button')).toBeVisible();
        await expect(canvas.getByTestId('cursor-scoped-button')).toBeVisible();
        await expect(canvas.getByTestId('cursor-scoped-input')).toBeVisible();
        await expect(canvas.getByTestId('cursor-scoped-disabled')).toBeVisible();
        await expect(canvas.getByTestId('typewriter-static')).toHaveTextContent('Instant message');
        await waitFor(() => expect(canvas.getByTestId('typewriter-live')).toHaveTextContent('Island typing'), {
            timeout: 5000,
        });
        await waitFor(() => expect(canvas.getByTestId('typewriter-done-count')).toHaveTextContent('done: 1'), {
            timeout: 5000,
        });
        await userEvent.click(canvas.getByRole('button', { name: 'Replay typewriter' }));
        await waitFor(() => expect(canvas.getByTestId('typewriter-done-count')).toHaveTextContent('done: 2'), {
            timeout: 5000,
        });
    },
};

export const TextUtilityStable: Story = {
    render: () => <CodeCursorTypewriterSection />,
};

export const StatusSceneParity: Story = {
    render: () => <StatusSceneSection />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByTestId('time-region')).toHaveTextContent(/Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday/);
        await expect(canvas.getByTestId('phone-region')).toHaveTextContent('Welcome!');
        await expect(canvas.getByTestId('phone-region').querySelectorAll('div[style*="background-color"]').length).toBe(9);
        await expect(canvas.getByTestId('loading-region').querySelector('svg.illustration')).toBeInTheDocument();
        await userEvent.click(canvas.getByRole('button', { name: 'Hide loading' }));
        await waitFor(() => expect(canvas.getByTestId('loading-region').querySelector('.parity-loading')).not.toBeVisible(), {
            timeout: 1200,
        });
    },
};

export const StatusSceneStable: Story = {
    render: () => <StatusSceneSection />,
};

export const WeddingInvitationParity: Story = {
    render: () => <WeddingInvitationSection />,
    play: async ({ canvasElement }) => {
        const canvas = within(canvasElement);
        await expect(canvas.getByTestId('wedding-invitation-region')).toBeVisible();
        await expect(canvas.getByTestId('wedding-invitation-card')).toHaveTextContent('Wedding Invitation');
        await expect(canvas.getByTestId('wedding-invitation-card')).toHaveTextContent('婚礼时间');
        await expect(canvas.getByRole('button', { name: '保存为图片' })).toBeVisible();
    },
};

export const WeddingInvitationStable: Story = {
    render: () => <WeddingInvitationSection />,
};
