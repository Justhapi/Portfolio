"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { COPY, POP_UP, mod, stop } from "./motion";

/* The doodles pop-up: a sticky-note pad. The top note breathes, then on a
   timer or a click it's ripped — its corner tugged up and out — springs up
   off the pad, flattens and is tossed onto the wall. */

const DOODLES = ["Lost", "Rice", "Locked"].map((n) => `${POP_UP}/doodles/${n}.webp`);

/* Where the two loose notes sit, and where the pad is (for the peel-off flight). */
const PAD = { x: 0, y: 128 };
const LOOSE = [{ x: 184, y: 0, r: 9 }, { x: 196, y: 152, r: -6 }];

/** Like the Available sticker: the note pops forward toward the middle of
 *  the pop-up, squared up and lifted, holds so you can look, then slams
 *  back into place. */
function popForward(el: HTMLElement, baseRotate: number) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (el.getAnimations().some((a) => !(a instanceof CSSAnimation) && a.playState === "running")) return;
  const box = el.parentElement!.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  const dx = (box.left + box.width / 2 - (r.left + r.width / 2)) * 0.45;
  const dy = (box.top + box.height / 2 - (r.top + r.height / 2)) * 0.45;
  const at = (k: number, up = 0) => `${dx * k}px ${dy * k - up}px`;
  const lifted = "drop-shadow(0 18px 14px rgba(26,23,20,0.35))";
  const flat = "drop-shadow(0 0 0 rgba(0,0,0,0))";
  const INOUT = "cubic-bezier(0.45, 0, 0.55, 1)";
  el.style.zIndex = "30";
  el.animate(
    [
      { translate: "0 0", rotate: `${baseRotate}deg`, scale: "1", filter: flat, easing: "cubic-bezier(0.1, 0.9, 0.2, 1)" },
      { translate: at(1.05, 10), rotate: `${-baseRotate * 0.2}deg`, scale: "1.62", filter: lifted, offset: 0.08, easing: INOUT },
      { translate: at(1, 8), rotate: "0deg", scale: "1.55", filter: lifted, offset: 0.16 },
      { translate: at(1, 8), rotate: "0deg", scale: "1.55", filter: lifted, offset: 0.76, easing: "cubic-bezier(0.7, 0, 0.9, 0.3)" },
      { translate: "0 0", rotate: `${baseRotate}deg`, scale: "1.08 0.88", filter: "drop-shadow(0 1px 1px rgba(26,23,20,0.3))", offset: 0.82, easing: "cubic-bezier(0.25, 1, 0.5, 1)" },
      { translate: "0 0", rotate: `${baseRotate}deg`, scale: "0.96 1.04", filter: flat, offset: 0.89, easing: INOUT },
      { translate: "0 0", rotate: `${baseRotate}deg`, scale: "1", filter: flat },
    ],
    { duration: 2200, easing: "linear" },
  ).finished.finally(() => { el.style.zIndex = ""; });
}


const SHEET = { w: 176, h: 158 };
const LOOSE_SIZE = { w: 140, h: 130 };
const SETTLE_MS = 700; // the next sheet eases into the breathing loop
const TEAR_TOTAL = 1200; // the whole tear, from first tug to landing on the wall, as one movement
/* The pull: the bottom-right corner is dragged out to the right and up, and
   the paper stretches after it — the bottom and right edges curve into a
   point, while the glued top edge stays put. */
const PULL_X = 0.62; // at full pull, the corner travels this much of the sheet's width to the right…
const PULL_Y = -0.6; // …and this much of its height up
const GRID_X = 12, GRID_Y = 10;
/** How much of the corner's pull a point (u, v) of the sheet follows. Sideways,
 *  the whole bottom edge is dragged right (the left corner too, less so); up,
 *  only the right side lifts. Nothing on the glued top edge moves. */
const followX = (u: number, v: number) => Math.pow(v, 1.4) * (0.4 + 0.6 * Math.pow(u, 1.6));
const followY = (u: number, v: number) => Math.pow(u, 1.8) * Math.pow(v, 1.4);
/* The flip: at the climax the page swings up over its glued top edge, like
   a wall-calendar page turned to the next month. The top edge is the hinge
   and never moves; how the rest of the page travels is what differs. */
