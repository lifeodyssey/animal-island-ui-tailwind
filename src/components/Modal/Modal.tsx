import React, { useCallback, useEffect, useState } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { Button } from '../Button';
import { Cursor } from '../Cursor';
import { Typewriter } from '../Typewriter';
import { cn } from '../../utils/cn';
import { useSafeId } from '../../utils/useSafeId';
import { ISLAND_BLOB_PATH } from '../../utils/shapes';

// Inline SVG clip-path — same organic blob shape as Dialog
const ClipDef: React.FC<{ id: string }> = ({ id }) => (
    <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden focusable="false">
        <clipPath id={id} clipPathUnits="objectBoundingBox">
            <path d={ISLAND_BLOB_PATH} />
        </clipPath>
    </svg>
);

const visuallyHiddenStyle: React.CSSProperties = {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
};

export interface ModalProps {
    /** 是否可见 */
    open: boolean;
    /** 标题 */
    title?: React.ReactNode;
    /** 宽度 */
    width?: number | string;
    /** 点击遮罩关闭 */
    maskClosable?: boolean;
    /** 底部按钮区域 */
    footer?: React.ReactNode | null;
    /** 关闭回调 */
    onClose?: () => void;
    /** 确认回调 */
    onOk?: () => void;
    /** 自定义内容 */
    children?: React.ReactNode;
    className?: string;
    /** 打字机每字间隔 (ms), 默认 80 */
    typeSpeed?: number;
    /** 是否启用打字机效果, 默认 true */
    typewriter?: boolean;
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
    (
        {
            open,
            title,
            width = 520,
            maskClosable = true,
            footer,
            onClose,
            onOk,
            children,
            className,
            typeSpeed = 80,
            typewriter = true,
        },
        ref
    ) => {
        const clipId = useSafeId('modal-clip');
        const [playKey, setPlayKey] = useState(0);
        useEffect(() => {
            if (open) setPlayKey((k) => k + 1);
        }, [open]);

        const handleOpenChange = useCallback(
            (nextOpen: boolean) => {
                if (!nextOpen) onClose?.();
            },
            [onClose]
        );

        const handleOutsideInteraction = useCallback(
            (event: Event) => {
                if (!maskClosable) event.preventDefault();
            },
            [maskClosable]
        );

        const defaultFooter = (
            <>
                <Button type="primary" onClick={onClose}>
                    取消
                </Button>
                <Button type="primary" onClick={onOk}>
                    确定
                </Button>
            </>
        );

        return (
            <Cursor>
                <RadixDialog.Root open={open} onOpenChange={handleOpenChange}>
                    <RadixDialog.Portal>
                        <RadixDialog.Overlay className="animal-modal-overlay" />
                        <RadixDialog.Content
                            ref={ref}
                            className={cn('animal-modal', className)}
                            style={{ width }}
                            onPointerDownOutside={handleOutsideInteraction}
                            onInteractOutside={handleOutsideInteraction}
                        >
                            <ClipDef id={clipId} />
                            <div
                                className="animal-modal-clipped"
                                style={{ clipPath: `url(#${clipId})` }}
                            >
                                {title ? (
                                    <>
                                        <div className="animal-modal-header">
                                            <RadixDialog.Title className="animal-modal-title">
                                                {title}
                                            </RadixDialog.Title>
                                        </div>
                                        <RadixDialog.Description style={visuallyHiddenStyle}>
                                            Dialog content for {typeof title === 'string' ? title : 'this dialog'}
                                        </RadixDialog.Description>
                                    </>
                                ) : (
                                    <>
                                        <RadixDialog.Title style={visuallyHiddenStyle}>
                                            Dialog
                                        </RadixDialog.Title>
                                        <RadixDialog.Description style={visuallyHiddenStyle}>
                                            Dialog content
                                        </RadixDialog.Description>
                                    </>
                                )}
                                <div className="animal-modal-body">
                                    {typewriter ? (
                                        <Typewriter speed={typeSpeed} trigger={playKey}>
                                            {children}
                                        </Typewriter>
                                    ) : (
                                        children
                                    )}
                                </div>
                                {footer !== null && (
                                    <div className="animal-modal-footer">
                                        {footer === undefined ? defaultFooter : footer}
                                    </div>
                                )}
                            </div>
                        </RadixDialog.Content>
                    </RadixDialog.Portal>
                </RadixDialog.Root>
            </Cursor>
        );
    }
);

Modal.displayName = 'Modal';
