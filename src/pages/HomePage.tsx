import { Link } from 'wouter';
import {
  ArrowRight, Code, Zap, Shield, Globe, Lock, Database,
  RefreshCw, ChevronRight, Sparkles, Hash, Target, LayoutGrid, Network,
} from 'lucide-react';
import { MANIFEST, CATEGORIES} from '../lib/content';
import { Roadmap } from '../components/Roadmap';

// ─── Styling maps ─────────────────────────────────────────────────────────────
const CATEGORY_STYLES: Record<string, { bg: string; text: string; border: string; iconBg: string; dot: string }> = {
  'Low Level Design':  { bg: 'bg-violet-50 hover:bg-violet-100',  text: 'text-violet-700',  border: 'border-violet-200',  iconBg: 'bg-violet-600', dot: 'bg-violet-500' },
  'High Level Design': { bg: 'bg-teal-50 hover:bg-teal-100',     text: 'text-teal-700',    border: 'border-teal-200',    iconBg: 'bg-teal-500',   dot: 'bg-teal-500' },
  Networking:          { bg: 'bg-sky-50 hover:bg-sky-100',        text: 'text-sky-700',     border: 'border-sky-200',     iconBg: 'bg-sky-500',    dot: 'bg-sky-500' },
  Introduction:        { bg: 'bg-violet-50 hover:bg-violet-100',  text: 'text-violet-700',  border: 'border-violet-200',  iconBg: 'bg-violet-500', dot: 'bg-violet-400' },
  Guides:              { bg: 'bg-amber-50 hover:bg-amber-100',    text: 'text-amber-700',   border: 'border-amber-200',   iconBg: 'bg-amber-500',  dot: 'bg-amber-500' },
  Reference:           { bg: 'bg-teal-50 hover:bg-teal-100',     text: 'text-teal-700',    border: 'border-teal-200',    iconBg: 'bg-teal-400',   dot: 'bg-teal-400' },
  Community:           { bg: 'bg-rose-50 hover:bg-rose-100',     text: 'text-rose-700',    border: 'border-rose-200',    iconBg: 'bg-rose-500',   dot: 'bg-rose-500' },
};
const fallbackStyle = CATEGORY_STYLES.Introduction;

const SUBJECT_HERO = [
  {
    title: 'Low Level Design', subtitle: 'LLD',
    desc: 'Design patterns, SOLID principles, concurrency, OOP concepts',
    icon: <Code className="w-6 h-6 text-white" />,
    gradient: 'from-violet-600 to-indigo-700',
    textAccent: 'text-violet-200', accent: 'bg-white/20',
    slug: 'lld-design-patterns', articles: 4, tag: 'Low Level Design',
  },
  {
    title: 'High Level Design', subtitle: 'HLD',
    desc: 'System design, scaling, caching, microservices architecture',
    icon: <LayoutGrid className="w-6 h-6 text-white" />,
    gradient: 'from-teal-600 to-emerald-700',
    textAccent: 'text-teal-200', accent: 'bg-white/20',
    slug: 'hld-system-design-basics', articles: 4, tag: 'High Level Design',
  },
  {
    title: 'Networking', subtitle: 'NET',
    desc: 'HTTP/3, TCP/IP, DNS, CDN, REST vs GraphQL vs gRPC',
    icon: <Network className="w-6 h-6 text-white" />,
    gradient: 'from-sky-600 to-cyan-700',
    textAccent: 'text-sky-200', accent: 'bg-white/20',
    slug: 'net-http-https', articles: 4, tag: 'Networking',
  },
];

const FEATURES = [
  { icon: <Zap className="w-5 h-5" />,      color: 'bg-amber-100 text-amber-600',   title: 'Lightning Fast',    desc: 'Built on Vite. Every page loads in under 100ms with zero hydration delay.' },
  { icon: <Shield className="w-5 h-5" />,   color: 'bg-violet-100 text-violet-600', title: 'Type Safe',         desc: 'First-class TypeScript support across the entire API surface.' },
  { icon: <Globe className="w-5 h-5" />,    color: 'bg-teal-100 text-teal-600',     title: 'Edge Ready',        desc: 'Deploy to Vercel, Cloudflare Workers, or any edge runtime.' },
  { icon: <Lock className="w-5 h-5" />,     color: 'bg-rose-100 text-rose-600',     title: 'Secure by Default', desc: 'Built-in CSRF protection, rate limiting, and input validation.' },
  { icon: <Database className="w-5 h-5" />, color: 'bg-sky-100 text-sky-600',       title: 'Any Database',      desc: 'PostgreSQL, MySQL, SQLite, MongoDB, and Redis via a unified query layer.' },
  { icon: <RefreshCw className="w-5 h-5" />,color: 'bg-emerald-100 text-emerald-600',title:'Real-time Ready',   desc: 'WebSocket, SSE, and optimistic UI updates as first-class primitives.' },
];

