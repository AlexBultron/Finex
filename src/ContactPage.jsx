import React, { useState } from 'react';
import { ArrowUpRight, Check, ChevronRight, Clock, MapPin, Navigation, Phone, Send, Smartphone } from 'lucide-react';

/* ---------- Settings ---------- */

const MOBILE_DISPLAY = '(+63) 917 122 2015';
const MOBILE_E164 = '639171222015';
const LANDLINE_DISPLAY = '8813 3210';
const LANDLINE_TEL = '+63288133210';
const ADDRESS_LINES = ['Unit 1015 10th floor', 'Parkway Corporate Center', 'Filinvest City', 'Alabang Muntinlupa'];
const MAP_QUERY = 'Parkway Corporate Center, Filinvest City, Alabang, Muntinlupa';
const MAP_EMBED = `https://www.google.com/maps?q=${encodeURIComponent(MAP_QUERY)}&output=embed`;
const MAP_LINK = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(MAP_QUERY)}`;
const MAP_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(MAP_QUERY)}`;

const FONT = 'DM Sans, Arial, sans-serif';

const scrollTo = (id) => (e) => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };

/* ---------- Illustration ---------- */

export function ContactArt() {
  return (
    <svg className="sp-chart" viewBox="0 0 480 320" role="img" aria-label="Illustration of chat messages, an envelope and a phone">
      <defs>
        <linearGradient id="ctBubble" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7fd0b3" />
          <stop offset="100%" stopColor="#3fa37e" />
        </linearGradient>
      </defs>
      <circle cx="240" cy="160" r="128" fill="#edf8f3" />
      <circle cx="240" cy="160" r="92" fill="#e1f3ea" />
      {/* connecting dots */}
      <path d="M118 232 C 150 262, 210 268, 250 250" fill="none" stroke="#9fd3bd" strokeWidth="2.5" strokeDasharray="2 9" strokeLinecap="round" />
      <path d="M400 92 C 392 130, 372 150, 340 160" fill="none" stroke="#9fd3bd" strokeWidth="2.5" strokeDasharray="2 9" strokeLinecap="round" />
      {/* main bubble */}
      <g className="sp-float">
        <path d="M70 56h206a24 24 0 0 1 24 24v74a24 24 0 0 1-24 24H146l-38 30v-30H70a24 24 0 0 1-24-24V80a24 24 0 0 1 24-24z" fill="url(#ctBubble)" />
        <rect x="76" y="86" width="150" height="10" rx="5" fill="#fff" opacity=".95" />
        <rect x="76" y="108" width="190" height="10" rx="5" fill="#fff" opacity=".7" />
        <rect x="76" y="130" width="110" height="10" rx="5" fill="#fff" opacity=".5" />
      </g>
      {/* reply bubble */}
      <g className="sp-float sp-float-2">
        <path d="M214 170h172a22 22 0 0 1 22 22v52a22 22 0 0 1-22 22h-24v26l-34-26H214a22 22 0 0 1-22-22v-52a22 22 0 0 1 22-22z" fill="#fff" stroke="#bfe5d4" strokeWidth="2" />
        <circle cx="232" cy="218" r="15" fill="#edf8f3" />
        <path d="M225 218l5 5 9-10" fill="none" stroke="#2f8f6c" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="258" y="206" width="104" height="9" rx="4.5" fill="#cfe3d9" />
        <rect x="258" y="224" width="76" height="9" rx="4.5" fill="#e3efe9" />
      </g>
      {/* envelope */}
      <g transform="translate(350 28)" className="sp-float sp-float-3">
        <rect width="84" height="60" rx="12" fill="#2f8f6c" />
        <path d="M8 14l34 24 34-24" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* phone */}
      <g transform="translate(60 214)">
        <circle cx="32" cy="32" r="32" fill="#fff" stroke="#bfe5d4" strokeWidth="2" />
        <g transform="translate(14 14) scale(1.5)" fill="none" stroke="#2f8f6c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
        </g>
      </g>
      <text x="240" y="312" textAnchor="middle" fontSize="11" fontWeight="600" fill="#8aa398" fontFamily={FONT} letterSpacing="1.5">WE’RE HERE TO HELP</text>
    </svg>
  );
}

/* ---------- Question-by-question form ---------- */

