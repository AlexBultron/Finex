// Original HorizonX code. Default artwork made for HorizonX. HorizonX Tools License.
/**
 * Tunnel Fold Slider engine.
 *
 * Cards ride a closed elliptical track seen from inside: the far end of the
 * ellipse sits deep in the frame, where the cards are small and face the
 * viewer, and its near end wraps around behind the camera, so a card grows and
 * turns side-on as it travels toward the lens and finally leaves the stage.
 * The ellipse was fitted to the card sizes and positions of the reference
 * frame, then scaled so about fifteen cards share a 16:10 stage.
 *
 * Two behaviours come from Fold Carousel, applied where they make physical
 * sense on this track:
 *  - Exit optics. Once a card is about to leave the stage, the part of the
 *    track ahead of it is stretched quadratically, so the card smears into
 *    horizontal streaks, its silhouette picks up a thin spectral fringe and a
 *    haze tinted with the card's own colour bleeds around it.
 *  - Door fold. Momentum folds every card about its leading edge like a door
 *    in the wind, and an exact critically damped spring unfolds it when the
 *    track slows down. At the cruise speed the cards lie flat on the track.
 *
 * Units: one card is CARD_W wide and tall (the default pictures are square
 * and keep their whole composition). On a stage wider than the reference the
 * ellipse widens just enough that a card at the side edge still fits the
 * frame's height, so cards only ever leave through the sides. World x to the right, z toward the
 * camera, camera at the origin looking down -z. The track maths is pure and
 * exported so the unit tests can hold it to its contract; three.js is loaded
 * on demand, only once a stage exists.
 */

const CARD_W = 1.80001;
const RADIUS = 0.0700001; // corner radius, world units
const ELLIPSE_W = 2.50001; // half width (x)
const ELLIPSE_D = 8; // half depth (z)
const ELLIPSE_ZC = -7.40001; // centre z; the near vertex sits behind the lens
const COLUMNS = 72; // segments along each card, so it bends with the track
const MARGIN_U = 0.299999; // haze margin around the card, in card widths
const MARGIN_V = 0.160001; // haze margin, in card heights
const BASE_VFOV = 58; // deg, on the reference 16:10 stage
// Tallest a card may stand inside the frame, as a fraction of its half height.
// The margin keeps the haze around a card off the top and bottom edges too.
const FIT_LIMIT = 0.86;
const PORTRAIT_VFOV = 34; // deg, a phone held upright
const REF_HALF_HFOV = Math.atan(Math.tan((BASE_VFOV / 2) * (Math.PI / 180)) * 1.6);

// Exit optics: the stretch starts EXIT_LEAD arc units before the card centre
// reaches the stage edge, and grows with the square of the overshoot.
const EXIT_LEAD = 1.35001;
const EXIT_STRETCH = 0.549999;
const EXIT_RAMP = 2.39999;

// Motion, in arc units per second.
const CRUISE = 0.420001;
const FOLD_DEADZONE = 0.7;
const FOLD_FULL = 7;
const FOLD_MAX = (30 * Math.PI) / 180;
const FOLD_OMEGA = 9; // spring angular frequency, rad/s
const MAX_SPEED = 26;
const EASE_BACK = 0.700001; // s, momentum easing back to the cruise speed

// Finer optics, for embeds that tune the look (the home hero's staging
// panel). Every default reproduces the tool exactly; the editor has no
// control for any of them.
const LOOK_DEFAULTS = {
  blur: 1, // length of the streak blur at the exits, on top of the stretch
  motionBlur: 1, // streak blur from speed (drag, flings)
  exitLead: EXIT_LEAD, // arc units before the frame edge where the exit starts
  widen: 1, // corridor width multiplier; wider puts the side cards deeper
  foldSpring: FOLD_OMEGA, // how fast the door fold follows the speed
  radius: RADIUS, // corner radius, world units
  hazeSpread: 0.0700001, // how far the coloured haze reaches past the card
  opacity: 1,
  brightness: 1,
  saturation: 1,
  sheen: 0, // glass: a diagonal highlight and a lit top
  rim: 0, // glass: a bright line just inside the card edge
  frost: 0, // glass: frosts the picture (mipmap blur)
  // Prism Edge Slider's exit, as a pass over the whole stage: near the left
  // and right edges the picture folds back as through a glass rim, smears
  // outward, splits into a spectral fringe and spills a hue-shifted haze. It
  // replaces the per-card streaks while on. 0 is off (the tool's own look).
  prism: 0,
  prismReach: 1, // how far in from each edge the prism works
  prismGlass: 1 // the rim's fold and magnification
};

const LOOK_RANGES = {
  blur: [0, 4],
  motionBlur: [0, 6],
  exitLead: [0, 5],
  widen: [1, 3],
  foldSpring: [2, 30],
  radius: [0, 0.6],
  hazeSpread: [0.0100001, 0.4],
  opacity: [0.100001, 1],
  brightness: [0.300001, 2],
  saturation: [0, 2],
  sheen: [0, 1],
  rim: [0, 1],
  frost: [0, 1],
  prism: [0, 3],
  prismReach: [0.300001, 2.49999],
  prismGlass: [0, 2]
};

const ENGINE_DEFAULTS = {
  images: [],
  speed: 1,
  playing: true,
  gap: 1.05999,
  fold: 1,
  flare: 1,
  fringe: 1,
  haze: 1,
  draggable: true,
  wheel: 'horizontal',
  preview: false,
  // Narrows the field of view (2 = half the tangent), so the far end of the
  // corridor draws that much larger. Embeds only: the home hero runs a stage
  // about 4:1, where the reference field leaves the middle cards tiny.
  zoom: 1,
  ...LOOK_DEFAULTS
};