type FlipMode = "calendar" | "roll" | "corner";
const FLIP_MAX = (118 * Math.PI) / 180; // fully flipped: up past vertical, its back toward you
const PERSP = 520;                       // camera distance for the flip, px
const clamp01 = (x: number) => Math.min(1, Math.max(0, x));


const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);


/** Draws the sheet onto the canvas as a 3D mesh: the dragged-corner pull in
 *  the page's plane, then the flip up over the top-edge hinge, projected in
 *  perspective. Each triangle is texture-mapped from the front (or, once it
 *  has turned past edge-on, the back) of the sheet, shaded by how squarely it
 *  faces you — the shading is baked into the textures per cell, so it has no seams. */
const work = { front: null as HTMLCanvasElement | null, back: null as HTMLCanvasElement | null };
type PagePose = { cx: number; cy: number; rot: number; w: number; h: number };
/** Where the canvas sits in the pad's own frame: room left, and lots above (the flip, and the flight to the top-right note). */
const CV = { l: 40, t: 270, w: 470, h: 270 + 158 + 40 };
function drawWarp(cv: HTMLCanvasElement, tex: { c: HTMLCanvasElement; back: HTMLCanvasElement }, p: number, f: number, mode: FlipMode, pose: PagePose) {
  const ctx = cv.getContext("2d");
  if (!ctx) return;
  const T = tex.c, dpr = cv.width / CV.w;
  const W = pose.w, H = pose.h;
  const tx = PULL_X * W * p, ty = PULL_Y * H * p;
  // 1 · positions in 3D (x right, y down the page, z toward you)
  const X: number[][] = [], Y: number[][] = [], Z: number[][] = [];
  for (let j = 0; j <= GRID_Y; j++) { X.push([]); Y.push([]); Z.push([]); }
  for (let i = 0; i <= GRID_X; i++) {
    const u = i / GRID_X;
    let y = 0, z = 0, prevD = 0;
    for (let j = 0; j <= GRID_Y; j++) {
      const v = j / GRID_Y;
      const x0 = u * W + tx * followX(u, v), d = v * H + ty * followY(u, v); // distance down from the hinge
      let th: number;
      if (mode === "calendar") th = f * FLIP_MAX;                                            // stiff: the whole page swings as one
      // the dragged right side goes first and stays ahead: flipped up, the page is twisted like a sail
      else if (mode === "corner") th = FLIP_MAX * (0.72 + 0.42 * u) * easeInOut(clamp01(f * 1.6 - (1 - u) * 0.6));
      // soft: the bottom rolls up first and keeps rolling, so flipped up it's curled into a scroll at the hinge
      else th = f * FLIP_MAX * 2.1 * Math.pow(v, 1.25);
      if (mode === "roll") { y += Math.cos(th) * (d - prevD); z += Math.sin(th) * (d - prevD); prevD = d; }
      else { y = d * Math.cos(th); z = d * Math.sin(th); }
      X[j][i] = x0; Y[j][i] = y; Z[j][i] = z;
    }
  }
  // 2 · project
  const cx = W / 2, cy = H / 2;
  const PX: number[][] = [], PY: number[][] = [];
  for (let j = 0; j <= GRID_Y; j++) {
    PX.push([]); PY.push([]);
    for (let i = 0; i <= GRID_X; i++) {
      const k = PERSP / Math.max(60, PERSP - Z[j][i]);
      PX[j][i] = cx + (X[j][i] - cx) * k; PY[j][i] = cy + (Y[j][i] - cy) * k;
    }
  }
  let backShade = 0;
  // 3 · shade the front and back textures per cell, by the cell's facing (light from above and in front)
  for (const side of ["front", "back"] as const) {
    let w = work[side];
    if (!w || w.width !== T.width || w.height !== T.height) { w = document.createElement("canvas"); w.width = T.width; w.height = T.height; work[side] = w; }
    const g = w.getContext("2d")!;
    g.globalCompositeOperation = "copy";
    g.drawImage(side === "front" ? T : tex.back, 0, 0);
    g.globalCompositeOperation = "source-over";
    if (f > 0.002 || p > 0.002) {
      // one smooth gradient down the page (no per-cell steps, so no banding lines)
      const grad = g.createLinearGradient(0, 0, 0, w.height);
      for (let j = 0; j < GRID_Y; j++) {
        let sum = 0;
        for (let i = 0; i < GRID_X; i++) {
          const ax = X[j][i + 1] - X[j][i], ay = Y[j][i + 1] - Y[j][i], az = Z[j][i + 1] - Z[j][i];
          const bx = X[j + 1][i] - X[j][i], by = Y[j + 1][i] - Y[j][i], bz = Z[j + 1][i] - Z[j][i];
          let ny = az * bx - ax * bz, nz = ax * by - ay * bx;
          const l = Math.hypot(ay * bz - az * by, ny, nz) || 1; ny /= l; nz /= l;
          if (side === "back") { ny = -ny; nz = -nz; }
          sum += clamp01(0.75 * Math.abs(nz) - 0.45 * ny);
        }
        const lit = sum / GRID_X;
        // the back is a lighter version of the front's shade
        const a = (side === "back" ? 0.1 : 0.2) * (1 - lit) * Math.min(1, f * 3 + p * 0.5);
        if (side === "back") backShade += a / GRID_Y;
        grad.addColorStop((j + 0.5) / GRID_Y, `rgba(26, 23, 20, ${a.toFixed(3)})`);
      }
      g.fillStyle = grad;
      g.fillRect(0, 0, w.width, w.height);
    }
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, CV.w, CV.h);
  ctx.translate(CV.l + pose.cx, CV.t + pose.cy);
  ctx.rotate(pose.rot);
  ctx.translate(-W / 2, -H / 2);
  // 4 · its shadow on the pad, fading as it flips away
  const outline = () => {
    ctx.beginPath();
    for (let i = 0; i <= GRID_X; i++) ctx[i ? "lineTo" : "moveTo"](PX[0][i], PY[0][i]);
    for (let j = 1; j <= GRID_Y; j++) ctx.lineTo(PX[j][GRID_X], PY[j][GRID_X]);
    for (let i = GRID_X - 1; i >= 0; i--) ctx.lineTo(PX[GRID_Y][i], PY[GRID_Y][i]);
    for (let j = GRID_Y - 1; j > 0; j--) ctx.lineTo(PX[j][0], PY[j][0]);
    ctx.closePath();
  };
  if (f < 0.35) {
    const k = 1 - f / 0.35;
    ctx.save(); outline();
    ctx.shadowColor = `rgba(26, 23, 20, ${((0.16 + 0.14 * p) * k).toFixed(3)})`;
    ctx.shadowBlur = 3 + 12 * p; ctx.shadowOffsetY = 1 + 6 * p;
    ctx.fillStyle = "rgba(255,255,255,0.01)"; ctx.fill(); ctx.restore();
  }
  // 5 · triangles, far ones first
  type Tri = { a: [number, number]; b: [number, number]; c: [number, number]; su: number[]; sv: number[]; z: number };
  const tris: Tri[] = [];
  const cw = T.width / GRID_X, ch = T.height / GRID_Y;
  for (let j = 0; j < GRID_Y; j++) for (let i = 0; i < GRID_X; i++) {
    const A: [number, number] = [PX[j][i], PY[j][i]], B: [number, number] = [PX[j][i + 1], PY[j][i + 1]];
    const C: [number, number] = [PX[j + 1][i + 1], PY[j + 1][i + 1]], E: [number, number] = [PX[j + 1][i], PY[j + 1][i]];
    const u0 = i * cw, u1 = (i + 1) * cw, v0 = j * ch, v1 = (j + 1) * ch;
    tris.push({ a: A, b: B, c: C, su: [u0, u1, u1], sv: [v0, v0, v1], z: (Z[j][i] + Z[j][i + 1] + Z[j + 1][i + 1]) / 3 });
    tris.push({ a: A, b: C, c: E, su: [u0, u1, u0], sv: [v0, v1, v1], z: (Z[j][i] + Z[j + 1][i + 1] + Z[j + 1][i]) / 3 });
  }
  if (f > 0.002) tris.sort((m, q) => m.z - q.z);
  // the back is one even colour, so back-facing pieces are filled together as a single shape: no seams between them
  const k = clamp01(backShade);
  const backFill = `rgb(${Math.round(247 * (1 - k) + 26 * k)}, ${Math.round(244 * (1 - k) + 23 * k)}, ${Math.round(238 * (1 - k) + 20 * k)})`;
  let backOpen = false;
  const flushBack = () => { if (backOpen) { ctx.fillStyle = backFill; ctx.fill(); backOpen = false; } };
  for (const t of tris) {
    const [x0, y0] = t.a, [x1, y1] = t.b, [x2, y2] = t.c;
    const [u0, u1, u2] = t.su, [v0, v1, v2] = t.sv;
    const d = u0 * (v1 - v2) + u1 * (v2 - v0) + u2 * (v0 - v1);
    if (!d) continue;
    const cross = (x1 - x0) * (y2 - y0) - (y1 - y0) * (x2 - x0);
    if (Math.abs(cross) < 0.01) continue; // edge-on
    if (cross < 0) {
      if (!backOpen) { ctx.beginPath(); backOpen = true; }
      ctx.moveTo(x0, y0); ctx.lineTo(x1, y1); ctx.lineTo(x2, y2); ctx.closePath();
      continue;
    }
    flushBack();
    const img = work.front!;
    const gx = (x0 + x1 + x2) / 3, gy = (y0 + y1 + y2) / 3;
    const grow = (x: number, y: number) => { const dx = x - gx, dy = y - gy, l = Math.hypot(dx, dy) || 1; return [x + (dx / l) * 1.1, y + (dy / l) * 1.1]; };
    ctx.save();
    ctx.beginPath();
    const g0 = grow(x0, y0), g1 = grow(x1, y1), g2 = grow(x2, y2);
    ctx.moveTo(g0[0], g0[1]); ctx.lineTo(g1[0], g1[1]); ctx.lineTo(g2[0], g2[1]); ctx.closePath();
    ctx.clip();
    ctx.transform(
      (x0 * (v1 - v2) + x1 * (v2 - v0) + x2 * (v0 - v1)) / d,
      (y0 * (v1 - v2) + y1 * (v2 - v0) + y2 * (v0 - v1)) / d,
      (x0 * (u2 - u1) + x1 * (u0 - u2) + x2 * (u1 - u0)) / d,
      (y0 * (u2 - u1) + y1 * (u0 - u2) + y2 * (u1 - u0)) / d,
      (x0 * (u1 * v2 - u2 * v1) + x1 * (u2 * v0 - u0 * v2) + x2 * (u0 * v1 - u1 * v0)) / d,
      (y0 * (u1 * v2 - u2 * v1) + y1 * (u2 * v0 - u0 * v2) + y2 * (u0 * v1 - u1 * v0)) / d,
    );
    const sx = Math.max(0, Math.min(u0, u1, u2) - 2), sy = Math.max(0, Math.min(v0, v1, v2) - 2);
    const sw = Math.min(T.width, Math.max(u0, u1, u2) + 2) - sx, sh = Math.min(T.height, Math.max(v0, v1, v2) + 2) - sy;
    ctx.drawImage(img, sx, sy, sw, sh, sx, sy, sw, sh);
    ctx.restore();
  }
  flushBack();
}