const QUICK_LINKS = [
  { label: 'Design Patterns',  slug: 'lld-design-patterns',      desc: 'GoF patterns in TypeScript' },
  { label: 'SOLID Principles', slug: 'lld-solid-principles',     desc: 'Write maintainable code' },
  { label: 'System Design',    slug: 'hld-system-design-basics', desc: 'Fundamentals & trade-offs' },
  { label: 'Load Balancing',   slug: 'hld-load-balancing',       desc: 'Algorithms & scaling' },
  { label: 'HTTP & HTTPS',     slug: 'net-http-https',           desc: 'HTTP/2, TLS, headers' },
  { label: 'TCP/IP Stack',     slug: 'net-tcp-ip',               desc: 'Network fundamentals' },
  { label: 'Caching',          slug: 'hld-caching-strategies',   desc: 'Eviction & invalidation' },
  { label: 'REST vs GraphQL',  slug: 'net-rest-graphql',         desc: 'API paradigm comparison' },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function HomePage() {

  const practiceCount = MANIFEST.filter((a) => a.hasPractice).length;

  return (
    <div className="min-h-screen">

      {/* ─── HERO BENTO ─── */}
      <section className="py-12 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {/* Main hero */}
          <div className="md:col-span-2 bg-linear-to-br from-slate-900 to-slate-800 rounded-3xl p-8 md:p-10 text-white relative overflow-hidden">
            <div className="absolute -right-12 -top-12 w-56 h-56 bg-violet-500/10 rounded-full" />
            <div className="absolute right-8 -bottom-8 w-32 h-32 bg-teal-500/10 rounded-full" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                v2.4.1 — Now Available
              </div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-none mb-4">
                Learn. Build.{' '}
                <span className="bg-linear-to-r from-violet-400 to-teal-400 bg-clip-text text-transparent">
                  Practice.
                </span>
              </h1>
              <p className="text-slate-400 text-lg leading-relaxed mb-8 max-w-md">
                Deep technical documentation for LLD, HLD, and Networking — each with interactive practice quizzes and visual mind maps.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/docs/lld-design-patterns" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
                  Start Learning <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/practice/lld-design-patterns" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
                  <Target className="w-4 h-4" /> Try Practice Quiz
                </Link>
              </div>
            </div>
          </div>

          {/* Stats column */}
          <div className="grid grid-rows-3 gap-4">
            <div className="bg-violet-600 rounded-3xl p-5 text-white flex flex-col justify-between">
              <div className="text-violet-200 text-xs font-semibold uppercase tracking-wider">Articles</div>
              <div>
                <div className="text-4xl font-black">{MANIFEST.length}</div>
                <div className="text-violet-200 text-xs mt-1">across {Object.keys(CATEGORIES).length} subjects</div>
              </div>
            </div>
            <div className="bg-amber-500 rounded-3xl p-5 text-white flex flex-col justify-between">
              <div className="text-amber-100 text-xs font-semibold uppercase tracking-wider">Practice Quizzes</div>
              <div>
                <div className="text-4xl font-black">{practiceCount}</div>
                <div className="text-amber-100 text-xs mt-1">interactive question sets</div>
              </div>
            </div>
            <div className="bg-slate-900 rounded-3xl p-5 text-white flex flex-col justify-between">
              <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Mind Maps</div>
              <div>
                <div className="text-4xl font-black">12</div>
                <div className="text-slate-400 text-xs mt-1">interactive visual maps</div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Subject hero cards ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
          {SUBJECT_HERO.map((subject) => (
            <div key={subject.title} className={`bg-linear-to-br ${subject.gradient} rounded-2xl p-6 text-white relative overflow-hidden group`}>
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/5 rounded-full" />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-11 h-11 ${subject.accent} rounded-xl flex items-center justify-center`}>
                    {subject.icon}
                  </div>
                  <span className={`text-xs font-bold ${subject.textAccent} bg-white/10 px-2.5 py-1 rounded-full`}>
                    {subject.articles} articles
                  </span>
                </div>
                <div className={`text-xs font-bold uppercase tracking-widest ${subject.textAccent} mb-1`}>{subject.subtitle}</div>
                <h3 className="text-lg font-black mb-2">{subject.title}</h3>
                <p className={`text-sm ${subject.textAccent} leading-relaxed mb-5`}>{subject.desc}</p>
                <div className="flex gap-2">
                  <Link href={`/docs/${subject.slug}`} className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors">
                    Read <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link href={`/mindmap/${subject.slug}`} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors border border-white/20">
                    <Network className="w-3.5 h-3.5" /> Map
                  </Link>
                  {CATEGORIES[subject.tag]?.some((a) => a.hasPractice) && (
                    <Link href={`/practice/${subject.slug}`} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors border border-white/20">
                      <Target className="w-3.5 h-3.5" /> Quiz
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ROADMAP ─── */}
      <div className="border-t border-slate-100 -mx-4 md:-mx-6 lg:-mx-8 px-4 md:px-6 lg:px-8 bg-slate-50/50">
        <Roadmap />
      </div>

      {/* ─── QUICK LINKS ─── */}
      <section className="py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Quick Links</h2>
          <span className="text-sm text-slate-400">Jump to any topic</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_LINKS.map(({ label, slug, desc }) => (
            <Link
              key={slug}
              href={`/docs/${slug}`}
              className="group flex flex-col gap-1 p-4 rounded-2xl border border-slate-100 bg-white hover:border-violet-200 hover:shadow-md hover:shadow-violet-50 transition-all duration-200"
            >
              <div className="flex items-center gap-2">
                <Hash className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                <span className="font-semibold text-slate-800 text-sm group-hover:text-violet-700 transition-colors truncate">{label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 ml-auto group-hover:text-violet-400 group-hover:translate-x-0.5 transition-all shrink-0" />
              </div>
              <p className="text-xs text-slate-400 pl-5">{desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── PRACTICE SPOTLIGHT ─── */}
      <section className="pb-16">
        <div className="bg-linear-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-widest bg-amber-100 px-3 py-1.5 rounded-full mb-4">
                <Target className="w-3.5 h-3.5" /> Interactive Practice
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight">Test your knowledge as you learn</h2>
              <p className="text-slate-600 leading-relaxed mb-6">
                Every major topic has a practice quiz. Questions range from concept checks to hard implementation challenges — with expandable answers. Your progress is saved automatically.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {MANIFEST.filter((a) => a.hasPractice).slice(0, 4).map((article) => {
                  const s = CATEGORY_STYLES[article.category] || fallbackStyle;
                  return (
                    <Link
                      key={article.slug}
                      href={`/practice/${article.slug}`}
                      className="flex items-center gap-2.5 p-3 bg-white rounded-xl border border-amber-100 hover:border-amber-300 hover:shadow-sm transition-all group"
                    >
                      <Target className="w-4 h-4 text-amber-500 shrink-0" />
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-slate-800 group-hover:text-amber-700 truncate transition-colors">{article.title}</div>
                        <div className={`text-xs font-medium ${s.text} truncate`}>{article.category}</div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
            <div className="shrink-0 flex flex-col gap-3 w-full md:w-64">
              <div className="bg-white rounded-2xl border border-amber-200 p-5">
                <div className="text-3xl font-black text-slate-900 mb-1">{practiceCount}</div>
                <div className="text-sm text-slate-500">Practice quizzes available</div>
                <div className="text-xs text-amber-600 font-semibold mt-1">progress saved locally</div>
              </div>
              <div className="bg-amber-500 rounded-2xl p-5 text-white">
                <div className="text-3xl font-black mb-1">3</div>
                <div className="text-sm text-amber-100">difficulty levels</div>
                <div className="text-xs text-amber-200 mt-1">Easy · Medium · Hard</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section className="pb-20">
        <div className="mb-10 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-violet-600 uppercase tracking-widest bg-violet-50 px-3 py-1.5 rounded-full mb-4">
            <Sparkles className="w-3.5 h-3.5" /> Why developers love it
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-3">Everything you need, nothing you don't</h2>
          <p className="text-slate-500 text-base leading-relaxed">
            Designed to be the last reference you'll ever need. Every feature is documented, every edge case is covered.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon, color, title, desc }) => (
            <div key={title} className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg hover:shadow-slate-100 transition-all duration-200 group">
              <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                {icon}
              </div>
              <h3 className="font-bold text-slate-900 mb-2">{title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
