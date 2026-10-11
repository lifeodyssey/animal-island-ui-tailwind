import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Upload, type UploadCustomRequestOptions, type UploadFile, type UploadOnChange } from './Upload';

const makeFile = (name: string, type = 'text/plain') => new File(['contents'], name, { type });
const pickFiles = async (container: HTMLElement, files: File[]) => {
    await act(async () => {
        fireEvent.change(container.querySelector('input[type="file"]')!, { target: { files } });
    });
};
const createObjectURL = vi.fn<typeof URL.createObjectURL>();
const revokeObjectURL = vi.fn<typeof URL.revokeObjectURL>();
let requests: FakeXHR[];

class FakeXHR {
    open = vi.fn();
    send = vi.fn<(body: FormData) => void>();
    abort = vi.fn(() => this.onabort?.());
    setRequestHeader = vi.fn();
    withCredentials = false;
    status = 200;
    response: unknown;
    onload: (() => void) | null = null;
    onerror: (() => void) | null = null;
    onabort: (() => void) | null = null;
    upload: { onprogress: ((event: ProgressEvent) => void) | null } = { onprogress: null };

    constructor() {
        requests.push(this);
    }
}

beforeEach(() => {
    requests = [];
    let nextUrl = 0;
    createObjectURL.mockReset().mockImplementation(() => `blob:upload-${++nextUrl}`);
    revokeObjectURL.mockReset();
    vi.stubGlobal('URL', class extends URL {
        static createObjectURL = createObjectURL;
        static revokeObjectURL = revokeObjectURL;
    });
    vi.stubGlobal('XMLHttpRequest', FakeXHR);
});

afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
});

describe('Upload controlled lists and object URL ownership', () => {
    it('proposes removal without changing the controlled list', () => {
        const fileList: UploadFile[] = [{ uid: 'remote', name: 'remote.txt', status: 'done' }];
        const onChange = vi.fn<UploadOnChange>();
        const { rerender } = render(<Upload fileList={fileList} onChange={onChange} />);
        fireEvent.click(screen.getByRole('button', { name: '删除 remote.txt' }));
        expect(onChange).toHaveBeenLastCalledWith(expect.objectContaining({
            file: { ...fileList[0], status: 'removed' }, fileList: [],
        }));
        expect(screen.getByText('remote.txt')).toBeInTheDocument();
        expect(fileList[0].status).toBe('done');
        rerender(<Upload fileList={[]} onChange={onChange} />);
        expect(screen.queryByText('remote.txt')).not.toBeInTheDocument();
    });

    it.each(['remove button', 'external update'] as const)(
        'releases a controlled thumbnail only after the parent removes it: %s',
        async (method) => {
            const onChange = vi.fn<UploadOnChange>();
            const customRequest = vi.fn();
            const { container, rerender, unmount } = render(
                <Upload fileList={[]} customRequest={customRequest} onChange={onChange} />
            );
            await pickFiles(container, [makeFile('photo.png', 'image/png')]);
            const accepted = onChange.mock.lastCall![0].fileList;
            expect(accepted[0].thumbUrl).toBe('blob:upload-1');
            expect(accepted[0].url).toBeUndefined();
            rerender(<Upload fileList={accepted} customRequest={customRequest} onChange={onChange} />);
            if (method === 'remove button') {
                fireEvent.click(screen.getByRole('button', { name: '删除 photo.png' }));
            }
            expect(revokeObjectURL).not.toHaveBeenCalled();
            expect(screen.getByText('photo.png')).toBeInTheDocument();
            rerender(<Upload fileList={[]} customRequest={customRequest} onChange={onChange} />);
            expect(revokeObjectURL).toHaveBeenCalledExactlyOnceWith('blob:upload-1');
            unmount();
            expect(revokeObjectURL).toHaveBeenCalledTimes(1);
        }
    );

    it('keeps a controlled thumbnail valid while the parent considers a maxCount replacement', async () => {
        const onChange = vi.fn<UploadOnChange>();
        const customRequest = vi.fn();
        const props = { maxCount: 1, customRequest, onChange };
        const { container, rerender } = render(<Upload {...props} fileList={[]} />);
        await pickFiles(container, [makeFile('old.png', 'image/png')]);
        rerender(<Upload {...props} fileList={onChange.mock.lastCall![0].fileList} />);
        await pickFiles(container, [makeFile('new.png', 'image/png')]);
        const replacement = onChange.mock.lastCall![0].fileList;
        expect(screen.getByText('old.png')).toBeInTheDocument();
        expect(revokeObjectURL).not.toHaveBeenCalled();
        rerender(<Upload {...props} fileList={replacement} />);
        expect(revokeObjectURL).toHaveBeenCalledExactlyOnceWith('blob:upload-1');
        expect(screen.getByText('new.png')).toBeInTheDocument();
    });

    it('releases local thumbnails on remove and unmount without revoking remote URLs', async () => {
        const { container, unmount } = render(
            <Upload multiple customRequest={() => {}} defaultFileList={[
                { uid: 'remote', name: 'remote.png', status: 'done', thumbUrl: 'https://example.com/photo.png' },
            ]} />
        );
        await pickFiles(container, [makeFile('one.png', 'image/png'), makeFile('two.png', 'image/png')]);
        fireEvent.click(screen.getByRole('button', { name: '删除 one.png' }));
        expect(revokeObjectURL).toHaveBeenCalledExactlyOnceWith('blob:upload-1');
        unmount();
        expect(revokeObjectURL.mock.calls.map(([url]) => url)).toEqual(['blob:upload-1', 'blob:upload-2']);
    });
});

