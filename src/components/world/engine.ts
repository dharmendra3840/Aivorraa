/**
 * The Aivorraa world: a procedural 3D landscape rendered in raw WebGL2.
 *
 * In the spirit of the reference (nk.studio, which runs three.js and a
 * modelled .glb world), but built from scratch and without a 3D library:
 * three.js alone is ~150KB gzipped, against a JavaScript budget of 200KB for
 * the whole page (PRD §21). This file is ~10KB.
 *
 * What is drawn, back to front:
 *   sky      a full-screen pass: night gradient and a moving aurora
 *   stars    a dome of twinkling points, plus dust drifting over the ground
 *   terrain  a noise heightfield, flat-shaded, with low ground flooded by
 *            glowing water; mountains rise toward the edges
 *   crystals low-poly floating stones, slowly turning
 *   portal   a glowing ring standing over the valley -- Aivorraa's landmark
 *   glow     additive halos that fake bloom around the light sources
 *
 * The camera flies a path keyed to scroll progress: low over the valley at
 * the top of the page, up into the stars through the middle, and back down
 * to the portal at the footer. The pointer adds a slight parallax.
 */

export interface WorldOptions {
  canvas: HTMLCanvasElement;
  /** Lower-end devices: fewer vertices and stars. */
  lite: boolean;
}

export interface World {
  /** Target scroll progress, 0..1. The camera eases toward it. */
  setProgress(p: number): void;
  /** Pointer position, -1..1 on each axis. */
  setPointer(x: number, y: number): void;
  /** Continuous animation on/off. Off: renders only when something changes. */
  setRunning(on: boolean): void;
  resize(): void;
  destroy(): void;
}

/* ------------------------------------------------------------------------ */
/* Small math                                                                */
/* ------------------------------------------------------------------------ */

type V3 = [number, number, number];

function perspective(fovy: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  const m = new Float32Array(16);
  m[0] = f / aspect;
  m[5] = f;
  m[10] = (far + near) * nf;
  m[11] = -1;
  m[14] = 2 * far * near * nf;
  return m;
}

function sub(a: V3, b: V3): V3 {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}
function cross(a: V3, b: V3): V3 {
  return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
}
function norm(a: V3): V3 {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
}
function dot(a: V3, b: V3) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function lookAt(eye: V3, target: V3, up: V3 = [0, 1, 0]) {
  const z = norm(sub(eye, target));
  const x = norm(cross(up, z));
  const y = cross(z, x);
  const m = new Float32Array(16);
  m[0] = x[0]; m[4] = x[1]; m[8] = x[2];
  m[1] = y[0]; m[5] = y[1]; m[9] = y[2];
  m[2] = z[0]; m[6] = z[1]; m[10] = z[2];
  m[12] = -dot(x, eye);
  m[13] = -dot(y, eye);
  m[14] = -dot(z, eye);
  m[15] = 1;
  return m;
}

function mul(a: Float32Array, b: Float32Array) {
  const o = new Float32Array(16);
  for (let c = 0; c < 4; c++)
    for (let r = 0; r < 4; r++) {
      let s = 0;
      for (let k = 0; k < 4; k++) s += a[k * 4 + r] * b[c * 4 + k];
      o[c * 4 + r] = s;
    }
  return o;
}

/** Deterministic pseudo-random, so the world is the same on every visit. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 2D value noise with smooth interpolation, and fractal sum. */
function makeNoise(seed: number) {
  const r = rng(seed);
  const perm = new Uint8Array(512);
  const vals = new Float32Array(256);
  for (let i = 0; i < 256; i++) {
    perm[i] = i;
    vals[i] = r();
  }
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(r() * (i + 1));
    [perm[i], perm[j]] = [perm[j], perm[i]];
  }
  for (let i = 0; i < 256; i++) perm[i + 256] = perm[i];
  const v = (x: number, y: number) => vals[perm[(perm[x & 255] + y) & 255]];
  const n = (x: number, y: number) => {
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;
    const u = xf * xf * (3 - 2 * xf), w = yf * yf * (3 - 2 * yf);
    const a = v(xi, yi), b = v(xi + 1, yi), c = v(xi, yi + 1), d = v(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * w + (a - b - c + d) * u * w;
  };
  return (x: number, y: number, oct = 5) => {
    let s = 0, amp = 0.5, f = 1;
    for (let i = 0; i < oct; i++) {
      s += amp * n(x * f, y * f);
      f *= 2.03;
      amp *= 0.5;
    }
    return s;
  };
}

