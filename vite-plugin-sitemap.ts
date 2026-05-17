/**
 * vite-plugin-sitemap.ts
 *
 * Writes sitemap.xml and robots.txt to TWO places:
 *   1. public/sitemap.xml  — served during `vite dev`, and also copied to dist/ by Vite automatically
 *   2. dist/sitemap.xml    — written explicitly after `vite build` as a safety net
 *
 * This means you ALWAYS get a sitemap regardless of whether you're in dev or prod.
 */

import type { Plugin } from 'vite';
import fs from 'node:fs';
import path from 'node:path';

const SITE_URL = 'https://cacheu.dev'; // ← keep in sync with seo.ts

interface SitemapEntry {
  loc: string;
  priority: string;
  changefreq: string;
}

function collectUrls(contentDir: string): SitemapEntry[] {
  const urls: SitemapEntry[] = [
    { loc: SITE_URL,          priority: '1.0', changefreq: 'weekly' },
    { loc: `${SITE_URL}/home`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${SITE_URL}/terms`, priority: '0.9', changefreq: 'weekly' },
    { loc: `${SITE_URL}/privacy-policy`, priority: '0.8', changefreq: 'weekly' },
  ];

  const practiceDir = path.join(contentDir, 'practice');
  const mindmapDir  = path.join(contentDir, 'mindmap');

  const practiceSet = new Set<string>(
    fs.existsSync(practiceDir)
      ? fs.readdirSync(practiceDir).filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''))
      : []
  );
  const mindmapSet = new Set<string>(
    fs.existsSync(mindmapDir)
      ? fs.readdirSync(mindmapDir).filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''))
      : []
  );

  if (fs.existsSync(contentDir)) {
    fs.readdirSync(contentDir)
      .filter(f => f.endsWith('.md'))
      .forEach(f => {
        const slug = f.replace('.md', '');
        urls.push({ loc: `${SITE_URL}/docs/${slug}`,     priority: '0.8', changefreq: 'monthly' });
        if (practiceSet.has(slug))
          urls.push({ loc: `${SITE_URL}/practice/${slug}`, priority: '0.7', changefreq: 'monthly' });
        if (mindmapSet.has(slug))
          urls.push({ loc: `${SITE_URL}/mindmap/${slug}`,  priority: '0.7', changefreq: 'monthly' });
      });
  }

  return urls;
}

function buildSitemapXml(entries: SitemapEntry[]): string {
  const now     = new Date().toISOString().slice(0, 10);
  const urlTags = entries.map(({ loc, priority, changefreq }) =>
    `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${now}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlTags}\n</urlset>`;
}

function buildRobotsTxt(): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;
}

function writeFiles(targetDir: string, contentDir: string, label: string) {
  const entries = collectUrls(contentDir);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'sitemap.xml'), buildSitemapXml(entries), 'utf-8');
  fs.writeFileSync(path.join(targetDir, 'robots.txt'),  buildRobotsTxt(),          'utf-8');
  console.log(`✅  Sitemap: sitemap.xml (${entries.length} URLs) + robots.txt → ${label}/`);
}

export function sitemapPlugin(): Plugin {
  let root       = process.cwd();
  let outDir     = 'dist';
  let contentDir = '';
  let publicDir  = '';

  return {
    name: 'vite-plugin-sitemap',

    configResolved(config) {
      root       = config.root;
      outDir     = path.resolve(root, config.build.outDir ?? 'dist');
      contentDir = path.join(root, 'src', 'content');
      // config.publicDir is already absolute
      publicDir  = typeof config.publicDir === 'string'
        ? config.publicDir
        : path.join(root, 'public');
    },

    // ── Dev server start — write to public/ so Vite serves it at /sitemap.xml ──
    buildStart() {
      writeFiles(publicDir, contentDir, 'public');
    },

    // ── Re-generate when any .md changes during dev ───────────────────────────
    handleHotUpdate({ file }) {
      if (file.endsWith('.md') && file.includes('/content/')) {
        writeFiles(publicDir, contentDir, 'public');
      }
    },

    // ── After vite build — also write to dist/ as a safety net ───────────────
    // (Vite copies public/ to dist/ automatically, but this ensures correct
    //  lastmod dates even if public/ was stale)
    closeBundle() {
      writeFiles(outDir, contentDir, 'dist');
    },
  };
}