describe('Upload count limits', () => {
    it('keeps existing and earliest selected files, and reports every overflow without uploading it', async () => {
        const existing: UploadFile = { uid: 'existing', name: 'existing.txt', status: 'done' };
        const onChange = vi.fn<UploadOnChange>();
        const onExceed = vi.fn();
        const customRequest = vi.fn<(options: UploadCustomRequestOptions) => void>();
        const { container } = render(
            <Upload multiple maxCount={2} defaultFileList={[existing]} onChange={onChange}
                onExceed={onExceed} customRequest={customRequest} />
        );
        const [first, second, third] = ['first.txt', 'second.txt', 'third.txt'].map((name) => makeFile(name));
        await pickFiles(container, [first, second, third]);
        expect(onChange.mock.lastCall![0].fileList.map((file) => file.name)).toEqual(['existing.txt', 'first.txt']);
        expect(customRequest.mock.calls.map(([options]) => options.file)).toEqual([first]);
        expect(onExceed).toHaveBeenCalledExactlyOnceWith([second, third], onChange.mock.lastCall![0].fileList);
    });

    it('does not upload or notify a list change when the list is already full', async () => {
        const onChange = vi.fn<UploadOnChange>();
        const onExceed = vi.fn();
        const customRequest = vi.fn();
        const existing: UploadFile[] = ['one.txt', 'two.txt'].map((name) => ({ uid: name, name, status: 'done' }));
        const { container } = render(
            <Upload maxCount={2} defaultFileList={existing} onChange={onChange}
                onExceed={onExceed} customRequest={customRequest} />
        );
        const extra = makeFile('extra.png', 'image/png');
        await pickFiles(container, [extra]);
        expect(onChange).not.toHaveBeenCalled();
        expect(customRequest).not.toHaveBeenCalled();
        expect(onExceed).toHaveBeenCalledExactlyOnceWith([extra], existing);
        expect(revokeObjectURL).toHaveBeenCalledExactlyOnceWith('blob:upload-1');
    });

    it('replaces a single existing file without reporting it as overflow and cancels its transfer', async () => {
        const onExceed = vi.fn();
        const { container } = render(<Upload maxCount={1} action="/upload" onExceed={onExceed} />);
        await pickFiles(container, [makeFile('old.png', 'image/png')]);
        await pickFiles(container, [makeFile('new.txt')]);
        expect(requests[0].abort).toHaveBeenCalledTimes(1);
        expect(requests[1].send).toHaveBeenCalledTimes(1);
        expect(revokeObjectURL).toHaveBeenCalledExactlyOnceWith('blob:upload-1');
        expect(onExceed).not.toHaveBeenCalled();
        expect(screen.queryByText('old.png')).not.toBeInTheDocument();
        expect(screen.getByText('new.txt')).toBeInTheDocument();
    });

    it('reports unprocessed multi-select files when maxCount is one', async () => {
        const onExceed = vi.fn();
        const customRequest = vi.fn<(options: UploadCustomRequestOptions) => void>();
        const { container } = render(<Upload multiple maxCount={1} customRequest={customRequest} onExceed={onExceed} />);
        const files = ['one.txt', 'two.txt', 'three.txt'].map((name) => makeFile(name));
        await pickFiles(container, files);
        expect(onExceed.mock.lastCall![0]).toEqual(files.slice(1));
        expect(customRequest.mock.calls.map(([options]) => options.file)).toEqual([files[0]]);
    });

    it('treats maxCount zero as unlimited', async () => {
        const customRequest = vi.fn();
        const { container } = render(<Upload multiple maxCount={0} customRequest={customRequest} />);
        await pickFiles(container, [makeFile('one.txt'), makeFile('two.txt')]);
        expect(customRequest).toHaveBeenCalledTimes(2);
    });
});

