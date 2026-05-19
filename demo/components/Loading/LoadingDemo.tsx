import React, { useState } from 'react';
import { Loading as LoadingComponent, Button } from '../../../src';
import { CodeBlock, ApiTable, ApiRow, sectionStyle, sectionTitleStyle, tagStyle, demoBodyStyle, labelStyle } from '../../tools';

const LoadingDemo: React.FC = () => {
    const [active, setActive] = useState(true);

    return (
        <div style={sectionStyle}>
            <div style={sectionTitleStyle}>
                Loading <span style={tagStyle}>加载动画</span>
            </div>
            <div style={labelStyle}>
                动森风格小岛 Loading 动画组件，带有漂浮的小岛、摇曳的树叶和游动的鱼。关闭时会从中间圆形透明扩散，露出底层内容。
            </div>
            <div style={{ marginBottom: 16 }}>
                <Button type={active ? 'default' : 'primary'} onClick={() => setActive(!active)}>
                    {active ? '关闭 Loading' : '开启 Loading'}
                </Button>
            </div>
            <div style={{ ...demoBodyStyle, position: 'relative', height: 800, padding: 0, overflow: 'hidden' }}>
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(135deg, #ffd6a5 0%, #fdffb6 25%, #caffbf 50%, #9bf6ff 75%, #a0c4ff 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 28,
                        fontWeight: 600,
                        color: '#333',
                    }}
                >
                    底层内容 · Underlying Content
                </div>
                <LoadingComponent
                    active={active}
                    style={{ height: '100%', position: 'absolute', inset: 0 }}
                />
            </div>
            <CodeBlock
                code={`import React, { useState } from 'react';
import { Loading } from 'animal-island-ui';

const App = () => {
    const [active, setActive] = useState(true);
    return (
        <div style={{ position: 'relative', height: 800 }}>
            {/* 底层内容 */}
            <div style={{ position: 'absolute', inset: 0 }}>Underlying Content</div>
            {/* Loading 覆盖层，关闭时透明圆形扩散露出底层 */}
            <Loading
                active={active}
                style={{ position: 'absolute', inset: 0, height: '100%' }}
            />
            <button onClick={() => setActive(!active)}>
                {active ? '关闭 Loading' : '开启 Loading'}
            </button>
        </div>
    );
};`}
            />
            <ApiTable rows={LOADING_API} />
        </div>
    );
};

const LOADING_API: ApiRow[] = [
    { prop: 'active', desc: '是否显示加载动画', type: 'boolean', defaultVal: 'true' },
    { prop: 'className', desc: '自定义类名', type: 'string', defaultVal: '-' },
    { prop: 'style', desc: '自定义样式', type: 'CSSProperties', defaultVal: '-' },
];

export default LoadingDemo;
