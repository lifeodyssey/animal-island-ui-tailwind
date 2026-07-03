/// <reference types="@testing-library/jest-dom" />

declare module '*.css' {
    const content: string;
    export default content;
}

// 图片资源类型声明
declare module '*.png' {
    const src: string;
    export default src;
}

declare module '*.jpg' {
    const src: string;
    export default src;
}

declare module '*.svg' {
    const src: string;
    export default src;
}

declare module '*.svg?url' {
    const src: string;
    export default src;
}

declare module '*.svg?raw' {
    const content: string;
    export default content;
}
