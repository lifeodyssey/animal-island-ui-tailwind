# Animal Island UI Tailwind

<div align="center">
    <img src="docs/img/readme-home.png" alt="animal-island-ui-tailwind" style="border-radius: 12px; width: 40%; display: block; margin: 0 auto;" />
</div>

<div align="center">
    动物森友会风格的 React 组件库 —— 基于 Tailwind CSS v4 + Radix UI 构建
</div>

<br />

<div align="center">
    <a href="https://www.npmjs.com/package/animal-island-ui-tailwind"><img src="https://img.shields.io/npm/v/animal-island-ui-tailwind?style=flat-square" alt="npm version"></a>
    <a href="https://github.com/lifeodyssey/animal-island-ui-tailwind/actions/workflows/ci.yml"><img src="https://img.shields.io/github/actions/workflow/status/lifeodyssey/animal-island-ui-tailwind/ci.yml?branch=main&style=flat-square" alt="CI"></a>
    <a href="https://codecov.io/gh/lifeodyssey/animal-island-ui-tailwind"><img src="https://img.shields.io/codecov/c/github/lifeodyssey/animal-island-ui-tailwind?style=flat-square" alt="Coverage"></a>
    <a href="https://bundlephobia.com/package/animal-island-ui-tailwind"><img src="https://img.shields.io/bundlephobia/minzip/animal-island-ui-tailwind?style=flat-square" alt="Bundle size"></a>
    <a href="https://www.npmjs.com/package/animal-island-ui-tailwind"><img src="https://img.shields.io/npm/types/animal-island-ui-tailwind?style=flat-square" alt="Types"></a>
    <a href="https://github.com/lifeodyssey/animal-island-ui-tailwind"><img src="https://img.shields.io/github/stars/lifeodyssey/animal-island-ui-tailwind?style=flat-square" alt="Stars"></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License"></a>
    <a href="https://www.npmjs.com/package/animal-island-ui-tailwind"><img src="https://img.shields.io/npm/dm/animal-island-ui-tailwind.svg?style=flat-square" alt="npm downloads"></a>
    <a href="https://animalcrossing.zhenjia.dev"><img src="https://img.shields.io/badge/Storybook-FF4785?style=flat-square&logo=storybook&logoColor=white" alt="Storybook"></a>
</div>

<br />

<p align="center">
    简体中文 | <a href="./docs/README.en.md">English</a>
</p>

## 这是什么

动物森友会风格的 React 组件库。奶油色背景、圆润的卡片、3D 按钮阴影、手写体字体，适合给界面加一层无人岛的质感。

视觉设计来自 [guokaigdg/animal-island-ui](https://github.com/guokaigdg/animal-island-ui)，内部实现用 Tailwind CSS v4 和 Radix UI 重写，以 `animal-island-ui-tailwind` 的包名独立发布到 npm。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 18+ + TypeScript |
| 样式 | Tailwind CSS v4 + CSS 自定义属性 |
| 交互 | Radix UI primitives |
| 构建 | Vite library mode (ESM + CJS) |
| 测试 | Storybook 10 + Vitest + Playwright |

## 组件一览

当前包含 25 个组件：

| 交互组件 | 容器与展示 | 装饰与特殊 |
|----------|-----------|-----------|
| Button 按钮 | Card 卡片 | Divider 分割线 |
| Input 输入框 | Modal 弹窗 | Icon 图标 |
| Switch 开关 | Collapse 折叠面板 | Typewriter 打字机 |
| Checkbox 多选框 | CodeBlock 代码块 | Phone 手机 |
| Radio 单选框 | Footer 页脚 | Time 时间 |
| Select 选择器 | Loading 加载 | Cursor 光标 |
| Tabs 标签页 | Table 表格 | Tooltip 气泡提示 |
| Form 表单 | Title 标题缎带 | Wallet 钱袋 |
| | WeddingInvitation 婚礼请柬 | |

## 快速开始

### 安装

```bash
npm install animal-island-ui-tailwind
```

### 使用

```tsx
// 在应用入口导入样式（只需一次）
import 'animal-island-ui-tailwind/style';

// 使用组件
import { Button, Card } from 'animal-island-ui-tailwind';

export function App() {
    return (
        <Card color="app-blue">
            <Button type="primary">开始冒险</Button>
        </Card>
    );
}
```

样式入口 **必须** 导入，否则组件没有样式、设计令牌和字体。

## 包结构

| 入口 | 路径 |
|------|------|
| ESM | `dist/es/index.js` |
| CJS | `dist/cjs/index.cjs` |
| 类型 | `dist/types/index.d.ts` |
| 样式 | `animal-island-ui-tailwind/style` |
| 样式（无字体） | `animal-island-ui-tailwind/style/core` |
| 资源 | `dist/files` |

## 本地开发

```bash
git clone https://github.com/lifeodyssey/animal-island-ui-tailwind.git
cd animal-island-ui
npm install

npm run storybook:test   # 启动 Storybook（端口 6106）
npm run build            # 构建组件库
npm run build:storybook  # 构建 Storybook 静态站点
```

## 测试

```bash
npm test                 # 运行全部测试
npx tsc --noEmit         # 类型检查
npm pack --dry-run       # 检查 npm 包内容
```

`npm test` 依次运行：
- 迁移结构与依赖约束检查
- Storybook/Vitest 交互测试
- Playwright 组件行为测试
- Playwright 视觉回归截图比对

## CI/CD

| 平台 | 触发条件 | 功能 |
|------|---------|------|
| GitHub Actions CI | PR / main push | 类型检查 + 构建 + 测试 + 无障碍扫描 + 包验证 |
| GitHub Actions Release | `v*.*.*` tag / 手动 | CI 验证 + npm Trusted Publishing |
| Cloudflare Pages | main push / PR | 自动部署 Storybook 到 [animalcrossing.zhenjia.dev](https://animalcrossing.zhenjia.dev) |

详细发布流程见 [PUBLISHING.md](./PUBLISHING.md)。

## 设计令牌

组件通过 `--animal-*` CSS 自定义属性支持主题定制：

```css
:root {
    --animal-primary-color: #19c8b9;
    --animal-text-color: #794f27;
    --animal-bg-color: #f8f8f0;
}
```

完整令牌列表见 [CONTRIBUTING.md](./CONTRIBUTING.md#设计令牌)。

## 文档

| 文档 | 说明 |
|------|------|
| [AI_USAGE.md](./AI_USAGE.md) | AI 代码助手专用的组件 API 手册 |
| [DESIGN_PROMPT.md](./DESIGN_PROMPT.md) | 视觉设计令牌与 AI 设计工具提示词 |
| [skill/SKILL.md](./skill/SKILL.md) | 像素级样式规范 Skill |
| [CONTRIBUTING.md](./CONTRIBUTING.md) | 开发与贡献指南 |
| [PUBLISHING.md](./PUBLISHING.md) | npm 发布流程 |
| [CHANGELOG.md](./CHANGELOG.md) | 版本变更记录 |
| [docs/README.en.md](./docs/README.en.md) | English README |
| [SECURITY.md](./SECURITY.md) | 安全问题报告 |
| [SUPPORT.md](./SUPPORT.md) | 支持与问题提交 |
| [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) | 社区协作准则 |

## 致谢

视觉设计和组件 API 沿用 [guokaigdg/animal-island-ui](https://github.com/guokaigdg/animal-island-ui)，感谢原作者。

## 声明

- 本项目基于 MIT License 开源。
- 本项目不是任天堂官方产品，与任天堂株式会社无关联、授权或合作关系。
- 项目风格仅为学习与研究目的的设计参考。

## License

MIT
