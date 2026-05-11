import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

function extractHeadings(content: string): Heading[] {
  // Updated to handle 1 to 6 hashes: #{1,6}
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    headings.push({ id, text, level });
  }

  return headings;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState('');
  const headings = extractHeadings(content);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
    // Keep 'content' as dependency so it re-runs when the MD changes
  }, [content, headings]); 

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-24 flex flex-col max-h-[calc(100vh-7rem)]">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 shrink-0">
        On this page
      </p>
      <ul className="space-y-1 border-l border-slate-100 overflow-y-auto min-h-0">
        {headings.map((h) => (
          <li key={h.id}>
            <a
              href={`#${h.id}`}
              // Dynamically calculate padding based on level
              // H1 (level 1) = 1rem, H2 = 1.75rem, H3 = 2.5rem, etc.
              style={{ paddingLeft: `${(h.level - 1) * 12 + 16}px` }}
              className={cn(
                'block py-1 text-sm transition-all border-l-2 -ml-px',
                activeId === h.id
                  ? 'border-violet-500 text-violet-700 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-700 hover:border-slate-300'
              )}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}