import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ChevronDown, ArrowUpRight, Menu, X, Sparkles, TrendingUp, Store, Building2, Check } from 'lucide-react';
import './styles.css';
import logo from './leaf.png';
import { buildTunnelFoldSlider } from './tunnelFoldEngine.js';
import galleryImg1 from './images/1.jpg';
import galleryImg10 from './images/10.jpg';
import galleryImg2 from './images/2.jpg';
import galleryImg3 from './images/3.jpg';
import galleryImg4 from './images/4.jpg';
import galleryImg11 from './images/11.jpg';
import galleryImg5 from './images/5.jpg';
import galleryImg6 from './images/6.jpg';
import galleryImg12 from './images/12.jpg';
import galleryImg7 from './images/7.jpg';
import galleryImg8 from './images/8.jpg';
import galleryImg13 from './images/13.jpg';
import galleryImg9 from './images/9.jpg';
import galleryImg14 from './images/14.jpg';
import galleryImg15 from './images/15.jpg';
import galleryImg16 from './images/16.jpg';
import ServicePage from './ServicePage.jsx';
import ContactPage from './ContactPage.jsx';
import { FaqPage, LegalPage } from './InfoPages.jsx';
import { terms, privacy } from './infoData.js';
import { services } from './servicesData.jsx';

const projects = [
  { type: 'aurora', name: 'AURORA', label: 'AI PLATFORM', color: 'blue' },
  { type: 'orbit', name: 'Orbit', label: 'FINTECH / SAAS', color: 'navy' },
  { type: 'mono', name: 'FORM / FUNCTION', label: 'STUDIO WEBSITE', color: 'cream' },
  { type: 'device', name: 'OBJECT 01', label: 'PRODUCT DESIGN', color: 'white' },
  { type: 'face', name: 'EVOLVE', label: 'CREATIVE TECHNOLOGY', color: 'black' },
  { type: 'mind', name: 'MindGrade', label: 'AI / RESEARCH', color: 'indigo' },
  { type: 'dashboard', name: 'NEXUS', label: 'DASHBOARD', color: 'dark' },
  { type: 'green', name: 'Greenhouse', label: 'WEB APP', color: 'green' },
  { type: 'brasa', name: 'BRASA', label: 'BRAND IDENTITY', color: 'red' },
  { type: 'cloud', name: 'CLOUD NINE', label: 'E-COMMERCE', color: 'peach' },
  { type: 'bottle', name: 'FORME', label: 'PRODUCT / BRAND', color: 'sky' }
];

const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61567168946744';
const INSTAGRAM_URL = 'https://www.instagram.com/finex.ph/';

const FacebookIcon = () => <svg viewBox="0 0 320 512" aria-hidden="true" focusable="false" fill="currentColor"><path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/></svg>;
const InstagramIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round"><rect x="2.5" y="2.5" width="19" height="19" rx="5.5"/><circle cx="12" cy="12" r="4.4"/><circle cx="17.6" cy="6.4" r="1.2" fill="currentColor" stroke="none"/></svg>;

function SocialButtons({ className = '' }) {
  return <div className={`social-buttons ${className}`}>
    <a className="social-btn social-fb" href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Finex.Ph on Facebook"><FacebookIcon/></a>
    <a className="social-btn social-ig" href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Finex.Ph on Instagram"><InstagramIcon/></a>
  </div>;
}

function Brand() {
  return <a className="brand" href="#/" aria-label="Finex.Ph home">
    <img className="brand-logo" src={logo} alt="" />
    <span>Finex.Ph</span>
  </a>;
}

