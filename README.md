# Animal Island UI - Tailwind/Radix Modernization

<div align="center">
    <img src="docs/img/readme-home.png" alt="animal-island-ui" style="border-radius: 12px; width: 40%; display: block; margin: 0 auto;" />
</div>

<div align="center">
    一个保留 Animal Island UI 视觉语言与包形态的 Tailwind CSS v4 + Radix UI 现代化实现。
</div>

<br />

<div align="center">
    <a href="https://github.com/lifeodyssey/animal-island-ui"><img src="https://img.shields.io/github/stars/lifeodyssey/animal-island-ui?style=flat-square" alt="Stars"></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License"></a>
    <a href="https://www.npmjs.com/package/animal-island-ui"><img src="https://img.shields.io/npm/dm/animal-island-ui.svg?style=flat-square" alt="npm downloads"></a>
    <a href="https://github.com/guokaigdg/animal-island-ui"><img src="https://img.shields.io/badge/upstream-guokaigdg%2Fanimal--island--ui-19c8b9?style=flat-square" alt="Upstream"></a>
</div>

<br />

<p align="center">
    简体中文 | <a href="./docs/README.en.md">English</a>
</p>

## 项目定位

本仓库是 [`guokaigdg/animal-island-ui`](https://github.com/guokaigdg/animal-island-ui) 的现代化重构 fork。目标不是重新设计一套 UI，而是在尽量保留原组件 API、视觉表现、静态资源和 npm 发布形态的前提下，把内部实现迁移到 Tailwind CSS v4 + Radix UI，并补齐可复现的 Storybook / Playwright 验收体系。

这不是上游仓库的正式版本。我们已经在上游创建 RFC Issue：[`guokaigdg/animal-island-ui#8`](https://github.com/guokaigdg/animal-island-ui/issues/8)，用于询问维护者是否接受这个方向，以及后续 PR 应该如何拆分。

## 和原版的关系

- 原版实现：React + TypeScript + Less CSS Modules。
- 当前实现：React 19 + TypeScript + Tailwind CSS v4 + Radix UI primitives。
- 视觉目标：尽量 1:1 保留 Animal Island 风格，包括颜色、圆角、阴影、动画、字体和资源。
- 发布目标：继续沿用原库的单 npm 包形态，而不是拆成多个 package 或 per-component subpath。
- 贡献策略：先作为 fork 维护；若上游接受，再按测试、文档、重构分批提交 PR。

## 技术栈

- React 19
- TypeScript
- Tailwind CSS v4
- Radix UI primitives
- Vite library mode
- Storybook 10
- Storybook/Vitest interaction tests
- Playwright behavior tests
- Playwright visual regression screenshots

## 组件

当前覆盖 18 个组件：

| 交互组件 | 展示与容器组件 | 装饰与特殊组件 |
|---|---|---|
| Button | Card | Divider |
| Input | Modal | Icon |
| Switch | Collapse | Typewriter |
| Checkbox | CodeBlock | Phone |
| Select | Footer | Time |
| Tabs | Loading | Cursor |

## 安装与使用

如果该版本已发布到 npm，可以按原包名安装：

```bash
npm install animal-island-ui
```

必须导入样式入口，否则组件没有样式、token 和字体：

```tsx
import { Button, Card } from 'animal-island-ui';
import 'animal-island-ui/style';

export function App() {
    return (
        <Card color="app-blue">
            <Button type="primary">开始冒险</Button>
        </Card>
    );
}
```

如果要在发布前验证当前 fork，可以从源码构建 tarball 后安装到临时项目：

```bash
npm install
npm run build
npm pack
```

## 发布形态

本 fork 刻意保持原 `animal-island-ui` 的发布方式：

- 单 npm 包：`animal-island-ui`
- ESM 入口：`dist/es/index.js`
- CJS 入口：`dist/cjs/index.cjs`
- 类型声明：`dist/types/index.d.ts`
- 样式入口：`animal-island-ui/style`
- 兼容入口：`animal-island-ui/dist/index.css`
- 静态资源：`dist/files`

`package.json` 的发布白名单只包含：

- `dist`
- `README.md`
- `AI_USAGE.md`

Storybook、Playwright tests、截图基线、Demo 构建产物和本地开发文件不会进入 npm tarball。

## 本地开发

```bash
npm install

# Demo
npm run dev

# Storybook，测试端口固定为 6106，避免占用默认 6006
npm run storybook:test

# 组件库构建
npm run build

# Demo 构建
npm run build:demo

# Storybook 静态构建
npm run build:storybook
```

## 验收与测试

完整验收命令：

```bash
npm test
npx tsc --noEmit
npm pack --dry-run
```

`npm test` 会依次运行：

- `tests/migration.test.mjs`：迁移结构与依赖约束。
- Storybook/Vitest：stories 和 play function 交互测试。
- Playwright behavior tests：组件 DOM、状态和交互行为。
- Playwright visual regression：局部区域 pix-to-pix 截图对比。

视觉对比优先截取稳定的组件区域，而不是整页截图。对于会自动运行 `play` function 的 Storybook story，Playwright 使用独立 no-play story，避免测试过程互相抢状态。

## 向上游贡献

这次改动本质上是一次现代化重构提案，而不是普通 CSS 替换。因此给原作者贡献时，建议按 RFC / proposal 方式沟通：

1. 先在上游 Issue 中确认维护者是否接受 Tailwind/Radix 方向。
2. 如果接受，优先拆出 Storybook / Playwright parity test infrastructure。
3. 再拆出 package/docs cleanup。
4. 最后把 Tailwind/Radix rewrite 作为 `next` / `v1` / experimental branch 的 PR。

当前 RFC：[`guokaigdg/animal-island-ui#8`](https://github.com/guokaigdg/animal-island-ui/issues/8)。

## 文档

| 文档 | 用途 |
|---|---|
| [`AI_USAGE.md`](./AI_USAGE.md) | 面向 AI 代码助手的组件 API 手册，包含 props、类型、默认值和硬性使用规则。 |
| [`DESIGN_PROMPT.md`](./DESIGN_PROMPT.md) | 视觉复刻提示词与设计 token 说明。 |
| [`skill/SKILL.md`](./skill/SKILL.md) | 像素级样式规范 Skill，覆盖组件 CSS、token、Demo 布局和新组件 Checklist。 |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | 本 fork 的开发与贡献指南。 |
| [`docs/README.en.md`](./docs/README.en.md) | 英文 README。 |

## 版权与免责声明

- 本项目继承原项目 MIT License。
- 本项目不是任天堂官方产品，与任天堂株式会社无关联、授权或合作关系。
- 项目风格仅为学习与研究目的的设计参考，不包含任天堂官方美术素材、代码或资源。
- 原项目与上游维护工作归功于 [`guokaigdg/animal-island-ui`](https://github.com/guokaigdg/animal-island-ui)。

## License

MIT
