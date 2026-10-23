import React, { useEffect, useRef, useState } from 'react';
import { cn } from '../../utils/cn';

const COLORS = {
    comment: '#6b5e50',
    string: '#a8d4a0',
    keyword: '#d4a0e0',
    react: '#e06c75',
    component: '#80c0e0',
    func: '#61afef',
    prop: '#e8c87a',
    jsx: '#f0a870',
    operator: '#d4b896',
    number: '#a8d4a0',
    default: '#e8d5bc',
};

// ORDER IS LOAD-BEARING: patterns are registered top-to-bottom and earlier
// patterns win on overlap. Do not reorder.
const HIGHLIGHT_PATTERNS: { regex: RegExp; color: string }[] = [
    { regex: /\/\*[\s\S]*?\*\//g, color: COLORS.comment },
    { regex: /\/\/.*$/gm, color: COLORS.comment },
    { regex: /`[^`]*`/g, color: COLORS.string },
    { regex: /"[^"]*"/g, color: COLORS.string },
    { regex: /'[^']*'/g, color: COLORS.string },
    { regex: /<\/?[A-Z][\w.$]*/g, color: COLORS.jsx },
    { regex: /<\/?[a-z][\w-]*/g, color: COLORS.jsx },
    { regex: /\/?>/g, color: COLORS.jsx },
    { regex: /\b(React|useState|useEffect|useCallback|useMemo|useRef|useContext|useReducer|useLayoutEffect|useImperativeHandle|useDebugValue|createContext|createElement|cloneElement|Fragment|Suspense|lazy|memo|forwardRef|useId|FC|ReactNode|ReactElement|CSSProperties)\b/g, color: COLORS.react },
    { regex: /\b(true|false)\b/g, color: COLORS.keyword },
    { regex: /\b(null|undefined|void|NaN|Infinity)\b/gi, color: COLORS.keyword },
    { regex: /\b\d+\.?\d*\b/g, color: COLORS.number },
    { regex: /\b(import|from|as|export|default|const|let|var|function|return|if|else|for|while|switch|case|break|continue|try|catch|throw|finally|new|typeof|instanceof|async|await|type|interface)\b/gi, color: COLORS.keyword },
    { regex: /\b[A-Z][a-zA-Z0-9_$]*\b/g, color: COLORS.component },
    { regex: /\b[a-z][a-zA-Z0-9_$]*\s*(?=\()/g, color: COLORS.func },
    { regex: /\b[a-zA-Z_$][\w$]*\s*(?==)/g, color: COLORS.prop },
    { regex: />|===|!==|==|!=|<=|>=|&&|\|\||[+\-*/%=<>!&|^~?:]/g, color: COLORS.operator },
    { regex: /[{}[\]();,]/g, color: COLORS.operator },
];

interface HighlightToken { start: number; end: number; color: string; italic?: boolean; }

const renderTokens = (code: string, tokens: HighlightToken[]): React.ReactNode[] => {
    tokens.sort((a, b) => a.start - b.start);
    const result: React.ReactNode[] = [];
    let pos = 0;
    for (const token of tokens) {
        if (token.start < pos) continue;
        if (token.start > pos) {
            result.push(<span key={`t${pos}`} style={{ color: COLORS.default }}>{code.slice(pos, token.start)}</span>);
        }
        const s: React.CSSProperties = { color: token.color };
        if (token.italic) s.fontStyle = 'italic';
        result.push(<span key={`s${token.start}`} style={s}>{code.slice(token.start, token.end)}</span>);
        pos = token.end;
    }
    if (pos < code.length) {
        result.push(<span key={`e${pos}`} style={{ color: COLORS.default }}>{code.slice(pos)}</span>);
    }
    return result;
};

const highlightJSX = (code: string): React.ReactNode[] => {
    const tokens: HighlightToken[] = [];

    const addPattern = (regex: RegExp, color: string) => {
        let match;
        const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
        while ((match = re.exec(code)) !== null) {
            tokens.push({ start: match.index, end: match.index + match[0].length, color });
        }
    };

    for (const { regex, color } of HIGHLIGHT_PATTERNS) {
        addPattern(regex, color);
    }

    return renderTokens(code, tokens);
};

const SHELL_COLORS = {
    prompt: '#e8c87a',
    command: '#80c0e0',
    flag: '#d4a0e0',
    string: '#a8d4a0',
    comment: '#6b5e50',
    path: '#f0a870',
    variable: '#e06c75',
    default: '#e8d5bc',
};

const highlightShell = (code: string): React.ReactNode[] => {
    const tokens: HighlightToken[] = [];

    const addPattern = (regex: RegExp, color: string, italic?: boolean) => {
        let match;
        const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
        while ((match = re.exec(code)) !== null) {
            tokens.push({ start: match.index, end: match.index + match[0].length, color, italic });
        }
    };

    addPattern(/#.*$/gm, SHELL_COLORS.comment, true);
    addPattern(/"[^"]*"|'[^']*'/g, SHELL_COLORS.string);
    addPattern(/\$\{?[\w]+\}?/g, SHELL_COLORS.variable);
    addPattern(/(?:^|\s)(--?[\w-]+)/gm, SHELL_COLORS.flag);
    addPattern(/(?:^|\|\s*)(npm|yarn|pnpm|npx|node|git|cd|ls|mkdir|rm|cp|mv|curl|wget|cat|echo|export|source|chmod|chown|touch|find|grep|sed|awk|sort|uniq|head|tail|wc|diff|patch|tar|zip|unzip|ssh|scp|rsync|docker|kubectl|make|cmake|python|python3|pip|pip3|ruby|gem|go|cargo|rustc|java|javac|mvn|gradle|dotnet|php|composer)\b/gm, SHELL_COLORS.command);
    addPattern(/(?:^|\s)(\/[\w./-]+)/gm, SHELL_COLORS.path);
    addPattern(/^\s*[$#>]\s*/gm, SHELL_COLORS.prompt);

    return renderTokens(code, tokens);
};

const looksLikeShell = (code: string): boolean =>
    /^\s*(npm|yarn|pnpm|npx|node|git|cd|ls|mkdir|rm|cp|mv)\b/m.test(code);

const codeBlockStyle: React.CSSProperties = {
    boxSizing: 'border-box',
    width: '100%',
    margin: 0,
    padding: '20px 24px',
    background: '#2b2118',
    border: '1px solid #3d3028',
    borderRadius: 20,
    fontSize: 14,
    lineHeight: 1.7,
    fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
    fontWeight: 600,
    color: '#e8d5bc',
    whiteSpace: 'pre' as const,
    overflow: 'auto' as const,
    tabSize: 4,
};

export interface CodeBlockProps {
    /** 要高亮的 JSX / TypeScript 源码 */
    code: string;
    /** 自定义 pre 样式 */
    style?: React.CSSProperties;
    /** 自定义 pre 类名 */
    className?: string;
    /** 是否显示复制按钮，默认 true */
    copyable?: boolean;
    /** 复制成功后的回调 */
    onCopy?: (code: string) => void;
}

type CopyStatus = 'idle' | 'copied' | 'error';

const COPY_STATUS_CONTENT: Record<CopyStatus, { text: string; label: string }> = {
    idle: { text: '复制', label: '复制代码' },
    copied: { text: '已复制', label: '代码已复制' },
    error: { text: '复制失败', label: '代码复制失败' },
};

const copyText = async (text: string) => {
    if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        return;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    try {
        textarea.select();
        const copied = document.execCommand('copy');
        if (!copied) throw new Error('Copy command failed');
    } finally {
        textarea.remove();
    }
};

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, style, className, copyable = true, onCopy }) => {
    const [copyStatus, setCopyStatus] = useState<CopyStatus>('idle');
    const resetTimer = useRef<number | undefined>(undefined);

    useEffect(() => () => window.clearTimeout(resetTimer.current), []);

    const handleCopy = async () => {
        window.clearTimeout(resetTimer.current);
        try {
            await copyText(code);
            setCopyStatus('copied');
            onCopy?.(code);
        } catch {
            setCopyStatus('error');
        }
        resetTimer.current = window.setTimeout(() => setCopyStatus('idle'), 2_000);
    };

    const buttonContent = COPY_STATUS_CONTENT[copyStatus];
    const copyButtonSpacing = copyable && style?.padding === undefined && style?.paddingRight === undefined;
    const { width, minWidth, maxWidth, margin, marginTop, marginRight, marginBottom, marginLeft, ...preStyle } =
        style ?? {};
    const wrapperStyle: React.CSSProperties = { width, minWidth, maxWidth, margin, marginTop, marginRight, marginBottom, marginLeft };

    return (
        <div className="animal-code-block-wrapper" style={wrapperStyle}>
            <pre
                style={{ ...codeBlockStyle, ...(copyButtonSpacing ? { paddingRight: 96 } : null), ...preStyle }}
                className={cn('animal-code-block', className)}
            >
                {React.useMemo(() => looksLikeShell(code) ? highlightShell(code) : highlightJSX(code), [code])}
            </pre>
            {copyable && (
                <button
                    type="button"
                    className="animal-code-block-copy"
                    aria-label={buttonContent.label}
                    onClick={handleCopy}
                >
                    {buttonContent.text}
                </button>
            )}
        </div>
    );
};

CodeBlock.displayName = 'CodeBlock';
