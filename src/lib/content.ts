import { mindmapSlugSet } from './mindmap';

export interface ArticleMeta {
  title: string;
  slug: string;
  description: string;
  category: string;
  order: number;
  hasPractice: boolean;
  hasMindmap: boolean;
}

export interface Article extends ArticleMeta {
  content: string;
}

export interface PracticeQuestion {
  id: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  question: string;
  answer: string;
}

export interface PracticeMeta {
  title: string;
  articleSlug: string;
  difficulty: string;
  estimatedTime: string;
  totalQuestions: number;
}

export interface PracticeArticle extends PracticeMeta {
  questions: PracticeQuestion[];
}

// Import all markdown files as raw strings using Vite's glob import
const rawFiles = import.meta.glob('../content/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const rawPracticeFiles = import.meta.glob('../content/practice/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

// Set of slugs that have practice files
const practiceSlugSet = new Set(
  Object.keys(rawPracticeFiles).map((path) =>
    path.replace('../content/practice/', '').replace('.md', '')
  )
);

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return { meta: {}, body: raw };

  const metaStr = match[1];
  const body = match[2];
  const meta: Record<string, string> = {};

  metaStr.split('\n').forEach((line) => {
    const colonIdx = line.indexOf(':');
    if (colonIdx === -1) return;
    const key = line.slice(0, colonIdx).trim();
    const value = line.slice(colonIdx + 1).trim();
    meta[key] = value;
  });

  return { meta, body };
}

function slugFromPath(path: string): string {
  return path.replace('../content/', '').replace('.md', '');
}

export function getManifest(): ArticleMeta[] {
  return Object.entries(rawFiles)
    .map(([path, raw]) => {
      const slug = slugFromPath(path);
      const { meta } = parseFrontmatter(raw as string);
      return {
        slug,
        title: meta.title || slug,
        description: meta.description || '',
        category: meta.category || 'General',
        order: parseInt(meta.order || '99', 10),
        hasPractice: practiceSlugSet.has(slug),
        hasMindmap: mindmapSlugSet.has(slug),
      };
    })
    .sort((a, b) => {
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      return a.order - b.order;
    });
}

export function getArticle(slug: string): Article | null {
  const path = `../content/${slug}.md`;
  const raw = rawFiles[path];
  if (!raw) return null;

  const { meta, body } = parseFrontmatter(raw as string);
  return {
    slug,
    title: meta.title || slug,
    description: meta.description || '',
    category: meta.category || 'General',
    order: parseInt(meta.order || '99', 10),
    hasPractice: practiceSlugSet.has(slug),
    hasMindmap: mindmapSlugSet.has(slug),
    content: body.trim(),
  };
}

// Parse practice questions from structured markdown
function parsePracticeQuestions(body: string): PracticeQuestion[] {
  const questions: PracticeQuestion[] = [];
  const blocks = body.split('<!-- QUESTION -->').slice(1);

  blocks.forEach((block, idx) => {
    const [questionPart, rest] = block.split('<!-- ANSWER -->');
    if (!questionPart || !rest) return;

    const [answerPart] = rest.split('<!-- END -->');
    if (!answerPart) return;

    const lines = questionPart.trim().split('\n');
    let difficulty: PracticeQuestion['difficulty'] = 'Medium';
    const tags: string[] = [];
    let questionStart = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.startsWith('difficulty:')) {
        const d = line.replace('difficulty:', '').trim();
        if (d === 'Easy' || d === 'Medium' || d === 'Hard') difficulty = d;
        questionStart = i + 1;
      } else if (line.startsWith('tags:')) {
        const tagStr = line.replace('tags:', '').trim();
        tags.push(...tagStr.split(',').map((t) => t.trim()));
        questionStart = i + 1;
      } else if (line !== '') {
        break;
      }
    }

    const questionText = lines.slice(questionStart).join('\n').trim();
    const answerText = answerPart.trim();

    if (questionText) {
      questions.push({
        id: idx + 1,
        difficulty,
        tags,
        question: questionText,
        answer: answerText,
      });
    }
  });

  return questions;
}

export function getPracticeArticle(slug: string): PracticeArticle | null {
  const path = `../content/practice/${slug}.md`;
  const raw = rawPracticeFiles[path];
  if (!raw) return null;

  const { meta, body } = parseFrontmatter(raw as string);
  const questions = parsePracticeQuestions(body);

  return {
    title: meta.title || `${slug} — Practice`,
    articleSlug: meta.articleSlug || slug,
    difficulty: meta.difficulty || 'Intermediate',
    estimatedTime: meta.estimatedTime || '20 mins',
    totalQuestions: questions.length,
    questions,
  };
}

export function getCategories(manifest: ArticleMeta[]): Record<string, ArticleMeta[]> {
  return manifest.reduce<Record<string, ArticleMeta[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});
}

export const MANIFEST = getManifest();
export const CATEGORIES = getCategories(MANIFEST);
export const CATEGORY_ORDER = [
  'Low Level Design',
  'High Level Design',
  'Networking',
  'Introduction',
  'Guides',
  'Reference',
  'Community',
];
