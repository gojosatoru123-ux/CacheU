import { Link } from 'wouter';
import {
  ArrowRight, Zap, Code, Brain, Rocket, Sparkles, Users, TrendingUp, Target,
  Shield, BookOpen, CheckCircle2, Lightbulb, BarChart3, Layers,
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-slate-100 overflow-hidden">
      {/* Background decorative elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-40 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-200/20 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        {/* ─── HERO SECTION ─── */}
        <section className="min-h-screen flex items-center justify-center px-4 md:px-6 lg:px-8 pt-20 pb-32">
          <div className="max-w-5xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-violet-100/60 backdrop-blur-sm border border-violet-300/40 px-4 py-2 rounded-full mb-8 hover:bg-violet-100/80 transition-all">
              <Sparkles className="w-4 h-4 text-violet-600" />
              <span className="text-sm font-semibold text-violet-700">The Complete System Design Platform</span>
            </div>

            {/* Main heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-tight mb-6 text-slate-900">
              Master System{' '}
              <span className="bg-gradient-to-r from-violet-600 via-teal-600 to-sky-600 bg-clip-text text-transparent">
                Design
              </span>
              <br />
              <span className="bg-gradient-to-r from-sky-600 via-violet-600 to-rose-600 bg-clip-text text-transparent">
                From Theory to Pro
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed font-light">
              World-class explanations, interactive mind maps, and hands-on practice quizzes. Everything you need to ace system design interviews and build scalable systems.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/home"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white font-bold px-8 py-4 rounded-2xl transition-all transform hover:scale-110 hover:shadow-2xl shadow-lg text-lg group hover:-translate-y-1"
              >
                <span>Start Learning Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-slate-200/60 hover:bg-slate-300/60 text-slate-700 font-bold px-8 py-4 rounded-2xl transition-all border border-slate-300/60 hover:border-slate-400/60 text-lg group hover:shadow-xl hover:-translate-y-1"
              >
                <Code className="w-5 h-5" />
                View on GitHub
              </a>
            </div>

            {/* Floating stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto mb-20">
              <div className="group bg-white/70 backdrop-blur-sm border border-violet-200/60 rounded-2xl p-6 hover:bg-white/90 hover:border-violet-300/80 transition-all transform hover:scale-110 hover:-translate-y-2 hover:shadow-xl hover:shadow-violet-500/20">
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-violet-600 to-violet-700 bg-clip-text text-transparent">
                  15+
                </div>
                <div className="text-sm text-slate-600 mt-2 group-hover:text-slate-700 transition-colors font-semibold">Topics</div>
              </div>
              <div className="group bg-white/70 backdrop-blur-sm border border-teal-200/60 rounded-2xl p-6 hover:bg-white/90 hover:border-teal-300/80 transition-all transform hover:scale-110 hover:-translate-y-2 hover:shadow-xl hover:shadow-teal-500/20">
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">
                  500+
                </div>
                <div className="text-sm text-slate-600 mt-2 group-hover:text-slate-700 transition-colors font-semibold">Practice Qs</div>
              </div>
              <div className="group bg-white/70 backdrop-blur-sm border border-sky-200/60 rounded-2xl p-6 hover:bg-white/90 hover:border-sky-300/80 transition-all transform hover:scale-110 hover:-translate-y-2 hover:shadow-xl hover:shadow-sky-500/20">
                <div className="text-3xl md:text-4xl font-black bg-gradient-to-r from-sky-600 to-sky-700 bg-clip-text text-transparent">
                  100%
                </div>
                <div className="text-sm text-slate-600 mt-2 group-hover:text-slate-700 transition-colors font-semibold">Free</div>
              </div>
            </div>

            {/* Hero image placeholder with gradient */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-violet-400/40 to-teal-400/40 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative bg-gradient-to-br from-slate-100/80 to-slate-50/80 backdrop-blur-sm border border-slate-300/60 group-hover:border-slate-400/80 rounded-3xl p-12 md:p-16 min-h-96 transition-all">
                <div className="flex items-center justify-center h-full">
                  <div className="text-center group-hover:scale-110 transition-transform duration-500">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-200/60 to-teal-200/60 flex items-center justify-center group-hover:from-violet-300/80 group-hover:to-teal-300/80 transition-all">
                      <Code className="w-12 h-12 text-violet-700 group-hover:text-violet-800 transition-colors" />
                    </div>
                    <p className="text-slate-600 text-lg group-hover:text-slate-700 transition-colors font-medium">
                      Start your system design mastery journey
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FEATURES SECTION ─── */}
        <section className="py-20 md:py-32 px-4 md:px-6 lg:px-8 bg-slate-100/40 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                What Makes CacheU Special?
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Everything crafted to help you master system design and land your dream job
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {FEATURES.map((feature, idx) => (
                <div
                  key={idx}
                  className="group bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-8 hover:border-slate-300/80 hover:bg-white transition-all hover:shadow-lg hover:shadow-violet-500/20 transform hover:-translate-y-1"
                >
                  <div className={`w-14 h-14 rounded-xl ${feature.color} flex items-center justify-center mb-6 group-hover:scale-125 transition-all transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-violet-700 transition-colors">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed group-hover:text-slate-700 transition-colors">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── SUBJECTS SECTION ─── */}
        <section className="py-20 md:py-32 px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                Comprehensive Learning Paths
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                Master every aspect of system design with our world-class curriculum
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {SUBJECTS.map((subject, idx) => (
                <Link key={idx} href={`/docs/${subject.slug}`}>
                  <div className="group relative rounded-3xl overflow-hidden h-96 cursor-pointer transition-all transform hover:scale-105">
                    <div className={`absolute inset-0 bg-gradient-to-br ${subject.gradient}`} />
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all" />

                    {/* Animated glow on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className={`absolute -inset-1 bg-gradient-to-br ${subject.gradient} rounded-3xl blur-xl opacity-20`} />
                    </div>

                    <div className="relative h-full flex flex-col justify-between p-8 text-white z-10">
                      <div>
                        <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 group-hover:bg-white/40 transition-all group-hover:scale-110 transform">
                          {subject.icon}
                        </div>
                        <h3 className="text-3xl font-black mb-2 leading-tight">{subject.title}</h3>
                        <p className="text-sm font-semibold opacity-75 group-hover:opacity-90 transition-all">{subject.subtitle}</p>
                      </div>

                      <div>
                        <p className="text-slate-100 mb-6 text-sm leading-relaxed opacity-90 group-hover:opacity-100 transition-all">
                          {subject.desc}
                        </p>
                        <div className="inline-flex items-center gap-2 bg-white/20 group-hover:bg-white/40 backdrop-blur-sm px-4 py-2 rounded-lg transition-all group-hover:shadow-lg">
                          <span className="font-semibold text-sm">Explore Now</span>
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── CTA SECTION ─── */}
        <section className="py-20 md:py-32 px-4 md:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-200/40 to-teal-200/40 blur-3xl" />

          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <div className="group bg-gradient-to-br from-white/90 to-slate-50/90 backdrop-blur-sm border border-slate-300/60 hover:border-slate-400/80 rounded-3xl p-12 md:p-16 transition-all hover:shadow-2xl hover:shadow-violet-500/30 transform hover:-translate-y-2">
              <Sparkles className="w-16 h-16 mx-auto text-violet-600 mb-6 group-hover:animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight group-hover:text-violet-700 transition-colors">
                Ready to Master System Design?
              </h2>
              <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto group-hover:text-slate-700 transition-colors">
                Join thousands of developers and engineers who've leveled up their system design skills with CacheU. Access world-class explanations, interactive mind maps, and challenging practice questions.
              </p>

              <Link
                href="/home"
                className="inline-flex items-center justify-center gap-3 bg-gradient-to-r from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800 text-white font-bold px-10 py-4 rounded-2xl transition-all transform hover:scale-110 hover:shadow-2xl shadow-lg text-lg group/btn hover:-translate-y-1"
              >
                <span>Get Started Free</span>
                <Rocket className="w-5 h-5 group-hover/btn:translate-y-1 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* ─── FOOTER ─── */}
        <footer className="border-t border-slate-300/60 bg-slate-50/50 backdrop-blur-sm py-8 px-4 md:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-slate-600">
              <div>
                <p className="font-semibold text-slate-900 mb-1">CacheU</p>
                <p className="text-sm">The Complete System Design Learning Platform</p>
              </div>
              <div className="flex items-center gap-6">
                <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors">GitHub</a>
                <a href="/home" className="hover:text-slate-900 transition-colors">Docs</a>
                <a href="/home" className="hover:text-slate-900 transition-colors">Community</a>
              </div>
            </div>

            <div className="border-t border-slate-300/60 mt-8 pt-8 text-center text-sm text-slate-500">
              <p>© 2024 CacheU. Built by developers, for developers. Master system design today.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

// ─── DATA ─────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    color: 'bg-violet-100 text-violet-700',
    title: 'World-Class Explanations',
    desc: 'Deep-dive into Low Level Design, High Level Architecture, and Networking with clear, comprehensive explanations that build intuition.',
  },
  {
    icon: <Brain className="w-6 h-6" />,
    color: 'bg-teal-100 text-teal-700',
    title: '500+ Practice Questions',
    desc: 'Interactive quizzes that test your understanding across design patterns, system design, and networking concepts. Track your progress in real-time.',
  },
  {
    icon: <Layers className="w-6 h-6" />,
    color: 'bg-sky-100 text-sky-700',
    title: 'Interactive Mind Maps',
    desc: 'Visualize complex system architectures and dependencies with beautiful, interactive mind maps. Learn by exploring.',
  },
  {
    icon: <CheckCircle2 className="w-6 h-6" />,
    color: 'bg-emerald-100 text-emerald-700',
    title: 'Learn at Your Pace',
    desc: 'Self-paced learning with structured curriculum. No time limits, no pressure. Learn when and how you want.',
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    color: 'bg-amber-100 text-amber-700',
    title: 'Real Interview Questions',
    desc: 'Practice with questions commonly asked in system design interviews at top tech companies.',
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    color: 'bg-rose-100 text-rose-700',
    title: 'Progress Analytics',
    desc: 'Track your learning journey with detailed performance metrics and personalized recommendations.',
  },
];

const SUBJECTS = [
  {
    title: 'Low Level Design',
    subtitle: 'LLD',
    desc: 'Master design patterns, SOLID principles, OOP concepts, and concurrency. Everything you need to write scalable, maintainable code.',
    icon: <Code className="w-6 h-6" />,
    gradient: 'from-violet-600 to-indigo-700',
    color: 'violet',
    slug: 'lld-design-patterns',
  },
  {
    title: 'High Level Design',
    subtitle: 'HLD',
    desc: 'Build scalable systems from scratch. Learn caching strategies, load balancing, microservices, databases, and architectural patterns.',
    icon: <Rocket className="w-6 h-6" />,
    gradient: 'from-teal-600 to-emerald-700',
    color: 'teal',
    slug: 'hld-system-design-basics',
  },
  {
    title: 'Networking',
    subtitle: 'NET',
    desc: 'Understand the internet fundamentals. Master HTTP/HTTPS, TCP/IP, DNS, CDN, REST, GraphQL, and gRPC protocols.',
    icon: <Shield className="w-6 h-6" />,
    gradient: 'from-sky-600 to-cyan-700',
    color: 'sky',
    slug: 'net-http-https',
  },
];