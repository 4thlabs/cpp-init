#!/usr/bin/env node
// cpp-init: scaffold a C++ project from one of the templates in ./templates.
//
//   npx @4thlabs/cpp-init@latest [directory] [--template cli]

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import readline from 'node:readline/promises';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const TEMPLATES_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'templates');

// Files npm would strip or rename when publishing are stored with a leading underscore.
const RENAMED_FILES = { _gitignore: '.gitignore' };

const HELP = `Usage: npx @4thlabs/cpp-init@latest [directory] [options]

Options:
  -t, --template <name>  Template to use (see the list below)
  -f, --force            Write into a non-empty directory
  -y, --yes              Accept the defaults for every question
  -h, --help             Show this help

Templates:
`;

function loadTemplates() {
  return fs
    .readdirSync(TEMPLATES_DIR, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const meta = JSON.parse(fs.readFileSync(path.join(TEMPLATES_DIR, entry.name, 'template.json'), 'utf8'));
      return { id: entry.name, ...meta };
    });
}

function toProjectName(directory) {
  return path
    .basename(path.resolve(directory))
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^[-_]+|[-_]+$/g, '') || 'my-app';
}

function isEmptyDir(dir) {
  return !fs.existsSync(dir) || fs.readdirSync(dir).filter((f) => f !== '.git').length === 0;
}

function copyTemplate(srcDir, destDir, replacements) {
  fs.mkdirSync(destDir, { recursive: true });

  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    if (entry.name === 'template.json') continue;

    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, RENAMED_FILES[entry.name] ?? entry.name);

    if (entry.isDirectory()) {
      copyTemplate(src, dest, replacements);
      continue;
    }

    let content = fs.readFileSync(src, 'utf8');
    for (const [from, to] of replacements) content = content.replaceAll(from, to);
    fs.writeFileSync(dest, content);
  }
}

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: {
      template: { type: 'string', short: 't' },
      force: { type: 'boolean', short: 'f' },
      yes: { type: 'boolean', short: 'y' },
      help: { type: 'boolean', short: 'h' },
    },
  });

  const templates = loadTemplates();

  if (values.help) {
    console.log(HELP + templates.map((t) => `  ${t.id.padEnd(12)} ${t.description}`).join('\n'));
    return;
  }

  const interactive = process.stdin.isTTY && !values.yes;
  const rl = interactive ? readline.createInterface({ input: process.stdin, output: process.stdout }) : null;
  const ask = async (question, fallback) => {
    if (!rl) return fallback;
    const answer = (await rl.question(`${question} (${fallback}) `)).trim();
    return answer || fallback;
  };

  try {
    const directory = positionals[0] ?? (await ask('Project directory?', 'my-app'));

    let templateId = values.template;
    if (!templateId) {
      if (rl) {
        console.log('Templates:');
        templates.forEach((t, i) => console.log(`  ${i + 1}. ${t.id.padEnd(12)} ${t.description}`));
      }
      const answer = await ask('Template?', templates[0].id);
      templateId = templates[Number(answer) - 1]?.id ?? answer;
    }

    const template = templates.find((t) => t.id === templateId);
    if (!template) throw new Error(`unknown template "${templateId}", run with --help to list them`);

    const destDir = path.resolve(directory);
    if (!isEmptyDir(destDir) && !values.force) {
      throw new Error(`${directory} is not empty, use --force to write into it anyway`);
    }

    const name = toProjectName(directory);
    const replacements = Object.entries(template.replace ?? {}).map(([from, to]) => [from, to.replaceAll('{{name}}', name)]);
    copyTemplate(path.join(TEMPLATES_DIR, template.id), destDir, replacements);

    const relative = path.relative(process.cwd(), destDir) || '.';
    console.log(`\nCreated ${name} from the ${template.id} template in ${relative}\n`);
    console.log('Next steps:');
    if (relative !== '.') console.log(`  cd ${relative}`);
    console.log('  cmake --preset default');
    console.log('  cmake --build --preset default');
    console.log('  ctest --preset default');
  } finally {
    rl?.close();
  }
}

main().catch((error) => {
  console.error(`cpp-init: ${error.message}`);
  process.exit(1);
});
