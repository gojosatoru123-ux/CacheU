import { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { MindNode, MindmapData } from '../lib/mindmap';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';

// ─── Constants ───────────────────────────────────────────────────────────────
const EDGE_GAP = [70, 55, 44, 36]; // gap between parent edge and child edge per depth
const NODE_H = [44, 34, 28, 24]; // node height by depth
const V_GAP = 13; // vertical gap between siblings
const ROOT_EXTRA = 20; // extra padding on root width

const BRANCH_COLORS = [
  { bg: '#7c3aed', light: '#ede9fe', text: '#5b21b6', border: '#c4b5fd' }, // violet
  { bg: '#0d9488', light: '#ccfbf1', text: '#0f766e', border: '#99f6e4' }, // teal
  { bg: '#0284c7', light: '#e0f2fe', text: '#0369a1', border: '#7dd3fc' }, // sky
  { bg: '#d97706', light: '#fef3c7', text: '#b45309', border: '#fcd34d' }, // amber
  { bg: '#e11d48', light: '#ffe4e6', text: '#be123c', border: '#fca5a5' }, // rose
  { bg: '#059669', light: '#d1fae5', text: '#047857', border: '#6ee7b7' }, // emerald
  { bg: '#4f46e5', light: '#e0e7ff', text: '#4338ca', border: '#a5b4fc' }, // indigo
  { bg: '#c2410c', light: '#ffedd5', text: '#9a3412', border: '#fdba74' }, // orange
];

// ─── Types ───────────────────────────────────────────────────────────────────
interface LayoutNode {
  id: string;
  text: string;
  depth: number;
  // Computed position (center)
  x: number;
  y: number;
  w: number;
  h: number;
  // Visual
  side: 'center' | 'left' | 'right';
  colorIdx: number;
  // Tree
  parentId: string | null;
  hasChildren: boolean;
  isCollapsed: boolean;
  // Animation helpers
  visible: boolean; // false = animate to animX,animY
  animX: number; // where to go when hidden
  animY: number;
}

// ─── Text measurement ────────────────────────────────────────────────────────
function measureText(text: string, depth: number): number {
  const charW = depth === 0 ? 10 : depth === 1 ? 8.5 : 7.5;
  const padH = depth === 0 ? 28 : depth === 1 ? 22 : 18;
  const max = depth === 0 ? 220 : depth === 1 ? 180 : 160;
  return Math.min(max, Math.max(70, Math.ceil(text.length * charW) + padH));
}

// ─── Subtree allocated height (ignores collapse for full-layout pass) ────────
function allocH(node: MindNode): number {
  const h = NODE_H[Math.min(node.depth, NODE_H.length - 1)];
  if (!node.children.length) return h + V_GAP;
  const childrenH = node.children.reduce((s, c) => s + allocH(c), 0);
  return Math.max(h + V_GAP, childrenH);
}

// ─── Full layout computation ─────────────────────────────────────────────────
function computeLayout(root: MindNode, collapsed: Set<string>): LayoutNode[] {
  const result: LayoutNode[] = [];

  const rootW = measureText(root.text, 0) + ROOT_EXTRA;
  const rootH = NODE_H[0];

  result.push({
    id: root.id, text: root.text, depth: 0,
    x: 0, y: 0, w: rootW, h: rootH,
    side: 'center', colorIdx: -1,
    parentId: null,
    hasChildren: root.children.length > 0,
    isCollapsed: collapsed.has(root.id),
    visible: true, animX: 0, animY: 0,
  });

  if (!root.children.length) return result;

  const n = root.children.length;
  const rightBranches = root.children.slice(0, Math.ceil(n / 2));
  const leftBranches = root.children.slice(Math.ceil(n / 2));

  function placeSubtree(
    node: MindNode,
    side: 'left' | 'right',
    parentId: string,
    parentX: number,
    parentY: number,
    parentW: number,
    topY: number,    // top of allocated vertical space for this subtree
    totalAllocH: number,
    colorIdx: number,
  ): void {
    const depth = node.depth;
    const nH = NODE_H[Math.min(depth - 1, NODE_H.length - 1)];
    const nW = measureText(node.text, depth);
    const dir = side === 'right' ? 1 : -1;
    const gap = EDGE_GAP[Math.min(depth - 1, EDGE_GAP.length - 1)];

    const nx = parentX + dir * (parentW / 2 + gap + nW / 2);
    const ny = topY + totalAllocH / 2 - nH / 2;

    result.push({
      id: node.id, text: node.text, depth,
      x: nx, y: ny, w: nW, h: nH,
      side, colorIdx,
      parentId,
      hasChildren: node.children.length > 0,
      isCollapsed: collapsed.has(node.id),
      visible: true, // pass 2 will fix this
      animX: parentX, animY: parentY,
    });

    if (!node.children.length) return;

    const childrenTotalH = node.children.reduce((s, c) => s + allocH(c), 0);
    let childY = ny + nH / 2 - childrenTotalH / 2;

    for (const child of node.children) {
      const childAlloc = allocH(child);
      placeSubtree(child, side, node.id, nx, ny, nW, childY, childAlloc, colorIdx);
      childY += childAlloc;
    }
  }

  // Place right branches
  const rightTotalH = rightBranches.reduce((s, b) => s + allocH(b), 0);
  let ry = -rightTotalH / 2;
  rightBranches.forEach((branch, i) => {
    const bAlloc = allocH(branch);
    placeSubtree(branch, 'right', root.id, 0, 0, rootW, ry, bAlloc, i % BRANCH_COLORS.length);
    ry += bAlloc;
  });

  // Place left branches
  const leftTotalH = leftBranches.reduce((s, b) => s + allocH(b), 0);
  let ly = -leftTotalH / 2;
  leftBranches.forEach((branch, i) => {
    const bAlloc = allocH(branch);
    placeSubtree(branch, 'left', root.id, 0, 0, rootW, ly, bAlloc, (Math.ceil(n / 2) + i) % BRANCH_COLORS.length);
    ly += bAlloc;
  });

  // ── Pass 2: propagate collapse state (BFS top-down) ─────────────────────

  const queue: Array<{ id: string; hiddenX: number; hiddenY: number }> = [];

  // Seed collapsed nodes
  for (const node of result) {
    if (node.visible && node.isCollapsed) {
      queue.push({ id: node.id, hiddenX: node.x, hiddenY: node.y });
    }
  }

  while (queue.length) {
    const { id, hiddenX, hiddenY } = queue.shift()!;
    for (const child of result) {
      if (child.parentId === id && child.visible) {
        child.visible = false;
        child.animX = hiddenX;
        child.animY = hiddenY;
        // Propagate further (child may itself have children)
        queue.push({ id: child.id, hiddenX, hiddenY });
      }
    }
  }

  return result;
}

// ─── Bezier path between two nodes ──────────────────────────────────────────
function bezierPath(
  px: number, py: number, pw: number,
  cx: number, cy: number, cw: number,
  side: 'left' | 'right' | 'center',
  childSide: 'left' | 'right',
): string {
  let x1: number, x2: number;
  if (side === 'center') {
    x1 = childSide === 'right' ? px + pw / 2 : px - pw / 2;
    x2 = childSide === 'right' ? cx - cw / 2 : cx + cw / 2;
  } else if (side === 'right') {
    x1 = px + pw / 2;
    x2 = cx - cw / 2;
  } else {
    x1 = px - pw / 2;
    x2 = cx + cw / 2;
  }
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${py} C ${mx} ${py} ${mx} ${cy} ${x2} ${cy}`;
}

// ─── Component ───────────────────────────────────────────────────────────────
interface MindMapProps {
  data: MindmapData;
}

export function MindMap({ data }: MindMapProps) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dragStart = useRef({ x: 0, y: 0, panX: 0, panY: 0 });
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Animate in on mount
  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, [data]);

  const layout = useMemo(
    () => computeLayout(data.root, collapsed),
    [data.root, collapsed],
  );

  const byId = useMemo(() => new Map(layout.map((n) => [n.id, n])), [layout]);

  // Compute bounding box for fit-to-screen
  const bbox = useMemo(() => {
    const visible = layout.filter((n) => n.visible);
    if (!visible.length) return { minX: -200, maxX: 200, minY: -100, maxY: 100 };
    return {
      minX: Math.min(...visible.map((n) => n.x - n.w / 2)) - 40,
      maxX: Math.max(...visible.map((n) => n.x + n.w / 2)) + 40,
      minY: Math.min(...visible.map((n) => n.y - n.h / 2)) - 40,
      maxY: Math.max(...visible.map((n) => n.y + n.h / 2)) + 40,
    };
  }, [layout]);

  const fitToScreen = useCallback(() => {
    if (!containerRef.current) return;
    const { width, height } = containerRef.current.getBoundingClientRect();
    const contentW = bbox.maxX - bbox.minX;
    const contentH = bbox.maxY - bbox.minY;
    const newZoom = Math.min(1.2, Math.min(width / contentW, height / contentH) * 0.9);
    const centerX = (bbox.minX + bbox.maxX) / 2;
    const centerY = (bbox.minY + bbox.maxY) / 2;
    setZoom(newZoom);
    setPan({ x: -centerX * newZoom, y: -centerY * newZoom });
  }, [bbox]);

  useEffect(() => {
    fitToScreen();
  }, [fitToScreen]);

  const toggleCollapse = useCallback((id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Mouse / touch pan
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as Element).closest('[data-node]')) return;
    setDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, panX: pan.x, panY: pan.y };
  }, [pan]);

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    setPan({
      x: dragStart.current.panX + (e.clientX - dragStart.current.x),
      y: dragStart.current.panY + (e.clientY - dragStart.current.y),
    });
  }, [dragging]);

  const onMouseUp = useCallback(() => setDragging(false), []);

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const factor = e.deltaY < 0 ? 1.12 : 0.9;
    setZoom((z) => Math.max(0.25, Math.min(3, z * factor)));
  }, []);

  // Build connection edges
  const edges = useMemo(() => {
    return layout.flatMap((node) => {
      if (!node.parentId) return [];
      const parent = byId.get(node.parentId);
      if (!parent) return [];

      const srcX = node.visible ? node.x : node.animX;
      const srcY = node.visible ? node.y : node.animY;
      const pX = parent.visible ? parent.x : parent.animX;
      const pY = parent.visible ? parent.y : parent.animY;

      const path = bezierPath(pX, pY, parent.w, srcX, srcY, node.w, parent.side, node.side as 'left' | 'right');
      const color = node.colorIdx >= 0 ? BRANCH_COLORS[node.colorIdx].bg : '#64748b';
      const opacity = node.visible && parent.visible ? 1 : 0;
      const strokeW = node.depth <= 1 ? 2.5 : node.depth === 2 ? 2 : 1.5;

      return [{ id: `e-${node.id}`, path, color, opacity, strokeW }];
    });
  }, [layout, byId]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full select-none overflow-hidden bg-[radial-gradient(ellipse_at_center,#f8faff_0%,#f1f5f9_100%)]"
      style={{ cursor: dragging ? 'grabbing' : 'grab' }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onWheel={onWheel}
    >
      {/* Dot grid background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dots" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1" fill="#cbd5e1" opacity="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Main SVG canvas */}
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        style={{ cursor: 'inherit' }}
      >
        <g
          transform={`translate(${(containerRef.current?.clientWidth ?? 800) / 2 + pan.x}, ${(containerRef.current?.clientHeight ?? 600) / 2 + pan.y}) scale(${zoom})`}
          style={{ transformOrigin: '0 0' }}
        >
          {/* ── Edges ── */}
          {edges.map((edge) => (
            <path
              key={edge.id}
              d={edge.path}
              fill="none"
              stroke={edge.color}
              strokeWidth={edge.strokeW}
              strokeOpacity={mounted ? edge.opacity : 0}
              strokeLinecap="round"
              style={{
                transition: 'stroke-opacity 0.35s ease',
              }}
            />
          ))}

          {/* ── Nodes ── */}
          {layout.map((node) => {
            const displayX = node.visible ? node.x : node.animX;
            const displayY = node.visible ? node.y : node.animY;
            const opacity = node.visible ? 1 : 0;
            const scale = node.visible ? 1 : 0.5;

            const color = node.colorIdx >= 0 ? BRANCH_COLORS[node.colorIdx] : null;
            const isRoot = node.depth === 0;
            const isCollapsed = node.isCollapsed;

            // Node visual styles
            let fill: string, stroke: string, textColor: string, fontWeight: string;
            if (isRoot) {
              fill = '#0f172a'; stroke = '#1e293b'; textColor = '#ffffff'; fontWeight = '800';
            } else if (node.depth === 1) {
              fill = color!.bg; stroke = color!.bg; textColor = '#ffffff'; fontWeight = '700';
            } else if (node.depth === 2) {
              fill = color!.light; stroke = color!.border; textColor = color!.text; fontWeight = '600';
            } else {
              fill = '#ffffff'; stroke = '#e2e8f0'; textColor = '#475569'; fontWeight = '500';
            }

            const rx = node.depth === 0 ? 14 : node.depth === 1 ? 10 : 8;
            const fontSize = node.depth === 0 ? 15 : node.depth === 1 ? 13 : node.depth === 2 ? 12 : 11;

            return (
              <g
                key={node.id}
                data-node="true"
                style={{
                  transform: `translate(${displayX}px, ${displayY}px) scale(${mounted ? scale : 0})`,
                  opacity: mounted ? opacity : 0,
                  transition: 'transform 0.38s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.28s ease',
                  transformOrigin: `${displayX}px ${displayY}px`,
                  cursor: node.hasChildren ? 'pointer' : 'default',
                  willChange: 'transform',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (node.hasChildren) toggleCollapse(node.id);
                }}
              >
                {/* Shadow */}
                {node.depth <= 2 && (
                  <rect
                    x={-node.w / 2 + 1}
                    y={-node.h / 2 + 3}
                    width={node.w}
                    height={node.h}
                    rx={rx}
                    fill={node.depth === 0 ? 'rgba(0,0,0,0.15)' : color ? color.bg + '30' : 'rgba(0,0,0,0.07)'}
                    opacity={0.6}
                  />
                )}

                {/* Main box */}
                <rect
                  x={-node.w / 2}
                  y={-node.h / 2}
                  width={node.w}
                  height={node.h}
                  rx={rx}
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={node.depth === 0 ? 0 : node.depth === 1 ? 0 : 1.5}
                />

                {/* Depth 3+: left accent line */}
                {node.depth >= 3 && color && (
                  <rect
                    x={-node.w / 2}
                    y={-node.h / 2 + 4}
                    width={3}
                    height={node.h - 8}
                    rx={1.5}
                    fill={color.bg}
                  />
                )}

                {/* Text */}
                <text
                  x={node.depth >= 3 ? -node.w / 2 + 10 : 0}
                  y={1}
                  textAnchor={node.depth >= 3 ? 'start' : 'middle'}
                  dominantBaseline="central"
                  fill={textColor}
                  fontSize={fontSize}
                  fontWeight={fontWeight}
                  fontFamily="Inter, system-ui, sans-serif"
                  style={{ userSelect: 'none', pointerEvents: 'none' }}
                >
                  {node.text.length > (node.depth === 0 ? 24 : node.depth <= 1 ? 20 : 18)
                    ? node.text.slice(0, node.depth === 0 ? 22 : node.depth <= 1 ? 18 : 16) + '…'
                    : node.text}
                </text>

                {/* Collapse toggle button */}
                {node.hasChildren && node.visible && (
                  <g
                    transform={`translate(${node.side === 'left' ? -node.w / 2 - 12 : node.w / 2 + 12}, 0)`}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCollapse(node.id);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <circle r={9} fill="white" stroke={color ? color.border : '#cbd5e1'} strokeWidth={1.5} />
                    <line
                      x1={-5} y1={0} x2={5} y2={0}
                      stroke={color ? color.bg : '#64748b'}
                      strokeWidth={2}
                      strokeLinecap="round"
                    />
                    {isCollapsed && (
                      <line
                        x1={0} y1={-5} x2={0} y2={5}
                        stroke={color ? color.bg : '#64748b'}
                        strokeWidth={2}
                        strokeLinecap="round"
                      />
                    )}
                    {isCollapsed && node.hasChildren && (
                      <text
                        x={node.side === 'left' ? -22 : 22}
                        y={1}
                        textAnchor={node.side === 'left' ? 'end' : 'start'}
                        dominantBaseline="central"
                        fill={color ? color.text : '#64748b'}
                        fontSize={9}
                        fontWeight="600"
                        style={{ pointerEvents: 'none' }}
                      >
                        {data.root.children.find(findNode(node.id)) ? '' : ''}
                      </text>
                    )}
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* ── Controls ── */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setZoom((z) => Math.min(3, z * 1.2))}
          className="w-9 h-9 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom((z) => Math.max(0.25, z * 0.85))}
          className="w-9 h-9 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={fitToScreen}
          className="w-9 h-9 bg-white border border-slate-200 rounded-xl shadow-sm flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          title="Fit to screen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* ── Zoom level indicator ── */}
      <div className="absolute bottom-4 left-4 text-xs text-slate-400 bg-white/80 backdrop-blur-sm border border-slate-100 px-2.5 py-1 rounded-lg font-mono">
        {Math.round(zoom * 100)}%
      </div>

      {/* ── Hint ── */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 text-xs text-slate-400 bg-white/90 backdrop-blur-sm border border-slate-100 px-3 py-1 rounded-full pointer-events-none">
        Click nodes to expand · Drag to pan · Scroll to zoom
      </div>
    </div>
  );
}

// Helper: deep search to find node by id
function findNode(targetId: string) {
  return function check(node: MindNode): boolean {
    if (node.id === targetId) return true;
    return node.children.some(check);
  };
}
