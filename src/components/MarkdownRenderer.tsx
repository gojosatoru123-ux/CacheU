import { useEffect, useRef } from 'react';
import { marked } from 'marked';
import hljs from 'highlight.js';
import mermaid from 'mermaid';
import svgPanZoom from 'svg-pan-zoom';
import 'highlight.js/styles/github-dark-dimmed.css';

interface MarkdownRendererProps {
  content: string;
}

interface PanZoomInstance {
  [key: string]: ReturnType<typeof svgPanZoom> | null;
}

// Initialize Mermaid
mermaid.initialize({
  startOnLoad: false, // We control rendering manually
  theme: 'default',
  securityLevel: 'loose',
});

// ─── Types ────────────────────────────────────────────────────────────────────

type TokenType = 'code' | 'other';

interface CodeToken {
  type: 'code';
  lang: string;
  text: string;
  raw: string;
}

interface OtherToken {
  type: 'other';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  token: any;
}

type AnnotatedToken = CodeToken | OtherToken;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getLangLabel(lang: string): string {
  const labels: Record<string, string> = {
    js: 'JavaScript',
    javascript: 'JavaScript',
    ts: 'TypeScript',
    typescript: 'TypeScript',
    jsx: 'JSX',
    tsx: 'TSX',
    py: 'Python',
    python: 'Python',
    rb: 'Ruby',
    ruby: 'Ruby',
    go: 'Go',
    rs: 'Rust',
    rust: 'Rust',
    java: 'Java',
    cs: 'C#',
    csharp: 'C#',
    cpp: 'C++',
    c: 'C',
    php: 'PHP',
    swift: 'Swift',
    kotlin: 'Kotlin',
    sh: 'Shell',
    bash: 'Bash',
    shell: 'Shell',
    zsh: 'Zsh',
    sql: 'SQL',
    html: 'HTML',
    css: 'CSS',
    scss: 'SCSS',
    sass: 'Sass',
    json: 'JSON',
    yaml: 'YAML',
    yml: 'YAML',
    xml: 'XML',
    md: 'Markdown',
    markdown: 'Markdown',
    dockerfile: 'Dockerfile',
    docker: 'Docker',
    graphql: 'GraphQL',
    gql: 'GraphQL',
    r: 'R',
    lua: 'Lua',
    dart: 'Dart',
    scala: 'Scala',
    elixir: 'Elixir',
    haskell: 'Haskell',
    plaintext: 'Plain Text',
    text: 'Plain Text',
    mermaid: 'Mermaid',
  };
  return labels[lang.toLowerCase()] ?? lang.toUpperCase();
}

function renderSingleCode(text: string, lang: string): string {
  if (lang === 'mermaid') {
    const mermaidId = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
    return `<div class="mermaid-wrapper">
      <div class="mermaid-titlebar">
        <div class="mermaid-dots">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
        </div>
        <span class="mermaid-label">Diagram</span>
        <div class="mermaid-controls" data-target="${mermaidId}">
          <button class="mermaid-zoom-out" title="Zoom Out (Ctrl/Cmd + Minus)">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </button>
          <button class="mermaid-zoom-in" title="Zoom In (Ctrl/Cmd + Plus)">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8M2 6h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
          </button>
          <button class="mermaid-reset" title="Reset View">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6a4 4 0 1 0 1.2-2.8L2 2v3h3L3.8 3.8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>
      </div>
      <div class="mermaid-container" id="${mermaidId}"><div class="mermaid">${text}</div></div>
    </div>`;
  }

  const language = lang && hljs.getLanguage(lang) ? lang : 'plaintext';
  const highlighted = hljs.highlight(text, { language }).value;
  return `<pre class="hljs-pre"><code class="hljs language-${language}">${highlighted}</code></pre>`;
}

function renderTabGroup(codes: CodeToken[]): string {
  const groupId = `tabgroup-${Math.random().toString(36).substr(2, 9)}`;

  const tabs = codes
    .map((c, i) => {
      const label = getLangLabel(c.lang || 'plaintext');
      const active = i === 0 ? 'tab-active' : '';
      return `<button class="code-tab ${active}" data-group="${groupId}" data-index="${i}">${label}</button>`;
    })
    .join('');

  const panels = codes
    .map((c, i) => {
      const hidden = i === 0 ? '' : 'style="display:none"';
      const inner = renderSingleCode(c.text, c.lang || 'plaintext');
      return `<div class="code-panel" data-group="${groupId}" data-index="${i}" ${hidden}>${inner}</div>`;
    })
    .join('');

  return `<div class="code-tab-group" id="${groupId}">
    <div class="code-tab-bar">${tabs}</div>
    <div class="code-tab-panels">${panels}</div>
  </div>`;
}

