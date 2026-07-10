#!/usr/bin/env node
const fs = require('node:fs');
const path = require('node:path');

function scan(dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const sub = scan(fullPath);
      results.push(...sub);
    } else if (entry.isFile() && /\.(js|ts)$/.test(entry.name)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach((lineText, i) => {
        if (/TODO:|FIXME:/.test(lineText)) {
          results.push({
            file: fullPath,
            line: i + 1,
            text: lineText.trim()
          });
        }
      });
    }
  }
  return results;
}

function report(results, dir) {
  if (!results || results.length === 0) {
    return 'No TODOs or FIXMEs found.';
  }
  const byFile = {};
  for (const r of results) {
    if (!byFile[r.file]) byFile[r.file] = [];
    byFile[r.file].push(r);
  }
  const files = Object.keys(byFile).sort();
  const lines = ['# TODO/FIXME Report'];
  for (const file of files) {
    lines.push(`## ${file}`);
    for (const r of byFile[file]) {
      lines.push(`- Line ${r.line}: ${r.text}`);
    }
  }
  return lines.join('\n');
}

if (require.main === module) {
  const args = process.argv.slice(2);
  let dir = process.cwd();
  const dirIdx = args.indexOf('--dir');
  if (dirIdx !== -1 && args[dirIdx + 1]) {
    dir = args[dirIdx + 1];
  }
  const results = scan(dir);
  const output = report(results, dir);
  console.log(output);
  process.exitCode = 0;
}

module.exports = { scan, report };
