# todo-scan

A lightweight CLI tool that scans JavaScript and TypeScript files for `TODO:` and `FIXME:` comments and prints a grouped markdown report with full file paths.

## Installation

```bash
npm install -g todo-scan
```

## Usage

```bash
# scan current directory
todo-scan

# scan a specific directory
todo-scan --dir /path/to/your/project
```

## Example Output

```
# TODO/FIXME Report
## /path/to/project/src/utils.js
- Line 12: // TODO: handle edge case for empty input
- Line 34: // FIXME: memory leak on large files
## /path/to/project/src/index.ts
- Line 7: // TODO: add error boundary
```

## Features

- Recursively scans all `.js` and `.ts` files
- Automatically skips `node_modules` and `.git` directories
- Groups results by file with full absolute paths
- Outputs clean markdown-formatted report

## Requirements

- Node.js >= 18

## License

MIT © [Rafi Abro](https://github.com/mrabro)
