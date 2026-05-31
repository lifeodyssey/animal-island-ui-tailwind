# Contributing to animal-island-ui-tailwind

欢迎参与 `animal-island-ui-tailwind` 的开发。Bug 报告、功能建议、代码贡献都行。

## 提交 Issue

- 使用 [GitHub Issues](https://github.com/lifeodyssey/animal-island-ui-tailwind/issues) 提交 Bug 报告或功能建议
- Bug 报告请附上：复现步骤、预期行为、实际行为、浏览器/系统环境
- 功能建议请说明使用场景和期望的 API 设计

## 提交 Pull Request

1. Fork 本仓库并基于 `main` 创建分支 (`git checkout -b feature/my-feature`)
2. 编写代码，确保构建和测试通过
3. 提交修改，遵循 [Conventional Commits](https://www.conventionalcommits.org/) 格式：
    - `feat: add xxx` — 新功能
    - `fix: resolve xxx` — Bug 修复
    - `docs: update xxx` — 文档更新
    - `refactor: simplify xxx` — 重构
4. 推送分支并创建 Pull Request

## 本地开发

```bash
git clone https://github.com/lifeodyssey/animal-island-ui-tailwind.git
cd animal-island-ui
npm install

npm run storybook:test   # Storybook 验收服务器（端口 6106）
npm run build            # 构建组件库
npm test                 # 运行全部测试
npm pack --dry-run       # 检查 npm 包内容
```

## 项目结构

```
src/
  components/
    Button/
      Button.tsx          # 组件实现
      index.ts            # 导出入口
    ...
  styles/
    tokens/ directory with modular CSS files (theme, tokens, base, components, keyframes)
  utils/
    cn.ts                 # clsx + tailwind-merge 合并工具
  index.ts                # 库导出入口
stories/                  # Storybook parity/matrix stories
tests/                    # Playwright 交互测试与视觉回归截图
```

## 新增组件规范

1. 在 `src/components/` 下创建同名目录，包含 `Component.tsx` 和 `index.ts`
2. 组件类名使用稳定的 `animal-*` 命名，并通过 `cn()` 合并内部类名与用户 `className`
3. 样式写入 `src/styles/tokens.css`，优先复用 `--animal-*` CSS 自定义属性
4. 在 `src/index.ts` 中导出组件及类型
5. 交互组件优先使用 Radix UI primitives
6. 在 `stories/` 中添加 Storybook story
7. 补 Playwright 交互测试和视觉回归截图

## 设计令牌

组件库通过 CSS 自定义属性（`--animal-*`）支持运行时主题定制。

| 类别 | 变量前缀 | 示例 |
|------|---------|------|
| 颜色 | `--animal-*-color` | `--animal-primary-color` (#19c8b9) |
| 字体 | `--animal-font-*` | `--animal-font-size-base` (14px) |
| 间距 | `--animal-spacing-*` | `--animal-spacing-sm` (8px) |
| 圆角 | `--animal-radius-*` | `--animal-radius-base` (18px) |
| 阴影 | `--animal-shadow-*` | `--animal-shadow-base` |
| 动画 | `--animal-motion-*` | `--animal-motion-duration-base` (0.25s) |
| 尺寸 | `--animal-height-*` | `--animal-height-base` (45px) |

覆盖示例：

```css
:root {
    --animal-primary-color: #19c8b9;
    --animal-text-color: #827157;
    --animal-bg-color: #f8f8f0;
}
```

## 发布检查

发布前必须通过以下检查：

```bash
npm run build
npm pack --dry-run
npm test
npm run build:storybook
npx tsc --noEmit
```

自动发布使用 `.github/workflows/release.yml`，详见 [PUBLISHING.md](./PUBLISHING.md)。

## License

MIT