// Arc-length table of the ellipse: x = W sin t, z = ZC - D cos t, t = 0 at the
// far vertex, increasing toward the right side of the frame. Resampled at
// uniform arc length so a lookup is O(1).
function makeTrack(halfWidth = ELLIPSE_W) {
  const n = 8192;
  const xs = new Float64Array(n + 1);
  const zs = new Float64Array(n + 1);
  const ss = new Float64Array(n + 1);
  for (let i = 0; i <= n; i++) {
    const t = (i / n) * Math.PI * 2;
    xs[i] = halfWidth * Math.sin(t);
    zs[i] = ELLIPSE_ZC - ELLIPSE_D * Math.cos(t);
    if (i > 0) ss[i] = ss[i - 1] + Math.hypot(xs[i] - xs[i - 1], zs[i] - zs[i - 1]);
  }
  const length = ss[n];
  const m = 4096;
  const ux = new Float64Array(m + 1);
  const uz = new Float64Array(m + 1);
  let j = 0;
  for (let k = 0; k <= m; k++) {
    const s = (k / m) * length;
    while (j < n - 1 && ss[j + 1] < s) j++;
    const f = (s - ss[j]) / (ss[j + 1] - ss[j] || 1);
    ux[k] = xs[j] + (xs[j + 1] - xs[j]) * f;
    uz[k] = zs[j] + (zs[j + 1] - zs[j]) * f;
  }
  return { halfWidth, length, half: length / 2, m, ux, uz };
}
const TRACK = makeTrack();
const TRACK_LEN = TRACK.length;

/** Arc folded into [-half, half), measured from the far vertex. */
function wrapSigned(a, track = TRACK) {
  const s = (((a + track.half) % track.length) + track.length) % track.length;
  return s - track.half;
}

const wrapIndex = (x, n) => ((x % n) + n) % n;

function trackAt(a, out = { x: 0, z: 0 }, track = TRACK) {
  const s = ((a % track.length) + track.length) % track.length;
  const f = (s / track.length) * track.m;
  const i = Math.min(track.m - 1, Math.floor(f));
  const k = f - i;
  out.x = track.ux[i] + (track.ux[i + 1] - track.ux[i]) * k;
  out.z = track.uz[i] + (track.uz[i + 1] - track.uz[i]) * k;
  return out;
}

// Arc where a point on the right half of the track crosses the vertical edge
// of the frustum for a given half horizontal field of view.
function exitArc(halfHfov, track = TRACK) {
  const limit = Math.tan(halfHfov);
  const p = { x: 0, z: 0 };
  for (let a = 0; a < track.half; a += 0.0099999) {
    trackAt(a, p, track);
    if (p.z >= -0.0499999 || p.x / -p.z > limit) return a;
  }
  return track.half;
}

/**
 * Exit warp on the signed arc: identity inside the frame, a quadratic stretch
 * past `start` scaled by `strength`, clamped short of the near vertex so
 * nothing wraps around behind the camera.
 */
function warp(a, start, strength = 1, track = TRACK) {
  const m = Math.abs(a);
  if (m <= start) return a;
  const q = m - start;
  const w = Math.min(track.half - 0.0200001, start + q + EXIT_STRETCH * strength * q * q * (1 + 0.35 * q));
  return Math.sign(a) * w;
}

/** 0 inside the frame, easing to 1 over EXIT_RAMP arc units past `start`. */
function exitAmount(a, start) {
  const t = Math.min(1, Math.max(0, (Math.abs(a) - start) / EXIT_RAMP));
  return t * t * (3 - 2 * t);
}

/** One exact step of a critically damped spring toward `target`. */
function springStep(x, v, target, dt, omega) {
  const x0 = x - target;
  const e = Math.exp(-omega * dt);
  return [target + (x0 + (v + omega * x0) * dt) * e, (v - (v + omega * x0) * omega * dt) * e];
}

/** How many cards the track holds edge to edge with `gap` card widths each. */
const cardCount = (gap, track = TRACK) => Math.max(8, Math.round(track.length / (CARD_W * gap)));

/**
 * Point of a card column at arc `a`, warped by the exit stretch and swung
 * about the hinge point `h` by the fold angle (given as its cosine and sine).
 */
function cardPoint(a, h, cosF, sinF, exitStart, flare, track, out) {
  trackAt(warp(a, exitStart, flare, track), out, track);
  const dx = out.x - h.x;
  const dz = out.z - h.z;
  out.x = h.x + dx * cosF + dz * sinF;
  out.z = h.z - dx * sinF + dz * cosF;
  return out;
}

/**
 * Half width of the ellipse for a frame. Where the frame's vertical edge meets
 * the track, a card stands (CARD_W / 2) / (depth * tan(vfov / 2)) of the
 * frame's half height, so the card fits once that point lies at least
 * `depth` deep. Widen the ellipse until the edge ray reaches the wall that
 * deep; stages up to about 16:9 keep the reference ellipse. Rounded up to a
 * small step so a resize reuses the same track.
 */
function fitHalfWidth(aspect, vfov) {
  const ty = Math.tan((vfov / 2) * (Math.PI / 180));
  const depth = CARD_W / 2 / (FIT_LIMIT * ty);
  const across = (depth + ELLIPSE_ZC) / ELLIPSE_D;
  if (Math.abs(across) >= 1) return ELLIPSE_W;
  const need = (ty * aspect * depth) / Math.sqrt(1 - across * across);
  return need <= ELLIPSE_W ? ELLIPSE_W : Math.ceil(need * 20) / 20;
}

const tracks = new Map();
function trackFor(halfWidth) {
  if (halfWidth === ELLIPSE_W) return TRACK;
  const key = halfWidth.toFixed(2);
  let track = tracks.get(key);
  if (!track) {
    if (tracks.size >= 8) tracks.clear();
    track = makeTrack(halfWidth);
    tracks.set(key, track);
  }
  return track;
}

/**
 * Camera for a stage: keep the reference horizontal field where the stage
 * allows it. Portrait stages cannot hold the whole corridor, so they zoom into
 * its middle and let the walls leave the frame sooner; very wide stages get a
 * wider ellipse (see fitHalfWidth).
 */
