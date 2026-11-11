import React, { useEffect, useMemo, useState } from 'react';
import { ArrowUpRight, ChevronDown, ChevronRight, Clock, Search, Users, Wallet } from 'lucide-react';
import { faqs } from './infoData.js';

const FONT = 'DM Sans, Arial, sans-serif';

/* Turns urls and email addresses inside plain text into links. */
function linkify(text) {
  const parts = text.split(/(https?:\/\/[^\s,;)]*[^\s,;).]|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g);
  return parts.map((part, i) => {
    if (i % 2 === 0) return part;
    if (part.includes('@') && !part.startsWith('http')) return <a key={i} href={`mailto:${part}`}>{part}</a>;
    return <a key={i} href={part} target="_blank" rel="noopener noreferrer">{part}</a>;
  });
}

const scrollToId = (id) => (e) => {
  e.preventDefault(); // the site uses #/ routes, so never let the hash change
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

function Crumbs({ trail, current }) {
  return (
    <nav className="sp-crumbs" aria-label="Breadcrumb">
      <a href="#/">Home</a>
      {trail.map((t) => <React.Fragment key={t}><ChevronRight size={13} /><span>{t}</span></React.Fragment>)}
      <ChevronRight size={13} /><span aria-current="page">{current}</span>
    </nav>
  );
}

/* ====================== FAQ ====================== */

function FaqArt() {
  return (
    <svg className="sp-chart" viewBox="0 0 480 300" role="img" aria-label="Illustration of questions and answers">
      <defs>
        <linearGradient id="fqG" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7fd0b3" /><stop offset="100%" stopColor="#3fa37e" />
        </linearGradient>
      </defs>
      <circle cx="240" cy="150" r="124" fill="#edf8f3" />
      <circle cx="240" cy="150" r="88" fill="#e1f3ea" />
      <g className="sp-float">
        <circle cx="240" cy="140" r="62" fill="url(#fqG)" />
        <text x="240" y="170" textAnchor="middle" fontSize="88" fontWeight="800" fill="#fff" fontFamily={FONT}>?</text>
      </g>
      <g className="sp-float sp-float-2">
        <rect x="40" y="52" width="150" height="46" rx="23" fill="#fff" stroke="#bfe5d4" strokeWidth="2" />
        <circle cx="66" cy="75" r="11" fill="#5db996" />
        <rect x="86" y="68" width="82" height="8" rx="4" fill="#cfe3d9" />
        <rect x="86" y="82" width="56" height="7" rx="3.5" fill="#e3efe9" />
      </g>
      <g className="sp-float sp-float-3">
        <rect x="300" y="196" width="150" height="46" rx="23" fill="#fff" stroke="#bfe5d4" strokeWidth="2" />
        <circle cx="326" cy="219" r="11" fill="#2f8f6c" />
        <path d="M320 219l4 4 8-9" fill="none" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="346" y="212" width="82" height="8" rx="4" fill="#cfe3d9" />
        <rect x="346" y="226" width="56" height="7" rx="3.5" fill="#e3efe9" />
      </g>
      <path d="M190 90 C 215 80, 225 84, 238 90" fill="none" stroke="#9fd3bd" strokeWidth="2.5" strokeDasharray="2 9" strokeLinecap="round" />
    </svg>
  );
}

const QUICK_FACTS = [
  { icon: Clock, value: '3–7 days', label: 'Typical approval time', note: 'Business days, depending on your application and loan type' },
  { icon: Wallet, value: 'No penalty', label: 'Early repayment', note: 'An administrative fee applies to early termination' },
  { icon: Users, value: 'Co-maker', label: 'Required to apply', note: 'A co-borrower or co-maker adds security to your application' }
];

export function FaqPage() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(0);
  const items = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.map((f, i) => ({ ...f, n: i + 1 })).filter((f) => !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q));
  }, [query]);

  return (
    <div className="sp fq">
      <section className="sp-hero">
        <div className="sp-hero-copy">
          <Crumbs trail={['About']} current="FAQ" />
          <span className="sp-eyebrow">Support</span>
          <h1>Frequently asked questions</h1>
          <p className="sp-intro">Quick answers about loans with FINEX.PH. Can’t find what you’re looking for? Our team is happy to help.</p>
          <div className="sp-actions">
            <a className="primary-button" href="#/contact">Contact Us <ArrowUpRight size={15} /></a>
            <a className="text-button" href="#faq-list" onClick={scrollToId('faq-list')}>Browse questions <ArrowUpRight size={15} /></a>
          </div>
        </div>
        <div className="sp-hero-visual"><div className="sp-card"><FaqArt /></div></div>
      </section>

      <section className="fq-facts" aria-label="Quick facts">
        {QUICK_FACTS.map(({ icon: Icon, value, label, note }) => (
          <article key={label} className="fq-fact">
            <span className="sp-icon"><Icon size={22} strokeWidth={1.9} /></span>
            <div><strong>{value}</strong><b>{label}</b><p>{note}</p></div>
          </article>
        ))}
      </section>

      <section className="sp-section" id="faq-list">
        <div className="fq-bar">
          <div>
            <div className="sp-label">QUESTIONS &amp; ANSWERS</div>
            <h2>Everything you need to know.</h2>
          </div>
          <label className="fq-search">
            <Search size={17} />
            <input type="search" placeholder="Search questions" value={query} onChange={(e) => { setQuery(e.target.value); setOpen(-1); }} aria-label="Search questions" />
          </label>
        </div>

        <div className="fq-list">
          {items.map((f) => {
            const isOpen = open === f.n - 1;
            return (
              <article key={f.q} className={`fq-item ${isOpen ? 'is-open' : ''}`}>
                <h3>
                  <button type="button" aria-expanded={isOpen} aria-controls={`fq-a-${f.n}`} onClick={() => setOpen(isOpen ? -1 : f.n - 1)}>
                    <span className="fq-num">{String(f.n).padStart(2, '0')}</span>
                    <span className="fq-q">{f.q}</span>
                    <ChevronDown size={20} />
                  </button>
                </h3>
                <div className="fq-panel" id={`fq-a-${f.n}`} role="region">
                  <div><p>{f.a}</p></div>
                </div>
              </article>
            );
          })}
          {items.length === 0 && (
            <div className="fq-empty">
              <strong>No matching questions.</strong>
              <p>Try a different word, or ask our team directly.</p>
              <a className="text-button" href="#/contact">Contact Us <ArrowUpRight size={15} /></a>
            </div>
          )}
        </div>
      </section>

      <section className="sp-cta">
        <div>
          <span>STILL HAVE QUESTIONS?</span>
          <h2>We’re here to help.</h2>
          <p>Reach out to the FINEX.PH team for guidance and support with your business financing needs.</p>
        </div>
        <a className="primary-button" href="#/contact">Contact Us <ArrowUpRight size={15} /></a>
      </section>
    </div>
  );
}

