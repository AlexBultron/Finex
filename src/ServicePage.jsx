import React from 'react';
import { ArrowUpRight, Check, ChevronRight, ChevronDown } from 'lucide-react';

const FONT = 'DM Sans, Arial, sans-serif';

/* ====================== Vector graphics (illustrative only) ====================== */

export function GrowthChart() {
  const heights = [52, 78, 104, 136, 172, 212];
  const base = 262;
  const barW = 38;
  const xs = heights.map((_, i) => 40 + i * 68);
  const pts = heights.map((h, i) => [xs[i] + barW / 2, base - h - 16]);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ');
  return (
    <svg className="sp-chart" viewBox="0 0 480 300" role="img" aria-label="Illustration of business growth rising over time">
      <defs>
        <linearGradient id="spBar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5db996" stopOpacity="1" />
          <stop offset="100%" stopColor="#5db996" stopOpacity=".25" />
        </linearGradient>
        <linearGradient id="spArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5db996" stopOpacity=".22" />
          <stop offset="100%" stopColor="#5db996" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => <line key={i} x1="24" x2="456" y1={62 + i * 66} y2={62 + i * 66} stroke="#e6efe9" strokeWidth="1" strokeDasharray="4 6" />)}
      <line x1="24" x2="456" y1={base} y2={base} stroke="#cfe3d9" strokeWidth="1.5" />
      {heights.map((h, i) => (
        <rect key={i} className="sp-bar" style={{ animationDelay: `${i * 90}ms` }} x={xs[i]} y={base - h} width={barW} height={h} rx="8" fill="url(#spBar)" />
      ))}
      <path d={`${line} L${pts[5][0]} ${base} L${pts[0][0]} ${base} Z`} fill="url(#spArea)" />
      <path className="sp-line" d={line} fill="none" stroke="#2f8f6c" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i === 5 ? 7 : 4.5} fill="#fff" stroke="#2f8f6c" strokeWidth="3" />)}
      <g transform={`translate(${pts[5][0] - 14} ${pts[5][1] - 40})`}>
        <rect width="64" height="24" rx="12" fill="#2f8f6c" />
        <text x="32" y="16.5" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily={FONT}>Growth</text>
      </g>
      <text x="40" y="286" fontSize="11" fill="#7a8a83" fontFamily={FONT} letterSpacing="1">TODAY</text>
      <text x="456" y="286" textAnchor="end" fontSize="11" fill="#7a8a83" fontFamily={FONT} letterSpacing="1">AFTER EXPANSION</text>
    </svg>
  );
}

