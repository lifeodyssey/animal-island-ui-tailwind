import React from 'react';

export type ProgressSize = 'small' | 'middle' | 'large';

export type ProgressInfoPosition = 'inside' | 'right' | 'top';

export interface ProgressProps {
    /** 当前百分比，0–100 */
    percent: number;
    /** 尺寸 */
    size?: ProgressSize;
    /** 是否显示百分比文字 */
    showInfo?: boolean;
    /** 百分比文字位置 */
    infoPosition?: ProgressInfoPosition;
    /** 自定义文字格式化（默认 `${percent}%`） */
    infoFormat?: (percent: number) => React.ReactNode;
    /** 进度条 fill 宽度动画时长（秒），0 = 不动画；不影响斜纹滚动 */
    duration?: number;
    /** 自定义类名 */
    className?: string;
    /** 自定义样式 */
    style?: React.CSSProperties;
    /** 无可见标题时给 progressbar 一个无障碍标签（WCAG aria-progressbar-name 必需） */
    'aria-label'?: string;
    /** 关联外部可见标题的 id */
    'aria-labelledby'?: string;
}
