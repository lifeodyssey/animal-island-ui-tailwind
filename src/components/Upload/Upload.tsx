import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Upload as UploadIcon, File as FileIcon, Check as CheckIcon, X as CloseIcon, Eye as EyeIcon } from 'lucide-react';
import { cn } from '../../utils/cn';

/** 单个文件的状态 */
export type UploadFileStatus = 'uploading' | 'done' | 'error' | 'removed';

/** 文件列表的展示形态 */
export type UploadListType = 'text' | 'picture' | 'picture-card';

/** 文件列表项（组件内部以 uid 追踪） */
export interface UploadFile {
    /** 唯一标识 */
    uid: string;
    /** 文件名 */
    name: string;
    /** 字节数 */
    size?: number;
    /** MIME 类型 */
    type?: string;
    /** 上传状态，默认 'uploading'；删除时经 onChange 上报为 'removed' */
    status?: UploadFileStatus;
    /** 上传进度 0–100 */
    percent?: number;
    /** 下载/服务端地址（语义上区别于缩略图）；由自定义/受控 fileList 或服务端提供 */
    url?: string;
    /** 缩略图地址（与本地上传时组件自动生成的 ObjectURL）；展示时优先于 url */
    thumbUrl?: string;
    /** 用户选择的原始 File 对象（beforeUpload 返回转换后的 File 时，这里仍是未转换的原始文件） */
    originFileObj?: File;
    /** 服务端返回（action XHR 的 response，或 customRequest 调 onSuccess(resp) 时传入） */
    response?: unknown;
    /** 失败信息（action XHR 出错，或 customRequest 调 onError(err) 时传入） */
    error?: unknown;
}

/** customRequest 收到的回调集合 */
export interface UploadCustomRequestOptions {
    file: File;
    /** 上报进度 0–100 */
    onProgress: (percent: number) => void;
    /** 标记成功，可附带服务端返回 */
    onSuccess: (response?: unknown) => void;
    /** 标记失败，可附带错误信息 */
    onError: (error?: unknown) => void;
}

/** onChange 回调收到的信息（file 为本次变化的文件，fileList 为最新列表） */
export interface UploadChangeParam {
    /** 本次发生变化的文件 */
    file: UploadFile;
    /** 最新文件列表（受控模式下以此为准） */
    fileList: UploadFile[];
    /** 进度事件（仅 XHR 上传进度跳变时携带） */
    event?: ProgressEvent;
}

/** 列表显隐配置（布尔形式等价 `{ showPreviewIcon: true, showRemoveIcon: true }`） */
export interface UploadShowUploadList {
    /** 是否显示预览图标（picture-card 下点击缩略图触发 onPreview），默认 true */
    showPreviewIcon?: boolean;
    /** 是否显示删除图标，默认 true */
    showRemoveIcon?: boolean;
}

export type UploadOnChange = (param: UploadChangeParam) => void;

