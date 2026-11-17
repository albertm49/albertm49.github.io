// =====================================================================
//  ink.js — the cursor leaves an ink stain that slowly dries away.
//  Outer stain: grey ink everywhere. Inner stain: reveals the portrait,
//  placed in a frame behind the name. Raw WebGL, no dependencies.
// =====================================================================
const VERT = `
attribute vec2 p;
varying vec2 vUv;
void main() { vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uMask;
uniform sampler2D uImg;
uniform vec2 uRes;
uniform vec4 uRect;      // portrait frame in uv (x, y, w, h), y up
uniform float uTime;
uniform vec3 uInk;
uniform vec3 uStain;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
}
float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }

void main() {
  vec2 asp = vec2(uRes.x / uRes.y, 1.0);
  float n = fbm(vUv * asp * 3.2 + vec2(uTime * 0.03, -uTime * 0.02));
  // wobble the mask lookup so the edge feels like wet ink, not a circle
  vec2 wob = (vec2(fbm(vUv * 3.5 + 3.1), fbm(vUv * 3.5 - 1.7)) - 0.5) * 0.025;
  float m = texture2D(uMask, vUv + wob).r;
  float outer = smoothstep(0.14, 0.21, m + (n - 0.5) * 0.22);
  float inner = smoothstep(0.37, 0.49, m + (n - 0.5) * 0.3);

  vec2 q = (vUv - uRect.xy) / uRect.zw;
  float inside = step(0.0, q.x) * step(q.x, 1.0) * step(0.0, q.y) * step(q.y, 1.0);
  vec3 photo = texture2D(uImg, q).rgb;

  vec3 col = mix(uInk, uStain, outer);
  float reveal = inner * inside;
  col = mix(col, photo, reveal);
  float alpha = max(outer * 0.55, reveal);
  gl_FragColor = vec4(col * alpha, alpha);
}`;

function hex(c) { const n = parseInt(c.replace("#", ""), 16); return [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255]; }

export function createInk(canvas, { src, reduced = false, rect }) {
  const gl = canvas.getContext("webgl", { premultipliedAlpha: true, antialias: false, alpha: true });
  if (!gl) return null;

  const sh = (type, code) => { const s = gl.createShader(type); gl.shaderSource(s, code); gl.compileShader(s); return s; };
  const prog = gl.createProgram();
  gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
  gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, "p");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U = (n) => gl.getUniformLocation(prog, n);
  const css = getComputedStyle(document.documentElement);
  gl.uniform3fv(U("uInk"), hex(css.getPropertyValue("--ink").trim() || "#0a0a0a"));
  gl.uniform3fv(U("uStain"), hex("#1A1A1A"));
  gl.uniform1i(U("uMask"), 0);
  gl.uniform1i(U("uImg"), 1);

  function tex(unit) {
    const t = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0 + unit);
    gl.bindTexture(gl.TEXTURE_2D, t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
    return t;
  }
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  const maskTex = tex(0);
  const imgTex = tex(1);
  let imgAspect = 1;
  const img = new Image();
  img.onload = () => {
    imgAspect = img.naturalWidth / img.naturalHeight;
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, imgTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    layout();
  };
  img.src = src;

  // low-res mask canvas: soft white dabs that fade every frame
  const mask = document.createElement("canvas");
  const mctx = mask.getContext("2d");
  const SCALE = 0.5;
  let W = 1, H = 1;

  function layout() {
    const r = canvas.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    const pr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(W * pr); canvas.height = Math.round(H * pr);
    mask.width = Math.round(W * SCALE); mask.height = Math.round(H * SCALE);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.uniform2f(U("uRes"), W, H);
    const f = rect(W, H, imgAspect);      // {x, y, w, h} in css px, y down
    gl.uniform4f(U("uRect"), f.x / W, 1 - (f.y + f.h) / H, f.w / W, f.h / H);
    if (reduced) staticStain();
  }

  function dab(x, y, r) {
    const g = mctx.createRadialGradient(x * SCALE, y * SCALE, 0, x * SCALE, y * SCALE, r * SCALE);
    g.addColorStop(0, "rgba(255,255,255,0.55)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    mctx.fillStyle = g;
    mctx.beginPath(); mctx.arc(x * SCALE, y * SCALE, r * SCALE, 0, Math.PI * 2); mctx.fill();
  }

  function staticStain() {
    mctx.clearRect(0, 0, mask.width, mask.height);
    const f = rect(W, H, imgAspect);
    for (let i = 0; i < 26; i++) {
      const a = (i / 26) * Math.PI * 2;
      dab(f.x + f.w / 2 + Math.cos(a) * f.w * 0.22, f.y + f.h * 0.45 + Math.sin(a) * f.h * 0.22, f.w * 0.32);
    }
  }

  // pointer, with an autonomous "pen" when the visitor is idle or on touch
  let px = -1, py = -1, lx = -1, ly = -1, lastMove = -1e9, t = 0, running = true;
  const hover = matchMedia("(hover: hover)").matches;
  canvas.parentElement.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "mouse") return;
    const r = canvas.getBoundingClientRect();
    px = e.clientX - r.left; py = e.clientY - r.top; lastMove = performance.now();
  });

  layout();
  addEventListener("resize", () => layout());

  function frame(now) {
    requestAnimationFrame(frame);
    if (!running) return;
    t = now / 1000;
    if (!reduced) {
      // dry the ink a little each frame
      mctx.globalCompositeOperation = "destination-out";
      mctx.fillStyle = "rgba(0,0,0,0.018)";
      mctx.fillRect(0, 0, mask.width, mask.height);
      mctx.globalCompositeOperation = "source-over";

      let x = px, y = py;
      if (!hover || now - lastMove > 2600) {
        const f = rect(W, H, imgAspect);
        x = f.x + f.w * (0.5 + 0.36 * Math.sin(t * 0.55) * Math.cos(t * 0.21));
        y = f.y + f.h * (0.45 + 0.3 * Math.sin(t * 0.8 + 1.3));
      }
      if (x >= 0) {
        if (lx < 0) { lx = x; ly = y; }
        const d = Math.hypot(x - lx, y - ly), steps = Math.min(24, Math.ceil(d / 8) + 1);
        const base = Math.min(W, H) * 0.12;
        for (let i = 0; i < steps; i++) {
          const k = i / steps;
          dab(lx + (x - lx) * k, ly + (y - ly) * k, base * (0.75 + 0.5 * Math.sin(t * 3 + i)));
        }
        lx = x; ly = y;
      }
    }
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, maskTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, mask);
    gl.uniform1f(U("uTime"), reduced ? 0 : t);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  requestAnimationFrame(frame);

  return { pause(p) { running = !p; }, layout };
}
