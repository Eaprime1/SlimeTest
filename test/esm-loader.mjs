import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

export async function load(url, context, defaultLoad) {
  if (!url.startsWith('file://') || !url.endsWith('.js')) {
    return defaultLoad(url, context, defaultLoad);
  }
  const source = await readFile(fileURLToPath(url), 'utf8');
  return {
    format: 'module',
    source,
    shortCircuit: true
  };
}