// Edit the questions and choices here. type: 'single' | 'multi' | 'text' | 'long' | 'phone'
const STEPS = [
  { id: 'inquiry', type: 'single', q: 'What is your inquiry?', hint: 'Pick the one that fits best.', label: 'Inquiry',
    options: ['Business Expansion Loan', 'MSME Financing', 'Corporate Financing', 'General question'] },
  { id: 'business', type: 'single', q: 'What kind of business do you have?', label: 'Type of business',
    options: ['Retail / Trading', 'Food & Beverage', 'Services', 'Manufacturing', 'Construction / Real Estate', 'Other'] },
  { id: 'years', type: 'single', q: 'How long has your business been operating?', label: 'Years in business',
    options: ['Not yet started', 'Less than 1 year', '1–3 years', '3–5 years', '5+ years'] },
  { id: 'amount', type: 'single', q: 'About how much financing are you looking for?', hint: 'An estimate is fine.', label: 'Financing amount',
    options: ['Below ₱500,000', '₱500,000 – ₱2M', '₱2M – ₱10M', '₱10M – ₱50M', 'Above ₱50M', 'Not sure yet'] },
  { id: 'purpose', type: 'multi', q: 'What will the funds be used for?', hint: 'Choose all that apply.', label: 'Use of funds',
    options: ['Working capital', 'Inventory', 'Equipment', 'Expansion / new location', 'Business improvements', 'Acquisition / merger', 'Other'] },
  { id: 'timeline', type: 'single', q: 'When do you need the funds?', label: 'Timeline',
    options: ['As soon as possible', 'Within 1 month', 'In 1–3 months', 'Just exploring'] },
  { id: 'notes', type: 'long', q: 'Anything else you’d like us to know?', hint: 'Optional. Skip if you’d rather not add more.', optional: true, label: 'Notes', placeholder: 'Type here…' },
  { id: 'name', type: 'text', q: 'What’s your name?', label: 'Name', placeholder: 'Your full name', autoComplete: 'name' },
  { id: 'company', type: 'text', q: 'What’s your company name?', hint: 'Type “None” if you don’t have one yet.', label: 'Company', placeholder: 'Company or business name', autoComplete: 'organization' },
  { id: 'phone', type: 'phone', q: 'What’s the best phone number to reach you?', label: 'Phone number', placeholder: '(+63) 9XX XXX XXXX', autoComplete: 'tel' }
];

const stepError = (step, value) => {
  if (step.optional) return '';
  if (step.type === 'multi') return value && value.length ? '' : 'Please choose at least one.';
  const v = (value || '').trim();
  if (!v) return step.type === 'single' ? 'Please choose one to continue.' : 'This one is required.';
  if (step.type === 'phone' && !/^[+()\d\s-]{7,}$/.test(v)) return 'Please enter a valid phone number.';
  return '';
};

const answerText = (step, value) => (step.type === 'multi' ? (value || []).join(', ') : (value || '').trim());

function buildMessage(answers) {
  const lines = ['Hello FINEX.PH! I’d like to make an inquiry.', ''];
  STEPS.forEach((s) => {
    const t = answerText(s, answers[s.id]);
    if (t) lines.push(`${s.label}: ${t}`);
  });
  lines.push('', 'Thank you!');
  return lines.join('\n');
}

