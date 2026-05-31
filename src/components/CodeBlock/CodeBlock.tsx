import React from 'react';
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

// Declarative syntax-highlight pattern table.
// ORDER IS LOAD-BEARING: patterns are registered top-to-bottom and earlier
// patterns win on overlap (see the token-merge loop below). Do not reorder.
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

const highlightJSX = (code: string): React.ReactNode[] => {
    const tokens: { start: number; end: number; color: string }[] = [];

    const addPattern = (regex: RegExp, color: string) => {
        let match;
        const re = new RegExp(regex.source, regex.flags.includes('g') ? regex.flags : regex.flags + 'g');
        while ((match = re.exec(code)) !== null) {
            tokens.push({
                start: match.index,
                end: match.index + match[0].length,
                color,
            });
        }
    };

    for (const { regex, color } of HIGHLIGHT_PATTERNS) {
        addPattern(regex, color);
    }

    tokens.sort((a, b) => a.start - b.start);

    const result: React.ReactNode[] = [];
    let pos = 0;

    for (const token of tokens) {
        if (token.start < pos) continue;

        if (token.start > pos) {
            result.push(<span key={`t${pos}`} style={{ color: COLORS.default }}>{code.slice(pos, token.start)}</span>);
        }

        result.push(<span key={`s${token.start}`} style={{ color: token.color }}>{code.slice(token.start, token.end)}</span>);
        pos = token.end;
    }

    if (pos < code.length) {
        result.push(<span key={`e${pos}`} style={{ color: COLORS.default }}>{code.slice(pos)}</span>);
    }

    return result;
};

export interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
    code: string;
}

export const CodeBlock = React.forwardRef<HTMLPreElement, CodeBlockProps>(
    ({ code, style, className, ...rest }, ref) => {
        const highlighted = React.useMemo(() => highlightJSX(code), [code]);
        return (
            <pre
                ref={ref}
                style={style}
                className={cn('animal-code-block', className)}
                {...rest}
            >
                {highlighted}
            </pre>
        );
    }
);

CodeBlock.displayName = 'CodeBlock';
