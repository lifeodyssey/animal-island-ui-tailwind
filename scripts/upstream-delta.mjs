#!/usr/bin/env node
// Upstream delta analysis (CC-native, replaces the codex:upstream-check shallow check).
//
// The old check-upstream-sync.mjs used `git fetch --depth=1`, which only fetches
// upstream/main's tip — so `git log HEAD..upstream/main` saw a single commit and
// silently under-reported multi-commit deltas (it reported 1 when there were 55).
//
// This script does a FULL fetch, computes the real merge-base, and buckets the
// changed files per component into a machine-readable worklist.
//
// Output:
//   - stdout: worklist JSON  { totalUpstreamCommits, components: [{component, files, commits, commitRange}], otherFiles }
//   - stderr: human-readable summary
//
// Usage: node scripts/upstream-delta.mjs            # JSON on stdout, summary on stderr
//        node scripts/upstream-delta.mjs --summary  # human summary only (stdout)

import { execFileSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';

const UPSTREAM_URL = 'https://github.com/guokaigdg/animal-island-ui.git';
const COMPONENT_RE = /^src\/components\/([^/]+)\//;
const LEDGER = '.upstream-sync'; // tracked file: full SHA of the last upstream commit we synced to

const git = (args, opts = {}) =>
    execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], ...opts }).trim();

const log = (msg) => process.stderr.write(`${msg}\n`);

function readLedgerSha() {
    if (!existsSync(LEDGER)) return null;
    return readFileSync(LEDGER, 'utf8').trim().split(/\s+/)[0] || null;
}

function isAncestor(sha) {
    try {
        git(['merge-base', '--is-ancestor', sha, 'upstream/main']);
        return true;
    } catch {
        return false;
    }
}

function ensureUpstream(ledgerSha) {
    const remotes = git(['remote']).split('\n').filter(Boolean);
    if (!remotes.includes('upstream')) git(['remote', 'add', 'upstream', UPSTREAM_URL]);
    git(['fetch', 'upstream', 'main:refs/remotes/upstream/main'], { stdio: ['ignore', 'pipe', 'inherit'] });
    // This repo may be a shallow clone — deepen until the ledger SHA is reachable
    // (otherwise the delta is silently truncated, the original --depth=1 bug).
    if (ledgerSha) {
        for (let i = 0; i < 6 && !isAncestor(ledgerSha); i++) {
            try {
                git(['fetch', `--deepen=300`, 'upstream', 'main:refs/remotes/upstream/main'], {
                    stdio: ['ignore', 'pipe', 'inherit'],
                });
            } catch {
                break;
            }
        }
    }
}

// This fork has an independent (grafted/shallow) history, so `git merge-base HEAD
// upstream/main` is unreliable. The source of truth for "what we've synced" is the
// .upstream-sync ledger (the last upstream SHA we ported). merge-base is only a fallback.
function syncBase(ledgerSha) {
    if (ledgerSha && isAncestor(ledgerSha)) return { base: ledgerSha, source: 'ledger' };
    if (ledgerSha) log(`⚠ ${LEDGER} SHA ${ledgerSha.slice(0, 8)} not reachable in upstream/main (force-push / too shallow) — falling back`);
    try {
        return { base: git(['merge-base', 'HEAD', 'upstream/main']), source: 'merge-base' };
    } catch {
        log(`⚠ no usable ${LEDGER} ledger and merge-base failed (independent history).`);
        log(`  Create ${LEDGER} with the last synced upstream SHA, e.g.: git rev-parse upstream/main > ${LEDGER}`);
        process.exit(2);
    }
}

function main() {
    const summaryOnly = process.argv.includes('--summary');
    const ledgerSha = readLedgerSha();
    ensureUpstream(ledgerSha);

    const { base, source } = syncBase(ledgerSha);
    const headSha = git(['rev-parse', 'HEAD']);
    const upstreamSha = git(['rev-parse', 'upstream/main']);

    // Upstream-only commits since the real merge-base, oldest first (port order).
    const shas = git(['rev-list', '--reverse', `${base}..upstream/main`]).split('\n').filter(Boolean);
    const totalUpstreamCommits = shas.length;

    // Bucket changed files per component.
    const byComponent = new Map(); // name -> { files:Set, commits:[] }
    const otherFiles = new Set();
    for (const sha of shas) {
        const subject = git(['show', '-s', '--format=%h %s', sha]);
        const files = git(['show', '--name-only', '--format=', sha]).split('\n').filter(Boolean);
        const touchedComponents = new Set();
        for (const f of files) {
            const m = COMPONENT_RE.exec(f);
            if (m) {
                const name = m[1];
                touchedComponents.add(name);
                if (!byComponent.has(name)) byComponent.set(name, { files: new Set(), commits: [] });
                byComponent.get(name).files.add(f);
            } else {
                otherFiles.add(f);
            }
        }
        for (const name of touchedComponents) byComponent.get(name).commits.push(subject);
    }

    const components = [...byComponent.entries()]
        .map(([component, { files, commits }]) => ({
            component,
            files: [...files].sort(),
            commitCount: commits.length,
            commits,
            commitRange: `${base.slice(0, 8)}..${upstreamSha.slice(0, 8)}`,
        }))
        .sort((a, b) => b.commitCount - a.commitCount);

    const worklist = {
        head: headSha,
        upstream: upstreamSha,
        mergeBase: base,
        totalUpstreamCommits,
        components,
        otherFiles: [...otherFiles].sort(),
    };

    log('# Upstream delta');
    log(`- HEAD: ${headSha.slice(0, 8)}  upstream/main: ${upstreamSha.slice(0, 8)}  base(${source}): ${base.slice(0, 8)}`);
    log(`- upstream-only commits: ${totalUpstreamCommits}`);
    log(`- components touched: ${components.length}`);
    for (const c of components) log(`    ${c.component.padEnd(20)} ${c.commitCount} commit(s), ${c.files.length} file(s)`);
    if (otherFiles.size) log(`- non-component files changed: ${otherFiles.size}`);
    if (totalUpstreamCommits === 0) log('- ✓ up to date with upstream.');

    if (summaryOnly) {
        process.stdout.write(`upstream-only commits: ${totalUpstreamCommits}, components: ${components.length}\n`);
    } else {
        process.stdout.write(`${JSON.stringify(worklist, null, 2)}\n`);
    }
}

main();
