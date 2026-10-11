import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Upload, type UploadCustomRequestOptions } from './Upload';

const deferred = <T,>() => {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((done) => { resolve = done; });
    return { promise, resolve };
};

const selectFile = async (container: HTMLElement, name = 'document.txt') => {
    await act(async () => {
        fireEvent.change(container.querySelector('input[type="file"]')!, {
            target: { files: [new File(['file content'], name, { type: 'text/plain' })] },
        });
    });
};

describe('Upload request lifecycle', () => {
    beforeEach(() => {
        vi.stubGlobal('XMLHttpRequest', vi.fn(function () {
            return {
                upload: {},
                open: vi.fn(),
                send: vi.fn(),
                abort: vi.fn(),
                setRequestHeader: vi.fn(),
            };
        }));
    });

    afterEach(() => {
        cleanup();
        vi.restoreAllMocks();
        vi.unstubAllGlobals();
    });

    it('does not accept a file whose validation resolves after unmount', async () => {
        const validation = deferred<boolean>();
        const customRequest = vi.fn();
        const onChange = vi.fn();
        const { container, unmount } = render(
            <Upload beforeUpload={() => validation.promise} customRequest={customRequest} onChange={onChange} />
        );
        await selectFile(container);
        unmount();
        await act(async () => { validation.resolve(true); });

        expect(customRequest).not.toHaveBeenCalled();
        expect(onChange).not.toHaveBeenCalled();
    });

    it('does not create a request when its action resolves after unmount', async () => {
        const action = deferred<string>();
        const data = vi.fn(() => ({ folder: 'files' }));
        const { container, unmount } = render(<Upload action={() => action.promise} data={data} />);
        await selectFile(container);
        unmount();
        await act(async () => { action.resolve('/upload'); });

        expect(data).not.toHaveBeenCalled();
        expect(XMLHttpRequest).not.toHaveBeenCalled();
    });

    it('does not create a request when a removed file has a pending action', async () => {
        const action = deferred<string>();
        const data = vi.fn(() => ({ folder: 'files' }));
        const { container } = render(<Upload action={() => action.promise} data={data} />);
        await selectFile(container);
        fireEvent.click(screen.getByRole('button', { name: '删除 document.txt' }));
        await act(async () => { action.resolve('/upload'); });

        expect(data).not.toHaveBeenCalled();
        expect(XMLHttpRequest).not.toHaveBeenCalled();
        expect(screen.queryByText('document.txt')).not.toBeInTheDocument();
    });

    it('does not create a request when async form data resolves after unmount', async () => {
        const data = deferred<Record<string, unknown>>();
        const { container, unmount } = render(<Upload action="/upload" data={() => data.promise} />);
        await selectFile(container);
        unmount();
        await act(async () => { data.resolve({ folder: 'files' }); });
        expect(XMLHttpRequest).not.toHaveBeenCalled();
    });

    it('aborts an active XHR when its file is removed', async () => {
        const xhr = { upload: {}, open: vi.fn(), send: vi.fn(), abort: vi.fn() };
        vi.stubGlobal('XMLHttpRequest', vi.fn(function () { return xhr; }));
        const { container } = render(<Upload action="/upload" />);
        await selectFile(container);
        expect(xhr.send).toHaveBeenCalledTimes(1);
        fireEvent.click(screen.getByRole('button', { name: '删除 document.txt' }));
        expect(xhr.abort).toHaveBeenCalledTimes(1);
        expect(screen.queryByText('document.txt')).not.toBeInTheDocument();
    });

    it('keeps concurrent custom uploads separate when they finish in reverse order', async () => {
        const requests = new Map<string, UploadCustomRequestOptions>();
        const onChange = vi.fn();
        const { container } = render(
            <Upload multiple onChange={onChange} customRequest={(request) => {
                requests.set(request.file.name, request);
            }} />
        );
        await selectFile(container, 'first.txt');
        await selectFile(container, 'second.txt');
        act(() => {
            requests.get('second.txt')!.onSuccess('second response');
            requests.get('first.txt')!.onProgress(50);
        });
        expect(onChange.mock.lastCall?.[0].fileList.map(({ name, status }: { name: string; status: string }) =>
            [name, status]
        )).toEqual([['first.txt', 'uploading'], ['second.txt', 'done']]);
        act(() => requests.get('first.txt')!.onSuccess('first response'));
        expect(screen.getAllByLabelText('上传完成')).toHaveLength(2);
    });

    it('ignores custom callbacks after successful completion, including synchronous completion', async () => {
        let request!: UploadCustomRequestOptions;
        const onChange = vi.fn();
        const { container } = render(
            <Upload onChange={onChange} customRequest={(options) => {
                request = options;
                options.onSuccess('uploaded');
            }} />
        );
        await selectFile(container);
        expect(screen.getByLabelText('上传完成')).toBeInTheDocument();
        const callsAfterCompletion = onChange.mock.calls.length;

        act(() => {
            request.onProgress(30);
            request.onError(new Error('late callback'));
            request.onSuccess('duplicate');
        });

        expect(screen.getByLabelText('上传完成')).toBeInTheDocument();
        expect(onChange).toHaveBeenCalledTimes(callsAfterCompletion);
    });

    it('ignores a custom callback after unmount', async () => {
        let request!: UploadCustomRequestOptions;
        const onChange = vi.fn();
        const { container, unmount } = render(
            <Upload onChange={onChange} customRequest={(options) => { request = options; }} />
        );
        await selectFile(container);
        unmount();
        onChange.mockClear();
        act(() => request.onSuccess('late response'));
        expect(onChange).not.toHaveBeenCalled();
    });

    it('reports a synchronous request setup failure through the file error state', async () => {
        vi.stubGlobal('XMLHttpRequest', vi.fn(function () {
            return { upload: {}, open: () => { throw new Error('invalid URL'); }, abort: vi.fn() };
        }));
        const onChange = vi.fn();
        const { container } = render(<Upload action="invalid URL" onChange={onChange} />);
        await selectFile(container);

        expect(screen.getByLabelText('上传失败')).toBeInTheDocument();
        expect(onChange.mock.lastCall?.[0].file.error).toEqual(new Error('invalid URL'));
    });
});