/* ====================== Terms / Privacy ====================== */

const OTHER_DOCS = [
  { href: '#/terms', title: 'Terms and Conditions', text: 'Rules for using the website.' },
  { href: '#/privacy', title: 'Privacy Policy', text: 'How we handle your information.' },
  { href: '#/faq', title: 'FAQ', text: 'Quick answers about our loans.' }
];

function Blocks({ blocks }) {
  return blocks.map((b, i) => {
    if (b.lead) return <p key={i} className="lg-lead">{b.lead}</p>;
    if (b.label) return <p key={i} className="lg-label">{b.label}</p>;
    if (b.ul) return <ul key={i} className="lg-list">{b.ul.map((li) => <li key={li}>{linkify(li)}</li>)}</ul>;
    return <p key={i}>{linkify(b.p)}</p>;
  });
}

export function LegalPage({ doc, current }) {
  const [active, setActive] = useState(doc.sections[0].id);

  // Highlight the table-of-contents entry for the section being read
  useEffect(() => {
    const els = doc.sections.map((s) => document.getElementById(`lg-${s.id}`)).filter(Boolean);
    if (!('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible) setActive(visible.target.id.replace('lg-', ''));
      },
      { rootMargin: '-110px 0px -65% 0px', threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [doc]);

  const others = OTHER_DOCS.filter((d) => d.title !== current);

  return (
    <div className="sp lg">
      <header className="lg-head">
        <Crumbs trail={['About']} current={doc.title} />
        <span className="sp-eyebrow">{doc.eyebrow}</span>
        <h1>{doc.title}</h1>
        <p className="sp-intro">{doc.summary}</p>
      </header>

      <div className="lg-layout">
        <aside className="lg-toc" aria-label="On this page">
          <span className="lg-toc-title">ON THIS PAGE</span>
          <ol>
            {doc.sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#lg-${s.id}`} className={active === s.id ? 'is-active' : ''} onClick={scrollToId(`lg-${s.id}`)}>
                  <em>{String(i + 1).padStart(2, '0')}</em>{s.heading}
                </a>
              </li>
            ))}
          </ol>
        </aside>

        <article className="lg-body">
          <div className="lg-intro"><Blocks blocks={doc.intro} /></div>
          {doc.sections.map((s, i) => (
            <section key={s.id} id={`lg-${s.id}`} className="lg-section">
              <h2><span>{String(i + 1).padStart(2, '0')}</span>{s.heading}</h2>
              <Blocks blocks={s.blocks} />
            </section>
          ))}

          <div className="lg-help">
            <div>
              <strong>Questions about this page?</strong>
              <p>Our team is happy to help.</p>
            </div>
            <a className="primary-button" href="#/contact">Contact Us <ArrowUpRight size={15} /></a>
          </div>

          <div className="lg-more">
            {others.map((d) => (
              <a key={d.title} href={d.href}>
                <span><strong>{d.title}</strong><small>{d.text}</small></span>
                <ArrowUpRight size={18} />
              </a>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}