import { lazy, Suspense } from 'react';
import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from 'wouter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Sidebar, MobileSidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { MANIFEST } from './lib/content';

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────
// Each page becomes its own JS chunk — only downloaded when first visited.
const LandingPage  = lazy(() => import('./pages/LandingPage'));
const HomePage     = lazy(() => import('./pages/HomePage'));
const DocsPage     = lazy(() => import('./pages/DocsPage'));
const PracticePage = lazy(() => import('./pages/PracticePage'));
const MindMapPage  = lazy(() => import('./pages/MindMapPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const TermsAndConditionsPage = lazy(() => import('./pages/TermsAndConditionsPage'));

const queryClient = new QueryClient();

// ─── Skeleton loaders (shown while a page chunk is downloading) ───────────────
function DocsSkeleton() {
  return (
    <div className="flex gap-8 xl:gap-12 max-w-5xl mx-auto px-6 py-8 md:px-8 md:py-10 animate-pulse">
      <div className="flex-1 min-w-0 space-y-4">
        <div className="h-4 bg-slate-100 rounded w-24" />
        <div className="h-9 bg-slate-100 rounded w-3/4" />
        <div className="h-4 bg-slate-100 rounded w-1/2" />
        <div className="flex gap-3 mt-2">
          <div className="h-14 bg-slate-100 rounded-2xl w-40" />
          <div className="h-14 bg-slate-100 rounded-2xl w-40" />
        </div>
        <div className="mt-8 space-y-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-3 bg-slate-100 rounded" style={{ width: `${85 - i * 5}%` }} />
          ))}
        </div>
      </div>
      <div className="hidden xl:block w-52 shrink-0 space-y-2 pt-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-3 bg-slate-100 rounded" style={{ width: `${70 - i * 8}%` }} />
        ))}
      </div>
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 animate-pulse space-y-6">
      <div className="h-8 bg-slate-100 rounded w-56" />
      <div className="h-4 bg-slate-100 rounded w-96" />
      <div className="grid grid-cols-3 gap-4 mt-8">
        {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-slate-100 rounded-2xl" />)}
      </div>
    </div>
  );
}

function FullscreenSkeleton() {
  return (
    <div className="flex items-center justify-center h-[60vh]">
      <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// ─── Layouts ──────────────────────────────────────────────────────────────────
function DocsLayout() {
  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      <aside className="hidden lg:flex w-64 xl:w-72 shrink-0 border-r border-slate-100 overflow-y-auto">
        <Sidebar manifest={MANIFEST} className="w-full" />
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8 md:px-8 md:py-10">
          <Suspense fallback={<DocsSkeleton />}>
            <DocsPage />
          </Suspense>
        </div>
      </main>
      <MobileSidebar manifest={MANIFEST} />
    </div>
  );
}

function PracticeLayout() {
  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      <aside className="hidden lg:flex w-64 xl:w-72 shrink-0 border-r border-slate-100 overflow-y-auto">
        <Sidebar manifest={MANIFEST} className="w-full" />
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-8 md:px-8 md:py-10">
          <Suspense fallback={<DocsSkeleton />}>
            <PracticePage />
          </Suspense>
        </div>
      </main>
      <MobileSidebar manifest={MANIFEST} />
    </div>
  );
}

function MindMapLayout() {
  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      <aside className="hidden lg:flex w-64 xl:w-72 shrink-0 border-r border-slate-100 overflow-y-auto">
        <Sidebar manifest={MANIFEST} className="w-full" />
      </aside>
      <div className="flex-1 overflow-hidden flex flex-col">
        <Suspense fallback={<FullscreenSkeleton />}>
          <MindMapPage />
        </Suspense>
      </div>
      <MobileSidebar manifest={MANIFEST} />
    </div>
  );
}

function HomeLayout() {
  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
      <Suspense fallback={<PageSkeleton />}>
        <HomePage />
      </Suspense>
    </main>
  );
}

function PrivacyPolicyLayout() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <Suspense fallback={<PageSkeleton />}>
        <PrivacyPolicyPage />
      </Suspense>
    </main>
  );
}

function TermsAndConditionsLayout() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <Suspense fallback={<PageSkeleton />}>
        <TermsAndConditionsPage />
      </Suspense>
    </main>
  );
}

// ─── Router ───────────────────────────────────────────────────────────────────
function Router() {
  return (
    <Switch>
      <Route path="/">
        <Suspense fallback={<FullscreenSkeleton />}>
          <LandingPage />
        </Suspense>
      </Route>
      <Route path="/home" component={HomeLayout} />
      <Route path="/docs/:slug" component={DocsLayout} />
      <Route path="/practice/:slug" component={PracticeLayout} />
      <Route path="/mindmap/:slug" component={MindMapLayout} />
      <Route path="/privacy-policy" component={PrivacyPolicyLayout} />
      <Route path="/terms" component={TermsAndConditionsLayout} />
      <Route path="/docs">
        <Redirect to="/docs/lld-design-patterns" />
      </Route>
      <Route>
        <Suspense fallback={<FullscreenSkeleton />}>
          <NotFoundPage />
        </Suspense>
      </Route>
    </Switch>
  );
}

function AppContent() {
  const [location] = useLocation();
  const isLanding = location === '/';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!isLanding && <Header />}
      <div className="flex-1">
        <Router />
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <AppContent />
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;