/* ------------------------------------------------------------------------ */
/* Shaders                                                                   */
/* ------------------------------------------------------------------------ */

const FOG = "vec3(0.012, 0.045, 0.036)";

const SKY_VS = `#version 300 es
in vec2 p; out vec2 uv;
void main(){ uv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

const SKY_FS = `#version 300 es
precision highp float;
in vec2 uv; out vec4 o;
uniform float t; uniform float horizon; uniform float aspect;
float h(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0-2.0*f);
  return mix(mix(h(i), h(i+vec2(1,0)), f.x), mix(h(i+vec2(0,1)), h(i+vec2(1,1)), f.x), f.y); }
void main(){
  float y = uv.y - horizon;
  vec3 top = vec3(0.004, 0.012, 0.010);
  vec3 low = ${FOG} * 1.6;
  vec3 c = mix(low, top, smoothstep(-0.1, 0.55, y));
  // Aurora: curtains of light that drift sideways above the horizon.
  float x = uv.x * aspect;
  float band = 0.0;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float wave = n(vec2(x * 1.3 + t * 0.03 * (fi + 1.0), fi * 7.0)) * 0.22;
    float d = abs(y - 0.22 - fi * 0.08 - wave);
    band += exp(-d * d * 220.0) * (0.55 - fi * 0.12) * n(vec2(x * 6.0 + fi, t * 0.08));
  }
  band *= smoothstep(-0.02, 0.12, y);
  c += vec3(0.10, 0.75, 0.55) * band * 0.55;
  o = vec4(c, 1.0);
}`;

const MESH_VS = `#version 300 es
in vec3 position; in float emissive;
uniform mat4 vp; uniform mat4 model;
out vec3 wpos; out float em;
void main(){
  vec4 w = model * vec4(position, 1.0);
  wpos = w.xyz; em = emissive;
  gl_Position = vp * w;
}`;

const MESH_FS = `#version 300 es
precision highp float;
in vec3 wpos; in float em; out vec4 o;
uniform vec3 eye; uniform vec3 base; uniform vec3 glow; uniform float alpha;
uniform float t; uniform float density;
void main(){
  vec3 nrm = normalize(cross(dFdx(wpos), dFdy(wpos)));
  vec3 l = normalize(vec3(-0.35, 0.8, -0.5));
  float diff = clamp(dot(nrm, l), 0.0, 1.0);
  vec3 v = normalize(eye - wpos);
  float rim = pow(1.0 - abs(dot(nrm, v)), 2.5);
  vec3 c = base * (0.28 + 0.9 * diff) + base * rim * 0.6;
  // Glowing water: shimmer drifting across it.
  // em: 0 rock; 0.3..1 water (brighter in the shallows); 2 the portal.
  float water = step(0.01, em) * step(em, 1.5);
  float ring = step(1.5, em);
  // Soft caustics: three drifting waves, never quite repeating.
  float s = (sin(wpos.x * 0.21 + t * 0.5) + sin(wpos.z * 0.17 - t * 0.37)
           + sin((wpos.x - wpos.z) * 0.11 + t * 0.23)) / 6.0 + 0.5;
  vec3 wc = glow * (0.08 + 0.62 * em * em + 0.22 * s * em);
  c = mix(c, wc, water);
  c = mix(c, glow * 1.25, ring);
  float d = length(eye - wpos);
  float f = 1.0 - exp(-d * density);
  c = mix(c, ${FOG}, clamp(f, 0.0, 1.0) * (1.0 - max(water * 0.45, ring)));
  o = vec4(c, alpha);
}`;

const POINT_VS = `#version 300 es
in vec3 position; in float seed;
uniform mat4 vp; uniform float t; uniform float scale; uniform float drift;
out float a;
void main(){
  vec3 p = position;
  p.y += sin(t * 0.3 + seed * 20.0) * drift;
  p.x += cos(t * 0.2 + seed * 13.0) * drift;
  vec4 c = vp * vec4(p, 1.0);
  gl_Position = c;
  a = 0.45 + 0.55 * sin(t * (0.8 + seed) + seed * 40.0);
  gl_PointSize = scale * (0.6 + seed) / max(c.w, 1.0);
}`;

const POINT_FS = `#version 300 es
precision mediump float;
in float a; out vec4 o; uniform vec3 color;
void main(){
  vec2 d = gl_PointCoord - 0.5;
  float r = 1.0 - smoothstep(0.1, 0.5, length(d));
  o = vec4(color * r * a, 1.0);
}`;

const GLOW_VS = `#version 300 es
in vec2 p; uniform mat4 vp; uniform vec3 center; uniform float size;
uniform vec3 right; uniform vec3 up; out vec2 uv;
void main(){
  uv = p;
  vec3 w = center + (right * p.x + up * p.y) * size;
  gl_Position = vp * vec4(w, 1.0);
}`;

const GLOW_FS = `#version 300 es
precision mediump float;
in vec2 uv; out vec4 o; uniform vec3 color; uniform float strength;
void main(){
  float d = length(uv);
  float g = exp(-d * d * 3.5) * strength;
  o = vec4(color * g, 1.0);
}`;

/* ------------------------------------------------------------------------ */
/* Geometry                                                                  */
/* ------------------------------------------------------------------------ */

function terrain(lite: boolean) {
  const N = lite ? 110 : 190;
  const SIZE = 260;
  const WATER = 0.0;
  const noise = makeNoise(7);
  const height = (x: number, z: number) => {
    let h = (noise(x * 0.018 + 10, z * 0.018 + 4) - 0.45) * 26;
    h += (noise(x * 0.07, z * 0.07, 3) - 0.5) * 4;
    // Mountains rising toward the far edges and the horizon.
    const edge = Math.max(Math.abs(x) / (SIZE / 2), Math.max(0, -z) / (SIZE / 2));
    h += Math.pow(Math.max(0, edge - 0.45), 2) * 120;
    // Keep the valley floor along the flight path open and wet.
    const path = Math.exp(-(x * x) / 900);
    h -= path * 5;
    return h;
  };
  const pos: number[] = [];
  const em: number[] = [];
  const step = SIZE / N;
  const H: number[] = [];
  for (let j = 0; j <= N; j++)
    for (let i = 0; i <= N; i++) H.push(height(-SIZE / 2 + i * step, -SIZE / 2 + j * step));
  for (let j = 0; j < N; j++)
    for (let i = 0; i < N; i++) {
      const quad = [
        [i, j], [i + 1, j], [i, j + 1],
        [i + 1, j], [i + 1, j + 1], [i, j + 1],
      ];
      for (let tri = 0; tri < 2; tri++) {
        const v = quad.slice(tri * 3, tri * 3 + 3);
        const hs = v.map(([a, b]) => H[b * (N + 1) + a]);
        const wet = hs.every((h) => h < WATER);
        for (let k = 0; k < 3; k++) {
          const [a, b] = v[k];
          pos.push(-SIZE / 2 + a * step, wet ? WATER : Math.max(hs[k], WATER - 0.6), -SIZE / 2 + b * step);
          // Water glows most in the shallows, near the shore.
          const shore = Math.min(1, Math.max(0, 1 - (WATER - hs[k]) / 3.5));
          em.push(wet ? 0.3 + 0.7 * shore : 0);
        }
      }
    }
  return { pos: new Float32Array(pos), em: new Float32Array(em), height };
}

/** Elongated, jittered icosahedron: a crystal. */
function crystal(seed: number) {
  const r = rng(seed);
  const t = (1 + Math.sqrt(5)) / 2;
  const V: V3[] = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0], [0, -1, t], [0, 1, t],
    [0, -1, -t], [0, 1, -t], [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ].map((v) => {
    const n = norm(v as V3);
    const j = 0.8 + r() * 0.4;
    return [n[0] * j, n[1] * j * 1.7, n[2] * j] as V3;
  });
  const F = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4],
    [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8],
    [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];
  const pos: number[] = [];
  for (const f of F) for (const i of f) pos.push(...V[i]);
  return new Float32Array(pos);
}

/** Torus standing upright in the XY plane: the portal. */
function torus(R: number, r: number, seg: number, side: number) {
  const pos: number[] = [];
  const at = (i: number, j: number): V3 => {
    const u = (i / seg) * Math.PI * 2, v = (j / side) * Math.PI * 2;
    return [(R + r * Math.cos(v)) * Math.cos(u), (R + r * Math.cos(v)) * Math.sin(u), r * Math.sin(v)];
  };
  for (let i = 0; i < seg; i++)
    for (let j = 0; j < side; j++) {
      const a = at(i, j), b = at(i + 1, j), c = at(i, j + 1), d = at(i + 1, j + 1);
      pos.push(...a, ...b, ...c, ...b, ...d, ...c);
    }
  return new Float32Array(pos);
}

/* ------------------------------------------------------------------------ */
/* Camera path                                                               */
/* ------------------------------------------------------------------------ */

/** Keyframes: scroll progress -> camera position and look target. */
const PATH: Array<{ p: number; eye: V3; at: V3 }> = [
  { p: 0.0, eye: [-17, 6, 58], at: [-7, 10, 0] },
  { p: 0.1, eye: [-20, 9, 36], at: [-4, 11, -10] },
  { p: 0.24, eye: [4, 26, 18], at: [0, 60, -60] },
  { p: 0.5, eye: [0, 40, 0], at: [-10, 90, -80] },
  { p: 0.86, eye: [-4, 32, 20], at: [10, 62, -70] },
  { p: 0.95, eye: [10, 11, 46], at: [2, 9, 0] },
  { p: 1.0, eye: [2, 7, 52], at: [0, 9, 0] },
];

const smooth = (x: number) => x * x * (3 - 2 * x);

function cameraAt(p: number) {
  let i = 0;
  while (i < PATH.length - 2 && p > PATH[i + 1].p) i++;
  const a = PATH[i], b = PATH[i + 1];
  const k = smooth(Math.min(1, Math.max(0, (p - a.p) / (b.p - a.p))));
  const lerp = (x: V3, y: V3): V3 => [x[0] + (y[0] - x[0]) * k, x[1] + (y[1] - x[1]) * k, x[2] + (y[2] - x[2]) * k];
  return { eye: lerp(a.eye, b.eye), at: lerp(a.at, b.at) };
}

/* ------------------------------------------------------------------------ */
/* World                                                                     */
/* ------------------------------------------------------------------------ */

export function createWorld({ canvas, lite }: WorldOptions): World | null {
  const gl = canvas.getContext("webgl2", { antialias: !lite, alpha: false, powerPreference: "high-performance" });
  if (!gl) return null;

  // No real GPU (blocklisted driver, VM, remote desktop): the browser falls
  // back to a CPU rasteriser that would starve the page. The poster instead.
  const dbg = gl.getExtension("WEBGL_debug_renderer_info");
  const renderer = dbg ? String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL)) : "";
  if (/swiftshader|llvmpipe|software|basic render/i.test(renderer)) {
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return null;
  }

  const compile = (vs: string, fs: string) => {
    const p = gl.createProgram()!;
    for (const [type, src] of [[gl.VERTEX_SHADER, vs], [gl.FRAGMENT_SHADER, fs]] as const) {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s) ?? "shader");
      gl.attachShader(p, s);
    }
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p) ?? "link");
    const u = (n: string) => gl.getUniformLocation(p, n);
    return { p, u };
  };

  let sky, mesh, pts, glw;
  try {
    sky = compile(SKY_VS, SKY_FS);
    mesh = compile(MESH_VS, MESH_FS);
    pts = compile(POINT_VS, POINT_FS);
    glw = compile(GLOW_VS, GLOW_FS);
  } catch {
    return null;
  }

  const buffer = (prog: WebGLProgram, attrs: Array<[string, Float32Array, number]>) => {
    const vao = gl.createVertexArray()!;
    gl.bindVertexArray(vao);
    for (const [name, data, size] of attrs) {
      const loc = gl.getAttribLocation(prog, name);
      if (loc < 0) continue;
      const b = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, b);
      gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
    }
    gl.bindVertexArray(null);
    return vao;
  };

  const quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, -1, 1, 1, -1, 1]);
  const skyVao = buffer(sky.p, [["p", new Float32Array([-1, -1, 3, -1, -1, 3]), 2]]);
  const glowVao = buffer(glw.p, [["p", quad, 2]]);

  const ter = terrain(lite);
  const terVao = buffer(mesh.p, [["position", ter.pos, 3], ["emissive", ter.em, 1]]);
  const terCount = ter.pos.length / 3;

  const crystalPos = crystal(3);
  const zeros = (n: number) => new Float32Array(n);
  const cryVao = buffer(mesh.p, [["position", crystalPos, 3], ["emissive", zeros(crystalPos.length / 3), 1]]);
  const ring = torus(9, 0.42, 96, 10);
  const ringVao = buffer(mesh.p, [["position", ring, 3], ["emissive", new Float32Array(ring.length / 3).fill(2), 1]]);

  // Crystals placed beside the valley, near the opening view.
  const crystals = [
    { at: [-14, 0, 8] as V3, s: 6.5, spin: 0.05, seed: 0 },
    { at: [-26, 0, -6] as V3, s: 3.2, spin: -0.08, seed: 1.7 },
    { at: [22, 0, -14] as V3, s: 4.2, spin: 0.06, seed: 3.1 },
    { at: [30, 0, 18] as V3, s: 2.4, spin: -0.1, seed: 4.4 },
    { at: [-8, 0, -40] as V3, s: 5, spin: 0.04, seed: 5.9 },
  ].map((c) => ({ ...c, at: [c.at[0], ter.height(c.at[0], c.at[2]) + c.s * 2.4, c.at[2]] as V3 }));

  const portal: V3 = [9, 0, -4];
  portal[1] = Math.max(ter.height(portal[0], portal[2]), 0) + 11;

  // Stars on a high dome; dust low over the valley.
  const r = rng(11);
  const STARS = lite ? 900 : 2200;
  const sPos = new Float32Array(STARS * 3), sSeed = new Float32Array(STARS);
  for (let i = 0; i < STARS; i++) {
    const th = r() * Math.PI * 2, ph = Math.acos(1 - r() * 0.95);
    const R = 220 + r() * 60;
    sPos.set([Math.cos(th) * Math.sin(ph) * R, Math.cos(ph) * R * 0.9 + 10, Math.sin(th) * Math.sin(ph) * R], i * 3);
    sSeed[i] = r();
  }
  const starVao = buffer(pts.p, [["position", sPos, 3], ["seed", sSeed, 1]]);
  const DUST = lite ? 260 : 600;
  const dPos = new Float32Array(DUST * 3), dSeed = new Float32Array(DUST);
  for (let i = 0; i < DUST; i++) {
    dPos.set([(r() - 0.5) * 120, 2 + r() * 40, (r() - 0.5) * 140], i * 3);
    dSeed[i] = r();
  }
  const dustVao = buffer(pts.p, [["position", dPos, 3], ["seed", dSeed, 1]]);

  const identity = new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  const model = (pos: V3, scale: number, rotY: number, rotZ = 0) => {
    const c = Math.cos(rotY), s = Math.sin(rotY), cz = Math.cos(rotZ), sz = Math.sin(rotZ);
    // R = Ry * Rz, then scale and translate.
    return new Float32Array([
      c * cz * scale, sz * scale, -s * cz * scale, 0,
      -c * sz * scale, cz * scale, s * sz * scale, 0,
      s * scale, 0, c * scale, 0,
      pos[0], pos[1], pos[2], 1,
    ]);
  };

  let target = 0, progress = 0, px = 0, py = 0, tpx = 0, tpy = 0;
  let running = false, raf = 0, last = 0, time = 0;
  let dirty = true;

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, lite ? 1 : 1.5);
    const w = Math.round(canvas.clientWidth * dpr), h = Math.round(canvas.clientHeight * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    dirty = true;
  };

  const draw = () => {
    const W = canvas.width, Hh = canvas.height;
    gl.viewport(0, 0, W, Hh);
    const aspect = W / Math.max(1, Hh);
    const cam = cameraAt(progress);
    // Pointer parallax: the camera slides with the cursor and turns a little
    // toward it, so the world answers the hand, not just the scroll.
    const eye: V3 = [cam.eye[0] + px * 6.5, cam.eye[1] - py * 3.2, cam.eye[2]];
    const at: V3 = [cam.at[0] + px * 4, cam.at[1] - py * 2.4, cam.at[2]];
    const proj = perspective(aspect < 1 ? 1.05 : 0.82, aspect, 0.5, 900);
    const view = lookAt(eye, at);
    const vp = mul(proj, view);

    // Where the horizon falls on screen, for the sky pass.
    const far: V3 = [eye[0] + (at[0] - eye[0]) * 50, 0, eye[2] + (at[2] - eye[2]) * 50];
    const clip = [0, 1, 2, 3].map((r2) => vp[r2] * far[0] + vp[4 + r2] * far[1] + vp[8 + r2] * far[2] + vp[12 + r2]);
    const horizon = clip[3] > 0 ? Math.min(1.5, Math.max(-0.5, (clip[1] / clip[3]) * 0.5 + 0.5)) : -0.5;

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.BLEND);
    gl.useProgram(sky.p);
    gl.uniform1f(sky.u("t"), time);
    gl.uniform1f(sky.u("horizon"), horizon);
    gl.uniform1f(sky.u("aspect"), aspect);
    gl.bindVertexArray(skyVao);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    // Stars (additive, behind everything solid).
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.useProgram(pts.p);
    gl.uniformMatrix4fv(pts.u("vp"), false, vp);
    gl.uniform1f(pts.u("t"), time);
    gl.uniform1f(pts.u("scale"), 900 * (W / 1440));
    gl.uniform1f(pts.u("drift"), 0);
    gl.uniform3f(pts.u("color"), 0.75, 1.0, 0.92);
    gl.bindVertexArray(starVao);
    gl.drawArrays(gl.POINTS, 0, STARS);

    gl.disable(gl.BLEND);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.DEPTH_BUFFER_BIT);

    gl.useProgram(mesh.p);
    gl.uniformMatrix4fv(mesh.u("vp"), false, vp);
    gl.uniform3f(mesh.u("eye"), eye[0], eye[1], eye[2]);
    gl.uniform1f(mesh.u("t"), time);
    gl.uniform3f(mesh.u("glow"), 0.16, 0.95, 0.72);

    // Terrain.
    gl.uniformMatrix4fv(mesh.u("model"), false, identity);
    gl.uniform3f(mesh.u("base"), 0.05, 0.2, 0.15);
    gl.uniform1f(mesh.u("alpha"), 1);
    gl.uniform1f(mesh.u("density"), 0.009);
    gl.bindVertexArray(terVao);
    gl.drawArrays(gl.TRIANGLES, 0, terCount);

    // Portal ring.
    gl.uniformMatrix4fv(mesh.u("model"), false, model(portal, 1, -0.35, 0.12 + Math.sin(time * 0.3) * 0.03));
    gl.uniform3f(mesh.u("glow"), 0.3, 1.0, 0.82);
    gl.bindVertexArray(ringVao);
    gl.drawArrays(gl.TRIANGLES, 0, ring.length / 3);

    // Crystals: translucent pale jade.
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.uniform3f(mesh.u("base"), 0.55, 0.85, 0.74);
    gl.uniform1f(mesh.u("alpha"), 0.92);
    gl.uniform1f(mesh.u("density"), 0.006);
    gl.bindVertexArray(cryVao);
    for (const c of crystals) {
      const bob = Math.sin(time * 0.4 + c.seed) * 0.8;
      gl.uniformMatrix4fv(mesh.u("model"), false, model([c.at[0], c.at[1] + bob, c.at[2]], c.s, c.seed + time * c.spin, 0.18 * Math.sin(c.seed)));
      gl.drawArrays(gl.TRIANGLES, 0, crystalPos.length / 3);
    }

    // Additive light: dust and halos.
    gl.blendFunc(gl.ONE, gl.ONE);
    gl.depthMask(false);
    gl.useProgram(pts.p);
    gl.uniform1f(pts.u("scale"), 260 * (W / 1440));
    gl.uniform1f(pts.u("drift"), 1.2);
    gl.uniform3f(pts.u("color"), 0.3, 1.0, 0.78);
    gl.bindVertexArray(dustVao);
    gl.drawArrays(gl.POINTS, 0, DUST);

    gl.useProgram(glw.p);
    gl.uniformMatrix4fv(glw.u("vp"), false, vp);
    const right = norm(cross(sub(at, eye), [0, 1, 0]));
    const up = norm(cross(right, sub(at, eye)));
    gl.uniform3f(glw.u("right"), right[0], right[1], right[2]);
    gl.uniform3f(glw.u("up"), up[0], up[1], up[2]);
    gl.bindVertexArray(glowVao);
    gl.uniform3f(glw.u("center"), portal[0], portal[1], portal[2]);
    gl.uniform1f(glw.u("size"), 17);
    gl.uniform3f(glw.u("color"), 0.1, 0.6, 0.46);
    gl.uniform1f(glw.u("strength"), 0.55 + Math.sin(time * 1.3) * 0.06);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.depthMask(true);
  };

  const frame = (now: number) => {
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    time += dt;
    const before = progress;
    progress += (target - progress) * Math.min(1, dt * 3.5);
    // Eased, but quick: catches up within a quarter of a second.
    px += (tpx - px) * Math.min(1, dt * 7);
    py += (tpy - py) * Math.min(1, dt * 7);
    const moving = Math.abs(target - progress) > 0.0004 || Math.abs(before - progress) > 0.0001;
    if (running || moving || dirty) {
      draw();
      dirty = false;
    }
    raf = running || moving ? requestAnimationFrame(frame) : 0;
    if (!raf) last = 0;
  };

  const kick = () => {
    if (!raf) raf = requestAnimationFrame(frame);
  };

  resize();
  kick();

  return {
    setProgress(p) {
      target = Math.min(1, Math.max(0, p));
      kick();
    },
    setPointer(x, y) {
      tpx = x;
      tpy = y;
      if (running) kick();
    },
    setRunning(on) {
      running = on;
      dirty = true;
      kick();
    },
    resize() {
      resize();
      kick();
    },
    destroy() {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
