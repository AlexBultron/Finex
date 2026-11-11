import React, { useState } from 'react';
import { ArrowUpRight, Check, ChevronRight, Clock, MapPin, Navigation, Phone, Send, Smartphone } from 'lucide-react';

/* ---------- Settings ---------- */

// Optional: paste a form-handling URL here (for example a Formspree endpoint like
// 'https://formspree.io/f/xxxxxxx') to have the form POST there.
// Leave it empty and "Send message" opens WhatsApp with the message ready to send.
const FORM_ENDPOINT = '';

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

/* ---------- Form ---------- */

const EMPTY = { name: '', phone: '', email: '', message: '' };

function validate(v) {
  const e = {};
  if (!v.name.trim()) e.name = 'Please enter your name.';
  if (!/^[+()\d\s-]{7,}$/.test(v.phone.trim())) e.phone = 'Please enter a valid phone number.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'Please enter a valid email address.';
  if (!v.message.trim()) e.message = 'Please tell us how we can help.';
  return e;
}

function ContactForm() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errs = validate(values);
    setErrors(errs);
    if (Object.keys(errs).length) return;

    if (FORM_ENDPOINT) {
      setStatus('sending');
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(values)
        });
        if (!res.ok) throw new Error('Request failed');
        setStatus('sent');
        setValues(EMPTY);
      } catch {
        setStatus('error');
      }
      return;
    }

    // No form endpoint configured: hand the message to WhatsApp, ready to send.
    const text = `Hello FINEX.PH,\n\nName: ${values.name}\nPhone: ${values.phone}\nEmail: ${values.email}\n\n${values.message}`;
    window.open(`https://wa.me/${MOBILE_E164}?text=${encodeURIComponent(text)}`, '_blank', 'noopener,noreferrer');
    setStatus('sent');
    setValues(EMPTY);
  };

  const field = (id, label, input) => (
    <div className={`ct-field ${errors[id] ? 'has-error' : ''}`}>
      <label htmlFor={`ct-${id}`}>{label}</label>
      {input}
      {errors[id] && <span className="ct-error" role="alert">{errors[id]}</span>}
    </div>
  );

  return (
    <form className="ct-form" onSubmit={onSubmit} noValidate>
      {status === 'sent' && (
        <div className="ct-banner ct-banner-ok" role="status">
          <Check size={18} strokeWidth={3} />
          <span>{FORM_ENDPOINT ? 'Thank you! Your message has been sent. We’ll get back to you soon.' : 'Almost there! Finish sending your message in the WhatsApp window that just opened.'}</span>
        </div>
      )}
      {status === 'error' && <div className="ct-banner ct-banner-err" role="alert">Sorry, something went wrong. Please try again, or call or message us directly.</div>}

      <div className="ct-grid2">
        {field('name', 'Name', <input id="ct-name" type="text" autoComplete="name" placeholder="Your full name" value={values.name} onChange={set('name')} />)}
        {field('phone', 'Phone Number', <input id="ct-phone" type="tel" autoComplete="tel" placeholder="(+63) 9XX XXX XXXX" value={values.phone} onChange={set('phone')} />)}
      </div>
      {field('email', 'Email', <input id="ct-email" type="email" autoComplete="email" placeholder="you@company.com" value={values.email} onChange={set('email')} />)}
      {field('message', 'Message', <textarea id="ct-message" rows="5" placeholder="Tell us a little about your business and how we can help." value={values.message} onChange={set('message')} />)}

      <button className="primary-button ct-submit" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending…' : 'Send message'} <Send size={15} />
      </button>
      {!FORM_ENDPOINT && <p className="ct-note">Sending opens WhatsApp with your message ready to go.</p>}
    </form>
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