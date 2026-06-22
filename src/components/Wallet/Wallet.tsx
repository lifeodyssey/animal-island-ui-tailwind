import React from 'react';
import { cn } from '../../utils/cn';
import { Icon } from '../Icon';

export type WalletSize = 'small' | 'medium' | 'large';

export interface WalletProps {
    /** 金额数值，数字会按千分位格式化；字符串则原样展示 */
    value?: number | string;
    /** 自定义货币图标，默认使用动森风格钱袋 */
    icon?: React.ReactNode;
    /** 尺寸预设 */
    size?: WalletSize;
    /** 千分位分隔符，默认 ","，传 "" 可关闭 */
    thousandSeparator?: string;
    className?: string;
    style?: React.CSSProperties;
}

/** 数值格式化：仅对 number 类型按千分位插入分隔符 */
const formatValue = (value: WalletProps['value'], sep: string): string => {
    if (value === undefined || value === null) return '00,000';
    if (typeof value !== 'number') return String(value);
    if (!sep) return String(value);
    const sign = value < 0 ? '-' : '';
    const [int, frac] = Math.abs(value).toString().split('.');
    const intWithSep = int.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
    return frac ? `${sign}${intWithSep}.${frac}` : `${sign}${intWithSep}`;
};

const SIZE_CLASS: Record<WalletSize, string | false> = {
    small: 'animal-wallet-small',
    medium: false,
    large: 'animal-wallet-large',
};

export const Wallet: React.FC<WalletProps> = ({
    value = '00,000',
    icon,
    size = 'medium',
    thousandSeparator = ',',
    className,
    style,
}) => {
    return (
        <div className={cn('animal-wallet', SIZE_CLASS[size], className)} style={style}>
            <div className="animal-wallet-bag-slot" aria-hidden="true">
                {icon ?? <Icon item={22} size="80%" />}
            </div>
            <div className="animal-wallet-pill">
                <span className="animal-wallet-value">{formatValue(value, thousandSeparator)}</span>
            </div>
        </div>
    );
};

Wallet.displayName = 'Wallet';
