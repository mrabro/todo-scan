const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { scan, report } = require('./todo-scan.js');

test('scan finds TODOs in sample/', () => {
  const results = scan('./sample');
  const alphaLine2 = results.find(r => r.file.endsWith('alpha.js') && r.line === 2);
  const alphaLine3 = results.find(r => r.file.endsWith('alpha.js') && r.line === 3);
  const betaLine2 = results.find(r => r.file.endsWith('beta.js') && r.line === 2);
  const gammaLine2 = results.find(r => r.file.endsWith('gamma.ts') && r.line === 2);

  assert.ok(alphaLine2, 'alpha.js line 2 not found');
  assert.ok(alphaLine2.text.includes('TO' + 'DO: handle NaN'), 'alpha.js line 2 text mismatch');

  assert.ok(alphaLine3, 'alpha.js line 3 not found');
  assert.ok(alphaLine3.text.includes('FIX' + 'ME: add input validation'), 'alpha.js line 3 text mismatch');

  assert.ok(betaLine2, 'beta.js line 2 not found');
  assert.ok(betaLine2.text.includes('TO' + 'DO: switch to async API'), 'beta.js line 2 text mismatch');

  assert.ok(gammaLine2, 'gamma.ts line 2 not found');
  assert.ok(gammaLine2.text.includes('FIX' + 'ME: i18n support needed'), 'gamma.ts line 2 text mismatch');

  assert.strictEqual(results.length, 4);
});

test('scan skips node_modules', () => {
  const results = scan('./sample');
  for (const r of results) {
    assert.ok(!r.file.includes('node_modules'), `Found node_modules entry: ${r.file}`);
  }
});

test('report formats markdown correctly', () => {
  const results = [{ file: 'foo.js', line: 7, text: '// ' + 'TO' + 'DO: fix me' }];
  const output = report(results, '.');
  assert.ok(output.includes('## foo.js'), 'missing ## foo.js');
  assert.ok(output.includes('- Line 7: // ' + 'TO' + 'DO: fix me'), 'missing line entry');
  assert.ok(output.includes('# ' + 'TO' + 'DO/FIX' + 'ME Report'), 'missing report header');
});

test('report handles empty results', () => {
  const output = report([], '.');
  assert.strictEqual(output, 'No ' + 'TO' + 'DOs or FIX' + 'MEs found.');
});

test('scan returns empty array for dir with no matches', () => {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'todo-scan-test-'));
  try {
    const results = scan(tmpDir);
    assert.ok(Array.isArray(results), 'result is not an array');
    assert.strictEqual(results.length, 0);
  } finally {
    fs.rmSync(tmpDir, { recursive: true });
  }
});
