import React from 'react';
import { cn } from '../../utils/cn';

export type BackgroundType = 'dots' | 'sprinkles';

export interface BackgroundProps extends React.HTMLAttributes<HTMLDivElement> {
    /** 背景图案类型：dots 波点 / sprinkles 彩色针糖（随机散落） */
    type?: BackgroundType;
    /** 子内容，渲染在图案背景之上 */
    children?: React.ReactNode;
}

export const Background: React.FC<BackgroundProps> = ({ type = 'dots', className, children, ...rest }) => (
    <div
        className={cn('animal-background', type === 'sprinkles' && 'animal-background--sprinkles', className)}
        {...rest}
    >
        {children}
    </div>
);

Background.displayName = 'Background';