/** Small shop with awning, coins and a rising bar badge (MSME). */
export function StorefrontArt() {
  const stripes = Array.from({ length: 8 }, (_, i) => i);
  return (
    <svg className="sp-chart" viewBox="0 0 480 300" role="img" aria-label="Illustration of a small business storefront with coins and growth bars">
      <defs>
        <linearGradient id="stWall" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#eaf6f0" />
        </linearGradient>
      </defs>
      <ellipse cx="240" cy="270" rx="200" ry="12" fill="#dcebe4" />
      {/* shop body */}
      <rect x="110" y="120" width="220" height="146" rx="10" fill="url(#stWall)" stroke="#cfe3d9" strokeWidth="2" />
      {/* awning */}
      <g>
        {stripes.map((i) => (
          <path key={i} d={`M${100 + i * 35} 78 h35 l-5 44 h-35 z`} fill={i % 2 ? '#fff' : '#5db996'} stroke="#2f8f6c" strokeWidth="1.5" strokeLinejoin="round" />
        ))}
        <path d="M100 78 h280 l8 -22 h-296 z" fill="#2f8f6c" opacity=".9" />
      </g>
      {/* door + window */}
      <rect x="136" y="162" width="62" height="104" rx="6" fill="#2f8f6c" />
      <circle cx="187" cy="218" r="3.5" fill="#fff" />
      <rect x="216" y="160" width="96" height="62" rx="8" fill="#e6f5ee" stroke="#9fd3bd" strokeWidth="2" />
      <path d="M228 206l20-18 16 12 22-26 14 14" fill="none" stroke="#2f8f6c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      {/* open sign */}
      <g transform="translate(222 232)">
        <rect width="84" height="24" rx="12" fill="#fff" stroke="#5db996" strokeWidth="2" />
        <text x="42" y="16.5" textAnchor="middle" fontSize="11" fontWeight="800" fill="#2f8f6c" fontFamily={FONT} letterSpacing="2">OPEN</text>
      </g>
      {/* coins */}
      {[0, 1, 2, 3].map((i) => <ellipse key={i} cx="396" cy={256 - i * 11} rx="30" ry="9" fill="#5db996" stroke="#2f8f6c" strokeWidth="2" />)}
      <ellipse cx="396" cy="212" rx="30" ry="9" fill="#8fd4b8" stroke="#2f8f6c" strokeWidth="2" />
      <text x="396" y="216" textAnchor="middle" fontSize="11" fontWeight="800" fill="#1f6b50" fontFamily={FONT}>₱</text>
      {/* floating growth badge */}
      <g className="sp-float" transform="translate(344 64)">
        <rect width="110" height="76" rx="16" fill="#fff" stroke="#d6eadf" strokeWidth="2" />
        {[0, 1, 2, 3].map((i) => <rect key={i} x={16 + i * 22} y={58 - (14 + i * 11)} width="14" height={14 + i * 11} rx="4" fill="#5db996" opacity={0.45 + i * 0.18} />)}
        <path d="M18 40l24-12 22 6 26-22" fill="none" stroke="#2f8f6c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* plant */}
      <g>
        <rect x="64" y="236" width="26" height="30" rx="5" fill="#2f8f6c" />
        <path d="M77 236c-18-8-24-26-20-44 16 6 24 20 20 44zM77 236c18-8 24-26 20-44-16 6-24 20-20 44z" fill="#5db996" />
      </g>
    </svg>
  );
}

/** Skyline with a rising trend line (Corporate). */
export function SkylineArt() {
  const buildings = [
    { x: 40, w: 56, h: 110 }, { x: 104, w: 70, h: 170 }, { x: 182, w: 62, h: 130 },
    { x: 252, w: 78, h: 210 }, { x: 338, w: 60, h: 150 }, { x: 406, w: 50, h: 100 }
  ];
  const base = 262;
  return (
    <svg className="sp-chart" viewBox="0 0 480 300" role="img" aria-label="Illustration of a city skyline with a rising trend line">
      <defs>
        <linearGradient id="skBld" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#5db996" />
          <stop offset="100%" stopColor="#2f8f6c" />
        </linearGradient>
      </defs>
      <line x1="20" x2="460" y1={base} y2={base} stroke="#cfe3d9" strokeWidth="2" />
      {buildings.map((b, i) => (
        <g key={i} className="sp-bar" style={{ animationDelay: `${i * 110}ms` }}>
          <rect x={b.x} y={base - b.h} width={b.w} height={b.h} rx="6" fill={i % 2 ? 'url(#skBld)' : '#8fd4b8'} />
          {Array.from({ length: Math.floor(b.h / 26) }, (_, r) => Array.from({ length: Math.max(2, Math.floor(b.w / 22)) }, (_, c) => (
            <rect key={`${r}-${c}`} x={b.x + 10 + c * 18} y={base - b.h + 12 + r * 24} width="9" height="12" rx="2" fill="#fff" opacity={(r + c) % 3 === 0 ? 0.35 : 0.8} />
          )))}
        </g>
      ))}
      <path className="sp-line" d="M36 150 C 120 130, 160 120, 230 84 S 370 50, 452 24" fill="none" stroke="#1f6b50" strokeWidth="4" strokeLinecap="round" strokeDasharray="640" />
      <path d="M452 24l-18 2 8 12z" fill="#1f6b50" transform="rotate(8 452 24)" />
      {[[36, 150], [230, 84], [452, 24]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="6" fill="#fff" stroke="#1f6b50" strokeWidth="3" />)}
      <g className="sp-float" transform="translate(40 30)">
        <rect width="104" height="30" rx="15" fill="#fff" stroke="#d6eadf" strokeWidth="2" />
        <circle cx="16" cy="15" r="6" fill="#5db996" />
        <text x="62" y="19.5" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1d2b26" fontFamily={FONT}>Large-scale</text>
      </g>
    </svg>
  );
}

