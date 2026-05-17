import { Link } from 'wouter';
import { ArrowLeft, Search } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center py-20">
      <div className="w-24 h-24 rounded-3xl bg-slate-100 flex items-center justify-center mb-6 text-4xl">
        🔍
      </div>
      <h1 className="text-4xl font-black text-slate-900 mb-3">404</h1>
      <h2 className="text-xl font-bold text-slate-700 mb-3">Page Not Found</h2>
      <p className="text-slate-500 max-w-sm mb-8">
        The page you're looking for doesn't exist. It may have been moved or the URL might be wrong.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-violet-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-violet-700 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
        <Link
          href="/home"
          className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-200 transition-colors text-sm"
        >
          <Search className="w-4 h-4" />
          Browse Docs
        </Link>
      </div>
    </div>
  );
}
