import React from 'react';
import { afterEach, describe, it, expect, vi } from 'vitest';
import { cleanup, render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Upload, type UploadFile } from './Upload';

const makeFile = (name = 'test.txt', size = 1024, type = 'text/plain') =>
    new File([new ArrayBuffer(size)], name, { type });

afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
});

describe('Upload', () => {
    describe('rendering', () => {
        it('renders children trigger', () => {
            render(
                <Upload>
                    <button type="button">上传</button>
                </Upload>
            );
            expect(screen.getByRole('button', { name: '上传' })).toBeInTheDocument();
        });

        it('renders default trigger when no children', () => {
            const { container } = render(<Upload />);
            expect(container.querySelector('.animal-upload-trigger')).toBeInTheDocument();
        });

        it('drag mode renders drag zone', () => {
            const { container } = render(<Upload drag />);
            expect(container.querySelector('.animal-upload-drag-zone')).toBeInTheDocument();
        });

        it('applies disabled class when disabled', () => {
            const { container } = render(<Upload disabled />);
            expect(container.querySelector('.animal-upload-disabled')).toBeInTheDocument();
        });

        it('renders tip text', () => {
            render(<Upload tip="只支持 PNG" />);
            expect(screen.getByText('只支持 PNG')).toBeInTheDocument();
        });

        it('renders text file list', () => {
            const fileList: UploadFile[] = [
                { uid: '1', name: 'file.txt', status: 'done' },
            ];
            const { container } = render(<Upload fileList={fileList} />);
            expect(container.querySelector('.animal-upload-text-list')).toBeInTheDocument();
            expect(screen.getByText('file.txt')).toBeInTheDocument();
        });

        it('renders picture-card list type', () => {
            const { container } = render(<Upload listType="picture-card" />);
            expect(container.querySelector('.animal-upload-card-list')).toBeInTheDocument();
        });

        it('applies custom className', () => {
            const { container } = render(<Upload className="my-upload" />);
            expect(container.querySelector('.my-upload')).toBeInTheDocument();
        });
    });

    describe('file selection', () => {
        it('calls onChange when file is selected', async () => {
            const onChange = vi.fn();
            const { container } = render(<Upload onChange={onChange} />);
            const input = container.querySelector('input[type="file"]') as HTMLInputElement;
            const file = makeFile();
            fireEvent.change(input, { target: { files: [file] } });
            await waitFor(() => {
                expect(onChange).toHaveBeenCalled();
            });
        });

        it('respects maxCount limit and calls onExceed when overflow', async () => {
            const onExceed = vi.fn();
            const { container } = render(
                <Upload maxCount={1} multiple onExceed={onExceed} />
            );
            const input = container.querySelector('input[type="file"]') as HTMLInputElement;
            const fileA = makeFile('a.txt');
            const fileB = makeFile('b.txt');
            fireEvent.change(input, { target: { files: [fileA, fileB] } });
            await waitFor(() => {
                expect(onExceed).toHaveBeenCalled();
            });
        });
    });

    describe('file removal', () => {
        it('calls onChange with removed status when remove button clicked', async () => {
            const onChange = vi.fn();
            const fileList: UploadFile[] = [
                { uid: '1', name: 'file.txt', status: 'done' },
            ];
            const user = userEvent.setup();
            render(<Upload fileList={fileList} onChange={onChange} />);
            const removeBtn = screen.getByLabelText('删除 file.txt');
            await user.click(removeBtn);
            expect(onChange).toHaveBeenCalledWith(
                expect.objectContaining({
                    file: expect.objectContaining({ status: 'removed' }),
                })
            );
        });

        it('onRemove returning false prevents removal', async () => {
            const onChange = vi.fn();
            const onRemove = vi.fn(() => false as const);
            const fileList: UploadFile[] = [
                { uid: '1', name: 'keep.txt', status: 'done' },
            ];
            const user = userEvent.setup();
            render(<Upload fileList={fileList} onChange={onChange} onRemove={onRemove} />);
            const removeBtn = screen.getByLabelText('删除 keep.txt');
            await user.click(removeBtn);
            expect(onRemove).toHaveBeenCalled();
            expect(onChange).not.toHaveBeenCalled();
        });
    });

    describe('beforeUpload', () => {
        it('beforeUpload returning false prevents upload', async () => {
            const onChange = vi.fn();
            const beforeUpload = vi.fn(() => false as const);
            const { container } = render(
                <Upload beforeUpload={beforeUpload} onChange={onChange} />
            );
            const input = container.querySelector('input[type="file"]') as HTMLInputElement;
            const file = makeFile();
            fireEvent.change(input, { target: { files: [file] } });
            await waitFor(() => {
                expect(beforeUpload).toHaveBeenCalled();
            });
            expect(onChange).not.toHaveBeenCalled();
        });
    });

    describe('drag and drop', () => {
        it('adds drag-active class on dragenter', () => {
            const { container } = render(<Upload drag />);
            const zone = container.querySelector('.animal-upload-drag-zone') as HTMLElement;
            fireEvent.dragEnter(zone, { dataTransfer: { files: [] } });
            expect(zone.classList.contains('animal-upload-drag-active')).toBe(true);
        });

        it('removes drag-active class on dragleave', () => {
            const { container } = render(<Upload drag />);
            const zone = container.querySelector('.animal-upload-drag-zone') as HTMLElement;
            fireEvent.dragEnter(zone, { dataTransfer: { files: [] } });
            fireEvent.dragLeave(zone);
            expect(zone.classList.contains('animal-upload-drag-active')).toBe(false);
        });
    });

    describe('file list item states', () => {
        it('error item gets error class', () => {
            const fileList: UploadFile[] = [
                { uid: '1', name: 'bad.txt', status: 'error' },
            ];
            const { container } = render(<Upload fileList={fileList} />);
            expect(container.querySelector('.animal-upload-item-error')).toBeInTheDocument();
        });

        it('uploading item shows percent', () => {
            const fileList: UploadFile[] = [
                { uid: '1', name: 'going.txt', status: 'uploading', percent: 42 },
            ];
            render(<Upload fileList={fileList} />);
            expect(screen.getByText('42%')).toBeInTheDocument();
        });
    });

    describe('preview', () => {
        it('calls onPreview when preview button clicked', async () => {
            const onPreview = vi.fn();
            const fileList: UploadFile[] = [
                { uid: '1', name: 'photo.png', status: 'done', url: '/photo.png' },
            ];
            const user = userEvent.setup();
            render(<Upload fileList={fileList} onPreview={onPreview} />);
            const previewBtn = screen.getByLabelText('预览 photo.png');
            await user.click(previewBtn);
            expect(onPreview).toHaveBeenCalledWith(
                expect.objectContaining({ name: 'photo.png' })
            );
        });
    });
});