export const HERO_VISUALS = { growth: GrowthChart, store: StorefrontArt, skyline: SkylineArt };

/** Roadmap: three numbered milestones on a rising path. */
export function Roadmap({ steps = ['Scale operations', 'Upgrade equipment', 'Enter new markets'] }) {
  const nodes = [[70, 238], [250, 160], [450, 66]];
  return (
    <svg className="sp-roadmap" viewBox="0 0 520 300" role="img" aria-label={`Growth roadmap: ${steps.join(', then ')}`}>
      <defs>
        <linearGradient id="spPath" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#bfe5d4" />
          <stop offset="100%" stopColor="#2f8f6c" />
        </linearGradient>
      </defs>
      <path d="M70 238 C 155 238, 165 160, 250 160 S 370 66, 450 66" fill="none" stroke="#e3f1eb" strokeWidth="16" strokeLinecap="round" />
      <path d="M70 238 C 155 238, 165 160, 250 160 S 370 66, 450 66" fill="none" stroke="url(#spPath)" strokeWidth="5" strokeLinecap="round" strokeDasharray="2 12" />
      {nodes.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="26" fill="#5db996" opacity=".18" />
          <circle cx={x} cy={y} r="18" fill="#5db996" />
          <text x={x} y={y + 5.5} textAnchor="middle" fontSize="16" fontWeight="800" fill="#fff" fontFamily={FONT}>{i + 1}</text>
          <text x={x} y={y + 50} textAnchor="middle" fontSize="13" fontWeight="700" fill="#1d2b26" fontFamily={FONT}>{steps[i]}</text>
        </g>
      ))}
      <line x1="488" x2="488" y1="22" y2="66" stroke="#2f8f6c" strokeWidth="3" strokeLinecap="round" />
      <path d="M488 22l20 8-20 8z" fill="#2f8f6c" />
    </svg>
  );
}

/** Cash-flow loop: four stages that keep a small business turning (MSME). */
export function CycleDiagram({ items = ['Buy inventory', 'Sell & serve', 'Collect payments', 'Reinvest'] }) {
  const pill = (cx, cy, text, i) => (
    <g key={text}>
      <rect x={cx - 72} y={cy - 22} width="144" height="44" rx="22" fill={i === 0 ? '#5db996' : '#fff'} stroke="#5db996" strokeWidth="2" />
      <text x={cx} y={cy + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill={i === 0 ? '#fff' : '#1d2b26'} fontFamily={FONT}>{text}</text>
    </g>
  );
  return (
    <svg className="sp-roadmap" viewBox="0 0 520 300" role="img" aria-label={`Business cash-flow cycle: ${items.join(', ')}`}>
      <defs>
        <marker id="cyArrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0L10 5L0 10z" fill="#2f8f6c" />
        </marker>
      </defs>
      <g fill="none" stroke="#2f8f6c" strokeWidth="2.5" strokeLinecap="round" markerEnd="url(#cyArrow)">
        <path d="M332 40 Q430 40 430 126" />
        <path d="M430 174 Q430 260 332 260" />
        <path d="M188 260 Q90 260 90 174" />
        <path d="M90 126 Q90 40 188 40" />
      </g>
      <circle cx="260" cy="150" r="52" fill="#edf8f3" stroke="#bfe5d4" strokeWidth="2" />
      <text x="260" y="146" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1f6b50" fontFamily={FONT}>Working</text>
      <text x="260" y="163" textAnchor="middle" fontSize="13" fontWeight="800" fill="#1f6b50" fontFamily={FONT}>capital</text>
      {pill(260, 40, items[0], 0)}
      {pill(430, 150, items[1], 1)}
      {pill(260, 260, items[2], 2)}
      {pill(90, 150, items[3], 3)}
    </svg>
  );
}

/** Hub and spokes: customized financing at the centre (Corporate). */
export function HubDiagram({ items = ['Major projects', 'Mergers', 'Acquisitions', 'Expansion'] }) {
  const spots = [[110, 52], [410, 52], [110, 248], [410, 248]];
  return (
    <svg className="sp-roadmap" viewBox="0 0 520 300" role="img" aria-label={`Customized financing connects to: ${items.join(', ')}`}>
      {spots.map(([x, y], i) => <line key={i} x1="260" y1="150" x2={x} y2={y} stroke="#bfe5d4" strokeWidth="3" strokeDasharray="3 9" strokeLinecap="round" />)}
      <circle cx="260" cy="150" r="66" fill="#5db996" opacity=".15" />
      <circle cx="260" cy="150" r="50" fill="#2f8f6c" />
      <text x="260" y="146" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily={FONT}>Customized</text>
      <text x="260" y="163" textAnchor="middle" fontSize="13" fontWeight="800" fill="#fff" fontFamily={FONT}>financing</text>
      {spots.map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 76} y={y - 22} width="152" height="44" rx="22" fill="#fff" stroke="#5db996" strokeWidth="2" />
          <circle cx={x - 54} cy={y} r="9" fill="#5db996" />
          <text x={x - 54} y={y + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill="#fff" fontFamily={FONT}>{i + 1}</text>
          <text x={x + 8} y={y + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill="#1d2b26" fontFamily={FONT}>{items[i]}</text>
        </g>
      ))}
    </svg>
  );
}