function cameraFor(width, height, zoom = 1, { widen = 1, exitLead = EXIT_LEAD } = {}) {
  const aspect = Math.max(width, 1) / Math.max(height, 1);
  let vfov = 2 * Math.atan(Math.tan(REF_HALF_HFOV) / aspect) * (180 / Math.PI);
  vfov = Math.min(72, Math.max(BASE_VFOV, vfov));
  if (aspect < 1) vfov += (PORTRAIT_VFOV - vfov) * Math.min(1, (1 - aspect) / 0.500001);
  // fitHalfWidth below widens the ellipse for the narrower field, so the
  // side cards still fit the frame height and only leave through the sides.
  if (zoom > 1) vfov = 2 * Math.atan(Math.tan((vfov / 2) * (Math.PI / 180)) / zoom) * (180 / Math.PI);
  const halfH = Math.atan(Math.tan((vfov / 2) * (Math.PI / 180)) * aspect);
  const fit = fitHalfWidth(aspect, vfov);
  // Only ever wider than the fit, so the side cards still clear the frame.
  const track = trackFor(widen > 1 ? Math.ceil(fit * widen * 20) / 20 : fit);
  return { aspect, vfov, track, exitStart: Math.max(1.20001, exitArc(halfH, track) - exitLead) };
}

/** The picture a card shows on a given lap, so every picture comes round. */
const pictureFor = (card, lap, count, pictures) => wrapIndex(card - lap * count, pictures);

const vertexShader = /* glsl */ `
  attribute float exitAmt;
  varying vec2 vUv;
  varying float vExit;
  void main() {
    vUv = uv;
    vExit = exitAmt;
    gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  uniform sampler2D map;
  uniform vec2 cardSize;
  uniform float radius;
  uniform vec2 coverScale;
  uniform vec3 hazeColor;
  uniform float speedSmear;
  uniform float smearScale;
  uniform float fringeScale;
  uniform float hazeScale;
  uniform float side;
  uniform float fade;
  uniform float hazeSpread;
  uniform float opacity;
  uniform float brightness;
  uniform float saturation;
  uniform float sheen;
  uniform float rim;
  uniform float frost;
  uniform float exitOptics;
  varying vec2 vUv;
  varying float vExit;

  float sdRound(vec2 uv) {
    vec2 p = (uv - 0.5) * cardSize;
    vec2 q = abs(p) - cardSize * 0.5 + radius;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - radius;
  }

  // The pictures are sRGB textures, so they sample as linear light; the
  // canvas takes sRGB bytes. A ShaderMaterial gets no output conversion of
  // its own, and without this every card drew darker and harsher than its
  // picture.
  vec3 toSRGB(vec3 c) {
    c = clamp(c, 0.0, 1.0);
    return mix(c * 12.92, 1.055 * pow(c, vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
  }

  vec2 cover(vec2 uv) {
    return clamp((uv - 0.5) * coverScale + 0.5, 0.001, 0.999);
  }

  void main() {
    float aa = fwidth(sdRound(vUv)) * 0.75 + 1e-4;
    // Smear length in card widths: exit stretch plus a little motion blur.
    // exitOptics is 0 while the prism pass draws the exits instead.
    float exit = vExit * exitOptics;
    float smear = (exit * 0.42 + speedSmear) * smearScale;
    float fringe = (exit * 0.022 + speedSmear * 0.08) * fringeScale;

    vec3 col = vec3(0.0);
    vec3 cov = vec3(0.0);
    const int TAPS = 10;
    if (smear < 0.004) {
      vec3 m = vec3(
        1.0 - smoothstep(-aa, aa, sdRound(vUv + vec2(fringe, 0.0))),
        1.0 - smoothstep(-aa, aa, sdRound(vUv)),
        1.0 - smoothstep(-aa, aa, sdRound(vUv - vec2(fringe, 0.0)))
      );
      col = texture2D(map, cover(vUv), frost * 5.0).rgb * m;
      cov = m;
    } else {
      for (int i = 0; i < TAPS; i++) {
        // Taps trail behind the direction of travel toward the edge, so the
        // streaks pour out of the side of the stage.
        float t = float(i) / float(TAPS - 1);
        float o = -side * t * t * smear;
        vec2 uvG = vUv + vec2(o, 0.0);
        float mR = 1.0 - smoothstep(-aa, aa, sdRound(uvG + vec2(fringe, 0.0)));
        float mG = 1.0 - smoothstep(-aa, aa, sdRound(uvG));
        float mB = 1.0 - smoothstep(-aa, aa, sdRound(uvG - vec2(fringe, 0.0)));
        // One fetch per tap; the fringe comes from the per-channel masks.
        col += texture2D(map, cover(uvG), frost * 5.0).rgb * vec3(mR, mG, mB);
        cov += vec3(mR, mG, mB);
      }
      col /= float(TAPS);
      cov /= float(TAPS);
    }

    float alpha = max(cov.r, max(cov.g, cov.b));
    // Grade and glass. col is premultiplied by the coverage, so the grade
    // works on it as is and the highlights mix toward white in alpha.
    float lum = dot(col, vec3(0.2126, 0.7152, 0.0722));
    col = mix(vec3(lum), col, saturation) * brightness * opacity;
    float a = alpha * opacity;
    float sd = sdRound(vUv);
    float lit = rim * exp(-abs(sd) / 0.018) * step(sd, 0.0)
      + sheen * (0.5 * exp(-pow((vUv.x - vUv.y * 0.7 + 0.1) / 0.14, 2.0)) + 0.22 * smoothstep(0.45, 1.0, vUv.y));
    lit = min(1.0, lit) * alpha;
    a = max(a, lit);
    col = mix(col, vec3(a), lit);
    // Haze around the silhouette, tinted by the card's own colour.
    float d = max(sd, 0.0);
    float haze = hazeScale * exit * exp(-d / hazeSpread) * (1.0 - alpha) * 0.38;
    // Premultiplied out: encode the straight colour, then multiply back.
    float outA = a + haze;
    vec3 outC = outA > 1e-5 ? toSRGB((col + hazeColor * haze) / outA) * outA : vec3(0.0);
    gl_FragColor = vec4(outC, outA) * fade;
  }
`;

const postVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

