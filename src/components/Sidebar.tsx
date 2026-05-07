import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { ArticleMeta, CATEGORIES, CATEGORY_ORDER } from '../lib/content';
import { ChevronDown, ChevronRight, BookOpen, X, Menu, Zap, Code, LayoutGrid, Target, Network } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  manifest: ArticleMeta[];
  className?: string;
}

const CATEGORY_COLORS: Record<string, { icon: string }> = {
  'Low Level Design': { icon: 'bg-violet-100 text-violet-600' },
  'High Level Design': { icon: 'bg-teal-100 text-teal-600' },
  'Backend Design': { icon: 'bg-amber-100 text-amber-600' },
  'Web Security': { icon: 'bg-rose-100 text-rose-600' },
  'SEO': { icon: 'bg-green-100 text-green-600' },
  General: { icon: 'bg-slate-100 text-slate-500' },
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'Low Level Design': <Code className="w-3.5 h-3.5" />,
  'High Level Design': <LayoutGrid className="w-3.5 h-3.5" />,
  'Backend Design': <Zap className="w-3.5 h-3.5" />,
  'Web Security': <Code className="w-3.5 h-3.5" />,
  'SEO': <Network className="w-3.5 h-3.5" />,
};

export function Sidebar({ className }: SidebarProps) {
  const [location] = useLocation();
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const activeSorted = [
    ...CATEGORY_ORDER,
    ...Object.keys(CATEGORIES).filter((c) => !CATEGORY_ORDER.includes(c)),
  ];

  function toggleCategory(cat: string) {
    setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }));
  }

  return (
    <aside className={cn('flex flex-col h-full', className)}>
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
        <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
          <BookOpen className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-slate-900 text-base tracking-tight">Docs</span>
        <span className="ml-auto text-xs text-slate-400 font-mono bg-slate-100 px-2 py-0.5 rounded-full">
          v2.4
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {activeSorted.map((category) => {
          const items = CATEGORIES[category];
          if (!items || items.length === 0) return null;
          const isOpen = !collapsed[category];
          const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.General;

          return (
            <div key={category} className="mb-1">
              <button
                onClick={() => toggleCategory(category)}
                className="w-full flex items-center gap-2 px-2 py-2 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-50 transition-colors group uppercase tracking-wider"
              >
                <span className={cn('w-5 h-5 rounded-md flex items-center justify-center shrink-0', colors.icon)}>
                  {CATEGORY_ICONS[category] || <BookOpen className="w-3.5 h-3.5" />}
                </span>
                <span className="flex-1 text-left">{category}</span>
                <span className="text-slate-300 text-xs font-normal normal-case tracking-normal mr-1">
                  {items.length}
                </span>
                {isOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500 transition-colors" />
                )}
              </button>

              {isOpen && (
                <div className="ml-2 mt-0.5 mb-2 space-y-0.5 border-l border-slate-100 pl-3">
                  {items.map((item) => {
                    const isDocActive = location === `/docs/${item.slug}`;
                    const isPractice = location === `/practice/${item.slug}`;
                    const isMindmap = location === `/mindmap/${item.slug}`;

                    return (
                      <div key={item.slug}>
                        {/* Article link */}
                        <Link
                          href={`/docs/${item.slug}`}
                          className={cn(
                            'flex items-center justify-between px-2 py-1.5 rounded-md text-sm transition-all',
                            isDocActive
                              ? 'bg-violet-50 text-violet-700 font-semibold'
                              : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50 font-medium'
                          )}
                        >
                          <span className="truncate">{item.title}</span>
                        </Link>

                        {/* Sub-links row */}
                        {(item.hasPractice || item.hasMindmap) && (
                          <div className="flex items-center gap-1 ml-2 mb-1 mt-0.5">
                            {item.hasMindmap && (
                              <Link
                                href={`/mindmap/${item.slug}`}
                                className={cn(
                                  'flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full transition-all',
                                  isMindmap
                                    ? 'bg-sky-100 text-sky-700'
                                    : 'text-slate-400 hover:text-sky-600 hover:bg-sky-50'
                                )}
                              >
                                <Network className="w-2.5 h-2.5 shrink-0" />
                                Map
                              </Link>
                            )}
                            {item.hasPractice && (
                              <Link
                                href={`/practice/${item.slug}`}
                                className={cn(
                                  'flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full transition-all',
                                  isPractice
                                    ? 'bg-amber-100 text-amber-700'
                                    : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                                )}
                              >
                                <Target className="w-2.5 h-2.5 shrink-0" />
                                Quiz
                              </Link>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-slate-100">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-xs text-slate-400 hover:text-slate-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
          </svg>
          View on GitHub
        </a>
      </div>
    </aside>
  );
}

// Mobile sidebar wrapper
export function MobileSidebar({ manifest }: SidebarProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-12 h-12 bg-violet-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-violet-700 transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-72 bg-white h-full shadow-2xl flex flex-col">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>
            <Sidebar manifest={manifest} />
          </div>
        </div>
      )}
    </>
  );
}