/** The flat sheet — white paper, 12px margin, the doodle contained — drawn
 *  once into a texture the warp samples from. */
function sheetTexture(img: HTMLImageElement, dpr: number) {
  const c = document.createElement("canvas");
  c.width = Math.round(SHEET.w * dpr); c.height = Math.round(SHEET.h * dpr);
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
  const pad = 12 * dpr, bw = c.width - 2 * pad, bh = c.height - 2 * pad;
  const k = Math.min(bw / img.naturalWidth, bh / img.naturalHeight);
  const w = img.naturalWidth * k, h = img.naturalHeight * k;
  ctx.drawImage(img, pad + (bw - w) / 2, pad + (bh - h) / 2, w, h);
  return c;
}
/** The same doodle laid out as a loose note on the wall (140×130, 7px margin),
 *  so the flier lands looking exactly like the note that takes over from it. */
function looseTexture(img: HTMLImageElement, dpr: number) {
  const c = document.createElement("canvas");
  c.width = Math.round(LOOSE_SIZE.w * dpr); c.height = Math.round(LOOSE_SIZE.h * dpr);
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
  const pad = 7 * dpr, bw = c.width - 2 * pad, bh = c.height - 2 * pad;
  const k = Math.min(bw / img.naturalWidth, bh / img.naturalHeight);
  const w = img.naturalWidth * k, h = img.naturalHeight * k;
  ctx.drawImage(img, pad + (bw - w) / 2, pad + (bh - h) / 2, w, h);
  return c;
}
/** The back of the sheet: paper, with the doodle faintly showing through. */
function backTexture(front: HTMLCanvasElement) {
  const c = document.createElement("canvas");
  c.width = front.width; c.height = front.height;
  const ctx = c.getContext("2d")!;
  ctx.fillStyle = "#F7F4EE"; // plain paper: the back is just a lighter shade of the page, no lines
  ctx.fillRect(0, 0, c.width, c.height);
  return c;
}

