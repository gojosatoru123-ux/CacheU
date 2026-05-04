import { useParams } from 'wouter';
import { useEffect } from 'react';
import { getArticle, MANIFEST } from '../lib/content';
import { markArticleRead } from '../lib/progress';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { TableOfContents } from '../components/TableOfContents';
import { Link } from 'wouter';
import { ArrowLeft, ArrowRight, Tag, Target, Sparkles, Network } from 'lucide-react';
import { cn } from '@/lib/utils';

const CATEGORY_BADGE: Record<string, string> = {
  'Low Level Design': 'bg-violet-100 text-violet-700',
  'High Level Design': 'bg-teal-100 text-teal-700',
  Networking: 'bg-sky-100 text-sky-700',
  Introduction: 'bg-violet-100 text-violet-700',
  Guides: 'bg-amber-100 text-amber-700',
  Reference: 'bg-teal-100 text-teal-700',
  Community: 'bg-rose-100 text-rose-700',
  General: 'bg-slate-100 text-slate-700',
};

export default function DocsPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const article = getArticle(slug);

  const idx = MANIFEST.findIndex((a) => a.slug === slug);
  const prev = idx > 0 ? MANIFEST[idx - 1] : null;
  const next = idx < MANIFEST.length - 1 ? MANIFEST[idx + 1] : null;

  // Mark article as read in progress store
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (slug) markArticleRead(slug);
  }, [slug]);

  useEffect(() => {
    const headings = document.querySelectorAll('.prose h2, .prose h3');
    headings.forEach((el) => {
      if (!el.id) {
        el.id = el.textContent!.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
      }
    });
  }, [slug]);

  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
          <span className="text-2xl">📄</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 mb-2">Page not found</h1>
        <p className="text-slate-500 mb-6">
          The documentation page <code className="bg-slate-100 px-1.5 py-0.5 rounded text-sm">{slug}</code> doesn't exist.
        </p>
        <Link href="/docs/lld-design-patterns" className="inline-flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-700">
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
        {/* Header */}
        <div className="mb-8 pb-8 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <span className={cn('inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full', badgeClass)}>
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

          {hasExtras && (
            <div className="mt-5 flex flex-wrap gap-3">
              {article.hasMindmap && (
                <Link
                  href={`/mindmap/${article.slug}`}
                  className="inline-flex items-center gap-3 bg-linear-to-r from-sky-50 to-indigo-50 border border-sky-200 hover:border-sky-300 hover:shadow-md hover:shadow-sky-100 text-sky-800 px-5 py-3 rounded-2xl transition-all duration-200 group"
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
                  className="inline-flex items-center gap-3 bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 hover:border-amber-300 hover:shadow-md hover:shadow-amber-100 text-amber-800 px-5 py-3 rounded-2xl transition-all duration-200 group"
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
            </div>
          )}
        </div>

        <MarkdownRenderer content={article.content} />

        {hasExtras && (
          <div className="mt-10 flex flex-col sm:flex-row gap-4">
            {article.hasMindmap && (
              <Link
                href={`/mindmap/${article.slug}`}
                className="flex-1 rounded-2xl bg-linear-to-br from-sky-600 to-indigo-700 p-5 text-white flex items-center justify-between gap-4 hover:shadow-lg transition-shadow"
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
                className="flex-1 rounded-2xl bg-linear-to-br from-violet-600 to-indigo-700 p-5 text-white flex items-center justify-between gap-4 hover:shadow-lg transition-shadow"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Target className="w-4 h-4 text-violet-200" />
                    <span className="text-sm font-bold">Ready to practice?</span>
                  </div>
                  <p className="text-violet-200 text-xs">Reinforce what you've learned with practice questions.</p>
                </div>
                <ArrowRight className="w-5 h-5 text-violet-300 shrink-0" />
              </Link>
            )}
          </div>
        )}

        {/* Prev/Next navigation */}
        <div className="mt-10 pt-8 border-t border-slate-100 grid grid-cols-2 gap-4">
          {prev ? (
            <Link href={`/docs/${prev.slug}`} className="group flex flex-col gap-1 p-4 rounded-xl border border-slate-200 hover:border-violet-200 hover:bg-violet-50 transition-all">
              <div className="flex items-center gap-1.5 text-xs text-slate-400 group-hover:text-violet-500 font-medium">
                <ArrowLeft className="w-3.5 h-3.5" /> Previous
              </div>
              <div className="text-sm font-semibold text-slate-900 group-hover:text-violet-700 truncate">{prev.title}</div>
            </Link>
          ) : <div />}
          {next ? (
            <Link href={`/docs/${next.slug}`} className="group flex flex-col gap-1 p-4 rounded-xl border border-slate-200 hover:border-violet-200 hover:bg-violet-50 transition-all text-right ml-auto w-full">
              <div className="flex items-center justify-end gap-1.5 text-xs text-slate-400 group-hover:text-violet-500 font-medium">
                Next <ArrowRight className="w-3.5 h-3.5" />
              </div>
              <div className="text-sm font-semibold text-slate-900 group-hover:text-violet-700 truncate">{next.title}</div>
            </Link>
          ) : <div />}
        </div>
      </article>

      <aside className="hidden xl:block w-52 shrink-0">
        <TableOfContents content={article.content} />
      </aside>
    </div>
  );
}
