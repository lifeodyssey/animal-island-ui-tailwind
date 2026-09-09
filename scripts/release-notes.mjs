import { readFileSync, writeFileSync } from 'node:fs';

const [tag, outputPath] = process.argv.slice(2);
const version = tag?.replace(/^v/, '');
const packageVersion = JSON.parse(readFileSync('package.json', 'utf8')).version;
if (!version || version !== packageVersion || !outputPath) {
    throw new Error('Provide a release tag matching package.json and an output path.');
}

const sections = readFileSync('CHANGELOG.md', 'utf8').split(/^## /m);
const section = sections.find((entry) => entry.startsWith(`${version} - `));
const body = section?.slice(section.indexOf('\n') + 1).trim();
if (!body) throw new Error(`Missing release notes for ${version} in CHANGELOG.md.`);
writeFileSync(outputPath, `${body}\n`);