// Prism Edge Slider's exit (prismEdgeSlider.engine.js), turned on its side:
// the cards leave left and right here. The scene arrives premultiplied from a
// render target and goes out over the stage colour. Fewer taps than the
// original, and a per-pixel jitter on the smear so it reads as one blur
// rather than a stack of copies.
const postFragmentShader = /* glsl */ `
  precision highp float;
  uniform sampler2D tScene;
  uniform vec2 uRes;
  uniform vec4 uBg;
  uniform float uPrism;
  uniform float uReach;
  uniform float uGlass;
  uniform float uSmear;
  varying vec2 vUv;

  const int FRINGE_TAPS = 5;
  const int SMEAR_TAPS = 7;
  const int HAZE_TAPS = 4;
  const float HAZE_HUE = -1.22;
  const float HAZE_LIGHT = 0.35;
  const float HAZE_SAT = 1.8;
  const float HAZE_ALPHA = 0.9;

  vec3 spectrum(float t) {
    // t = 0 -> blue, 0.5 -> green, 1 -> red (red is displaced furthest out).
    return max(vec3(1.0 - abs(t - 1.0) * 1.9, 1.0 - abs(t - 0.5) * 2.4, 1.0 - abs(t) * 1.9), 0.0) + 0.02;
  }
  vec3 hueRotate(vec3 c, float a) {
    const vec3 k = vec3(0.57735027);
    float ca = cos(a);
    return c * ca + cross(k, c) * sin(a) + k * dot(k, c) * (1.0 - ca);
  }
  vec3 hazeTint(vec3 c) {
    vec3 ghost = hueRotate(c, HAZE_HUE);
    float luma = dot(ghost, vec3(0.299, 0.587, 0.114));
    return clamp(mix(vec3(luma), ghost, HAZE_SAT), 0.0, 1.0);
  }

  float reach() {
    return max(uReach * (0.12 * uRes.x + 0.2 * uRes.y), 1.0);
  }

  // Edge glass: the scene folds back from both side edges and grows taller
  // toward them.
  vec2 glassAt(vec2 fc) {
    float R = reach();
    float A = 0.485 * R * uGlass;
    float L = 0.168 * R;
    float MU = 0.2 * R;
    float dl = fc.x, dr = uRes.x - fc.x;
    float sx = fc.x + A * (exp(-dl / L) - exp(-dr / L));
    float m = 1.0 + 0.31 * uGlass * (exp(-dl / MU) + exp(-dr / MU));
    float cy = uRes.y * 0.5;
    return vec2(sx, cy + (fc.y - cy) / m);
  }

  vec4 sceneAt(vec2 p) {
    vec2 uv = p / uRes;
    if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return vec4(0.0);
    return texture2D(tScene, uv);
  }

  // Premultiplied scene seen through the glass, smeared along dir.
  vec4 shade(vec2 fc, vec2 dir, float spread, int taps, float jitter) {
    vec4 acc = vec4(0.0);
    for (int i = 0; i < SMEAR_TAPS; i++) {
      if (i >= taps) break;
      float t = taps > 1 ? (float(i) + jitter) / float(taps) - 0.5 : 0.0;
      acc += sceneAt(glassAt(fc + dir * t * spread));
    }
    return acc / float(taps);
  }

  vec4 over(vec4 c) {
    return c + uBg * (1.0 - c.a);
  }

  void main() {
    vec2 fc = vUv * uRes;
    vec4 base = sceneAt(glassAt(fc));
    vec4 col = over(base);

    float R = reach();
    float edge = min(fc.x, uRes.x - fc.x);
    float f = clamp(1.0 - edge / R, 0.0, 1.0);
    float kk = uPrism * f * f;
    if (kk > 0.01) {
      // Outward from the stage centre, mostly sideways: the cards leave there.
      vec2 dir = normalize(vec2(fc.x - uRes.x * 0.5, (fc.y - uRes.y * 0.5) * 0.45) + 1e-4);
      float spread = 0.14 * R * kk * sqrt(kk) * uSmear;
      float jitter = fract(52.9829189 * fract(dot(gl_FragCoord.xy, vec2(0.06711056, 0.00583715))));

      vec2 off = dir * 0.088 * R * kk;
      vec4 acc = vec4(0.0);
      vec3 wsum = vec3(0.0);
      float wa = 0.0;
      for (int i = 0; i < FRINGE_TAPS; i++) {
        float t = float(i) / float(FRINGE_TAPS - 1);
        vec3 w = spectrum(t);
        float wm = (w.r + w.g + w.b) / 3.0;
        vec4 h = over(shade(fc - off * t, dir, spread, SMEAR_TAPS, jitter));
        acc += vec4(h.rgb * w, h.a * wm);
        wsum += w;
        wa += wm;
      }
      col = vec4(acc.rgb / wsum, acc.a / wa);

      vec2 hoff = dir * 0.265 * R * kk;
      vec3 hc = vec3(0.0);
      float cov = 0.0, wt = 0.0;
      for (int i = 0; i < HAZE_TAPS; i++) {
        float t = (float(i) + 0.5) / float(HAZE_TAPS);
        vec4 h = shade(fc - hoff * t, dir, spread, 3, jitter);
        float w = 1.0 - 0.7 * t;
        hc += h.rgb * w;
        cov += h.a * w;
        wt += w;
      }
      if (cov > 1e-3) {
        vec3 ghost = hazeTint(hc / cov);
        vec3 bg = uBg.a > 0.0 ? uBg.rgb / uBg.a : vec3(1.0);
        vec3 lift = dot(bg, vec3(0.299, 0.587, 0.114)) > 0.5 ? vec3(1.0) : bg;
        ghost = mix(ghost, lift, HAZE_LIGHT);
        float a = sqrt(cov / wt) * (1.0 - base.a) * HAZE_ALPHA * smoothstep(0.08, 0.6, kk);
        col = col * (1.0 - a) + vec4(ghost, 1.0) * a;
      }
    }
    gl_FragColor = col;
  }
`;

function webglAvailable() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2') || c.getContext('webgl');
    // The probe context would otherwise stay alive until the canvas is collected.
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