function Dropdown({ label, items }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const timer = useRef(null);
  const canHover = () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (min-width: 761px)').matches;

  const show = () => { clearTimeout(timer.current); setOpen(true); };
  const hideSoon = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setOpen(false), 140); };

  useEffect(() => {
    // Click/tap outside or Escape closes it
    const onDown = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { clearTimeout(timer.current); document.removeEventListener('pointerdown', onDown); document.removeEventListener('keydown', onKey); };
  }, []);

  return <div
    ref={wrapRef}
    className={`nav-dropdown ${open ? 'open' : ''}`}
    onMouseEnter={() => canHover() && show()}
    onMouseLeave={() => canHover() && hideSoon()}
    onBlur={(e) => { if (!wrapRef.current.contains(e.relatedTarget)) setOpen(false); }}
  >
    <button className={`nav-link ${open ? 'active' : ''}`} aria-haspopup="true" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
      {label}<ChevronDown className="nav-chevron" size={13} strokeWidth={1.8}/>
    </button>
    <div className="dropdown-panel" role="menu">
      {items.map(item => {
        const it = typeof item === 'string' ? { label: item, href: '#library' } : item;
        return <a href={it.href} role="menuitem" key={it.label} onClick={() => setOpen(false)}>{it.label}<ArrowUpRight size={13}/></a>;
      })}
    </div>
  </div>;
}

function Nav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    const close = () => setMobileOpen(false);
    window.addEventListener('hashchange', close);
    return () => window.removeEventListener('hashchange', close);
  }, []);
  return <header className={`topbar ${scrolled ? 'scrolled' : ''}`}>
    <div className="nav-inner">
      <Brand />
      <nav className={mobileOpen ? 'nav-menu open' : 'nav-menu'}>
        <a className="nav-link" href="#/">Home</a>
        <Dropdown label="Services" items={[{ label: 'Business Expansion Loans', href: '#/business-expansion-loans' }, { label: 'MSMEs', href: '#/msme-financing' }, { label: 'Corporate', href: '#/corporate-financing' }]}/>
        <Dropdown label="About" items={[{ label: 'FAQ', href: '#/faq' }, { label: 'Terms and Conditions', href: '#/terms' }, { label: 'Privacy Policy', href: '#/privacy' }]}/>
        
        {/*<a className="nav-link" href="#pricing">Pricing</a>
        <a className="nav-link" href="#community">Community</a>
        <a className="nav-link" href="#affiliate">Affiliate</a> */}
        <Dropdown label="Resources" items={['Documentation', 'Inspiration', 'Changelog']}/>
        <a className="signup mobile-cta" href="#/contact">Contact Us</a>
        <SocialButtons className="mobile-social"/>
      </nav>
      <div className="nav-right">
        <SocialButtons className="desktop-social"/>
        <a className="signup" href="#/contact">Contact Us</a>
      </div>
      <a className="signup nav-cta-mobile" href="#/contact">Contact Us</a>
      <button className="mobile-toggle" aria-label="Toggle menu" onClick={() => setMobileOpen(!mobileOpen)}>
        {mobileOpen ? <X/> : <Menu/>}
      </button>
    </div>
  </header>;
}

