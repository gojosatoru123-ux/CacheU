import { useEffect, useRef } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github-dark-dimmed.css';

interface MarkdownRendererProps {
  content: string;
}

// Configure marked with syntax highlighting
const renderer = new marked.Renderer();

renderer.code = ({ text, lang }) => {
  const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
  const highlighted = hljs.highlight(text, { language }).value;
  return `<pre class="hljs-pre"><code class="hljs language-${language}">${highlighted}</code></pre>`;
};

marked.setOptions({ renderer });

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const ref = useRef<HTMLDivElement>(null);

  const html = marked.parse(content) as string;

  useEffect(() => {
    if (ref.current) {
      ref.current.querySelectorAll('pre code:not(.hljs)').forEach((block) => {
        hljs.highlightElement(block as HTMLElement);
      });
    }
  }, [content]);

  return (
    <div
      ref={ref}
      className="prose prose-slate prose-lg max-w-none
        prose-headings:font-bold prose-headings:tracking-tight
        prose-h1:text-3xl prose-h1:text-slate-900
        prose-h2:text-2xl prose-h2:text-slate-800 prose-h2:border-b prose-h2:border-slate-100 prose-h2:pb-3 prose-h2:mt-10
        prose-h3:text-xl prose-h3:text-slate-700
        prose-p:text-slate-600 prose-p:leading-relaxed
        prose-a:text-violet-600 prose-a:no-underline hover:prose-a:underline
        prose-code:text-violet-700 prose-code:bg-violet-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
        prose-pre:bg-transparent prose-pre:p-0 prose-pre:m-0
        prose-blockquote:border-l-violet-400 prose-blockquote:bg-violet-50 prose-blockquote:rounded-r-lg prose-blockquote:py-1
        prose-table:border-collapse
        prose-th:bg-slate-50 prose-th:text-slate-700 prose-th:font-semibold
        prose-td:border-slate-200
        prose-strong:text-slate-900 prose-strong:font-semibold
        prose-ul:text-slate-600 prose-ol:text-slate-600
        prose-li:marker:text-violet-400
      "
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