function buildTunnelFoldSlider(root, config) {
  if (!root) return null;
  let cfg = { ...ENGINE_DEFAULTS, ...config };
  const stage = root.querySelector('.tf-gl') ?? root;
  const live = root.querySelector('.tf-live');
  const toggle = root.querySelector('.tf-toggle');
  const motionQuery = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
  const reduced = () => motionQuery?.matches === true;

  let disposed = false;
  let scene = null;
  const cleanups = [];
  const listen = (target, type, handler, options) => {
    if (!target) return;
    target.addEventListener(type, handler, options);
    cleanups.push(() => target.removeEventListener(type, handler, options));
  };

  // A visitor's pause outlives config edits; the author's `playing` is the
  // default it starts from.
  let userPaused = false;
  const paused = () => !cfg.playing || userPaused;
  const motion = {
    scroll: 0,
    velocity: CRUISE * cfg.speed,
    direction: 1,
    fold: 0,
    foldVel: 0,
    dragging: false,
    dragVel: 0,
    lastInput: -Infinity
  };
  const cruise = () => (paused() || reduced() ? 0 : CRUISE * cfg.speed * motion.direction);
  const clampSpeed = (v) => Math.max(-MAX_SPEED, Math.min(MAX_SPEED, v));

  function syncToggle() {
    if (!toggle) return;
    const isPaused = paused();
    toggle.setAttribute('aria-pressed', String(isPaused));
    toggle.setAttribute('aria-label', isPaused ? 'Play animation' : 'Pause animation');
  }
  syncToggle();
  listen(toggle, 'click', () => {
    userPaused = !userPaused;
    // Resuming an author-paused slider plays it for this visitor.
    if (!userPaused && !cfg.playing) cfg = { ...cfg, playing: true };
    syncToggle();
    scene?.invalidate();
  });

  // --- input ---------------------------------------------------------------

  let drag = null;
  const interactive = () => !cfg.preview;
  listen(root, 'pointerdown', (e) => {
    if (!cfg.draggable || !interactive() || e.button !== 0) return;
    if (e.target instanceof Element && e.target.closest('button')) return;
    try { root.setPointerCapture(e.pointerId); } catch { /* synthetic events */ }
    drag = { id: e.pointerId, x: e.clientX, t: performance.now() };
    motion.dragging = true;
    motion.dragVel = 0;
    motion.velocity = 0;
    root.setAttribute('data-dragging', '');
    scene?.invalidate();
  });
  listen(root, 'pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const now = performance.now();
    const dt = Math.max(1, now - drag.t) / 1000;
    // Arc units per pixel: the track moves roughly with the pointer near the
    // middle of the stage.
    const d = (e.clientX - drag.x) * (7.50001 / Math.max(stage.clientWidth, 1));
    motion.scroll += d;
    motion.dragVel = motion.dragVel * 0.599999 + (d / dt) * 0.399999;
    drag.x = e.clientX;
    drag.t = now;
    motion.lastInput = now;
    scene?.invalidate();
  });
  const endDrag = (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    // A release that paused before letting go carries no momentum.
    const idle = performance.now() - drag.t > 90;
    motion.velocity = idle ? 0 : clampSpeed(motion.dragVel);
    if (Math.abs(motion.velocity) > 0.199999) motion.direction = Math.sign(motion.velocity);
    motion.dragging = false;
    drag = null;
    root.removeAttribute('data-dragging');
    scene?.invalidate();
  };
  listen(root, 'pointerup', endDrag);
  listen(root, 'pointercancel', endDrag);
  listen(root, 'lostpointercapture', endDrag);

  listen(root, 'wheel', (e) => {
    if (!interactive() || cfg.wheel === 'off') return;
    const horizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY);
    // Only a sideways wheel belongs to the slider unless the author opted in
    // to the vertical one too; the page keeps scrolling otherwise.
    if (!horizontal && cfg.wheel !== 'both') return;
    e.preventDefault();
    const unit = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? stage.clientHeight : 1;
    const delta = (horizontal ? -e.deltaX : e.deltaY) * unit;
    motion.velocity = clampSpeed(motion.velocity + delta * 0.0119999);
    if (Math.abs(motion.velocity) > 0.200001) motion.direction = Math.sign(motion.velocity);
    motion.lastInput = performance.now();
    scene?.invalidate();
  }, { passive: false });

  listen(root, 'keydown', (e) => {
    if (!interactive() || e.target !== root) return;
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const s = e.key === 'ArrowRight' ? 1 : -1;
    motion.velocity = clampSpeed(motion.velocity + s * 5.50001);
    motion.direction = s;
    motion.lastInput = performance.now();
    scene?.invalidate();
  });

  let onScreen = true;
  const observer = typeof IntersectionObserver === 'function'
    ? new IntersectionObserver((entries) => {
      onScreen = entries.some((entry) => entry.isIntersecting);
      if (onScreen) scene?.invalidate();
    })
    : null;
  observer?.observe(root);
  cleanups.push(() => observer?.disconnect());
  listen(document, 'visibilitychange', () => scene?.invalidate());
  if (motionQuery?.addEventListener) listen(motionQuery, 'change', () => scene?.invalidate());

  function fail() {
    if (disposed) return;
    root.setAttribute('data-tf-fallback', '');
  }

  // --- scene ---------------------------------------------------------------

  function createScene(THREE) {
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    } catch {
      fail();
      return null;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.74999));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    // The stage colour is the root's CSS background, so a recolour never
    // touches the GL state.
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.className = 'tf-canvas';
    stage.append(canvas);

    const world = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(BASE_VFOV, 1.59999, 0.0499999, 60);
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    const maxAniso = renderer.capabilities.getMaxAnisotropy();

    const uvs = [];
    const index = [];
    for (let c = 0; c <= COLUMNS; c++) {
      const u = -MARGIN_U + (c / COLUMNS) * (1 + 2 * MARGIN_U);
      uvs.push(u, -MARGIN_V, u, 1 + MARGIN_V);
      if (c < COLUMNS) {
        const i = c * 2;
        index.push(i, i + 2, i + 1, i + 1, i + 2, i + 3);
      }
    }

    let cards = [];
    let spacing = 1;
    let track = TRACK;
    function buildCards() {
      for (const card of cards) {
        world.remove(card.mesh);
        card.mesh.geometry.dispose();
        card.material.dispose();
      }
      const count = cardCount(cfg.gap, track);
      spacing = track.length / count;
      cards = Array.from({ length: count }, () => {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array((COLUMNS + 1) * 2 * 3);
        const exits = new Float32Array((COLUMNS + 1) * 2);
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
        geometry.setAttribute('exitAmt', new THREE.BufferAttribute(exits, 1).setUsage(THREE.DynamicDrawUsage));
        geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
        geometry.setIndex(index);
        const material = new THREE.ShaderMaterial({
          vertexShader,
          fragmentShader,
          transparent: true,
          depthWrite: false,
          depthTest: false,
          side: THREE.DoubleSide,
          blending: THREE.CustomBlending,
          blendSrc: THREE.OneFactor,
          blendDst: THREE.OneMinusSrcAlphaFactor,
          uniforms: {
            map: { value: null },
            cardSize: { value: new THREE.Vector2(CARD_W, CARD_W) },
            radius: { value: cfg.radius },
            coverScale: { value: new THREE.Vector2(1, 1) },
            hazeColor: { value: new THREE.Color(0.499999, 0.5, 0.5) },
            speedSmear: { value: 0 },
            smearScale: { value: 1 },
            fringeScale: { value: 1 },
            hazeScale: { value: 1 },
            side: { value: 1 },
            fade: { value: 0 },
            hazeSpread: { value: 0.0700001 },
            opacity: { value: 1 },
            brightness: { value: 1 },
            saturation: { value: 1 },
            sheen: { value: 0 },
            rim: { value: 0 },
            frost: { value: 0 },
            exitOptics: { value: 1 }
          }
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.frustumCulled = false;
        mesh.visible = false;
        world.add(mesh);
        return { mesh, positions, exits, material, image: -1, born: 0 };
      });
    }

    // Every picture is loaded once. The track usually holds fewer cards than
    // there are pictures, so a card takes its next picture each time it passes
    // behind the lens, where the swap cannot be seen, and all of them come round.
    let pictures = [];
    let sources = [];
    // A picture that cannot be read (no CORS header, a broken link) becomes a
    // neutral card instead of a hole in the corridor.
    const blank = new THREE.DataTexture(new Uint8Array([206, 206, 206, 255]), 1, 1);
    blank.colorSpace = THREE.SRGBColorSpace;
    blank.needsUpdate = true;

    function averageColor(image) {
      const color = new THREE.Color(0.499999, 0.5, 0.5);
      try {
        const c = document.createElement('canvas');
        c.width = c.height = 8;
        const g = c.getContext('2d', { willReadFrequently: true });
        g.drawImage(image, 0, 0, 8, 8);
        const d = g.getImageData(0, 0, 8, 8).data;
        let r = 0, gg = 0, b = 0;
        for (let i = 0; i < d.length; i += 4) { r += d[i]; gg += d[i + 1]; b += d[i + 2]; }
        const n = d.length / 4;
        color.setRGB(r / n / 255, gg / n / 255, b / n / 255);
      } catch { /* keep the neutral haze */ }
      // Push the haze toward the card's dominant hue so it reads as coloured
      // light rather than a grey shadow.
      const hsl = {};
      color.getHSL(hsl);
      color.setHSL((hsl.h + 0.0399999) % 1, Math.min(1, hsl.s * 1.49999 + 0.149999), Math.min(0.620001, Math.max(0.42, hsl.l)));
      // Picked in sRGB; the shader mixes in linear light and encodes at the end.
      return color.convertSRGBToLinear();
    }

    function syncPictures() {
      const next = cfg.images.length ? cfg.images : [];
      if (JSON.stringify(next) === JSON.stringify(sources)) return;
      for (const pic of pictures) pic.texture?.dispose();
      sources = [...next];
      for (const card of cards) card.image = -1;
      root.removeAttribute('data-tf-loaded');
      pictures = sources.map((src) => {
        const pic = { texture: null, aspect: 1, haze: new THREE.Color(0.5, 0.500001, 0.500001), done: false };
        loader.load(
          src,
          (texture) => {
            if (disposed || !pictures.includes(pic)) { texture.dispose(); return; }
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.anisotropy = Math.min(8, maxAniso);
            texture.minFilter = THREE.LinearMipmapLinearFilter;
            const img = texture.image;
            pic.aspect = (img.naturalWidth || img.width) / (img.naturalHeight || img.height) || 1;
            pic.haze.copy(averageColor(img));
            pic.texture = texture;
            pic.done = true;
            settled();
            invalidate();
          },
          undefined,
          () => {
            if (!pictures.includes(pic)) return;
            pic.texture = null;
            pic.done = true;
            settled();
            invalidate();
          }
        );
        return pic;
      });
      settled();
    }

    // Every picture has answered, loaded or failed: a recording waits on this
    // so no card fades in partway through the clip.
    function settled() {
      if (pictures.every((pic) => pic.done)) root.setAttribute('data-tf-loaded', '');
    }

    const coverFor = (pic, out) => out.set(pic.aspect > 1 ? 1 / pic.aspect : 1, pic.aspect > 1 ? 1 : pic.aspect);

    function assignPicture(card, imageIndex, now) {
      const pic = pictures[imageIndex];
      if (!pic?.done) return false;
      if (card.image !== imageIndex) {
        const u = card.material.uniforms;
        u.map.value = pic.texture ?? blank;
        coverFor(pic, u.coverScale.value);
        u.hazeColor.value.copy(pic.haze);
        // Only the first appearance fades in; later swaps happen out of sight.
        if (card.image === -1) card.born = now;
        card.image = imageIndex;
      }
      return true;
    }

    // The prism exit pass, built the first time `prism` goes above 0 and
    // freed when it returns to 0: the tool itself never pays for it.
    /** @type {null | { target: any, material: any, scene: any, camera: any, size: any }} */
    let post = null;
    let bgDirty = true;
    function ensurePost() {
      if (!post) {
        const material = new THREE.ShaderMaterial({
          vertexShader: postVertexShader,
          fragmentShader: postFragmentShader,
          depthTest: false,
          depthWrite: false,
          blending: THREE.NoBlending,
          uniforms: {
            tScene: { value: null },
            uRes: { value: new THREE.Vector2(1, 1) },
            uBg: { value: new THREE.Vector4(0, 0, 0, 0) },
            uPrism: { value: 0 },
            uReach: { value: 1 },
            uGlass: { value: 1 },
            uSmear: { value: 1 }
          }
        });
        const quad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
        quad.frustumCulled = false;
        const scene = new THREE.Scene();
        scene.add(quad);
        // Same bytes as the canvas: an 8-bit target with no colour conversion,
        // multisampled like the antialiased canvas.
        const target = new THREE.WebGLRenderTarget(1, 1, { samples: 4, depthBuffer: false });
        post = { target, material, scene, camera: new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), size: new THREE.Vector2() };
        material.uniforms.tScene.value = target.texture;
        bgDirty = true;
        sizePost();
      }
      return post;
    }
    function sizePost() {
      if (!post) return;
      renderer.getDrawingBufferSize(post.size);
      post.target.setSize(post.size.x, post.size.y);
      post.material.uniforms.uRes.value.copy(post.size);
    }
    function freePost() {
      if (!post) return;
      post.target.dispose();
      post.material.dispose();
      post.scene.children[0].geometry.dispose();
      post = null;
    }
    // The stage colour, premultiplied, read from the root's CSS background.
    function syncBackground() {
      bgDirty = false;
      const m = getComputedStyle(root).backgroundColor.match(/[\d.]+/g);
      const [r, g, b, a = 1] = m ? m.map(Number) : [0, 0, 0, 0];
      post.material.uniforms.uBg.value.set((r / 255) * a, (g / 255) * a, (b / 255) * a, a);
    }

    let width = 1;
    let height = 1;
    let exitStart = 4;
    function resize() {
      width = Math.max(1, stage.clientWidth);
      height = Math.max(1, stage.clientHeight);
      renderer.setSize(width, height, false);
      sizePost();
      const cam = cameraFor(width, height, cfg.zoom, cfg);
      camera.fov = cam.vfov;
      camera.aspect = cam.aspect;
      camera.updateProjectionMatrix();
      exitStart = cam.exitStart;
      if (cam.track !== track) {
        // Keep the track's phase, so a resize does not jump the pictures.
        motion.scroll *= cam.track.length / track.length;
        track = cam.track;
        if (cardCount(cfg.gap, track) !== cards.length) buildCards();
        else spacing = track.length / cards.length;
      }
      invalidate();
    }
    const resizeObserver = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
    resizeObserver?.observe(stage);

    const p = { x: 0, z: 0 };
    const h = { x: 0, z: 0 };
    let announced = -1;

    function render(now, speed) {
      const count = cards.length;
      const n = pictures.length;
      const calm = reduced();
      const speedSmear = calm ? 0 : Math.min(0.12, Math.max(0, Math.abs(speed) - 2) * 0.01) * cfg.motionBlur;
      const hingeSign = motion.fold >= 0 ? 1 : -1;
      let nearest = -1;
      let nearestDist = Infinity;
      let fading = false;

      for (let i = 0; i < count; i++) {
        const card = cards[i];
        const { mesh, positions, exits, material } = card;
        const raw = i * spacing + motion.scroll;
        const centre = wrapSigned(raw, track);
        const lap = Math.floor((raw + track.half) / track.length);
        // Behind the lens, or the picture is still loading: skip the work.
        if (!n || Math.abs(centre) > track.half - 1.20001 || !assignPicture(card, pictureFor(i, lap, count, n), now)) {
          mesh.visible = false;
          continue;
        }
        mesh.visible = true;

        // The fold belongs to the cards inside the frame. Near the lens a small
        // swing becomes a huge sweep across the screen, so it fades out before
        // the exit optics take over.
        const t = Math.min(1, Math.max(0, (Math.abs(centre) - (exitStart - 4)) / 3.20001));
        const cardFold = motion.fold * (1 - t * t * (3 - 2 * t));
        const cosF = Math.cos(cardFold);
        const sinF = Math.sin(cardFold);

        // Hinge on the leading edge (the edge the track is moving toward).
        trackAt(warp(centre + hingeSign * CARD_W * 0.499999, exitStart, cfg.flare, track), h, track);

        let k = 0;
        for (let c = 0; c <= COLUMNS; c++) {
          const u = -MARGIN_U + (c / COLUMNS) * (1 + 2 * MARGIN_U);
          const a = centre + (u - 0.499999) * CARD_W;
          cardPoint(a, h, cosF, sinF, exitStart, cfg.flare, track, p);
          const { x, z } = p;
          const ex = exitAmount(a, exitStart) * Math.min(1, cfg.flare);
          positions[k] = x; positions[k + 1] = -CARD_W * (0.500001 + MARGIN_V); positions[k + 2] = z;
          positions[k + 3] = x; positions[k + 4] = CARD_W * (0.499999 + MARGIN_V); positions[k + 5] = z;
          exits[c * 2] = ex;
          exits[c * 2 + 1] = ex;
          k += 6;
        }
        mesh.geometry.attributes.position.needsUpdate = true;
        mesh.geometry.attributes.exitAmt.needsUpdate = true;

        trackAt(centre, p, track);
        // Far cards are drawn first; the near, smeared ones go on top.
        mesh.renderOrder = Math.round(-Math.hypot(p.x, p.z) * 1000);

        const u = material.uniforms;
        u.side.value = centre >= 0 ? 1 : -1;
        u.speedSmear.value = speedSmear;
        u.smearScale.value = (calm ? 0.25 : 1) * cfg.flare * cfg.blur;
        u.fringeScale.value = (calm ? 0.300001 : 1) * cfg.fringe;
        u.hazeScale.value = cfg.haze;
        u.radius.value = cfg.radius;
        u.hazeSpread.value = cfg.hazeSpread;
        u.opacity.value = cfg.opacity;
        u.brightness.value = cfg.brightness;
        u.saturation.value = cfg.saturation;
        u.sheen.value = cfg.sheen;
        u.rim.value = cfg.rim;
        u.frost.value = cfg.frost;
        u.exitOptics.value = Math.max(0, 1 - cfg.prism * 2);
        u.fade.value = Math.min(1, (now - card.born) / 600);
        if (u.fade.value < 1) fading = true;

        if (Math.abs(centre) < nearestDist) {
          nearestDist = Math.abs(centre);
          nearest = i;
        }
      }

      // Announce the card at the far end only when the track settles on one
      // after the visitor moved it; the cruise itself stays quiet.
      if (live && !cfg.preview && nearest >= 0 && Math.abs(speed) < 1 && nearest !== announced && now - motion.lastInput < 4000) {
        announced = nearest;
        live.textContent = `Image ${cards[nearest].image + 1} of ${n}`;
      }

      if (cfg.prism > 0) {
        const pass = ensurePost();
        if (bgDirty) syncBackground();
        const pu = pass.material.uniforms;
        pu.uPrism.value = cfg.prism;
        pu.uReach.value = cfg.prismReach;
        pu.uGlass.value = cfg.prismGlass;
        pu.uSmear.value = calm ? 0.249999 : 1;
        renderer.setRenderTarget(pass.target);
        renderer.render(world, camera);
        renderer.setRenderTarget(null);
        renderer.render(pass.scene, pass.camera);
      } else {
        freePost();
        renderer.render(world, camera);
      }
      return fading;
    }

    // Frames run while the track moves or a spring settles; a paused, settled
    // slider costs nothing, and one scrolled out of view or in a hidden tab
    // stops until it returns.
    let frame = 0;
    let last = 0;
    function tick() {
      frame = 0;
      if (disposed) return;
      const now = performance.now();
      const dt = last ? Math.min(0.0500001, (now - last) / 1000) : 1 / 60;
      last = now;

      const target = cruise();
      if (!motion.dragging) {
        motion.velocity += (target - motion.velocity) * (1 - Math.exp(-dt / EASE_BACK));
        if (Math.abs(motion.velocity - target) < 1e-4) motion.velocity = target;
        motion.scroll += motion.velocity * dt;
      } else {
        motion.dragVel *= Math.exp(-dt / 0.12);
      }
      const speed = motion.dragging ? motion.dragVel : motion.velocity;

      // Door fold target from momentum above the cruise speed.
      const over = Math.max(0, Math.abs(speed) - FOLD_DEADZONE) / FOLD_FULL;
      const foldTarget = reduced() ? 0 : Math.sign(speed) * FOLD_MAX * cfg.fold * Math.min(1, over);
      [motion.fold, motion.foldVel] = springStep(motion.fold, motion.foldVel, foldTarget, dt, cfg.foldSpring);
      if (Math.abs(motion.fold - foldTarget) < 1e-5 && Math.abs(motion.foldVel) < 1e-5) {
        motion.fold = foldTarget;
        motion.foldVel = 0;
      }

      const visible = onScreen && !document.hidden;
      const fading = visible ? render(now, speed) : false;
      const moving = motion.dragging || motion.velocity !== 0 || motion.foldVel !== 0 || motion.fold !== foldTarget;
      const loading = pictures.some((pic) => !pic.done);
      if (visible && (moving || fading || loading)) frame = requestAnimationFrame(tick);
      else last = 0;
    }
    function invalidate() {
      if (!frame && !disposed) frame = requestAnimationFrame(tick);
    }

    const lost = (e) => { e.preventDefault(); cancelAnimationFrame(frame); frame = 0; };
    const restored = () => {
      for (const pic of pictures) if (pic.texture) pic.texture.needsUpdate = true;
      blank.needsUpdate = true;
      invalidate();
    };
    canvas.addEventListener('webglcontextlost', lost);
    canvas.addEventListener('webglcontextrestored', restored);

    buildCards();
    syncPictures();
    resize();
    root.setAttribute('data-tf-ready', '');

    return {
      invalidate,
      renderNow() {
        render(performance.now(), motion.velocity);
      },
      update(previous) {
        const view = (c) => `${c.zoom}|${c.widen}|${c.exitLead}`;
        if (view(cfg) !== view(previous)) resize();
        bgDirty = true;
        const previousGap = previous.gap;
        if (cardCount(cfg.gap, track) !== cardCount(previousGap, track)) buildCards();
        syncPictures();
        invalidate();
      },
      destroy() {
        cancelAnimationFrame(frame);
        resizeObserver?.disconnect();
        canvas.removeEventListener('webglcontextlost', lost);
        canvas.removeEventListener('webglcontextrestored', restored);
        for (const card of cards) {
          card.mesh.geometry.dispose();
          card.material.dispose();
        }
        cards = [];
        for (const pic of pictures) pic.texture?.dispose();
        pictures = [];
        blank.dispose();
        freePost();
        renderer.dispose();
        // Free the context now rather than whenever the collector gets to it:
        // an editor that rebuilds would otherwise run into the browser's cap.
        renderer.forceContextLoss();
        canvas.remove();
      }
    };
  }

  if (!webglAvailable()) {
    fail();
  } else {
    import('three')
      .then((THREE) => {
        if (disposed) return;
        scene = createScene(THREE);
      })
      .catch(fail);
  }

  return {
    setConfig(next) {
      if (disposed) return;
      const previous = cfg;
      cfg = { ...ENGINE_DEFAULTS, ...next };
      if (cfg.playing !== previous.playing) userPaused = false;
      syncToggle();
      scene?.update(previous);
    },
    // Places the track at an exact moment of its cruise, settled: no fold, no
    // fade-in. The thumbnail recorder uses it; the editor never calls it.
    setTime(seconds) {
      if (disposed || !Number.isFinite(seconds)) return;
      motion.scroll = Math.max(0, seconds) * CRUISE * cfg.speed;
      motion.velocity = cruise();
      motion.fold = 0;
      motion.foldVel = 0;
      scene?.renderNow();
      scene?.invalidate();
    },
    get scroll() { return motion.scroll; },
    destroy() {
      disposed = true;
      cleanups.forEach((cleanup) => cleanup());
      cleanups.length = 0;
      scene?.destroy();
      scene = null;
      root.removeAttribute('data-tf-ready');
      root.removeAttribute('data-tf-loaded');
      root.removeAttribute('data-dragging');
    }
  };
}

export { buildTunnelFoldSlider };
