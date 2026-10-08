// 场景背景图（Progress 填充场景图 / Background 场景背景同款）集中导出。
// 多个组件引用同一 URL，preserveModules 下避免同源资源被多个 chunk 重复 emit
// （否则会触发 "emitted file ... overwrites a previously emitted file" 警告）。
// 仅收录被多组件共用的资源；单组件独占的图片（如 forest-grove / starry-camp）保持直接 import。
import sweetCorner from './sweet-corner.svg';
import coffeeBreak from './coffee-break.svg';

export { sweetCorner, coffeeBreak };