export interface UploadProps {
    /** 接受的文件类型（同 <input accept>） */
    accept?: string;
    /** 是否多选，默认 false */
    multiple?: boolean;
    /** 最多文件数：1 = 替换，>1 = 满员丢弃多余文件 */
    maxCount?: number;
    /** 是否禁用，默认 false */
    disabled?: boolean;
    /** 是否开启整文件夹选择，默认 false */
    directory?: boolean;
    /** 受控文件列表 */
    fileList?: UploadFile[];
    /** 初始非受控文件列表 */
    defaultFileList?: UploadFile[];
    /** 文件列表展示形态，默认 text */
    listType?: UploadListType;
    /** 是否显示文件列表；也可为对象 { showPreviewIcon, showRemoveIcon }，默认 true */
    showUploadList?: boolean | UploadShowUploadList;
    /** 图片预览回调（未传时组件内置弹层预览） */
    onPreview?: (file: UploadFile) => void;
    /** 是否开启拖拽上传区，默认 false */
    drag?: boolean;
    /** 拖拽区或按钮下方的说明文字 */
    tip?: React.ReactNode;
    /** 自定义触发按钮/区域内容（替换默认按钮文字） */
    children?: React.ReactNode;
    /** 上传前的钩子；返回 false（或 Promise<false>）则跳过该文件，返回 File（或 Promise<File>）则改为上传该转换后的文件 */
    beforeUpload?: (file: File, fileList: File[]) => boolean | File | Promise<boolean | File>;
    /** 自定义上传实现；优先级高于 action（若同时提供则优先 customRequest） */
    customRequest?: (options: UploadCustomRequestOptions) => void;
    /**
     * 上传地址；提供时用原生 XMLHttpRequest 真实上传（优先级低于 customRequest）。
     * 也接受 (file) => 地址 或异步 (file) => Promise<地址> 的形式（便于每文件取 OSS 直传签名）。
     * 解析结果为空字符串时该文件标记为 error，不会静默停在 uploading。
     */
    action?: string | ((file: File) => string | Promise<string>);
    /** 请求方法，默认 POST */
    method?: 'POST' | 'PUT' | 'PATCH';
    /** 追加到请求的自定义请求头 */
    headers?: Record<string, string>;
    /** 随文件一起提交的附加表单字段；也接受 (file) => 字段 或异步 (file) => Promise<字段> 的形式 */
    data?:
        | Record<string, unknown>
        | ((file: File) => Record<string, unknown> | undefined | Promise<Record<string, unknown> | undefined>);
    /** 文件字段名，默认 'file' */
    name?: string;
    /** 是否携带跨域凭证（withCredentials） */
    withCredentials?: boolean;
    /** 列表变化回调（新增/进度/完成/删除都会触发），参数为 { file, fileList, event? } */
    onChange?: UploadOnChange;
    /**
     * 选中的文件超出 maxCount 被丢弃时触发（组件自身静默丢弃，用它提示用户「已达上限」）。
     * 参数为被丢弃的原始 File 列表与当前文件列表。仅在 maxCount > 1 的丢弃分支触发，
     * maxCount === 1 属于替换语义，不触发。
     */
    onExceed?: (files: File[], fileList: UploadFile[]) => void;
    /** 删除前的钩子；返回 false（或 Promise<false>）则阻止删除 */
    onRemove?: (file: UploadFile) => boolean | void | Promise<boolean | void>;
    /** 无可见说明时的无障碍标签（默认「上传文件」） */
    'aria-label'?: string;
    /** 额外类名 */
    className?: string;
    /** 行内样式 */
    style?: React.CSSProperties;
}

let uidSeed = 0;
const genUid = () => `animal-upload-${Date.now().toString(36)}-${(uidSeed += 1)}`;

const clampPercent = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

/**
 * 按 accept 校验单个文件（拖拽进来的文件不受 <input accept> 约束，必须自己过滤）。
 * 规则同浏览器：`.ext` 比扩展名、`image/*` 比主类型、`image/png` 精确比 MIME。
 */
const matchAccept = (file: File, accept?: string): boolean => {
    if (!accept) return true;
    const patterns = accept
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
    if (patterns.length === 0) return true;
    const name = (file.name || '').toLowerCase();
    const mime = (file.type || '').toLowerCase();
    if (!mime) return patterns.some((p) => p.startsWith('.') && name.endsWith(p));
    const baseMime = mime.replace(/\/.*$/, '');
    return patterns.some((p) => {
        if (p.startsWith('.')) return name.endsWith(p);
        if (p.endsWith('/*')) return baseMime === p.replace(/\/.*$/, '');
        return mime === p;
    });
};

