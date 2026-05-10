/**
 * vite-plugin-content-manifest.ts
 *
 * Runs at build time AND dev server start.
 * Reads every src/content/*.md file, extracts only the frontmatter,
 * and writes src/content/_manifest.json.
 *
 * This means:
 *   - The sidebar/search loads a single tiny JSON (a few KB)
 *   - The full markdown bodies are NEVER in the main bundle
 *   - Each article body is fetched lazily on first visit only
 *
 * Add to vite.config.ts:
 *   import { contentManifestPlugin } from './vite-plugin-content-manifest';
 *   plugins: [react(), contentManifestPlugin()]
 */

import type { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  category: string;
  order: number;
  hasPractice: boolean;
  hasMindmap: boolean;
}

function parseFrontmatter(raw: string): Record<string, string> {
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const meta: Record<string, string> = {};
  match[1].split('\n').forEach((line) => {
    const i = line.indexOf(':');
    if (i === -1) return;
    meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  });
  return meta;
}

function buildManifest(contentDir: string): ArticleMeta[] {
  const practiceDir = path.join(contentDir, 'practice');
  const mindmapDir  = path.join(contentDir, 'mindmap');

  const practiceSet = new Set(
    fs.existsSync(practiceDir)
      ? fs.readdirSync(practiceDir).filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''))
      : []
  );
  const mindmapSet = new Set(
    fs.existsSync(mindmapDir)
      ? fs.readdirSync(mindmapDir).filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''))
      : []
  );

  const files = fs.existsSync(contentDir)
    ? fs.readdirSync(contentDir).filter(f => f.endsWith('.md'))
    : [];

  return files
    .map((file): ArticleMeta => {
      const slug = file.replace('.md', '');
      const raw  = fs.readFileSync(path.join(contentDir, file), 'utf-8');
      const meta = parseFrontmatter(raw);
      return {
        slug,
        title:       meta.title       || slug,
        description: meta.description || '',
        category:    meta.category    || 'General',
        order:       parseInt(meta.order || '99', 10),
        hasPractice: practiceSet.has(slug),
        hasMindmap:  mindmapSet.has(slug),
      };
    })
    .sort((a, b) =>
      a.category !== b.category
        ? a.category.localeCompare(b.category)
        : a.order - b.order
    );
}

export function contentManifestPlugin(): Plugin {
  let contentDir = '';
  let outFile    = '';

  const generate = () => {
    if (!contentDir) return;
    const manifest = buildManifest(contentDir);
    fs.writeFileSync(outFile, JSON.stringify(manifest, null, 2), 'utf-8');
    console.log(`✅  manifest.json written — ${manifest.length} articles`);
  };

  return {
    name: 'vite-plugin-content-manifest',

    configResolved(config) {
      contentDir = path.join(config.root, 'src', 'content');
      outFile    = path.join(contentDir, '_manifest.json');
    },

    // Generate on dev server start
    buildStart() {
      generate();
    },

    // Re-generate when any .md file changes in dev
    handleHotUpdate({ file }) {
      if (file.endsWith('.md') && file.includes('/content/')) {
        generate();
      }
    },
  };
}