import React from 'react';
import { cn } from '../../utils/cn';

/** 原创钱袋图形：圆袋身 + 束口 + 绳结 + 星形贴片（内联 SVG，非素材文件） */
const BagIcon: React.FC = () => (
    <svg viewBox="0 0 64 64" style={{ width: '80%', height: '80%' }} aria-hidden="true">
        <path
            d="M32 20c-11.5 0-19 8.6-19 18.4C13 49 21.5 55 32 55s19-6 19-16.6C51 28.6 43.5 20 32 20z"
            fill="#e8b04b"
            stroke="#a8732a"
            strokeWidth="3"
        />
        <path
            d="M22.5 20c1.8-6.4 5.6-9.6 9.5-9.6s7.7 3.2 9.5 9.6c-3 2-6.4 2.8-9.5 2.8s-6.5-.8-9.5-2.8z"
            fill="#d19a3a"
            stroke="#a8732a"
            strokeWidth="3"
            strokeLinejoin="round"
        />
        <rect x="23" y="17" width="18" height="5.5" rx="2.75" fill="#8a5a24" />
        <circle cx="27.5" cy="11" r="2.8" fill="#8a5a24" />
        <circle cx="36.5" cy="11" r="2.8" fill="#8a5a24" />
        <path
            d="M32 30.5l2.4 4.8 5.3.8-3.8 3.7.9 5.2-4.8-2.5-4.8 2.5.9-5.2-3.8-3.7 5.3-.8z"
            fill="#fdf3e3"
        />
    </svg>
);

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
                {icon ?? <BagIcon />}
            </div>
            <div className="animal-wallet-pill">
                <span className="animal-wallet-value">{formatValue(value, thousandSeparator)}</span>
            </div>
        </div>
    );
};

Wallet.displayName = 'Wallet';
