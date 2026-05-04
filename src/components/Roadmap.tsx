import { Link } from 'wouter';
import { useProgress, resetAllQuizzes, ProgressStore } from '../lib/progress';
import { MANIFEST } from '../lib/content';
import { Network, Target, BookOpen, CheckCircle2, ArrowRight, Trophy, RotateCcw, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Track definitions ───────────────────────────────────────────────────────
const TRACKS = [
  {
    name: 'Low Level Design',
    short: 'LLD',
    color: '#7c3aed',
    lightColor: '#ede9fe',
    gradient: 'from-violet-600 to-indigo-700',
    glow: 'shadow-violet-500/30',
    badge: 'bg-violet-100 text-violet-700',
    border: 'border-violet-200',
    ring: 'violet',
    slugs: ['lld-design-patterns', 'lld-solid-principles', 'lld-concurrency', 'lld-oop-concepts'],
  },
  {
    name: 'High Level Design',
    short: 'HLD',
    color: '#0d9488',
    lightColor: '#ccfbf1',
    gradient: 'from-teal-600 to-emerald-700',
    glow: 'shadow-teal-500/30',
    badge: 'bg-teal-100 text-teal-700',
    border: 'border-teal-200',
    ring: 'teal',
    slugs: ['hld-system-design-basics', 'hld-load-balancing', 'hld-caching-strategies', 'hld-microservices'],
  },
  {
    name: 'Networking',
    short: 'NET',
    color: '#0284c7',
    lightColor: '#e0f2fe',
    gradient: 'from-sky-600 to-cyan-700',
    glow: 'shadow-sky-500/30',
    badge: 'bg-sky-100 text-sky-700',
    border: 'border-sky-200',
    ring: 'sky',
    slugs: ['net-http-https', 'net-tcp-ip', 'net-dns-cdn', 'net-rest-graphql'],
  },
];

// ─── SVG progress ring ───────────────────────────────────────────────────────
function RingProgress({
  pct, color, size = 44, done,
}: { pct: number; color: string; size?: number; done: boolean }) {
  const r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="shrink-0">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={3} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={done ? '#10b981' : color}
        strokeWidth={3}
        strokeDasharray={`${pct * circ} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dasharray 0.7s cubic-bezier(0.4,0,0.2,1)' }}
      />
      {done && (
        <text
          x={size / 2} y={size / 2 + 1}
          textAnchor="middle" dominantBaseline="central"
          fontSize={12} fill="#10b981" fontWeight="700"
        >✓</text>
      )}
      {!done && pct === 0 && (
        <circle cx={size / 2} cy={size / 2} r={4} fill="#cbd5e1" />
      )}
      {!done && pct > 0 && pct < 1 && (
        <circle cx={size / 2} cy={size / 2} r={3} fill={color} />
      )}
    </svg>
  );
}

// ─── Node status helpers ─────────────────────────────────────────────────────
function getProgress(slug: string, store: ProgressStore, hasPractice: boolean) {
  const read = store.articlesRead.includes(slug);
  const done = store.quizzesCompleted.includes(slug);
  const partialCount = store.quizzesRevealed[slug]?.length ?? 0;

  if (!hasPractice) return { pct: read ? 1 : 0, done: read, read, quizDone: false, partial: false };
  if (done) return { pct: 1, done: true, read, quizDone: true, partial: false };
  if (read) return { pct: partialCount > 0 ? 0.7 : 0.5, done: false, read, quizDone: false, partial: partialCount > 0 };
  return { pct: 0, done: false, read: false, quizDone: false, partial: false };
}

// ─── Big animated overall ring ───────────────────────────────────────────────
function OverallRing({ pct }: { pct: number }) {
  const size = 96;
  const r = 40;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e2e8f0" strokeWidth={5} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke="url(#overallGrad)"
        strokeWidth={5}
        strokeDasharray={`${pct * circ} ${circ}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dasharray 1s cubic-bezier(0.4,0,0.2,1)' }}
      />
      <defs>
        <linearGradient id="overallGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ─── Main Roadmap component ───────────────────────────────────────────────────
export function Roadmap() {
  const store = useProgress();

  // Compute global stats
  const mainSlugs = TRACKS.flatMap((t) => t.slugs);
  const totalArticles = mainSlugs.length;
  const articlesRead = mainSlugs.filter((s) => store.articlesRead.includes(s)).length;
  const quizSlugs = MANIFEST.filter((a) => a.hasPractice).map((a) => a.slug);
  const totalQuizzes = quizSlugs.length;
  const quizzesDone = store.quizzesCompleted.length;
  const overallPct =
    totalArticles + totalQuizzes > 0
      ? (articlesRead + quizzesDone * 1.5) / (totalArticles + totalQuizzes * 1.5)
      : 0;

  // Find next article to read
  const nextUnread = mainSlugs.find((s) => !store.articlesRead.includes(s));
  const nextArticle = nextUnread ? MANIFEST.find((a) => a.slug === nextUnread) : null;

  const hasAnyProgress = articlesRead > 0 || quizzesDone > 0;

  return (
    <section className="py-10">
      {/* ── Section header ── */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold text-violet-600 uppercase tracking-widest bg-violet-50 px-3 py-1.5 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Learning Roadmap
          </div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Your Progress Journey
          </h2>
          <p className="text-slate-500 mt-1.5 text-sm">
            Track every article, quiz, and mind map across all topics.
          </p>
        </div>
        {hasAnyProgress && (
          <button
            onClick={() => { if (confirm('Reset all quiz progress? Articles read will be preserved.')) resetAllQuizzes(); }}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 px-3 py-2 rounded-xl transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Quizzes
          </button>
        )}
      </div>

      {/* ── Overall progress bar ── */}
      <div className="bg-white border border-slate-100 rounded-3xl p-6 mb-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Big ring */}
          <div className="relative shrink-0">
            <OverallRing pct={overallPct} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-black text-slate-900 leading-none">
                {Math.round(overallPct * 100)}%
              </span>
              <span className="text-xs text-slate-400 mt-0.5">done</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
            <Stat label="Articles Read" value={`${articlesRead}`} total={totalArticles} color="violet" icon={<BookOpen className="w-4 h-4" />} />
            <Stat label="Quizzes Done" value={`${quizzesDone}`} total={totalQuizzes} color="amber" icon={<Target className="w-4 h-4" />} />
            <Stat label="Tracks" value={`${TRACKS.filter((t) => t.slugs.every((s) => store.articlesRead.includes(s))).length}`} total={3} color="teal" icon={<Trophy className="w-4 h-4" />} />
            <Stat label="Streak" value={`${Math.floor(articlesRead * 1.5)}`} total={undefined} color="rose" icon={<Sparkles className="w-4 h-4" />} suffix=" pts" />
          </div>

          {/* Continue CTA */}
          {nextArticle && (
            <Link
              href={`/docs/${nextArticle.slug}`}
              className="shrink-0 flex items-center gap-3 bg-linear-to-r from-violet-600 to-indigo-600 text-white px-5 py-3 rounded-2xl hover:shadow-lg hover:shadow-violet-200 transition-all group"
            >
              <div>
                <div className="text-xs text-violet-200 font-medium">Continue</div>
                <div className="text-sm font-bold truncate max-w-30">{nextArticle.title}</div>
              </div>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform shrink-0" />
            </Link>
          )}
        </div>
      </div>

      {/* ── Track columns ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {TRACKS.map((track, trackIdx) => {
          const trackArticles = track.slugs.map((slug) => MANIFEST.find((a) => a.slug === slug)).filter(Boolean) as typeof MANIFEST;
          const trackRead = trackArticles.filter((a) => store.articlesRead.includes(a.slug)).length;
          const trackDone = trackArticles.filter((a) => store.quizzesCompleted.includes(a.slug)).length;
          const trackComplete = trackRead === trackArticles.length && trackDone === trackArticles.filter((a) => a.hasPractice).length;

          return (
            <div
              key={track.name}
              className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm"
              style={{ animationDelay: `${trackIdx * 80}ms` }}
            >
              {/* Track header */}
              <div className={`bg-linear-to-r ${track.gradient} p-5 text-white relative overflow-hidden`}>
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full" />
                <div className="relative flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-widest opacity-80 mb-0.5">{track.short}</div>
                    <div className="font-bold text-base">{track.name}</div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    {trackComplete && (
                      <div className="flex items-center gap-1 bg-white/20 rounded-full px-2.5 py-1 text-xs font-bold">
                        <Trophy className="w-3 h-3" /> Complete!
                      </div>
                    )}
                    <div className="text-xs opacity-70">
                      {trackRead}/{trackArticles.length} read · {trackDone} quiz done
                    </div>
                  </div>
                </div>
                {/* Track progress bar */}
                <div className="mt-3 bg-white/20 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-700"
                    style={{ width: `${(trackRead / trackArticles.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Nodes */}
              <div className="p-3">
                {trackArticles.map((article, nodeIdx) => {
                  const prog = getProgress(article.slug, store, article.hasPractice);
                  const isLast = nodeIdx === trackArticles.length - 1;

                  return (
                    <div key={article.slug} className="relative">
                      {/* Connector line */}
                      {!isLast && (
                        <div className="absolute left-6.75 top-13 w-0.5 h-5 z-0">
                          <div className="w-full bg-slate-100 absolute inset-0" />
                          {prog.read && (
                            <div
                              className="w-full absolute top-0 transition-all duration-700"
                              style={{ height: '100%', background: track.color }}
                            />
                          )}
                        </div>
                      )}

                      {/* Node card */}
                      <div
                        className={cn(
                          'relative z-10 flex items-start gap-3 p-3 rounded-2xl transition-all duration-200 group mb-1',
                          prog.done
                            ? 'bg-emerald-50 border border-emerald-100'
                            : prog.read
                            ? 'bg-slate-50 border border-slate-100 hover:bg-white hover:border-slate-200 hover:shadow-sm'
                            : 'border border-transparent hover:bg-slate-50 hover:border-slate-100'
                        )}
                        style={prog.done ? { boxShadow: `0 0 0 1px rgba(16,185,129,0.2), 0 2px 8px rgba(16,185,129,0.08)` } : {}}
                      >
                        {/* Progress ring */}
                        <RingProgress pct={prog.pct} color={track.color} done={prog.done} />

                        {/* Content */}
                        <div className="flex-1 min-w-0 pt-0.5">
                          <Link
                            href={`/docs/${article.slug}`}
                            className={cn(
                              'font-semibold text-sm leading-tight block hover:underline transition-colors mb-2',
                              prog.done ? 'text-emerald-800' : prog.read ? 'text-slate-800' : 'text-slate-500'
                            )}
                          >
                            {article.title}
                          </Link>

                          {/* Status + actions row */}
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {/* Status pill */}
                            {prog.done ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" /> Done
                              </span>
                            ) : prog.read ? (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
                                <BookOpen className="w-3 h-3" /> Reading
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                                Not started
                              </span>
                            )}

                            {/* Action buttons */}
                            <div className="flex items-center gap-1 ml-auto">
                              {article.hasMindmap && (
                                <Link
                                  href={`/mindmap/${article.slug}`}
                                  title="Mind Map"
                                  className="w-6 h-6 rounded-lg bg-sky-50 hover:bg-sky-100 flex items-center justify-center transition-colors"
                                >
                                  <Network className="w-3 h-3 text-sky-600" />
                                </Link>
                              )}
                              {article.hasPractice && (
                                <Link
                                  href={`/practice/${article.slug}`}
                                  title="Practice Quiz"
                                  className={cn(
                                    'w-6 h-6 rounded-lg flex items-center justify-center transition-colors',
                                    prog.quizDone
                                      ? 'bg-emerald-50 hover:bg-emerald-100'
                                      : prog.partial
                                      ? 'bg-amber-50 hover:bg-amber-100'
                                      : 'bg-slate-50 hover:bg-slate-100'
                                  )}
                                >
                                  <Target className={cn('w-3 h-3', prog.quizDone ? 'text-emerald-600' : prog.partial ? 'text-amber-600' : 'text-slate-400')} />
                                </Link>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Track footer CTA */}
              <div className="px-3 pb-3">
                <Link
                  href={`/docs/${track.slugs[0]}`}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border text-xs font-bold transition-all hover:shadow-sm"
                  style={{ borderColor: `${track.color}30`, color: track.color, background: `${track.color}08` }}
                >
                  {trackRead === 0 ? 'Start track' : trackComplete ? 'Review track' : 'Continue'} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Mobile reset button ── */}
      {hasAnyProgress && (
        <div className="mt-5 flex justify-center sm:hidden">
          <button
            onClick={() => { if (confirm('Reset all quiz progress?')) resetAllQuizzes(); }}
            className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-rose-600 px-4 py-2 rounded-xl border border-slate-200 transition-all"
          >
            <RotateCcw className="w-4 h-4" /> Reset All Quizzes
          </button>
        </div>
      )}
    </section>
  );
}

// ─── Small stat card ─────────────────────────────────────────────────────────
function Stat({
  label, value, total, color, icon, suffix = '',
}: {
  label: string; value: string; total?: number; color: string; icon: React.ReactNode; suffix?: string;
}) {
  const colorMap: Record<string, string> = {
    violet: 'bg-violet-50 text-violet-600',
    amber: 'bg-amber-50 text-amber-600',
    teal: 'bg-teal-50 text-teal-600',
    rose: 'bg-rose-50 text-rose-600',
  };
  return (
    <div className="flex items-center gap-3">
      <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center shrink-0', colorMap[color] || colorMap.violet)}>
        {icon}
      </div>
      <div>
        <div className="font-black text-slate-900 text-lg leading-none">
          {value}{total !== undefined ? <span className="text-slate-400 text-sm font-semibold">/{total}</span> : suffix}
        </div>
        <div className="text-xs text-slate-400 mt-0.5">{label}</div>
      </div>
    </div>
  );
}
