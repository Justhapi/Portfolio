/* Doodles drawn on a note: strokes of points, scaled so the pad is 1000
   units wide (height follows its shape). They travel as a short text code
   in the link emailed with the note, which /doodle turns back into the
   drawing — no image upload needed. */

export type Pt = [number, number];
export type Doodle = { h: number; strokes: Pt[][] };

export const DOODLE_W = 1000;
export const DOODLE_MAX_POINTS = 1500; // keeps the link a sensible length

const B = 36, MAXV = B * B - 1; // two base-36 digits per number (0–1295)
const enc = (n: number) => Math.max(0, Math.min(MAXV, Math.round(n))).toString(B).padStart(2, "0");

/** "h~xxyyxxyy.xxyy…" — strokes split by ".", 4 characters per point. */
export function encodeDoodle(d: Doodle): string {
  return `${enc(d.h)}~` + d.strokes.map((s) => s.map(([x, y]) => enc(x) + enc(y)).join("")).join(".");
}

export function decodeDoodle(code: string): Doodle | null {
  const m = /^([0-9a-z]{2})~([0-9a-z.]*)$/.exec(code);
  if (!m) return null;
  const h = parseInt(m[1], B);
  const strokes = m[2].split(".").filter(Boolean).map((s) => {
    const pts: Pt[] = [];
    for (let i = 0; i + 3 < s.length; i += 4) pts.push([parseInt(s.slice(i, i + 2), B), parseInt(s.slice(i + 2, i + 4), B)]);
    return pts;
  });
  return h > 0 && strokes.length ? { h, strokes } : null;
}

/** A smooth path through the points (midpoint quadratic curves). */
export function strokePath(pts: Pt[]): string {
  if (!pts.length) return "";
  if (pts.length === 1) return `M${pts[0][0]} ${pts[0][1]}l0.1 0`; // a dot
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const mx = (pts[i][0] + pts[i + 1][0]) / 2, my = (pts[i][1] + pts[i + 1][1]) / 2;
    d += `Q${pts[i][0]} ${pts[i][1]} ${mx.toFixed(1)} ${my.toFixed(1)}`;
  }
  const last = pts[pts.length - 1];
  return d + `L${last[0]} ${last[1]}`;
}