describe('Upload HTTP request contract', () => {
    it('awaits per-file action/data and preserves file and Blob fields in FormData', async () => {
        const file = makeFile('document.txt');
        const attachment = makeFile('attachment.txt');
        const blob = new Blob(['metadata'], { type: 'text/plain' });
        const action = vi.fn(async (selected: File) => `/signed/${selected.name}`);
        const data = vi.fn(async () => ({ attachment, blob, count: 3, source: 'form' }));
        const { container } = render(
            <Upload action={action} data={data} name="attachmentFile" method="PUT"
                headers={{ Authorization: 'Bearer test-token' }} withCredentials />
        );
        await pickFiles(container, [file]);
        const xhr = requests[0];
        expect(action).toHaveBeenCalledExactlyOnceWith(file);
        expect(data).toHaveBeenCalledExactlyOnceWith(file);
        expect(xhr.open).toHaveBeenCalledExactlyOnceWith('PUT', '/signed/document.txt', true);
        expect(xhr.withCredentials).toBe(true);
        expect(xhr.setRequestHeader).toHaveBeenCalledExactlyOnceWith('Authorization', 'Bearer test-token');
        const form = xhr.send.mock.lastCall![0];
        expect(form.get('attachmentFile')).toBeInstanceOf(File);
        expect((form.get('attachmentFile') as File).name).toBe('document.txt');
        expect(form.get('attachment')).toBe(attachment);
        expect(form.get('blob')).toBeInstanceOf(File);
        expect((form.get('blob') as File).size).toBe(blob.size);
        expect(form.get('count')).toBe('3');
        expect(form.get('source')).toBe('form');
    });

    it('reports progress events and includes successful responses in both file and fileList', async () => {
        const onChange = vi.fn<UploadOnChange>();
        const { container } = render(<Upload action="/upload" onChange={onChange} />);
        await pickFiles(container, [makeFile('document.txt')]);
        const xhr = requests[0];
        expect(xhr.open).toHaveBeenCalledWith('POST', '/upload', true);
        expect(xhr.send.mock.lastCall![0].get('file')).toBeInstanceOf(File);
        const event = new ProgressEvent('progress', { lengthComputable: true, loaded: 1, total: 3 });
        act(() => xhr.upload.onprogress!(event));
        expect(onChange.mock.lastCall![0]).toMatchObject({ event, file: { status: 'uploading', percent: 33 } });
        const response = { url: '/files/document.txt' };
        act(() => { xhr.status = 201; xhr.response = response; xhr.onload!(); });
        const info = onChange.mock.lastCall![0];
        expect(info.file).toMatchObject({ status: 'done', percent: 100, response });
        expect(info.fileList[0]).toEqual(info.file);
        expect(screen.getByLabelText('上传完成')).toBeInTheDocument();
    });

    it.each(['http', 'network'] as const)('reports %s errors without a false success', async (kind) => {
        const onChange = vi.fn<UploadOnChange>();
        const { container } = render(<Upload action="/upload" onChange={onChange} />);
        await pickFiles(container, [makeFile('document.txt')]);
        const xhr = requests[0];
        act(() => {
            if (kind === 'http') { xhr.status = 500; xhr.response = 'server rejected'; xhr.onload!(); }
            else xhr.onerror!();
        });
        const info = onChange.mock.lastCall![0];
        expect(info.file.status).toBe('error');
        expect(info.file.error).toEqual(kind === 'http' ? 'server rejected' : new Error('network error'));
        expect(info.fileList[0]).toEqual(info.file);
        expect(screen.getByLabelText('上传失败')).toBeInTheDocument();
    });

    it.each(['empty action', 'rejected action', 'rejected data'] as const)(
        'reports %s without starting an XHR', async (kind) => {
            const onChange = vi.fn<UploadOnChange>();
            const failure = new Error('signing failed');
            const action = kind === 'empty action' ? () => ''
                : kind === 'rejected action' ? async () => { throw failure; } : '/upload';
            const data = kind === 'rejected data' ? async () => { throw failure; } : undefined;
            const { container } = render(<Upload action={action} data={data} onChange={onChange} />);
            await pickFiles(container, [makeFile('document.txt')]);
            expect(requests).toHaveLength(0);
            expect(onChange.mock.lastCall![0].file).toMatchObject({ status: 'error', error: expect.any(Error) });
        }
    );

    it('gives customRequest precedence over action and forwards its response', async () => {
        const response = { id: 'custom-upload' };
        const action = vi.fn(() => '/upload');
        const onChange = vi.fn<UploadOnChange>();
        const { container } = render(
            <Upload action={action} onChange={onChange} customRequest={({ onSuccess }) => onSuccess(response)} />
        );
        await pickFiles(container, [makeFile('document.txt')]);
        expect(action).not.toHaveBeenCalled();
        expect(requests).toHaveLength(0);
        expect(onChange.mock.lastCall![0].file).toMatchObject({ status: 'done', response });
    });
});

