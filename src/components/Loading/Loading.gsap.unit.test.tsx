import { describe, it, expect, vi, beforeAll } from 'vitest';

/**
 * gsap-spy guardrail for the Loading idle animation.
 *
 * Source of truth: the upstream island animation script
 * `git show upstream/main:src/components/Loading/island/script.js`
 * (guokaigdg/animal-island-ui — the fork parent). Our Loading.tsx ports
 * those 16 gsap calls into a React effect. This test mocks gsap, renders
 * Loading, captures every tween, and asserts each target gets the upstream
 * method + params. It is the regression net for the planned gsap-config
 * refactor: reorder or alter any tween and this fails.
 */
type Call = { method: string; target: unknown; from?: unknown; to?: unknown };
const calls: Call[] = [];

vi.mock('gsap', () => {
    const record = (method: string) => (target: unknown, a: unknown, b: unknown) => {
        if (method === 'fromTo') calls.push({ method, target, from: a, to: b });
        else calls.push({ method, target, to: a });
        return {};
    };
    const gsap = {
        to: vi.fn(record('to')),
        fromTo: vi.fn(record('fromTo')),
        set: vi.fn(record('set')),
        // Run the context callback synchronously so the tweens register.
        context: vi.fn((fn: () => void) => {
            fn();
            return { revert: vi.fn() };
        }),
        registerPlugin: vi.fn(),
        globalTimeline: { pause: vi.fn() },
    };
    return { gsap, default: gsap };
});
vi.mock('gsap/MotionPathPlugin', () => ({ MotionPathPlugin: {} }));

import { render } from '@testing-library/react';
import { Loading } from './Loading';

const to = (target: string) => calls.find((c) => c.method === 'to' && c.target === target);
const fromTo = (target: string) => calls.find((c) => c.method === 'fromTo' && c.target === target);
const set = (target: string) => calls.find((c) => c.method === 'set' && c.target === target);

beforeAll(() => {
    render(<Loading active />);
});

describe('Loading gsap tweens match upstream island/script.js', () => {
    it('registers the full upstream tween set (14 to/fromTo + 1 set + fish)', () => {
        // 8 `to` (incl. fish) + 6 `fromTo` + 1 `set` = 15 unique calls
        expect(calls.filter((c) => c.method === 'to').length).toBeGreaterThanOrEqual(8);
        expect(calls.filter((c) => c.method === 'fromTo').length).toBeGreaterThanOrEqual(6);
        expect(calls.filter((c) => c.method === 'set').length).toBeGreaterThanOrEqual(1);
    });

    it('#whole-island bob', () => {
        expect(to('#whole-island')?.to).toMatchObject({ y: -15, rotation: 1, duration: 1, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });
    it('#tree sway', () => {
        expect(fromTo('#tree')?.from).toMatchObject({ rotation: -6 });
        expect(fromTo('#tree')?.to).toMatchObject({ rotation: 5, duration: 2, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });
    it('#leaf1', () => {
        expect(to('#leaf1')?.to).toMatchObject({ y: -3, duration: 1, ease: 'sine.inOut', yoyo: true, repeat: -1 });
    });
    it('#leaf2', () => {
        expect(fromTo('#leaf2')?.from).toMatchObject({ rotation: 3 });
        expect(fromTo('#leaf2')?.to).toMatchObject({ rotation: -4, x: -3, y: -3 });
    });
    it('#leaf3', () => {
        expect(to('#leaf3')?.to).toMatchObject({ rotation: -6, duration: 1 });
    });
    it('#leaf4', () => {
        expect(to('#leaf4')?.to).toMatchObject({ rotation: -6, y: -3 });
    });
    it('#leaf5', () => {
        expect(to('#leaf5')?.to).toMatchObject({ y: -3 });
    });
    it('#water-circle1 / #water-circle2', () => {
        expect(to('#water-circle1')?.to).toMatchObject({ scaleX: 1.2 });
        expect(to('#water-circle2')?.to).toMatchObject({ scaleX: 0.8, delay: -0.5 });
    });
    it('#tri-wave1 / #tri-wave2 drift', () => {
        expect(fromTo('#tri-wave1')?.from).toMatchObject({ x: -60 });
        expect(fromTo('#tri-wave1')?.to).toMatchObject({ x: 20, duration: 6, ease: 'none' });
        expect(fromTo('#tri-wave2')?.from).toMatchObject({ x: -10 });
        expect(fromTo('#tri-wave2')?.to).toMatchObject({ x: 50, duration: 6, ease: 'none' });
    });
    it('tri-wave path scaleY pulse', () => {
        expect(fromTo('#tri-wave1>path, #tri-wave2>path')?.to).toMatchObject({ scaleY: 1, yoyo: true });
    });
    it('#sine-wave-group drift + pulse', () => {
        const drift = calls.find((c) => c.method === 'fromTo' && c.target === '#sine-wave-group *' && (c.to as { x?: number }).x === 75);
        expect(drift?.to).toMatchObject({ x: 75, duration: 2, ease: 'none' });
        const pulse = calls.find((c) => c.method === 'fromTo' && c.target === '#sine-wave-group *' && (c.to as { scaleY?: number }).scaleY === 1.2);
        expect(pulse?.to).toMatchObject({ scaleY: 1.2, yoyo: true });
    });
    it('#fish-path set + #fish motionPath', () => {
        expect(set('#fish-path')?.to).toMatchObject({ scaleX: 1.3, scaleY: 1.3 });
        const fish = to('#fish')?.to as { duration?: number; repeatDelay?: number; ease?: string; motionPath?: Record<string, unknown> };
        expect(fish).toMatchObject({ duration: 3, repeat: -1, repeatDelay: 4, ease: 'slow(0.3, 0.7, false)' });
        expect(fish?.motionPath).toMatchObject({ path: '#fish-path', autoRotate: true });
    });
});