// ─── Custom renderer ──────────────────────────────────────────────────────────
//
// Strategy: we walk the token list ourselves so we can group consecutive code
// tokens into a single tab group. We override `renderer.code` only as a
// fallback (marked may call it for tokens we didn't touch).

function buildHtml(content: string): string {
  // Get the token list from marked's lexer
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tokens: any[] = (marked as any).lexer(content);

  const annotated: AnnotatedToken[] = tokens.map((t) => {
    if (t.type === 'code') {
      return { type: 'code', lang: t.lang ?? 'plaintext', text: t.text, raw: t.raw } as CodeToken;
    }
    return { type: 'other', token: t } as OtherToken;
  });

  // Build a default renderer for non-code tokens
  const defaultRenderer = new marked.Renderer();
  defaultRenderer.code = ({ text, lang }) => renderSingleCode(text, lang ?? 'plaintext');

  const markedWithRenderer = marked.use({ renderer: defaultRenderer });

  let html = '';
  let i = 0;

  while (i < annotated.length) {
    const cur = annotated[i];

    if (cur.type === 'code') {
      // Collect the run of consecutive code tokens
      const group: CodeToken[] = [cur];
      let j = i + 1;
      while (j < annotated.length && annotated[j].type === 'code') {
        group.push(annotated[j] as CodeToken);
        j++;
      }

      if (group.length === 1) {
        // Single code block — render normally (keeps mermaid flow intact)
        html += renderSingleCode(group[0].text, group[0].lang);
      } else {
        // Multiple consecutive code blocks — render as tabs
        html += renderTabGroup(group);
      }

      i = j;
    } else {
      // Non-code token — let marked parse it individually
      html += markedWithRenderer(cur.token.raw) as string;
      i++;
    }
  }

  return html;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const ref = useRef<HTMLDivElement>(null);
  const panZoomInstancesRef = useRef<PanZoomInstance>({});

  const html = buildHtml(content);

  useEffect(() => {
    if (!ref.current) return;

    // ── 1. Highlight any un-highlighted code blocks ──────────────────────────
    ref.current.querySelectorAll<HTMLElement>('pre code:not(.hljs)').forEach((block) => {
      hljs.highlightElement(block);
    });

    // ── 2. Tab switching logic ───────────────────────────────────────────────
    const tabBars = ref.current.querySelectorAll<HTMLElement>('.code-tab-bar');
    const tabClickHandlers: Array<{ el: HTMLElement; fn: EventListener }> = [];

    tabBars.forEach((bar) => {
      const handler: EventListener = (e) => {
        const btn = (e.target as HTMLElement).closest<HTMLButtonElement>('.code-tab');
        if (!btn) return;
        const groupId = btn.dataset.group!;
        const idx = btn.dataset.index!;

        // Update tab active state
        ref.current!.querySelectorAll<HTMLButtonElement>(`.code-tab[data-group="${groupId}"]`).forEach((t) => {
          t.classList.toggle('tab-active', t.dataset.index === idx);
        });

        // Show/hide panels
        ref.current!.querySelectorAll<HTMLElement>(`.code-panel[data-group="${groupId}"]`).forEach((p) => {
          p.style.display = p.dataset.index === idx ? '' : 'none';
        });
      };

      bar.addEventListener('click', handler);
      tabClickHandlers.push({ el: bar, fn: handler });
    });

    // ── 3. Render Mermaid diagrams ───────────────────────────────────────────
    const mermaidEls = ref.current.querySelectorAll<HTMLElement>('.mermaid');

    const renderMermaid = async () => {
      if (mermaidEls.length === 0) return;

      // Give each .mermaid div a unique id if it doesn't have one
      mermaidEls.forEach((el, idx) => {
        if (!el.id) el.id = `mermaid-render-${idx}-${Math.random().toString(36).substr(2, 6)}`;
      });

      try {
        await mermaid.run({ nodes: Array.from(mermaidEls) });
      } catch (err) {
        console.warn('Mermaid render error:', err);
      }

      // ── 4. Initialize pan-zoom on rendered SVGs ──────────────────────────
      initializePanZoom();
    };

    const initializePanZoom = (retries = 0, maxRetries = 6) => {
      if (!ref.current) return;
      const containers = ref.current.querySelectorAll<HTMLElement>('.mermaid-container');
      if (containers.length === 0) return;

      let allInitialized = true;

      containers.forEach((container) => {
        const svg = container.querySelector('svg');
        const containerId = container.id;
        if (!svg || !containerId) { allInitialized = false; return; }

        // Already initialized
        if (panZoomInstancesRef.current[containerId]) return;

        // ── Fix SVG sizing ───────────────────────────────────────────────────
        // Mermaid often sets height="100%" or a giant px value on the SVG.
        // We read the viewBox (the true diagram dimensions), derive the natural
        // aspect ratio, and size the container to fit tightly with no extra space.

        // 1. Remove any explicit width/height attrs mermaid put on the SVG so
        //    we can measure its natural intrinsic size via viewBox.
        const vb = svg.getAttribute('viewBox');
        let naturalH = 0;
        let naturalW = 0;

        if (vb) {
          const parts = vb.split(/[\s,]+/).map(Number);
          // viewBox = "minX minY width height"
          if (parts.length === 4) {
            naturalW = parts[2];
            naturalH = parts[3];
          }
        }

        // Fallback: use getBBox which gives us the tight bounding box of content
        if (naturalH === 0 || naturalW === 0) {
          try {
            const bb = svg.getBBox();
            naturalW = bb.width;
            naturalH = bb.height;
          } catch (_) { /* noop */ }
        }

        if (naturalH === 0 || naturalW === 0) { allInitialized = false; return; }

        // 2. Force the SVG to fill its container (pan-zoom will manage viewport)
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');
        svg.style.width = '100%';
        svg.style.height = '100%';
        svg.style.display = 'block';

        // 3. Set the container height based on natural aspect ratio, capped
        //    so very tall diagrams don't blow out the page.
        const containerWidth = container.clientWidth || 700;
        const aspectRatio = naturalH / naturalW;
        const targetH = Math.min(Math.round(containerWidth * aspectRatio), 600);
        const finalH = Math.max(targetH, 120); // never shorter than 120px
        container.style.height = `${finalH}px`;

        try {
          const instance = svgPanZoom(svg, {
            viewportSelector: '.svg-pan-zoom_viewport',
            panEnabled: true,
            controlIconsEnabled: false,
            zoomEnabled: true,
            dblClickZoomEnabled: true,
            mouseWheelZoomEnabled: true,
            preventMouseEventsDefault: false,
            zoomScaleSensitivity: 0.3,
            minZoom: 0.1,
            maxZoom: 10,
            fit: true,
            contain: false,
            center: true,
            refreshRate: 'auto',
          });

          // After fit+center, the diagram fills the box with no dead space
          instance.fit();
          instance.center();

          panZoomInstancesRef.current[containerId] = instance;

          // Wire up control buttons — controls are inside .mermaid-titlebar which is the previous sibling of container
          const titlebar = container.previousElementSibling as HTMLElement | null;
          if (titlebar?.classList.contains('mermaid-titlebar')) {
            (titlebar.querySelector('.mermaid-zoom-in') as HTMLButtonElement | null)?.addEventListener('click', () => instance.zoomIn());
            (titlebar.querySelector('.mermaid-zoom-out') as HTMLButtonElement | null)?.addEventListener('click', () => instance.zoomOut());
            (titlebar.querySelector('.mermaid-reset') as HTMLButtonElement | null)?.addEventListener('click', () => { instance.fit(); instance.center(); });
          }
        } catch (err) {
          console.warn(`pan-zoom init failed for ${containerId}:`, err);
          allInitialized = false;
        }
      });

      if (!allInitialized && retries < maxRetries) {
        setTimeout(() => initializePanZoom(retries + 1, maxRetries), 250);
      }
    };

    // Keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      const instances = Object.values(panZoomInstancesRef.current).filter(Boolean);
      if (!instances.length) return;
      const active = instances[0]!;
      if ((e.ctrlKey || e.metaKey) && (e.key === '+' || e.key === '=')) { e.preventDefault(); active.zoomIn(); }
      else if ((e.ctrlKey || e.metaKey) && e.key === '-') { e.preventDefault(); active.zoomOut(); }
      else if ((e.ctrlKey || e.metaKey) && e.key === '0') { e.preventDefault(); active.reset(); }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Kick off mermaid rendering after a small delay so the DOM is painted
    const tid = setTimeout(() => { renderMermaid(); }, 100);

    return () => {
      clearTimeout(tid);
      window.removeEventListener('keydown', handleKeyDown);
      tabClickHandlers.forEach(({ el, fn }) => el.removeEventListener('click', fn));
      Object.values(panZoomInstancesRef.current).forEach((i) => i?.destroy());
      panZoomInstancesRef.current = {};
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [content]);

  return (
    <>
      {/* ── Styles ── */}
      <style>{`
        /* ════════════════════════════════════════════════════════════
           CODE TAB GROUP  — Apple HIG inspired
        ════════════════════════════════════════════════════════════ */
        .code-tab-group {
          margin: 1.5rem 0;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.08);
          box-shadow:
            0 1px 2px rgba(0,0,0,0.04),
            0 4px 16px rgba(0,0,0,0.06);
          background: #1c1c1e;
        }

        /* Tab bar — macOS window-chrome feel */
        .code-tab-bar {
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 0 12px;
          background: #2c2c2e;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          overflow-x: auto;
          scrollbar-width: none;
          min-height: 40px;
        }
        .code-tab-bar::-webkit-scrollbar { display: none; }

        .code-tab {
          position: relative;
          padding: 0 14px;
          height: 28px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 11.5px;
          font-family: -apple-system, "SF Pro Text", "Helvetica Neue", sans-serif;
          font-weight: 500;
          letter-spacing: 0.01em;
          color: rgba(255,255,255,0.4);
          background: transparent;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          white-space: nowrap;
          transition: color 0.15s ease, background 0.15s ease;
          outline: none;
          -webkit-font-smoothing: antialiased;
        }
        .code-tab:hover {
          color: rgba(255,255,255,0.75);
          background: rgba(255,255,255,0.07);
        }
        .code-tab.tab-active {
          color: rgba(255,255,255,0.92);
          background: rgba(255,255,255,0.11);
        }
        /* Active indicator pill */
        .code-tab.tab-active::after {
          content: '';
          position: absolute;
          bottom: -1px;
          left: 50%;
          transform: translateX(-50%);
          width: 60%;
          height: 2px;
          border-radius: 2px 2px 0 0;
          background: rgba(255,255,255,0.5);
        }

        /* Panel area */
        .code-tab-panels {
          background: #1c1c1e;
        }
        .code-tab-panels .hljs-pre {
          margin: 0 !important;
          border-radius: 0 !important;
          border: none !important;
          background: transparent !important;
        }
        .code-tab-panels pre.hljs-pre code {
          border-radius: 0 !important;
        }

        /* ════════════════════════════════════════════════════════════
           MERMAID WRAPPER — Apple Finder / Preview window aesthetic
        ════════════════════════════════════════════════════════════ */
        .mermaid-wrapper {
          margin: 1.5rem 0;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.09);
          box-shadow:
            0 1px 3px rgba(0,0,0,0.05),
            0 6px 24px rgba(0,0,0,0.08);
          background: #ffffff;
        }

        /* Title bar — macOS-style chrome */
        .mermaid-titlebar {
          display: flex;
          align-items: center;
          gap: 0;
          height: 38px;
          padding: 0 12px;
          background: linear-gradient(180deg, #f5f5f7 0%, #ebebed 100%);
          border-bottom: 1px solid rgba(0,0,0,0.1);
          user-select: none;
        }

        /* Traffic-light dots */
        .mermaid-dots {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-right: 10px;
          flex-shrink: 0;
        }
        .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          display: block;
          position: relative;
          transition: filter 0.15s;
        }
        .dot-red    { background: #ff5f57; border: 0.5px solid rgba(0,0,0,0.12); }
        .dot-yellow { background: #ffbd2e; border: 0.5px solid rgba(0,0,0,0.12); }
        .dot-green  { background: #28c840; border: 0.5px solid rgba(0,0,0,0.12); }
        .mermaid-titlebar:hover .dot-red    { filter: brightness(0.88); }
        .mermaid-titlebar:hover .dot-yellow { filter: brightness(0.88); }
        .mermaid-titlebar:hover .dot-green  { filter: brightness(0.88); }

        /* Center label */
        .mermaid-label {
          flex: 1;
          text-align: center;
          font-size: 12px;
          font-family: -apple-system, "SF Pro Text", "Helvetica Neue", sans-serif;
          font-weight: 500;
          color: rgba(0,0,0,0.45);
          letter-spacing: 0.01em;
          -webkit-font-smoothing: antialiased;
          pointer-events: none;
        }

        /* Control buttons — right side */
        .mermaid-controls {
          display: flex;
          align-items: center;
          gap: 2px;
          flex-shrink: 0;
        }
        .mermaid-controls button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 26px;
          height: 22px;
          border: 1px solid rgba(0,0,0,0.13);
          border-radius: 5px;
          background: rgba(255,255,255,0.7);
          color: rgba(0,0,0,0.5);
          cursor: pointer;
          transition: background 0.12s, color 0.12s, border-color 0.12s;
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
          outline: none;
        }
        .mermaid-controls button:hover {
          background: rgba(255,255,255,0.95);
          color: rgba(0,0,0,0.8);
          border-color: rgba(0,0,0,0.2);
        }
        .mermaid-controls button:active {
          background: rgba(0,0,0,0.06);
          transform: scale(0.94);
        }

        /* Diagram canvas */
        .mermaid-container {
          position: relative;
          width: 100%;
          overflow: hidden;
          background: #fafafa;
          /* Subtle dot-grid pattern like Keynote canvas */
          background-image: radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .mermaid-container .mermaid {
          display: block;
          margin: 0 !important;
          padding: 0 !important;
          line-height: 0;
          width: 100%;
          height: 100%;
        }
        .mermaid-container svg {
          display: block !important;
          width: 100% !important;
          height: 100% !important;
          max-width: unset !important;
          max-height: unset !important;
        }
      `}</style>

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
    </>
  );
}