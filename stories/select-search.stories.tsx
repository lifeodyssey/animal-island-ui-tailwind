import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Select } from '../src/components/Select';

const fruitOptions = [
    { key: 'apple', label: 'Apple' },
    { key: 'orange', label: 'Orange' },
    { key: 'pear', label: 'Pear' },
    { key: 'pineapple', label: 'Pineapple' },
];

function SearchExamples() {
    const [value, setValue] = useState('apple');
    const [changes, setChanges] = useState<string[]>([]);
    const [searches, setSearches] = useState<string[]>([]);
    const [clears, setClears] = useState(0);
    const [lockedChange, setLockedChange] = useState('none');

    return (
        <div style={{ display: 'grid', gap: 24, justifyItems: 'start', padding: 40 }}>
            <section data-testid="controlled-select">
                <Select
                    options={fruitOptions}
                    aria-label="Controlled fruit"
                    placeholder="Choose a fruit"
                    value={value}
                    onChange={(next) => { setValue(next); setChanges((previous) => [...previous, next]); }}
                    showSearch
                    allowClear
                    clearAriaLabel="Clear fruit"
                    onSearch={(next) => setSearches((previous) => [...previous, next])}
                    onClear={() => setClears((previous) => previous + 1)}
                    notFoundContent="No matching fruit"
                />
                <output aria-label="Selected fruit">{value || 'empty'}</output>
                <output aria-label="Value changes">{JSON.stringify(changes)}</output>
                <output aria-label="Search changes">{JSON.stringify(searches)}</output>
                <output aria-label="Clear count">{clears}</output>
            </section>
            <section data-testid="uncontrolled-select">
                <Select options={fruitOptions} aria-label="Uncontrolled fruit" defaultValue="orange" showSearch allowClear clearAriaLabel="Clear uncontrolled fruit" />
            </section>
            <section data-testid="locked-select">
                <Select options={fruitOptions} aria-label="Locked controlled fruit" value="pear" onChange={setLockedChange} allowClear clearAriaLabel="Clear locked fruit" />
                <output aria-label="Requested value">{lockedChange || 'empty'}</output>
            </section>
            <section data-testid="disabled-select">
                <Select options={fruitOptions} aria-label="Disabled fruit" defaultValue="apple" disabled showSearch allowClear clearAriaLabel="Clear disabled fruit" />
            </section>
            <section data-testid="value-filter-select">
                <Select options={[{ key: 'apple', label: '苹果' }, { key: 'orange', label: '橙子' }]} aria-label="Filter by key" showSearch filterOption optionFilterProp="key" />
            </section>
            <section data-testid="remote-filter-select">
                <Select options={fruitOptions} aria-label="Remote filter" showSearch filterOption={false} />
            </section>
            <section data-testid="value-alias-select">
                <Select options={[{ key: 'apple', label: '苹果' }, { key: 'orange', label: '橙子' }]} aria-label="Value filter alias" showSearch optionFilterProp="value" />
            </section>
            <section data-testid="custom-filter-select">
                <Select options={fruitOptions} aria-label="Custom filter" showSearch filterOption={(input, option) => option.label.startsWith(input)} />
            </section>
            <button type="button">After selects</button>
        </div>
    );
}

const meta = {
    title: 'Regression/Select search',
    component: SearchExamples,
    parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SearchExamples>;

export default meta;
type Story = StoryObj<typeof meta>;

// Playwright uses this no-play story so its input never races a play function.
export const Stable: Story = {};

export const SearchAndClear: Story = {
    play: async ({ canvasElement, userEvent }) => {
        const canvas = within(canvasElement);
        const body = within(canvasElement.ownerDocument.body);
        const trigger = canvas.getByRole('combobox', { name: 'Controlled fruit' });
        await userEvent.click(trigger);
        const search = await body.findByPlaceholderText('搜索...');
        await userEvent.type(search, 'Or');
        await expect(body.getAllByRole('option')).toHaveLength(1);
        await userEvent.click(body.getByRole('option', { name: 'Orange' }));
        await expect(canvas.getByLabelText('Selected fruit')).toHaveTextContent('orange');
        await userEvent.click(canvas.getByRole('button', { name: 'Clear fruit', exact: true }));
        await expect(canvas.getByLabelText('Selected fruit')).toHaveTextContent('empty');
        await expect(trigger).toHaveFocus();
    },
};

const emptyKeyOptions = [
    { key: '', label: 'Empty-key option' },
    { key: 'fruit', label: 'Fruit' },
];

function EmptyKeyExamples() {
    const [controlled, setControlled] = useState('fruit');
    const [locked, setLocked] = useState('fruit');
    const [uncontrolledChanges, setUncontrolledChanges] = useState<string[]>([]);
    const [controlledClears, setControlledClears] = useState(0);
    const [lockedRequest, setLockedRequest] = useState('none');

    return (
        <div style={{ display: 'grid', gap: 24, justifyItems: 'start', padding: 40 }}>
            <section>
                <Select options={emptyKeyOptions} aria-label="Uncontrolled empty key" defaultValue="fruit" placeholder="Choose an option" allowClear clearAriaLabel="Clear uncontrolled empty key" onChange={(next) => setUncontrolledChanges((previous) => [...previous, next])} />
                <output aria-label="Empty key changes">{JSON.stringify(uncontrolledChanges)}</output>
            </section>
            <section>
                <Select options={emptyKeyOptions} aria-label="Controlled empty key" value={controlled} onChange={setControlled} placeholder="Choose an option" allowClear clearAriaLabel="Clear controlled empty key" onClear={() => setControlledClears((previous) => previous + 1)} />
                <output aria-label="Controlled empty key value">{JSON.stringify(controlled)}</output>
                <output aria-label="Controlled empty key clears">{controlledClears}</output>
                <button type="button" onClick={() => setControlled('fruit')}>Set controlled fruit</button>
                <button type="button" onClick={() => setControlled('')}>Set controlled empty key</button>
            </section>
            <section>
                <Select options={emptyKeyOptions} aria-label="Locked empty key" value={locked} onChange={setLockedRequest} placeholder="Choose an option" allowClear clearAriaLabel="Clear locked empty key" />
                <output aria-label="Locked empty key request">{JSON.stringify(lockedRequest)}</output>
                <button type="button" onClick={() => setLocked('')}>Set locked empty key externally</button>
            </section>
            <Select options={emptyKeyOptions} aria-label="Initially empty key" defaultValue="" placeholder="Choose an option" showSearch allowClear clearAriaLabel="Clear initially empty key" />
        </div>
    );
}

export const EmptyKeyStable: Story = { render: () => <EmptyKeyExamples /> };