/* One continuous motion, all driven frame by frame from the same clock:
   the sheet breathes on the pad → a pull builds from wherever it currently
   is → it tears off and the SAME frame a real loose note takes over at the
   sheet's exact spot → it flies to its place on the wall and lands at
   rest, so nothing nudges over afterwards. No CSS transitions or class
   swaps in the middle, so nothing can stall between steps. */
export function BagDoodles({ bump }: { bump: number }) {
  // the page rolls up from the bottom over its glued top edge (picked from the note-flip prototype)
  const modeRef = useRef<FlipMode>("roll");
  const [n, setN] = useState(0);
  const [falling, setFalling] = useState<{ src: string; id: number } | null>(null);
  const pad = useRef<HTMLSpanElement>(null);
  const sheet = useRef<HTMLSpanElement>(null);
  const leaf = useRef<HTMLSpanElement>(null);
  const shade = useRef<HTMLSpanElement>(null);
  const sheen = useRef<HTMLSpanElement>(null);
  const underShade = useRef<HTMLSpanElement>(null);
  const warp = useRef<HTMLCanvasElement | null>(null);
  const tex = useRef<{ src: string; img: HTMLImageElement; c: HTMLCanvasElement; back: HTMLCanvasElement; loose: { c: HTMLCanvasElement; back: HTMLCanvasElement } } | null>(null);
  const arriving = useRef<HTMLSpanElement | null>(null);
  const marks = useRef<(HTMLSpanElement | null)[]>([]);
  const st = useRef({
    lift: 18, pull: 0 as number, pullFrom: 0, settle: 0 as number, busy: false,
    fly: 0 as number, // 1 once the page has torn free and is flying to the wall
    flyTex: null as { c: HTMLCanvasElement; back: HTMLCanvasElement } | null,
  });
  const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const peelNow = () => {
    const s = st.current;
    if (s.busy || s.fly) return;
    if (reduce()) { setN((x) => x + 1); return; }
    s.busy = true;
    // the bottom note lets go first, making room before anything else moves
    setFalling({ src: DOODLES[mod(n - 1, 3)], id: n });
    s.pullFrom = s.lift; // start from wherever the sheet is right now
    s.pull = performance.now();
  };

  /** The pad's own frame on screen, from two markers inside it: origin and x-axis. */
  const padFrame = () => {
    const [a, b] = marks.current;
    if (!a || !b) return null;
    const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
    const ox = ra.left, oy = ra.top, ux = (rb.left - ox) / 100, uy = (rb.top - oy) / 100;
    return { ox, oy, ux, uy, ang: Math.atan2(uy, ux), k: Math.hypot(ux, uy) };
  };
  /** Where the arriving note sits at rest, in the pad's frame (centre, tilt). */
  const restPose = (): PagePose | null => {
    const el = arriving.current, fr = padFrame();
    if (!el || !fr) return null;
    const r = el.getBoundingClientRect();
    const sx = r.left + r.width / 2 - fr.ox, sy = r.top + r.height / 2 - fr.oy;
    const k2 = fr.k * fr.k;
    const lx = (sx * fr.ux + sy * fr.uy) / k2, ly = (-sx * fr.uy + sy * fr.ux) / k2;
    return { cx: lx, cy: ly, rot: (LOOSE[0].r * Math.PI) / 180 - fr.ang, w: LOOSE_SIZE.w, h: LOOSE_SIZE.h };
  };

  /* The whole tear is one movement on one clock:
       tug   - the bottom corner is dragged out, and the page starts to flip up over its hinge
       tear  - right at the top of the flip it comes free, without stopping
       fly   - it keeps going: travels up and over to its top-right spot,
               turning back down to face you on the way, and lands flat */
  useEffect(() => {
    if (reduce()) return;
    let raf = 0;
    /* One clock for the whole thing, x = 0 → 1 over TEAR_TOTAL. The curves
       overlap so something is always moving — nothing eases to a stop and
       starts again at the tear:
         tug   0    – 0.7   the corner is dragged out and lets go again (in-out, peaks at 0.35)
         flip  0.15 – 0.95  up over the hinge and back down (peaks at 0.55, just AFTER the tear)
         tear  0.46         the hinge lets go — the page is already mid-flip and keeps flipping
         fly   0.46 – 1     it leaves the pad already moving and eases onto its spot */
    const TEAR_AT = 0.46;
    const wave = (x: number, from: number, to: number) => { const u = clamp01((x - from) / (to - from)); return (1 - Math.cos(2 * Math.PI * u)) / 2; };
    const loop = () => {
      const now = performance.now();
      const s = st.current;
      const breathe = 18 + 12 * Math.sin((now / 3800) * Math.PI * 2);
      let lift = breathe, fold = 0;
      let pose: PagePose = { cx: SHEET.w / 2, cy: SHEET.h / 2, rot: 0, w: SHEET.w, h: SHEET.h };
      let draw: { c: HTMLCanvasElement; back: HTMLCanvasElement } | null = null;
      if (s.pull) {
        const x = clamp01((now - s.pull) / TEAR_TOTAL);
        lift = s.pullFrom + (100 - s.pullFrom) * wave(x, 0, 0.7);
        if (x > 0.35) lift = 100 * wave(x, 0, 0.7); // lets go fully, whatever it started from
        fold = wave(x, 0.15, 0.95);
        if (!s.fly && x >= TEAR_AT) {
          // the tear: the flier is laid out as the loose note it'll become (prepared in advance, so no hitch)
          s.flyTex = tex.current?.loose ?? null;
          s.fly = 1;
          setN((k) => k + 1); // the next sheet shows on the pad; the old top-right note slides down
        }
        if (s.fly) {
          const u = clamp01((x - TEAR_AT) / (1 - TEAR_AT));
          const e = 1 - Math.pow(1 - u, 2.4); // leaves already moving, eases onto its spot
          const end = restPose();
          const start = { cx: SHEET.w / 2, cy: SHEET.h / 2, rot: 0, w: SHEET.w, h: SHEET.h };
          if (end) {
            pose = {
              cx: start.cx + (end.cx - start.cx) * e,
              cy: start.cy + (end.cy - start.cy) * e - 46 * Math.sin(Math.PI * e),
              rot: start.rot + (end.rot - start.rot) * e,
              w: start.w + (end.w - start.w) * e,
              h: start.h + (end.h - start.h) * e,
            };
          }
          draw = s.flyTex;
          if (x >= 1) {
            // landed: the real note takes over at exactly this spot
            s.pull = 0; s.fly = 0; s.flyTex = null; s.busy = false;
            const el = arriving.current;
            if (el) { el.style.visibility = ""; el.classList.remove("is-arriving"); }
            s.settle = now; lift = 0; fold = 0; draw = null;
          }
        } else draw = tex.current;
      } else {
        if (s.settle) {
          const p = Math.min(1, (now - s.settle) / SETTLE_MS);
          lift = breathe * easeOut(p);
          if (p >= 1) s.settle = 0;
        }
        draw = tex.current && tex.current.src === sheet.current?.dataset.src ? tex.current : null;
      }
      s.lift = lift;
      const cv = warp.current;
      if (cv) {
        const pw = Math.pow(lift / 100, 1.15); // same curve before and after the tear, so nothing jumps
        const key = draw ? `${pw.toFixed(4)}|${fold.toFixed(4)}|${modeRef.current}|${pose.cx.toFixed(2)},${pose.cy.toFixed(2)},${pose.rot.toFixed(4)},${pose.w.toFixed(2)}` : "none";
        if (cv.dataset.p !== key) {
          if (draw) drawWarp(cv, draw, pw, fold, modeRef.current, pose);
          else cv.getContext("2d")?.clearRect(0, 0, cv.width, cv.height);
          cv.dataset.p = key;
        }
        pad.current?.classList.toggle("is-warp", !!draw && !s.fly);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPadSrc = DOODLES[mod(n + 1, 3)];
  useEffect(() => {
    if (reduce()) return;
    let live = true;
    const img = new Image();
    img.decoding = "async";
    img.src = onPadSrc;
    img.decode().then(() => {
      if (!live) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const c = sheetTexture(img, dpr);
      const lc = looseTexture(img, dpr);
      tex.current = { src: onPadSrc, img, c, back: backTexture(c), loose: { c: lc, back: backTexture(lc) } };
    }, () => {});
    return () => { live = false; };
  }, [onPadSrc]);

  // while the torn page is still flying, the real note waits, hidden, at its spot
  useLayoutEffect(() => {
    const el = arriving.current;
    if (el && st.current.fly) el.style.visibility = "hidden";
  }, [n]);

  const peelRef = useRef(peelNow);
  peelRef.current = peelNow;
  useEffect(() => {
    const id = window.setInterval(() => peelRef.current(), 5600);
    return () => window.clearInterval(id);
  }, []);
  // only a real click of the bag item peels — compare against the last value,
  // so React's double-run of effects in development can't trigger a peel on open
  const lastBump = useRef(bump);
  useEffect(() => { if (bump === lastBump.current) return; lastBump.current = bump; peelRef.current(); }, [bump]);

  const loose = [DOODLES[mod(n, 3)], DOODLES[mod(n - 1, 3)]];
  const onPad = DOODLES[mod(n + 1, 3)];
  const under = DOODLES[mod(n + 2, 3)];

  return (
    <div className="pd pd--curls pd--js" aria-hidden="true">
      {loose.map((src, k) => (k === 1 && falling?.id === n ? null :
        <span
          key={`${src}-${n - k}`}
          ref={k === 0 ? (el) => { arriving.current = el; } : undefined}
          className={`pd-loose${k === 0 && n > 0 ? " is-arriving" : ""}`}
          data-k={k}
          style={{ left: LOOSE[k].x, top: LOOSE[k].y, width: k ? 130 : 140, height: k ? 122 : 130, ["--r" as string]: `${LOOSE[k].r}deg` }}
          onClick={(e) => { stop(e); popForward(e.currentTarget, LOOSE[k].r); }}
        >
          <img src={src} alt="" draggable={false} />
        </span>
      ))}
      {falling && (
        <span
          key={`fall-${falling.id}`}
          className="pd-loose is-falling"
          data-k={1}
          style={{ left: LOOSE[1].x, top: LOOSE[1].y, ["--r" as string]: `${LOOSE[1].r}deg` }}
          onAnimationEnd={() => setFalling(null)}
        >
          <img src={falling.src} alt="" draggable={false} />
        </span>
      )}

      <span ref={pad} className="pd-pad" style={{ left: PAD.x, top: PAD.y }} onClick={(e) => { stop(e); peelNow(); }}>
        <span className="pd-block" />
        {/* the next sheet is already there underneath, so peeling reveals it */}
        <span className="pd-under"><img src={under} alt="" draggable={false} /><span ref={underShade} className="pd-under__shade" /></span>
        <span key={n} ref={sheet} className="pd-sheet" data-src={onPad}>
          <span className="pd-top"><img src={onPad} alt="" draggable={false} /></span>
          <span className="pd-corner">
            <span ref={shade} className="pd-corner__shade" />
            {/* the leaf carries its own piece of the doodle, lined up with the sheet,
                so the drawing bends up with the corner instead of being cut off */}
            <span ref={leaf} className="pd-corner__leaf">
              <span className="pd-corner__face"><img src={onPad} alt="" draggable={false} /></span>
              <span ref={sheen} className="pd-corner__sheen" />
            </span>
          </span>
        </span>
        <canvas
          ref={(el) => {
            warp.current = el;
            if (el && !el.dataset.sized) {
              const dpr = Math.min(2, window.devicePixelRatio || 1);
              el.width = Math.round(CV.w * dpr);
              el.height = Math.round(CV.h * dpr);
              el.dataset.sized = "1";
            }
          }}
          className="pd-warp"
          data-bounds-ignore=""
          style={{ left: -CV.l, top: -CV.t, width: CV.w, height: CV.h }}
        />
        <span ref={(el) => { marks.current[0] = el; }} className="pd-mark" style={{ left: 0, top: 0 }} />
        <span ref={(el) => { marks.current[1] = el; }} className="pd-mark" style={{ left: 100, top: 0 }} />
      </span>
      <p className="pd-hand pd-line">{COPY.art}</p>
    </div>
  );
}

