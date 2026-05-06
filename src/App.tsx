import { Switch, Route, Router as WouterRouter, Redirect, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Sidebar, MobileSidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { MANIFEST } from "./lib/content";
import HomePage from "./pages/HomePage";
import LandingPage from "./pages/LandingPage";
import DocsPage from "./pages/DocsPage";
import PracticePage from "./pages/PracticePage";
import MindMapPage from "./pages/MindMapPage";
import NotFoundPage from "./pages/NotFoundPage";

const queryClient = new QueryClient();

function AppContent() {
  const [location] = useLocation();
  const isLanding = location === "/";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {!isLanding && <Header />}
      <div className="flex-1">
        <Router />
      </div>
    </div>
  );
}

function DocsLayout() {
  return (
    <div className="flex h-[calc(100vh-64px)] overflow-hidden">
      <aside className="hidden lg:flex w-64 xl:w-72 shrink-0 border-r border-slate-100 overflow-y-auto">
        <Sidebar manifest={MANIFEST} className="w-full" />
      </aside>
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-5xl mx-auto px-6 py-8 md:px-8 md:py-10">
          <DocsPage />
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
          <PracticePage />
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
        <MindMapPage />
      </div>
      <MobileSidebar manifest={MANIFEST} />
    </div>
  );
}

function HomeLayout() {
  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
      <HomePage />
    </main>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={LandingPage} />
      <Route path="/home" component={HomeLayout} />
      <Route path="/docs/:slug" component={DocsLayout} />
      <Route path="/practice/:slug" component={PracticeLayout} />
      <Route path="/mindmap/:slug" component={MindMapLayout} />
      <Route path="/docs">
        <Redirect to="/docs/lld-design-patterns" />
      </Route>
      <Route component={NotFoundPage} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <AppContent />
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
