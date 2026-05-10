export interface MindNode {
  id: string;
  text: string;
  depth: number; // 0=root, 1=branch, 2=subbranch, 3+=detail
  children: MindNode[];
  parentId: string | null;
}

export interface MindmapData {
  title: string;
  articleSlug: string;
  root: MindNode;
}

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  match[1].split('\n').forEach((line) => {
    const i = line.indexOf(':');
    if (i === -1) return;
    meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  });
  return { meta, body: match[2] };
}

let _idCounter = 0;
function uid(prefix: string) {
  return `${prefix}-${++_idCounter}`;
}

export function parseMindmap(raw: string): MindmapData | null {
  _idCounter = 0;
  const { meta, body } = parseFrontmatter(raw);
  if (!meta.title) return null;

  const lines = body.split('\n').filter((l) => l.trim());

  // Stack: [{ node, depth }]
  const stack: Array<{ node: MindNode; headingDepth: number }> = [];
  let root: MindNode | null = null;

  for (const line of lines) {
    // Match heading: # ## ### etc
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const hDepth = headingMatch[1].length - 1; // # → 0, ## → 1, etc.
      const text = headingMatch[2].trim();
      const node: MindNode = {
        id: uid(text.toLowerCase().replace(/\W+/g, '-').slice(0, 20)),
        text,
        depth: hDepth,
        children: [],
        parentId: null,
      };

      if (hDepth === 0) {
        root = node;
        stack.length = 0;
        stack.push({ node, headingDepth: 0 });
      } else {
        // Pop stack until we find a parent with lower depth
        while (stack.length > 1 && stack[stack.length - 1].headingDepth >= hDepth) {
          stack.pop();
        }
        const parent = stack[stack.length - 1].node;
        node.parentId = parent.id;
        node.depth = hDepth;
        parent.children.push(node);
        stack.push({ node, headingDepth: hDepth });
      }
      continue;
    }

    // Match list item: - text or * text
    const listMatch = line.match(/^\s*[-*]\s+(.+)$/);
    if (listMatch && stack.length > 0) {
      const text = listMatch[1].trim();
      const parentNode = stack[stack.length - 1].node;
      const node: MindNode = {
        id: uid(text.toLowerCase().replace(/\W+/g, '-').slice(0, 20)),
        text,
        depth: parentNode.depth + 1,
        children: [],
        parentId: parentNode.id,
      };
      parentNode.children.push(node);
    }
  }

  if (!root) return null;

  return {
    title: meta.title,
    articleSlug: meta.articleSlug || '',
    root,
  };
}

// ─── Lazy loaders — each mindmap .md is its own chunk, fetched on demand ──────
// eager: false means NO mindmap file is included in the main bundle.
const mindmapLoaders = import.meta.glob('../content/mindmap/*.md', {
  query: '?raw',
  import: 'default',
  eager: false,
}) as Record<string, () => Promise<string>>;

// mindmapSlugSet is derived from loader keys (just the paths, no file content loaded).
// This is used by content.ts to mark hasMindmap on ArticleMeta at build time.
export const mindmapSlugSet = new Set(
  Object.keys(mindmapLoaders).map((p) =>
    p.replace('../content/mindmap/', '').replace('.md', '')
  )
);

// Per-session cache — each file fetched at most once
const cache: Record<string, string> = {};

async function loadRaw(slug: string): Promise<string | null> {
  const path = `../content/mindmap/${slug}.md`;
  if (cache[path] !== undefined) return cache[path];
  const loader = mindmapLoaders[path];
  if (!loader) return null;
  const raw = await loader();
  cache[path] = raw;
  return raw;
}

// Async — fetches only the requested mindmap file
export async function getMindmapData(slug: string): Promise<MindmapData | null> {
  const raw = await loadRaw(slug);
  if (!raw) return null;
  return parseMindmap(raw);
}