function ContactForm() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [dir, setDir] = useState('fwd');
  const [sendState, setSendState] = useState('idle'); // idle | sending | sent | error
  const [trap, setTrap] = useState('');
  const total = STEPS.length;
  const review = index >= total;
  const step = STEPS[index];
  const message = buildMessage(answers);

  const setValue = (id, value) => { setAnswers((a) => ({ ...a, [id]: value })); setError(''); };
  const go = (next, d) => { setDir(d); setIndex(next); setError(''); };

  const next = (override) => {
    const value = override !== undefined ? override : answers[step.id];
    const err = stepError(step, value);
    if (err) { setError(err); return; }
    go(index + 1, 'fwd');
  };

  const pickSingle = (opt) => {
    setValue(step.id, opt);
    setTimeout(() => go(index + 1, 'fwd'), 220); // auto-advance after a short beat
  };
  const toggleMulti = (opt) => {
    const cur = answers[step.id] || [];
    setValue(step.id, cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt]);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !(e.target.tagName === 'TEXTAREA' && !e.metaKey && !e.ctrlKey)) { e.preventDefault(); next(); }
  };

  const openWhatsApp = () => {
    window.open(`https://wa.me/${MOBILE_E164}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  };
  const send = async () => {
    setSendState('sending');
    try {
      const body = Object.fromEntries(STEPS.map((s) => [s.id, answerText(s, answers[s.id])]));
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, website: trap })
      });
      if (!res.ok) throw new Error('send failed');
      setSendState('sent');
    } catch {
      setSendState('error'); // offer the WhatsApp link as a backup
    }
  };
  const restart = () => { setAnswers({}); setSendState('idle'); go(0, 'back'); };

  const pct = Math.round((Math.min(index, total) / total) * 100);

  if (sendState === 'sent') {
    const first = (answers.name || '').trim().split(' ')[0];
    return (
      <div className="qf qf-done">
        <span className="qf-check"><Check size={30} strokeWidth={3} /></span>
        <h3 className="qf-q">Thank you{first ? `, ${first}` : ''}!</h3>
        <p className="qf-hint">We’ve received your inquiry. Our team will contact you at <strong>{(answers.phone || '').trim()}</strong> soon.</p>
        <div className="qf-nav qf-nav-center">
          <button type="button" className="qf-back" onClick={restart}>Send another inquiry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="qf" onKeyDown={review ? undefined : onKeyDown}>
      <div className="qf-top">
        <span className="qf-count" aria-live="polite">{review ? 'Review' : `Question ${index + 1} of ${total}`}</span>
        <span className="qf-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={pct}><i style={{ width: `${review ? 100 : pct}%` }} /></span>
      </div>

      {!review ? (
        <div className={`qf-step qf-${dir}`} key={step.id}>
          <h3 className="qf-q">{step.q}</h3>
          {step.hint && <p className="qf-hint">{step.hint}</p>}

          {(step.type === 'single' || step.type === 'multi') && (
            <div className="qf-options" role={step.type === 'single' ? 'radiogroup' : 'group'} aria-label={step.q}>
              {step.options.map((opt) => {
                const on = step.type === 'single' ? answers[step.id] === opt : (answers[step.id] || []).includes(opt);
                return (
                  <button key={opt} type="button" className={`qf-chip ${on ? 'is-on' : ''}`} role={step.type === 'single' ? 'radio' : 'checkbox'} aria-checked={on}
                    onClick={() => (step.type === 'single' ? pickSingle(opt) : toggleMulti(opt))}>
                    <span className="qf-dot">{on && <Check size={12} strokeWidth={3.5} />}</span>{opt}
                  </button>
                );
              })}
            </div>
          )}

          {(step.type === 'text' || step.type === 'phone') && (
            <input className="qf-input" autoFocus type={step.type === 'phone' ? 'tel' : 'text'} autoComplete={step.autoComplete} placeholder={step.placeholder}
              value={answers[step.id] || ''} onChange={(e) => setValue(step.id, e.target.value)} aria-label={step.q} />
          )}
          {step.type === 'long' && (
            <textarea className="qf-input" autoFocus rows="4" placeholder={step.placeholder} value={answers[step.id] || ''} onChange={(e) => setValue(step.id, e.target.value)} aria-label={step.q} />
          )}

          {error && <p className="qf-error" role="alert">{error}</p>}

          <div className="qf-nav">
            <button type="button" className="qf-back" onClick={() => go(index - 1, 'back')} disabled={index === 0}>← Back</button>
            {step.type !== 'single' && (
              <button type="button" className="primary-button qf-next" onClick={() => next()}>
                {step.optional && !(answers[step.id] || '').trim() ? 'Skip' : index === total - 1 ? 'Review' : 'Next'} <ArrowUpRight size={15} />
              </button>
            )}
            {step.type === 'single' && <span className="qf-tip">Tap an answer to continue</span>}
          </div>
        </div>
      ) : (
        <div className="qf-step qf-fwd" key="review">
          <h3 className="qf-q">All set, please review.</h3>
          <p className="qf-hint">Check your answers, then send them to the FINEX.PH team.</p>
          <ul className="qf-summary">
            {STEPS.map((s, i) => {
              const t = answerText(s, answers[s.id]);
              return t ? <li key={s.id}><span>{s.label}</span><strong>{t}</strong><button type="button" onClick={() => go(i, 'back')}>Edit</button></li> : null;
            })}
          </ul>
          <input className="qf-hp" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={trap} onChange={(e) => setTrap(e.target.value)} />
          {sendState === 'error' && (
            <div className="ct-banner ct-banner-err" role="alert" style={{ marginTop: 16 }}>
              <span>Sorry, we couldn’t send that just now. You can send the same message directly on WhatsApp instead.</span>
            </div>
          )}
          <div className="qf-nav qf-nav-end">
            <button type="button" className="qf-back" onClick={() => go(total - 1, 'back')} disabled={sendState === 'sending'}>← Back</button>
            {sendState === 'error' && <button type="button" className="qf-back qf-wa" onClick={openWhatsApp}>Send on WhatsApp</button>}
            <button type="button" className="primary-button qf-next" onClick={send} disabled={sendState === 'sending'}>
              {sendState === 'sending' ? 'Sending…' : sendState === 'error' ? 'Try again' : 'Send inquiry'} <Send size={15} />
            </button>
          </div>
          <p className="ct-note"><button type="button" className="qf-link" onClick={restart}>Start over</button></p>
        </div>
      )}
    </div>
  );
}

/* ---------- Page ---------- */

export default function ContactPage() {
  return (
    <div className="sp ct">
      {/* Hero */}
      <section className="sp-hero">
        <div className="sp-hero-copy">
          <nav className="sp-crumbs" aria-label="Breadcrumb">
            <a href="#/">Home</a><ChevronRight size={13} /><span aria-current="page">Contact Us</span>
          </nav>
          <span className="sp-eyebrow">Get in touch</span>
          <h1>Contact Us</h1>
          <p className="sp-intro">Reach out to FINEX.PH for any questions or assistance! We're here to provide guidance and support for all your business financing needs.</p>
          <div className="sp-actions">
            <a className="primary-button" href="#ct-form" onClick={scrollTo('ct-form')}>Send a message <ArrowUpRight size={15} /></a>
            <a className="text-button" href="#ct-office" onClick={scrollTo('ct-office')}>Visit our office <ArrowUpRight size={15} /></a>
          </div>
        </div>
        <div className="sp-hero-visual">
          <div className="sp-card"><ContactArt /></div>
        </div>
      </section>

      {/* Form */}
      <section className="sp-section ct-formwrap" id="ct-form">
        <div className="ct-formcopy">
          <div className="sp-label">SEND US A MESSAGE</div>
          <h2>How can we help?</h2>
          <p className="sp-lead">Tell us a little about your business and what you need. Our team will take it from there.</p>
          <ul className="ct-points">
            <li><span><Check size={15} strokeWidth={3} /></span>Questions about our financing options</li>
            <li><span><Check size={15} strokeWidth={3} /></span>Help with your application</li>
            <li><span><Check size={15} strokeWidth={3} /></span>Guidance for your business financing needs</li>
          </ul>
        </div>
        <div className="sp-card ct-card"><ContactForm /></div>
      </section>

      {/* Office */}
      <section className="sp-section" id="ct-office">
        <div className="sp-label">OUR OFFICE</div>
        <h2>Visit or call us.</h2>
        <div className="ct-office">
          <article className="sp-pillar ct-info">
            <span className="sp-icon"><MapPin size={22} strokeWidth={1.9} /></span>
            <h3>Address</h3>
            <p>{ADDRESS_LINES.map((l, i) => <React.Fragment key={l}>{l}{i < ADDRESS_LINES.length - 1 && <br />}</React.Fragment>)}</p>
          </article>
          <article className="sp-pillar ct-info">
            <span className="sp-icon"><Clock size={22} strokeWidth={1.9} /></span>
            <h3>Hours</h3>
            <p className="ct-big">9am – 6pm</p>
          </article>
          <article className="sp-pillar ct-info ct-contacts">
            <span className="sp-icon"><Phone size={22} strokeWidth={1.9} /></span>
            <h3>Contact Information</h3>
            <a className="ct-line" href={`tel:${LANDLINE_TEL}`}>
              <Phone size={16} /><span><strong>{LANDLINE_DISPLAY}</strong><small>Telephone Number</small></span>
            </a>
            <a className="ct-line" href={`tel:+${MOBILE_E164}`}>
              <Smartphone size={16} /><span><strong>{MOBILE_DISPLAY}</strong><small>Available on WhatsApp &amp; Viber</small></span>
            </a>
            <div className="ct-chat">
              <a href={`https://wa.me/${MOBILE_E164}`} target="_blank" rel="noopener noreferrer" className="ct-chip ct-wa">WhatsApp</a>
              <a href={`viber://chat?number=%2B${MOBILE_E164}`} className="ct-chip ct-vb">Viber</a>
            </div>
          </article>
        </div>

        {/* Map */}
        <div className="ct-map">
          <iframe
            title="FINEX.PH office location on Google Maps"
            src={MAP_EMBED}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
          <div className="ct-map-card">
            <span className="sp-icon"><MapPin size={20} strokeWidth={1.9} /></span>
            <div>
              <strong>FINEX.PH</strong>
              <p>Parkway Corporate Center, Filinvest City, Alabang, Muntinlupa</p>
              <div className="ct-map-actions">
                <a href={MAP_DIRECTIONS} target="_blank" rel="noopener noreferrer"><Navigation size={14} /> Get directions</a>
                <a href={MAP_LINK} target="_blank" rel="noopener noreferrer">Open in Google Maps <ArrowUpRight size={14} /></a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}