function PreviewArt({ item }) {
  switch (item.type) {
    case 'aurora': return <div className="art art-aurora"><div className="aurora-symbol">A</div><span className="tiny-kicker">A new perspective</span><b>Ideas<br/>in motion.</b><div className="art-line"/></div>;
    case 'orbit': return <div className="art art-orbit"><div className="orbit-ring"/><span>orbit / 01</span><b>Paris begins<br/>before you land.</b><small>Discover a new way to travel</small><div className="orbit-button">Explore now ↗</div></div>;
    case 'mono': return <div className="art art-mono"><div className="mini-nav">FORM&nbsp;&nbsp; STUDIO&nbsp;&nbsp; ABOUT</div><div className="mono-title">Less, but<br/><em>better.</em></div><div className="mono-shape"/></div>;
    case 'device': return <div className="art art-device"><div className="device-top">OBJECT / 001</div><div className="product-object"><div/></div><b>Designed to<br/>make sense.</b></div>;
    case 'face': return <div className="art art-face"><div className="face-orb">◉</div><b>EVOLVE</b><span>THE HUMAN FUTURE</span></div>;
    case 'mind': return <div className="art art-mind"><div className="mind-globe">✺</div><span>MindGrade</span><b>Built into<br/>Every Decision</b></div>;
    case 'dashboard': return <div className="art art-dashboard"><div className="dash-sidebar">NEXUS<br/><br/>Overview<br/>Analytics<br/>Projects</div><div className="dash-main"><small>OVERVIEW / 2025</small><b>Your workspace.</b><div className="dash-graph"><i/><i/><i/><i/><i/><i/><i/></div><div className="dash-stats"><span/><span/><span/></div></div></div>;
    case 'green': return <div className="art art-green"><div className="green-orb"/><div className="green-card"><small>YOUR WORKSPACE</small><b>Make room<br/>for growth.</b><span>↗ &nbsp; Explore</span></div></div>;
    case 'brasa': return <div className="art art-brasa"><b>BRASA</b><div className="brasa-box">B.</div><span>BRAND SYSTEM / 2025</span></div>;
    case 'cloud': return <div className="art art-cloud"><div className="cloud-window"><span>☼ &nbsp; CLOUD NINE</span><b>Find your<br/>own kind<br/>of wonder.</b><small>SHOP THE COLLECTION ↗</small></div><div className="cloud-sun"/></div>;
    default: return <div className="art art-bottle"><div className="bottle-glass"><span>8</span></div><small>FORME / OBJECT 08</small></div>;
  }
}

function Gallery() {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const slider = buildTunnelFoldSlider(root, {
      images: [galleryImg1, galleryImg10, galleryImg2, galleryImg3, galleryImg4, galleryImg11, galleryImg5, galleryImg6, galleryImg12, galleryImg7, galleryImg8, galleryImg13, galleryImg9, galleryImg14, galleryImg15, galleryImg16],
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
      zoom: 2.7
    });
    return () => slider?.destroy();
  }, []);

  
   
return (
  <div className="tunnel-gallery" aria-label="Interactive 3D image carousel">
    <div
      className="tf-root"
      ref={rootRef}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Picture tunnel. Drag, scroll sideways or use the arrow keys."
      data-tf-words
      data-draggable
    >
      {/* Existing 3D carousel */}
      <div className="tf-gl" aria-hidden="true" />

      {/* Keep the original fallback image */}
      <img
        className="tf-still"
        src={galleryImg1}
        alt=""
        draggable="false"
      />

      <p className="tf-live" aria-live="polite" />
    </div>
  </div>
);

}

function Preloader() {
  const [phase, setPhase] = useState('show'); // show -> hide -> gone
  const [pct, setPct] = useState(0);
  const [bursts, setBursts] = useState([]);
  const tiltRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 1000);
      setPct(Math.round((1 - Math.pow(1 - t, 3)) * 100)); // ease-out count to 100
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const t1 = setTimeout(() => setPhase('hide'), 1000);
    const t2 = setTimeout(() => { setPhase('gone'); document.body.style.overflow = ''; }, 1200);
    return () => { cancelAnimationFrame(raf); clearTimeout(t1); clearTimeout(t2); document.body.style.overflow = ''; };
  }, []);

  // Leaf tilts toward the mouse / finger
  const onMove = (e) => {
    const el = tiltRef.current;
    if (!el) return;
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    el.style.setProperty('--rx', `${-y * 16}deg`);
    el.style.setProperty('--ry', `${x * 16}deg`);
  };

  // Click / tap: a burst of little leaves
  const onDown = (e) => {
    const id = performance.now() + Math.random();
    const leaves = Array.from({ length: 7 }, (_, i) => ({
      id: id + i, x: e.clientX, y: e.clientY,
      a: (Math.PI * 2 * i) / 7 + Math.random() * 0.6,
      d: 60 + Math.random() * 60, r: Math.random() * 360
    }));
    setBursts((b) => [...b, ...leaves]);
    setTimeout(() => setBursts((b) => b.filter((l) => !leaves.includes(l))), 800);
  };

  if (phase === 'gone') return null;
  return <div
    className={`preloader ${phase === 'hide' ? 'is-hiding' : ''}`}
    role="status" aria-label={`Loading ${pct}%`}
    onPointerMove={onMove} onPointerDown={onDown}
  >
    <div className="pl2-inner">
      <div className="pl2-stage" ref={tiltRef}>
        <span className="pl2-glow" />
        <div className="pl2-leaf">
          <img className="pl2-img pl2-img-bg" src={logo} alt="" draggable="false" />
          <img className="pl2-img pl2-img-fill" src={logo} alt="" draggable="false" style={{ clipPath: `inset(${89 - 0.78 * pct}% 0 0 0)` }} />
        </div>
      </div>
      <div className="pl2-meta">
        <span className="pl2-brand">Finex.Ph</span>
        <span className="pl2-pct">{pct}<small>%</small></span>
      </div>
      <span className="pl2-bar"><i style={{ transform: `scaleX(${pct / 100})` }} /></span>
    </div>
    {bursts.map((l) => <span key={l.id} className="pl2-spark" style={{ left: l.x, top: l.y, '--dx': `${Math.cos(l.a) * l.d}px`, '--dy': `${Math.sin(l.a) * l.d}px`, '--rot': `${l.r}deg` }} />)}
  </div>;
}