describe('Upload validation and selection', () => {
    it.each([
        { status: 'uploading', label: '上传中 42%' },
        { status: 'done', label: '上传完成' },
        { status: 'error', label: '上传失败' },
    ] as const)('exposes a single accessible name for the $status status indicator', ({ status, label }) => {
        render(<Upload defaultFileList={[{ uid: 'one', name: 'one.txt', status, percent: 42 }]} />);
        const indicator = screen.getByRole('img', { name: label });
        expect(indicator).toHaveAccessibleName(label);
        if (status !== 'uploading') expect(indicator.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    });

    it('uploads the transformed file while preserving the original file reference', async () => {
        const original = makeFile('original.txt');
        const transformed = makeFile('optimized.png', 'image/png');
        const beforeUpload = vi.fn(async () => transformed);
        const customRequest = vi.fn<(options: UploadCustomRequestOptions) => void>();
        const onChange = vi.fn<UploadOnChange>();
        const { container } = render(<Upload beforeUpload={beforeUpload} customRequest={customRequest} onChange={onChange} />);
        await pickFiles(container, [original]);
        expect(beforeUpload).toHaveBeenCalledExactlyOnceWith(original, [original]);
        expect(customRequest.mock.lastCall![0].file).toBe(transformed);
        expect(onChange.mock.lastCall![0].file).toMatchObject({
            name: 'optimized.png', type: 'image/png', originFileObj: original, thumbUrl: 'blob:upload-1',
        });
        expect(createObjectURL).toHaveBeenCalledExactlyOnceWith(transformed);
    });

    it('skips false and rejected validations while processing subsequent files', async () => {
        const errorLog = vi.spyOn(console, 'error').mockImplementation(() => {});
        const customRequest = vi.fn<(options: UploadCustomRequestOptions) => void>();
        const files = ['blocked.txt', 'rejected.txt', 'allowed.txt'].map((name) => makeFile(name));
        const { container } = render(<Upload multiple customRequest={customRequest} beforeUpload={async (file) => {
            if (file.name === 'rejected.txt') throw new Error('validation failed');
            return file.name !== 'blocked.txt';
        }} />);
        await pickFiles(container, files);
        expect(customRequest.mock.calls.map(([options]) => options.file)).toEqual([files[2]]);
        expect(errorLog).toHaveBeenCalledTimes(1);
        expect(screen.queryByText('blocked.txt')).not.toBeInTheDocument();
        expect(screen.queryByText('rejected.txt')).not.toBeInTheDocument();
        expect(screen.getByText('allowed.txt')).toBeInTheDocument();
    });

    it.each(['false', 'rejected'] as const)('retains the file when onRemove returns %s', async (result) => {
        vi.spyOn(console, 'error').mockImplementation(() => {});
        const onChange = vi.fn<UploadOnChange>();
        const onRemove = vi.fn(async () => {
            if (result === 'rejected') throw new Error('removal failed');
            return false;
        });
        const file: UploadFile = { uid: 'one', name: 'one.txt', status: 'done' };
        render(<Upload defaultFileList={[file]} onRemove={onRemove} onChange={onChange} />);
        await act(async () => { fireEvent.click(screen.getByRole('button', { name: '删除 one.txt' })); });
        expect(onRemove).toHaveBeenCalledExactlyOnceWith(file);
        expect(onChange).not.toHaveBeenCalled();
        expect(screen.getByText('one.txt')).toBeInTheDocument();
    });

    it('filters dropped files by MIME wildcards, exact MIME types, and case-insensitive extensions', async () => {
        const customRequest = vi.fn<(options: UploadCustomRequestOptions) => void>();
        render(<Upload drag multiple accept="image/*, application/pdf, .TXT" customRequest={customRequest} />);
        const files = [makeFile('photo.png', 'image/png'), makeFile('document.pdf', 'application/pdf'),
            makeFile('NOTES.TXT', ''), makeFile('audio.mp3', 'audio/mpeg'), makeFile('unknown.png', '')];
        await act(async () => {
            fireEvent.drop(screen.getByRole('button', { name: '上传文件' }), { dataTransfer: { files } });
        });
        expect(customRequest.mock.calls.map(([options]) => options.file)).toEqual(files.slice(0, 3));
    });

    it('enforces single selection for drop but accepts all files from directory input', async () => {
        const customRequest = vi.fn<(options: UploadCustomRequestOptions) => void>();
        const { container, rerender } = render(<Upload drag customRequest={customRequest} />);
        const files = [makeFile('one.txt'), makeFile('two.txt')];
        await act(async () => {
            fireEvent.drop(screen.getByRole('button', { name: '上传文件' }), { dataTransfer: { files } });
        });
        expect(customRequest.mock.calls.map(([options]) => options.file)).toEqual([files[0]]);
        customRequest.mockClear();
        rerender(<Upload directory customRequest={customRequest} />);
        expect(container.querySelector('input')).toHaveAttribute('webkitdirectory');
        await pickFiles(container, files);
        expect(customRequest.mock.calls.map(([options]) => options.file)).toEqual(files);
    });

    it('ignores file selection and drops while disabled', async () => {
        const customRequest = vi.fn();
        const onChange = vi.fn();
        const { container } = render(<Upload drag disabled customRequest={customRequest} onChange={onChange} />);
        const files = [makeFile('one.txt')];
        await pickFiles(container, files);
        fireEvent.drop(screen.getByRole('button', { name: '上传文件' }), { dataTransfer: { files } });
        expect(customRequest).not.toHaveBeenCalled();
        expect(onChange).not.toHaveBeenCalled();
    });
});
