import { useParams } from 'wouter';
import { useEffect, useState } from 'react';
import { getArticleAsync, MANIFEST, Article } from '../lib/content';
import { markArticleRead } from '../lib/progress';
import { useDocSEO } from '../lib/seo';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { TableOfContents } from '../components/TableOfContents';
import { Link } from 'wouter';
import { ArrowLeft, ArrowRight, Tag, Target, Sparkles, Network, ClipboardCopy, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Category badge colours ───────────────────────────────────────────────────
const CATEGORY_BADGE: Record<string, string> = {
  'Low Level Design': 'bg-violet-100 text-violet-700',
  'High Level Design': 'bg-teal-100 text-teal-700',
  'Backend Design': 'bg-sky-100 text-sky-700',
  'SEO': 'bg-violet-100 text-violet-700',
  'Web Security': 'bg-amber-100 text-amber-700',
  General: 'bg-slate-100 text-slate-700',
};

// ─── Interview prompt builder ─────────────────────────────────────────────────
function buildInterviewPrompt(title: string, category: string, description: string): string {
  return `You are a senior software engineering interviewer at a top-tier tech company (think Google, Meta, Amazon, or a high-growth startup). Your job is to generate a comprehensive, high-quality set of technical interview questions on the topic: "${title}" (subject area: ${category}).

Context about this topic:
${description ? `"${description}"` : `This is a core ${category} topic that appears frequently in senior engineering interviews.`}

Your task:
Generate 15 interview questions that span the full difficulty spectrum and question types listed below. For EACH question, provide:
1. The question itself (clearly worded, precise, and unambiguous)
2. Difficulty tag: [Easy] / [Medium] / [Hard] / [System Design] / [Behavioral+Technical]
3. What the interviewer is actually testing (the hidden intent — e.g. "tests whether the candidate understands the tradeoff between X and Y, not just the definition")
4. Key points a strong answer must cover (bullet list of 4–7 essential concepts, edge cases, or decisions)
5. A follow-up question to push deeper (one level harder, or pivoting to a real-world constraint)
6. A common mistake or misconception candidates make on this question

Question type distribution to follow:
- 3 × Conceptual depth questions — not "what is X" but "explain WHY X works this way", "what problem does X solve that alternatives don't", "how does X behave under Y condition"
- 3 × Design/tradeoff questions — "design a system that uses X", "when would you choose X over Y and why", "what are the failure modes of X"
- 3 × Implementation & code questions — "walk me through implementing X", "what is the time/space complexity and can you optimise", "debug this broken implementation of X" (provide a short buggy snippet)
- 2 × Scenario-based questions — real production situations: "your service is experiencing Z, how does X help or hurt you", "your team is debating approach A vs B for this use case — what do you recommend"
- 2 × Edge case & deep-dive questions — boundary conditions, failure scenarios, scale constraints, concurrency issues, security implications
- 2 × Senior/staff level questions — architecture decisions, organisational tradeoffs, mentoring a junior who misunderstands X, reviewing a PR with a subtle X-related bug

Constraints and quality rules:
- NEVER ask "What is X?" or "Define X" or "List the types of X" — surface-level recall is forbidden
- Every question must require the candidate to reason, not just remember
- Questions should feel like they came from a real 60-minute interview loop, not a quiz sheet
- Include at least one question that involves a deliberate misconception or trap that smart candidates often fall into
- At least two questions should involve writing or reasoning about actual code or pseudocode
- Questions should build on each other thematically where natural, as if this were a real interview progression

Format your output clearly with each question numbered and all six fields labelled. After all 15 questions, add a final section: "Interview Strategy Notes" — 3–5 sentences on what a truly exceptional candidate does differently on this topic that separates them from a merely competent one.`;
}

// ─── Copy prompt button ───────────────────────────────────────────────────────
function CopyPromptButton({
  title,
  category,
  description,
}: {
  title: string;
  category: string;
  description: string;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const prompt = buildInterviewPrompt(title, category, description);
    try {
      await navigator.clipboard.writeText(prompt);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = prompt;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-3 px-5 py-3 rounded-2xl border transition-all duration-200 group',
        copied
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
          : 'bg-gradient-to-r from-slate-50 to-slate-100 border-slate-200 hover:border-violet-300 hover:shadow-md hover:shadow-violet-50 text-slate-700 hover:text-violet-800'
      )}
    >
      <div
        className={cn(
          'w-8 h-8 rounded-xl flex items-center justify-center transition-colors shrink-0',
          copied ? 'bg-emerald-100' : 'bg-slate-200 group-hover:bg-violet-100'
        )}
      >
        {copied ? (
          <Check className="w-4 h-4 text-emerald-600" />
        ) : (
          <ClipboardCopy className="w-4 h-4 text-slate-500 group-hover:text-violet-600" />
        )}
      </div>
      <div className="text-left">
        <div className="text-sm font-bold leading-tight">
          {copied ? 'Prompt copied!' : 'Copy Interview Prompt'}
        </div>
        <div
          className={cn(
            'text-xs mt-0.5',
            copied ? 'text-emerald-600' : 'text-slate-400 group-hover:text-violet-500'
          )}
        >
          {copied
            ? 'Paste into ChatGPT, Claude, or Gemini'
            : 'Generate 15 deep interview questions with AI'}
        </div>
      </div>
    </button>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function DocsPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [article, setArticle] = useState<Article | null | undefined>(undefined);

  useEffect(() => {
    setArticle(undefined); // reset to loading state on slug change
    if (!slug) { setArticle(null); return; }
    getArticleAsync(slug).then(setArticle);
  }, [slug]);

  useDocSEO(article ?? null);

  const idx = MANIFEST.findIndex((a) => a.slug === slug);
  const prev = idx > 0 ? MANIFEST[idx - 1] : null;
  const next = idx < MANIFEST.length - 1 ? MANIFEST[idx + 1] : null;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (slug && article) markArticleRead(slug);
  }, [slug, article]);

  useEffect(() => {
    if (!article) return;
    const headings = document.querySelectorAll('.prose h2, .prose h3');
    headings.forEach((el) => {
      if (!el.id) {
        el.id = el.textContent!
          .toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
      }
    });
  }, [article]);

  // Loading state
  if (article === undefined) {
    return (
      <div className="flex gap-8 xl:gap-12 animate-pulse">
        <div className="flex-1 min-w-0 space-y-4">
          <div className="h-4 bg-slate-100 rounded w-24" />
          <div className="h-9 bg-slate-100 rounded w-3/4" />
          <div className="h-4 bg-slate-100 rounded w-1/2" />
          <div className="flex gap-3 mt-2">
            <div className="h-14 bg-slate-100 rounded-2xl w-44" />
            <div className="h-14 bg-slate-100 rounded-2xl w-44" />
          </div>
          <div className="mt-8 space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-3 bg-slate-100 rounded" style={{ width: `${90 - i * 4}%` }} />
            ))}
          </div>
        </div>
        <div className="hidden xl:block w-52 shrink-0 space-y-2 pt-1">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-3 bg-slate-100 rounded" style={{ width: `${65 - i * 7}%` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <span className="text-2xl">📄</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Page not found</h1>
        <p className="text-slate-500 mb-6">
          The documentation page{' '}
          <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">{slug}</code> doesn't exist.
        </p>
        <Link
          href="/docs/lld-design-patterns"
          className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Getting Started
        </Link>
      </div>
    );
  }

  const badgeClass = CATEGORY_BADGE[article.category] || CATEGORY_BADGE.General;
  const hasExtras = article.hasPractice || article.hasMindmap;

  return (
    <div className="flex gap-8 xl:gap-12">
      <article className="flex-1 min-w-0">

        {/* ── Header ── */}
        <div className="mb-8 pb-8 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <span
              className={cn(
                'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full',
                badgeClass
              )}
            >
              <Tag className="w-3 h-3" />
              {article.category}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3 leading-tight">
            {article.title}
          </h1>

          {article.description && (
            <p className="text-lg text-slate-500 leading-relaxed">{article.description}</p>
          )}

          {/* Action buttons row */}
          <div className="mt-5 flex flex-wrap gap-3">
            {article.hasMindmap && (
              <Link
                href={`/mindmap/${article.slug}`}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-sky-50 to-indigo-50 border border-sky-200 hover:border-sky-300 hover:shadow-md hover:shadow-sky-100 text-sky-800 px-5 py-3 rounded-2xl transition-all duration-200 group"
              >
                <div className="w-8 h-8 bg-sky-100 group-hover:bg-sky-200 rounded-xl flex items-center justify-center transition-colors shrink-0">
                  <Network className="w-4 h-4 text-sky-600" />
                </div>
                <div>
                  <div className="text-sm font-bold">Mind Map</div>
                  <div className="text-xs text-sky-600">Visualize the concept structure</div>
                </div>
              </Link>
            )}

            {article.hasPractice && (
              <Link
                href={`/practice/${article.slug}`}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 hover:border-amber-300 hover:shadow-md hover:shadow-amber-100 text-amber-800 px-5 py-3 rounded-2xl transition-all duration-200 group"
              >
                <div className="w-8 h-8 bg-amber-100 group-hover:bg-amber-200 rounded-xl flex items-center justify-center transition-colors shrink-0">
                  <Target className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                  <div className="text-sm font-bold">Practice Quiz</div>
                  <div className="text-xs text-amber-600">Test your understanding</div>
                </div>
                <Sparkles className="w-4 h-4 text-amber-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            )}

            <CopyPromptButton
              title={article.title}
              category={article.category}
              description={article.description}
            />
          </div>
        </div>

        {/* ── Content ── */}
        <MarkdownRenderer content={article.content} />

        {/* ── Bottom CTA cards ── */}
        {hasExtras && (
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            {article.hasMindmap && (
              <Link
                href={`/mindmap/${article.slug}`}
                className="flex-1 rounded-2xl bg-gradient-to-br from-sky-600 to-indigo-700 p-5 text-white flex items-center justify-between gap-4 hover:shadow-lg transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Network className="w-4 h-4 text-sky-200" />
                    <span className="text-sm font-bold">Explore the mind map</span>
                  </div>
                  <p className="text-sky-200 text-xs">Visual overview of all concepts in this topic.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-sky-300 shrink-0" />
              </Link>
            )}
            {article.hasPractice && (
              <Link
                href={`/practice/${article.slug}`}
                className="flex-1 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-5 text-white flex items-center justify-between gap-4 hover:shadow-lg transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-violet-200" />
                    <span className="text-sm font-bold">Ready to practice?</span>
                  </div>
                  <p className="text-violet-200 text-xs">
                    Reinforce what you've learned with practice questions.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-violet-300 shrink-0" />
              </Link>
            )}
          </div>
        )}

        {/* ── Prev / Next navigation ── */}
        <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
          {prev ? (
            <Link
              href={`/docs/${prev.slug}`}
              className="group flex flex-col gap-1 p-4 rounded-xl border border-slate-200 hover:border-violet-200 hover:bg-violet-50 transition-all"
            >
              <div className="flex items-center gap-1.5 text-xs text-slate-400 group-hover:text-violet-500 font-medium">
                <ArrowLeft className="w-3.5 h-3.5" /> Previous
              </div>
              <div className="text-sm font-semibold text-slate-900 group-hover:text-violet-700 truncate">
                {prev.title}
              </div>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/docs/${next.slug}`}
              className="group flex flex-col gap-1 p-4 rounded-xl border border-slate-200 hover:border-violet-200 hover:bg-violet-50 transition-all text-right ml-auto w-full"
            >
              <div className="flex items-center justify-end gap-1.5 text-xs text-slate-400 group-hover:text-violet-500 font-medium">
                Next <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <div className="text-sm font-semibold text-slate-900 group-hover:text-violet-700 truncate">
                {next.title}
              </div>
            </Link>
          ) : (
            <div />
          )}
        </div>
      </article>

      {/* ── Table of contents ── */}
      <aside className="hidden xl:block w-52 shrink-0">
        <TableOfContents content={article.content} />
      </aside>
    </div>
  );
}