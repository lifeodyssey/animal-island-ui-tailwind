/**
 * Minimal inline SVG icon set — substitutes for naive-icons used by upstream
 * components. Sized with the same `size` / `color` / `className` API.
 */
import React from 'react';

interface IconProps {
    size?: number;
    color?: string;
    className?: string;
    'aria-hidden'?: boolean | 'true' | 'false';
}

export const CloseIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className, ...rest }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...rest}
    >
        <path
            d="M12 4L4 12M4 4l8 8"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const StarIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className, ...rest }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...rest}
    >
        <path
            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle cx="9.5" cy="12.5" r="1" fill={color} />
        <circle cx="14.5" cy="12.5" r="1" fill={color} />
    </svg>
);

export const UserIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className, ...rest }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...rest}
    >
        <circle cx="12" cy="8" r="4" stroke={color} strokeWidth="1.5" />
        <path
            d="M4 20c0-4 3.582-7 8-7s8 3 8 7"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
        />
    </svg>
);

export const UploadIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className, ...rest }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...rest}
    >
        <path
            d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <polyline
            points="17 8 12 3 7 8"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <line x1="12" y1="3" x2="12" y2="15" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
);

export const FileIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className, ...rest }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...rest}
    >
        <path
            d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <polyline
            points="14 2 14 8 20 8"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const CheckIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className, ...rest }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...rest}
    >
        <path
            d="M20 6L9 17l-5-5"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const EyeIcon: React.FC<IconProps> = ({ size = 16, color = 'currentColor', className, ...rest }) => (
    <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...rest}
    >
        <path
            d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
        <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
    </svg>
);
