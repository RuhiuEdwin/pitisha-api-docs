/** Geometry for Sparkline. */
export interface SparkGeometry { line: string; area: string; min: number; max: number; last: { x: number; y: number } | null }

export function sparkGeometry(values: readonly number[], width: number, height: number, pad = 2): SparkGeometry {
  const v = values.filter((n) => Number.isFinite(n));
  if (!v.length) return { line: "", area: "", min: 0, max: 0, last: null };
  const min = Math.min(...v);
  const max = Math.max(...v);
  const span = max - min || 1;
  const w = width - pad * 2;
  const h = height - pad * 2;
  const pts = v.map((n, i) => ({
    x: pad + (v.length === 1 ? w / 2 : (i / (v.length - 1)) * w),
    y: pad + h - ((n - min) / span) * h,
  }));
  const r = (n: number) => Math.round(n * 100) / 100;
  const line = pts.map((p, i) => `${i ? "L" : "M"}${r(p.x)} ${r(p.y)}`).join("");
  const first = pts[0]!;
  const last = pts[pts.length - 1]!;
  const area = `${line}L${r(last.x)} ${r(height - pad)}L${r(first.x)} ${r(height - pad)}Z`;
  return { line, area, min, max, last };
}