/** 字节数格式化为 B / KB / MB */
const formatFileSize = (size?: number): string => {
    if (size === undefined || size === null || Number.isNaN(size)) return '';
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / 1024 / 1024).toFixed(1)} MB`;
};

export const Upload: React.FC<UploadProps> = ({
    accept,
    multiple = false,
    maxCount,
    disabled = false,
    directory = false,
    fileList,
    defaultFileList,
    listType = 'text',
    showUploadList = true,
    onPreview,
    drag = false,
    tip,
    children,
    beforeUpload,
    customRequest,
    action,
    method = 'POST',
    headers,
    data,
    name,
    withCredentials,
    onChange,
    onExceed,
    onRemove,
    'aria-label': ariaLabel,
    className,
    style,
}) => {
    const listVisible = showUploadList !== false;
    const showRemoveIcon = typeof showUploadList === 'object' ? showUploadList.showRemoveIcon !== false : true;
    const showPreviewIcon = typeof showUploadList === 'object' ? showUploadList.showPreviewIcon !== false : true;
    const [innerList, setInnerList] = useState<UploadFile[]>(defaultFileList ?? []);
    const isControlled = fileList !== undefined;
    const list = isControlled ? fileList! : innerList;
    const listRef = useRef(list);
    listRef.current = list;

    const inputRef = useRef<HTMLInputElement>(null);
    const closeBtnRef = useRef<HTMLButtonElement>(null);
    const previewLayerRef = useRef<HTMLDivElement>(null);
    const [dragging, setDragging] = useState(false);
    const dragDepth = useRef(0);
    const [previewTarget, setPreviewTarget] = useState<UploadFile | null>(null);

    const timersRef = useRef<Map<string, number>>(new Map());
    const blobUrlsRef = useRef<Map<string, string>>(new Map());
    const xhrRef = useRef<Map<string, XMLHttpRequest>>(new Map());

    const previewSrc = (file: UploadFile) => file.thumbUrl ?? file.url;
    const isImage = (file: UploadFile) =>
        Boolean(file.type?.startsWith('image/') || /\.(png|jpe?g|gif|webp|svg|bmp|ico)$/i.test(file.name || ''));
    const canPreview = (file: UploadFile) => Boolean(previewSrc(file)) && isImage(file);

    const openPreview = useCallback(
        (file: UploadFile) => {
            if (onPreview) {
                onPreview(file);
                return;
            }
            if (previewSrc(file)) setPreviewTarget(file);
        },
        [onPreview]
    );

    useEffect(() => {
        if (!previewTarget) return;
        if (!list.some((f) => f.uid === previewTarget.uid)) setPreviewTarget(null);
    }, [list, previewTarget]);

    useEffect(() => {
        if (!previewTarget) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setPreviewTarget(null);
                return;
            }
            if (e.key !== 'Tab') return;
            const focusables = Array.from(
                previewLayerRef.current?.querySelectorAll<HTMLElement>(
                    'button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])'
                ) ?? []
            );
            if (focusables.length === 0) {
                e.preventDefault();
                closeBtnRef.current?.focus();
                return;
            }
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement;
            if (e.shiftKey && (active === first || active === previewLayerRef.current)) {
                e.preventDefault();
                last.focus();
            } else if (!e.shiftKey && active === last) {
                e.preventDefault();
                first.focus();
            }
        };
        document.addEventListener('keydown', onKey);
        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const opener = document.activeElement as HTMLElement | null;
        closeBtnRef.current?.focus();
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prevOverflow;
            opener?.focus?.();
        };
    }, [previewTarget]);

    const commit = useCallback(
        (next: UploadFile[], changed?: UploadFile, event?: ProgressEvent, notify = true) => {
            listRef.current = next;
            if (!isControlled) setInnerList(next);
            if (notify) onChange?.({ file: changed ?? next[0], fileList: next, event });
        },
        [isControlled, onChange]
    );

    const stopTransfer = useCallback((uid: string) => {
        const timer = timersRef.current.get(uid);
        if (timer !== undefined) {
            window.clearInterval(timer);
            timersRef.current.delete(uid);
        }
        const xhr = xhrRef.current.get(uid);
        if (xhr) {
            xhr.abort();
            xhrRef.current.delete(uid);
        }
    }, []);

    const releaseFile = useCallback(
        (uid: string) => {
            stopTransfer(uid);
            const blobUrl = blobUrlsRef.current.get(uid);
            if (blobUrl) {
                URL.revokeObjectURL(blobUrl);
                blobUrlsRef.current.delete(uid);
            }
        },
        [stopTransfer]
    );

    const patchFile = useCallback(
        (uid: string, patch: Partial<UploadFile>, event?: ProgressEvent) => {
            if (!listRef.current.some((f) => f.uid === uid)) return;
            const next = listRef.current.map((f) => (f.uid === uid ? { ...f, ...patch } : f));
            const changed = next.find((f) => f.uid === uid);
            commit(next, changed, event);
        },
        [commit]
    );

    const clearTimers = useCallback(() => {
        timersRef.current.forEach((t) => window.clearInterval(t));
        timersRef.current.clear();
        xhrRef.current.forEach((xhr) => xhr.abort());
        xhrRef.current.clear();
        blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
        blobUrlsRef.current.clear();
    }, []);

    useEffect(() => clearTimers, [clearTimers]);

    const prevUidsRef = useRef<string[]>([]);
    useEffect(() => {
        const uids = list.map((f) => f.uid);
        if (!isControlled) {
            prevUidsRef.current = uids;
            return;
        }
        const currentUids = new Set(uids);
        prevUidsRef.current.forEach((uid) => {
            if (!currentUids.has(uid)) releaseFile(uid);
        });
        prevUidsRef.current = uids;
    }, [list, isControlled, releaseFile]);

    const simulateUpload = useCallback(
        (uid: string) => {
            patchFile(uid, { percent: 6 });
            const timer = window.setInterval(() => {
                const current = listRef.current.find((f) => f.uid === uid);
                const next = (current?.percent ?? 0) + 12 + Math.round(Math.random() * 8);
                if (next >= 100) {
                    window.clearInterval(timer);
                    timersRef.current.delete(uid);
                    patchFile(uid, { percent: 100, status: 'done' });
                } else {
                    patchFile(uid, { percent: next });
                }
            }, 220);
            timersRef.current.set(uid, timer);
        },
        [patchFile]
    );

    const startRealUpload = useCallback(
        async (file: File, uid: string) => {
            let resolvedAction: string;
            let resolvedData: Record<string, unknown> | undefined;
            try {
                resolvedAction = (typeof action === 'function' ? await action(file) : action) ?? '';
                resolvedData = typeof data === 'function' ? await data(file) : data;
            } catch (err) {
                patchFile(uid, { status: 'error', percent: 100, error: err });
                return;
            }
            if (!listRef.current.some((f) => f.uid === uid)) return;
            if (!resolvedAction) {
                patchFile(uid, {
                    status: 'error',
                    percent: 100,
                    error: new Error('upload action is empty'),
                });
                return;
            }
            const xhr = new XMLHttpRequest();
            xhrRef.current.set(uid, xhr);

            const form = new FormData();
            form.append(name ?? 'file', file, file.name);
            if (resolvedData) {
                Object.entries(resolvedData).forEach(([key, value]) => {
                    if (value instanceof Blob) {
                        form.append(key, value);
                    } else {
                        form.append(key, String(value));
                    }
                });
            }

            xhr.open(method, resolvedAction, true);
            if (withCredentials) xhr.withCredentials = true;
            if (headers) {
                Object.entries(headers).forEach(([key, value]) => xhr.setRequestHeader(key, value));
            }

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    patchFile(uid, { status: 'uploading', percent: clampPercent((e.loaded / e.total) * 100) }, e);
                }
            };
            xhr.onload = () => {
                xhrRef.current.delete(uid);
                const ok = xhr.status >= 200 && xhr.status < 300;
                patchFile(
                    uid,
                    ok
                        ? { status: 'done', percent: 100, response: xhr.response }
                        : { status: 'error', percent: 100, error: xhr.response }
                );
            };
            xhr.onerror = () => {
                xhrRef.current.delete(uid);
                patchFile(uid, { status: 'error', percent: 100, error: new Error('network error') });
            };
            xhr.onabort = () => {
                xhrRef.current.delete(uid);
            };
            xhr.send(form);
        },
        [action, data, headers, method, name, withCredentials, patchFile]
    );

    const runRequest = useCallback(
        (file: File, uid: string) => {
            if (customRequest) {
                try {
                    customRequest({
                        file,
                        onProgress: (pct) => patchFile(uid, { percent: clampPercent(pct), status: 'uploading' }),
                        onSuccess: (response) => patchFile(uid, { status: 'done', percent: 100, response }),
                        onError: (error) => patchFile(uid, { status: 'error', percent: 100, error }),
                    });
                } catch (err) {
                    console.error('[Upload] customRequest threw:', err);
                    patchFile(uid, { status: 'error', percent: 100, error: err });
                }
            } else if (action) {
                void startRealUpload(file, uid);
            } else {
                simulateUpload(uid);
            }
        },
        [customRequest, action, startRealUpload, patchFile, simulateUpload]
    );

    const handleFiles = useCallback(
        async (rawFiles: File[]) => {
            if (disabled || rawFiles.length === 0) return;
            const truncated = multiple || directory ? rawFiles : rawFiles.slice(0, 1);
            const rawFilesIn = truncated.filter((f) => matchAccept(f, accept));
            if (rawFilesIn.length === 0) return;
            const limit = maxCount && maxCount > 0 ? maxCount : undefined;

            const added: UploadFile[] = [];
            const requests: Array<[File, string]> = [];
            let overflow: File[] = [];
            const rawByUid = new Map<string, File>();

            for (let i = 0; i < rawFilesIn.length; i += 1) {
                const file = rawFilesIn[i];
                if (limit !== undefined && added.length >= limit) {
                    overflow = rawFilesIn.slice(i);
                    break;
                }
                let uploadFile: File = file;
                if (beforeUpload) {
                    try {
                        const res = await beforeUpload(file, rawFilesIn);
                        if (res === false) continue;
                        if (res instanceof File) uploadFile = res;
                    } catch (err) {
                        console.error('[Upload] beforeUpload threw, file skipped:', err);
                        continue;
                    }
                }
                const uid = genUid();
                const item: UploadFile = {
                    uid,
                    name: uploadFile.name,
                    size: uploadFile.size,
                    type: uploadFile.type,
                    status: 'uploading',
                    percent: 0,
                    originFileObj: file,
                };
                if (uploadFile.type.startsWith('image/')) {
                    const url = URL.createObjectURL(uploadFile);
                    blobUrlsRef.current.set(uid, url);
                    item.thumbUrl = url;
                }
                added.push(item);
                requests.push([uploadFile, uid]);
                rawByUid.set(uid, file);
            }

            if (added.length === 0 && overflow.length === 0) return;
            const current = listRef.current;
            let dropped: UploadFile[] = [];
            let next: UploadFile[];
            if (limit === undefined) {
                next = [...current, ...added];
            } else if (limit === 1) {
                const merged = [...current, ...added];
                next = merged.slice(-1);
                dropped = merged.slice(0, merged.length - 1);
            } else {
                const merged = [...current, ...added];
                next = merged.slice(0, limit);
                dropped = merged.slice(limit);
            }
            dropped.forEach((f) => releaseFile(f.uid));
            const keptUids = new Set(next.map((f) => f.uid));
            const keptAdded = added.filter((f) => keptUids.has(f.uid));
            const addedUids = new Set(added.map((f) => f.uid));
            const exceedFiles = [
                ...dropped.filter((f) => addedUids.has(f.uid)).map((f) => rawByUid.get(f.uid)),
                ...overflow,
            ].filter((f): f is File => Boolean(f));
            if (exceedFiles.length > 0) onExceed?.(exceedFiles, next);
            if (added.length > 0) {
                commit(next, keptAdded[keptAdded.length - 1], undefined, keptAdded.length > 0);
                requests.filter(([, uid]) => keptUids.has(uid)).forEach(([file, uid]) => runRequest(file, uid));
            }
        },
        [accept, beforeUpload, commit, directory, disabled, maxCount, multiple, onExceed, releaseFile, runRequest]
    );

    const handleRemove = useCallback(
        async (file: UploadFile) => {
            if (disabled) return;
            if (onRemove) {
                let ok: boolean | void;
                try {
                    ok = await onRemove(file);
                } catch (err) {
                    console.error('[Upload] onRemove threw, removal blocked:', err);
                    ok = false;
                }
                if (ok === false) return;
            }
            if (isControlled) {
                stopTransfer(file.uid);
            } else {
                releaseFile(file.uid);
            }
            const removedFile: UploadFile = { ...file, status: 'removed' };
            commit(
                listRef.current.filter((f) => f.uid !== file.uid),
                removedFile
            );
        },
        [commit, disabled, isControlled, onRemove, releaseFile, stopTransfer]
    );

    const openFilePicker = () => {
        if (disabled) return;
        inputRef.current?.click();
    };

    const onDragEnter = (e: React.DragEvent) => {
        if (!drag || disabled) return;
        e.preventDefault();
        dragDepth.current += 1;
        setDragging(true);
    };
    const onDragLeave = (e: React.DragEvent) => {
        if (!drag || disabled) return;
        e.preventDefault();
        dragDepth.current -= 1;
        if (dragDepth.current <= 0) {
            dragDepth.current = 0;
            setDragging(false);
        }
    };
    const onDragOver = (e: React.DragEvent) => {
        if (!drag || disabled) return;
        e.preventDefault();
    };
    const onDrop = (e: React.DragEvent) => {
        if (!drag || disabled) return;
        e.preventDefault();
        dragDepth.current = 0;
        setDragging(false);
        void handleFiles(Array.from(e.dataTransfer?.files ?? []));
    };

    const wrapperCls = cn('animal-upload', disabled && 'animal-upload--disabled', className);

    const renderStatus = (file: UploadFile) => {
        const status = file.status ?? 'uploading';
        if (status === 'done') {
            return (
                <span className="animal-upload-status-icon animal-upload-status-done" aria-label="上传完成">
                    <CheckIcon size={16} />
                </span>
            );
        }
        if (status === 'error') {
            return (
                <span className="animal-upload-status-icon animal-upload-status-error" aria-label="上传失败">
                    <CloseIcon size={16} />
                </span>
            );
        }
        if (status === 'removed') return null;
        return (
            <span className="animal-upload-status-icon" aria-label={`上传中 ${clampPercent(file.percent ?? 0)}%`}>
                <span className="animal-upload-spinner" aria-hidden="true" />
                <span className="animal-upload-percent">{clampPercent(file.percent ?? 0)}%</span>
            </span>
        );
    };

    const renderTextList = () => (
        <ul className="animal-upload-text-list">
            {list.map((file) => (
                <li
                    key={file.uid}
                    className={cn(
                        'animal-upload-text-item',
                        file.status === 'error' && 'animal-upload-text-item--error'
                    )}
                >
                    {listType === 'picture' ? (
                        <span className="animal-upload-text-thumb">
                            {previewSrc(file) ? (
                                <img className="animal-upload-text-thumb-img" src={previewSrc(file)} alt={file.name} />
                            ) : (
                                <FileIcon size={18} />
                            )}
                        </span>
                    ) : (
                        <span className="animal-upload-file-icon">
                            <FileIcon size={15} />
                        </span>
                    )}
                    <span className="animal-upload-file-name" title={file.name}>
                        {file.name}
                    </span>
                    {file.size !== undefined && file.size !== null && (
                        <span className="animal-upload-file-size">{formatFileSize(file.size)}</span>
                    )}
                    {renderStatus(file)}
                    {showPreviewIcon && canPreview(file) && (
                        <button
                            type="button"
                            className="animal-upload-preview-btn"
                            aria-label={`预览 ${file.name}`}
                            disabled={disabled}
                            onClick={() => openPreview(file)}
                        >
                            <EyeIcon size={16} />
                        </button>
                    )}
                    {showRemoveIcon && (
                        <button
                            type="button"
                            className="animal-upload-remove-btn"
                            aria-label={`删除 ${file.name}`}
                            disabled={disabled}
                            onClick={() => void handleRemove(file)}
                        >
                            <CloseIcon size={16} />
                        </button>
                    )}
                </li>
            ))}
        </ul>
    );

    const renderPictureList = () => (
        <ul className="animal-upload-card-list">
            {listVisible &&
                list.map((file) => {
                    const status = file.status ?? 'uploading';
                    return (
                        <li
                            key={file.uid}
                            className={cn(
                                'animal-upload-card',
                                status === 'error' && 'animal-upload-card--error',
                                status === 'done' && 'animal-upload-card--done'
                            )}
                        >
                            {previewSrc(file) ? (
                                <img
                                    className={cn(
                                        'animal-upload-card-img',
                                        canPreview(file) && 'animal-upload-card-img--previewable'
                                    )}
                                    src={previewSrc(file)}
                                    alt={file.name}
                                    onClick={showPreviewIcon && canPreview(file) ? () => openPreview(file) : undefined}
                                />
                            ) : (
                                <span className="animal-upload-card-file-icon">
                                    <FileIcon size={15} />
                                </span>
                            )}
                            {status === 'uploading' && (
                                <span className="animal-upload-card-mask">
                                    <span className="animal-upload-spinner" aria-hidden="true" />
                                    <span className="animal-upload-percent">{clampPercent(file.percent ?? 0)}%</span>
                                </span>
                            )}
                            {status === 'error' && (
                                <span className="animal-upload-card-mask">
                                    <CloseIcon size={22} color="#e05a5a" />
                                </span>
                            )}
                            {showPreviewIcon && canPreview(file) && (
                                <button
                                    type="button"
                                    className="animal-upload-card-preview"
                                    aria-label={`预览 ${file.name}`}
                                    disabled={disabled}
                                    onClick={() => openPreview(file)}
                                >
                                    <EyeIcon size={18} />
                                </button>
                            )}
                            {showRemoveIcon && (
                                <button
                                    type="button"
                                    className="animal-upload-card-remove"
                                    aria-label={`删除 ${file.name}`}
                                    disabled={disabled}
                                    onClick={() => void handleRemove(file)}
                                >
                                    <CloseIcon size={16} />
                                </button>
                            )}
                        </li>
                    );
                })}
            <li className="animal-upload-card-add">
                <button
                    type="button"
                    className="animal-upload-card-add-btn"
                    aria-label={ariaLabel ?? '上传文件'}
                    onClick={openFilePicker}
                    disabled={disabled}
                >
                    {children ?? <UploadIcon size={28} />}
                </button>
            </li>
        </ul>
    );

    return (
        <div className={wrapperCls} style={style}>
            <input
                ref={inputRef}
                className="animal-upload-hidden-input"
                type="file"
                accept={accept}
                multiple={multiple}
                disabled={disabled}
                {...(directory ? ({ webkitdirectory: '' } as React.InputHTMLAttributes<HTMLInputElement>) : {})}
                onChange={(e) => {
                    void handleFiles(Array.from(e.target.files ?? []));
                    e.target.value = '';
                }}
            />

            {listType === 'picture-card' ? (
                <>
                    {renderPictureList()}
                    {tip && <div className="animal-upload-tip">{tip}</div>}
                </>
            ) : (
                <>
                    {drag ? (
                        <div
                            role="button"
                            tabIndex={disabled ? -1 : 0}
                            aria-label={ariaLabel ?? '上传文件'}
                            aria-disabled={disabled || undefined}
                            className={cn(
                                'animal-upload-drag-zone',
                                dragging && 'animal-upload-drag-zone--active'
                            )}
                            onClick={openFilePicker}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    openFilePicker();
                                }
                            }}
                            onDragEnter={onDragEnter}
                            onDragLeave={onDragLeave}
                            onDragOver={onDragOver}
                            onDrop={onDrop}
                        >
                            {children ?? (
                                <>
                                    <span className="animal-upload-drag-icon">
                                        <UploadIcon size={16} />
                                    </span>
                                    <span className="animal-upload-drag-text">点击或拖拽文件到这里</span>
                                </>
                            )}
                        </div>
                    ) : (
                        <button
                            type="button"
                            className={children ? 'animal-upload-trigger-custom' : 'animal-upload-trigger'}
                            aria-label={ariaLabel ?? '上传文件'}
                            onClick={openFilePicker}
                            disabled={disabled}
                        >
                            {children ?? (
                                <>
                                    <UploadIcon size={18} />
                                    <span>点击上传</span>
                                </>
                            )}
                        </button>
                    )}
                    {tip && <div className="animal-upload-tip">{tip}</div>}
                    {listVisible && list.length > 0 && renderTextList()}
                </>
            )}

            {previewTarget && (
                <div
                    ref={previewLayerRef}
                    className="animal-upload-preview-layer"
                    role="dialog"
                    aria-modal="true"
                    tabIndex={-1}
                    aria-label={`预览 ${previewTarget.name}`}
                    onClick={() => setPreviewTarget(null)}
                >
                    <img
                        className="animal-upload-preview-img"
                        src={previewSrc(previewTarget)}
                        alt={previewTarget.name}
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        ref={closeBtnRef}
                        type="button"
                        className="animal-upload-preview-close"
                        aria-label="关闭预览"
                        onClick={() => setPreviewTarget(null)}
                    >
                        <CloseIcon size={24} />
                    </button>
                </div>
            )}
        </div>
    );
};

Upload.displayName = 'Upload';