const testimonials = [
  { name: 'Jaxon Cruz', text: 'FINEX.PH helped my small business through a challenging time. Their MSME loan came with great terms, and the customer service was top-notch. I felt supported from start to finish!' },
  { name: 'Kiana Reyes', text: 'FINEX.PH has been a game-changer for my startup. Their Business Expansion Loan gave me the funds I needed to grow faster than I imagined. The team was responsive and professional throughout. Highly recommend!' },
  { name: 'Lia Soriano', text: 'FINEX.PH made securing a loan so easy! Their team was helpful, and I got the funds I needed quickly to expand my business. Excellent service all around!' },
  { name: 'Alessa Vergara', text: 'Applying for a loan with FINEX.PH was incredibly easy, and their rates were competitive. Thanks to their business loan, I was able to purchase new equipment and increase my productivity. Highly recommend their services!' }
];

function Testimonials() {
  const ref = useRef(null);
  useEffect(() => {
    const items = ref.current?.querySelectorAll('.testi-item') ?? [];
    if (!('IntersectionObserver' in window)) { items.forEach((el) => el.classList.add('in')); return undefined; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.2 });
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return <section className="testi" id="testimonials">
    <div className="section-label">TESTIMONIALS</div>
    <h2>What our clients say.</h2>
    <p>Kind words from the businesses we’ve supported.</p>
    <div className="testi-grid" ref={ref}>
      {testimonials.map((t, i) => (
        <figure key={t.name} className={`testi-item ${i % 2 ? 'is-right' : ''}`} style={{ '--d': `${(i % 2) * 120}ms` }}>
          <blockquote className="testi-bubble"><span className="testi-mark" aria-hidden="true">“</span>{t.text}</blockquote>
          <figcaption className="testi-by"><i/>{t.name}</figcaption>
        </figure>
      ))}
    </div>
  </section>;
}

function useRoute() {
  const read = () => (window.location.hash.startsWith('#/') ? window.location.hash.slice(1) : '/');
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => setRoute(read());
    window.addEventListener('hashchange', on);
    return () => window.removeEventListener('hashchange', on);
  }, []);
  return route;
}

