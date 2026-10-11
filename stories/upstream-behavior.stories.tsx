import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Avatar, AvatarGroup, Badge, Button, CountUp, Rate, Upload } from '../src';

const meta = {
    title: 'Regression/Parity/Upstream Behavior',
    tags: ['!autodocs'],
    parameters: { layout: 'padded' },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const previewImage = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="80" height="80" fill="#82d5bb"/><circle cx="40" cy="40" r="20" fill="#fff8e7"/></svg>')}`;

function InteractiveExamples() {
    const [rating, setRating] = useState(2);
    const [counting, setCounting] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('empty');
    return (
        <main style={{ display: 'grid', gap: 24, width: 420 }} data-testid="upstream-behavior">
            <section aria-label="Badges and avatars">
                <Badge count={120}><Avatar>AB</Avatar></Badge>
                <AvatarGroup maxCount={2}><Avatar>A</Avatar><Avatar>B</Avatar><Avatar>C</Avatar></AvatarGroup>
            </section>
            <section aria-label="Rating examples">
                <Rate value={rating} onChange={setRating} aria-label="Your rating" />
                <output aria-label="Selected rating">{rating}</output>
                <Rate defaultValue={4} readonly aria-label="Readonly rating" />
            </section>
            <section aria-label="Upload examples">
                <Upload
                    aria-label="Upload document"
                    accept=".txt"
                    customRequest={({ onSuccess }) => { onSuccess({ ok: true }); }}
                    onChange={({ file }) => setUploadStatus(file.status ?? 'empty')}
                />
                <output aria-label="Upload status">{uploadStatus}</output>
                <Upload
                    listType="picture-card"
                    aria-label="Upload picture"
                    defaultFileList={[{ uid: 'preview', name: 'island.svg', status: 'done', url: previewImage, type: 'image/svg+xml' }]}
                />
            </section>
            <section aria-label="Counter example">
                <Button onClick={() => setCounting(true)}>Start counter</Button>
                <CountUp end={42} duration={0.1} isCounting={counting} aria-label="Counter" />
            </section>
        </main>
    );
}

export const Interactive: Story = { render: () => <InteractiveExamples /> };

export const Stable: Story = {
    render: () => (
        <main data-testid="upstream-stable" style={{ display: 'grid', gap: 28, width: 440, padding: 24 }}>
            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                <Badge count={120}><Avatar>AB</Avatar></Badge>
                <Badge count={0} showZero />
                <Badge count="New" color="purple" />
                <Avatar src={previewImage} alt="Island" />
                <AvatarGroup maxCount={2}><Avatar>A</Avatar><Avatar>B</Avatar><Avatar>C</Avatar></AvatarGroup>
            </div>
            <Rate defaultValue={3} aria-label="Rating" />
            <Rate defaultValue={4} readonly aria-label="Readonly rating" />
            <Upload aria-label="Upload document" defaultFileList={[{ uid: 'document', name: 'island.txt', status: 'done' }]} />
            <Upload drag aria-label="Drop files" tip="PNG, JPG or PDF" />
            <CountUp start={1234} end={1234} isCounting={false} thousandsSeparator="," variant="island" prefix="¥" />
        </main>
    ),
};
