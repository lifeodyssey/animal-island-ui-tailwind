import { describe, it, expect, afterEach, vi } from 'vitest';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { Upload } from './Upload';
import type { UploadFile } from './Upload';

afterEach(() => {
    cleanup();
});

describe('Upload', () => {
    describe('rendering', () => {
        it('渲染子元素（trigger）', () => {
            render(
                <Upload>
                    <button>click</button>
                </Upload>
            );
            expect(screen.getByText('click')).toBeInTheDocument();
        });

        it('应用 animal-upload 类', () => {
            const { container } = render(<Upload><button>u</button></Upload>);
            expect(container.firstChild).toHaveClass('animal-upload');
        });

        it('drag=true 渲染拖拽区域', () => {
            const { container } = render(<Upload drag />);
            expect(container.querySelector('.animal-upload-drag-zone')).not.toBeNull();
        });

        it('listType=picture-card 渲染卡片列表', () => {
            const fileList: UploadFile[] = [
                { uid: '1', name: 'test.png', status: 'done', url: 'https://example.com/test.png' },
            ];
            const { container } = render(
                <Upload listType="picture-card" fileList={fileList} onChange={() => {}} />
            );
            expect(container.querySelector('.animal-upload-card-list')).not.toBeNull();
        });

        it('listType=text 渲染文本列表', () => {
            const fileList: UploadFile[] = [
                { uid: '1', name: 'doc.pdf', status: 'done' },
            ];
            const { container } = render(
                <Upload listType="text" fileList={fileList} onChange={() => {}} />
            );
            expect(container.querySelector('.animal-upload-text-list')).not.toBeNull();
        });
    });

    describe('disabled', () => {
        it('disabled 时应用 animal-upload-disabled 类', () => {
            const { container } = render(
                <Upload disabled>
                    <button>u</button>
                </Upload>
            );
            expect(container.firstChild).toHaveClass('animal-upload-disabled');
        });
    });

    describe('fileList', () => {
        it('显示文件名', () => {
            const fileList: UploadFile[] = [
                { uid: '1', name: 'hello.txt', status: 'done' },
            ];
            render(<Upload fileList={fileList} onChange={() => {}} />);
            expect(screen.getByText('hello.txt')).toBeInTheDocument();
        });

        it('error 状态文件应用 animal-upload-item-error 类', () => {
            const fileList: UploadFile[] = [
                { uid: '1', name: 'fail.txt', status: 'error' },
            ];
            const { container } = render(<Upload fileList={fileList} onChange={() => {}} />);
            expect(container.querySelector('.animal-upload-item-error')).not.toBeNull();
        });

        it('picture-card 卡片 error 状态应用 animal-upload-card-error 类', () => {
            const fileList: UploadFile[] = [
                { uid: '1', name: 'fail.png', status: 'error' },
            ];
            const { container } = render(
                <Upload listType="picture-card" fileList={fileList} onChange={() => {}} />
            );
            expect(container.querySelector('.animal-upload-card-error')).not.toBeNull();
        });
    });

    describe('tip', () => {
        it('渲染 tip 文本', () => {
            render(
                <Upload tip="最多上传3个文件">
                    <button>u</button>
                </Upload>
            );
            expect(screen.getByText('最多上传3个文件')).toBeInTheDocument();
        });
    });
});