function App() {
  const route = useRoute();
  const service = services[route];

  useEffect(() => {
    const pageTitles = { '/contact': 'Contact Us', '/faq': 'FAQ', '/terms': 'Terms and Conditions', '/privacy': 'Privacy Policy' };
    const pageTitle = pageTitles[route] || service?.title;
    document.title = pageTitle ? `${pageTitle} | Finex.Ph` : 'Finex.Ph Lending Solution Corporation';
    const hash = window.location.hash;
    if (route === '/' && hash && !hash.startsWith('#/')) {
      setTimeout(() => document.querySelector(hash)?.scrollIntoView(), 0); // home section anchors
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [route, service]);
  const subpage = route === '/contact' ? <ContactPage/>
    : route === '/faq' ? <FaqPage/>
    : route === '/terms' ? <LegalPage doc={terms} current="Terms and Conditions"/>
    : route === '/privacy' ? <LegalPage doc={privacy} current="Privacy Policy"/>
    : service ? <ServicePage page={service}/> : null;

  return <div className="page">
    <Preloader/>
    <Nav/>
    {subpage ? <main>{subpage}</main> : <main>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><Sparkles size={13}/> FINANCIAL SOLUTIONS • PHILIPPINES</div>
          <h1>Lending a hand towards<br/><span className="accent">your financial<br/>success.</span></h1>
          <div className="gallery-stats">
            <div className="gallery-stat"><strong>1K+</strong><span>Partners</span></div>
            <div className="gallery-stat-divider" />
            <div className="gallery-stat"><strong>5+ Years</strong><span>in the Philippines</span></div>
          </div>
        </div>
        <Gallery/>
        <div className="hero-bottom">
          <p>Business expansion loans, MSME financing and corporate solutions,<br className="desktop-break"/> built to help Filipino businesses grow.</p>
          <div className="hero-actions">
            <a className="primary-button" href="#/contact">Contact Us <ArrowUpRight size={15}/></a>
            <a className="text-button" href="#library">Our services <ArrowUpRight size={15}/></a>
          </div>
        </div>
      </section>
      <section className="below-fold" id="library">
        <div className="section-label">OUR SERVICES</div>
        <h2>Financing for every stage of your business.</h2>
        <p>From growing small shops to powering large enterprises, find the solution that fits.</p>
        <div className="svc-grid">
          {[
            { href: '#/business-expansion-loans', icon: TrendingUp, tag: 'GROWTH', title: 'Business Expansion Loans', text: 'Capital to scale operations, upgrade equipment or enter new markets, with flexible terms built for long-term growth.', points: ['Scaling operations', 'New equipment', 'New markets'] },
            { href: '#/msme-financing', icon: Store, tag: 'MSMEs', title: 'MSME Financing', text: 'Accessible funding for Micro, Small and Medium Enterprises, with fast approval and flexible repayment options.', points: ['Working capital', 'Inventory purchase', 'Business improvements'] },
            { href: '#/corporate-financing', icon: Building2, tag: 'CORPORATE', title: 'Corporate Financing', text: 'Comprehensive, customized lending for large enterprises taking on major projects, mergers and acquisitions.', points: ['Major projects', 'Mergers & acquisitions', 'Large-scale investments'] }
          ].map(({ href, icon: Icon, tag, title, text, points }) => (
            <a key={title} className="svc-card" href={href}>
              <div className="svc-top">
                <span className="svc-icon"><Icon size={24} strokeWidth={1.8}/></span>
                <span className="svc-tag">{tag}</span>
              </div>
              <h3>{title}</h3>
              <p>{text}</p>
              <ul>{points.map(p => <li key={p}><Check size={14} strokeWidth={3}/>{p}</li>)}</ul>
              <span className="svc-link">Learn more <ArrowUpRight size={15}/></span>
            </a>
          ))}
        </div>
      </section>
      <Testimonials/>
      <section className="pricing-strip" id="pricing"><div><span>READY TO TAKE THE NEXT STEP?</span><h2>Let’s build your financial success together.</h2></div><a className="primary-button" href="#/contact">Contact Us <ArrowUpRight size={15}/></a></section>
    </main>}
    <footer>
      <Brand/>
      <span>© 2026 Finex.Ph Lending Solution Corporation.</span>
      <nav className="footer-links" aria-label="Footer">
        <a href="#/faq">FAQ</a><a href="#/terms">Terms</a><a href="#/privacy">Privacy</a><a href="#/contact">Contact</a>
      </nav>
      <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>Back to top ↑</a>
    </footer>
  </div>;
}

createRoot(document.getElementById('root')).render(<React.StrictMode><App/></React.StrictMode>);