import { Link, useLocation } from 'wouter';
import { Search } from './Search';
import { MANIFEST } from '../lib/content';
import { Github, Moon, Sun } from 'lucide-react';
import { useState, useEffect } from 'react';

export function Header() {
  const [location] = useLocation();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center px-4 md:px-6 gap-4">
      {/* Logo */}
      <Link href="/home" className="flex items-center gap-2.5 shrink-0 mr-4">
        <div className="w-11 h-11 rounded-lg flex items-center justify-center">
          <img src="/cacheu_logo.webp" alt="CacheU"/>
        </div>
        <span className="font-bold text-slate-900 text-base tracking-tight hidden sm:block">CacheU</span>
      </Link>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <Search manifest={MANIFEST} />
      </div>

      {/* Nav links */}
      <nav className="hidden md:flex items-center gap-1 ml-auto">
        {[
          { href: '/home', label: 'Home' },
          { href: '/docs/lld-introduction', label: 'LLD' },
          { href: '/docs/api-reference', label: 'HLD' },
          { href: '/docs/websec-01-cors', label: 'WEB Security' },
          { href: '/docs/backend-01-what-is-backend', label: 'Backend Design' },
        ].map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              location === href
                ? 'bg-violet-50 text-violet-700'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-2">
        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          <Github className="w-4 h-4" />
        </a>
        <button
          onClick={() => setDark((d) => !d)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