const DIAGRAMS = { roadmap: Roadmap, cycle: CycleDiagram, hub: HubDiagram };

/* ====================== Shared content ====================== */

// Generic application journey, shown on every service page. Edit to match your real process.
const DEFAULT_PROCESS = [
  { title: 'Reach out', text: 'Contact FINEX.PH and tell us about your business and what you would like to fund.' },
  { title: 'Consultation', text: 'We learn about your goals and point you to the financing that fits.' },
  { title: 'Application', text: 'Submit your application along with the documents our team asks for.' },
  { title: 'Review', text: 'Our team reviews your application and talks through the terms with you.' },
  { title: 'Funding', text: 'Once approved, funds are released so you can get to work.' }
];

const TRUST = [
  { value: '1K+', label: 'Partners' },
  { value: '5+ Years', label: 'in the Philippines' }
];

/* ====================== Reusable service page template ====================== */

export default function ServicePage({ page }) {
  const {
    eyebrow, title, intro, chips = [], heroVisual = 'growth', visualTitle = 'Growth, illustrated',
    pillars = [], pillarsLabel = 'WHAT IT HELPS YOU DO', pillarsHeading = 'Financing built around your goals.',
    build, idealFor, compare, process = DEFAULT_PROCESS, faq = [], cta
  } = page;
  const Hero = HERO_VISUALS[heroVisual] || GrowthChart;
  const Diagram = DIAGRAMS[build?.diagram?.type] || Roadmap;
  const ctaHref = cta?.href || '#/contact';

  return (
    <div className="sp">
      {/* Hero */}
      <section className="sp-hero">
        <div className="sp-hero-copy">
          <nav className="sp-crumbs" aria-label="Breadcrumb">
            <a href="#/">Home</a><ChevronRight size={13} /><span>{eyebrow}</span><ChevronRight size={13} /><span aria-current="page">{title}</span>
          </nav>
          <span className="sp-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          <p className="sp-intro">{intro}</p>
          {chips.length > 0 && <ul className="sp-chips">{chips.map((c) => <li key={c}><Check size={14} strokeWidth={3} />{c}</li>)}</ul>}
          <div className="sp-actions">
            <a className="primary-button" href={ctaHref}>Contact Us <ArrowUpRight size={15} /></a>
            <a className="text-button" href="#/">Back to home <ArrowUpRight size={15} /></a>
          </div>
        </div>
        <div className="sp-hero-visual">
          <div className="sp-card">
            <div className="sp-card-head"><span>{visualTitle}</span><i>Illustration only</i></div>
            <Hero />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="sp-trust" aria-label="About FINEX.PH">
        {TRUST.map((t) => <div key={t.label}><strong>{t.value}</strong><span>{t.label}</span></div>)}
        <p>Trusted by businesses across the Philippines.</p>
      </section>

      {/* What it covers */}
      {pillars.length > 0 && (
        <section className="sp-section">
          <div className="sp-label">{pillarsLabel}</div>
          <h2>{pillarsHeading}</h2>
          <div className="sp-pillars">
            {pillars.map(({ icon: Icon, title: t, text }) => (
              <article key={t} className="sp-pillar">
                <span className="sp-icon"><Icon size={22} strokeWidth={1.9} /></span>
                <h3>{t}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Overview + diagram */}
      {build && (
        <section className="sp-section sp-split">
          <div className="sp-split-copy">
            <div className="sp-label">{build.label}</div>
            <h2>{build.heading}</h2>
            {build.paragraphs.map((p) => <p key={p}>{p}</p>)}
          </div>
          <div className="sp-card sp-card-soft"><Diagram {...(build.diagram?.items ? { [build.diagram.type === 'roadmap' ? 'steps' : 'items']: build.diagram.items } : {})} /></div>
        </section>
      )}

      {/* Who it's for */}
      {idealFor && (
        <section className="sp-section">
          <div className="sp-label">{idealFor.label}</div>
          <h2>{idealFor.heading}</h2>
          <div className="sp-ideal">
            {idealFor.items.map((it) => (
              <div key={it.title} className="sp-ideal-item">
                <span className="sp-tick"><Check size={16} strokeWidth={3} /></span>
                <div><h3>{it.title}</h3><p>{it.text}</p></div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Comparison (optional) */}
      {compare && (
        <section className="sp-section">
          <div className="sp-label">{compare.label}</div>
          <h2>{compare.heading}</h2>
          {compare.paragraphs.map((p) => <p className="sp-lead" key={p}>{p}</p>)}
          <div className="sp-compare" role="table" aria-label="Comparison of loan types">
            <div className="sp-row sp-row-head" role="row">
              <div role="columnheader" />
              <div role="columnheader" className="is-main">{compare.columns[0]}</div>
              <div role="columnheader">{compare.columns[1]}</div>
            </div>
            {compare.rows.map((r) => (
              <div className="sp-row" role="row" key={r.label}>
                <div role="rowheader" className="sp-row-label">{r.label}</div>
                <div role="cell" className="is-main" data-col={compare.columns[0]}>{r.a}</div>
                <div role="cell" data-col={compare.columns[1]}>{r.b}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Process timeline */}
      <section className="sp-section">
        <div className="sp-label">HOW TO GET STARTED</div>
        <h2>Five simple steps.</h2>
        <ol className="sp-steps">
          {process.map((s, i) => (
            <li key={s.title} className="sp-step">
              <span className="sp-step-num">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      {faq.length > 0 && (
        <section className="sp-section sp-faq-wrap">
          <div>
            <div className="sp-label">QUESTIONS</div>
            <h2>Good to know.</h2>
            <p className="sp-lead">Can't find what you're looking for? Our team is happy to help.</p>
            <a className="text-button" href="#/contact">Ask our team <ArrowUpRight size={15} /></a>
          </div>
          <div className="sp-faq">
            {faq.map((f) => (
              <details key={f.q} className="sp-faq-item">
                <summary>{f.q}<ChevronDown size={18} /></summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      {cta && (
        <section className="sp-cta">
          <div>
            <span>{cta.label}</span>
            <h2>{cta.heading}</h2>
            <p>{cta.text}</p>
          </div>
          <a className="primary-button" href={ctaHref}>Contact Us <ArrowUpRight size={15} /></a>
        </section>
      )}
    </div>
  );
}