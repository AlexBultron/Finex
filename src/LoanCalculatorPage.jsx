import React, { useEffect, useMemo, useRef, useState } from 'react';
import './loanCalculator.css';
import { Calculator, RotateCcw, Info, Banknote, Percent, CalendarDays, ArrowRight, Sparkles, Repeat } from 'lucide-react';

const MIN_AMOUNT = 1_000_000;
const MAX_AMOUNT = 15_000_000;
const MIN_RATE = 2;
const MAX_RATE = 5;
const MIN_TERM = 1;
const MAX_TERM = 6;
const DEFAULTS = { amount: 5_000_000, rate: 3, term: 3 };
const QUICK_AMOUNTS = [1_000_000, 3_000_000, 5_000_000, 10_000_000, 15_000_000];

const peso = (n, d = 2) => '₱' + Number(n).toLocaleString('en-PH', { minimumFractionDigits: d, maximumFractionDigits: d });
const compact = (n) => (n >= 1_000_000 ? `${+(n / 1_000_000).toFixed(1)}M` : `${Math.round(n / 1000)}K`);
const pct = (v, min, max) => `${((v - min) / (max - min)) * 100}%`;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

function useCountUp(value, ms = 550) {
  const [v, setV] = useState(value);
  const from = useRef(value);
  useEffect(() => {
    const start = performance.now();
    const a = from.current;
    let raf;
    const tick = (t) => {
      const k = Math.min(1, (t - start) / ms);
      const cur = a + (value - a) * (1 - Math.pow(1 - k, 3));
      from.current = cur;
      setV(cur);
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, ms]);
  return v;
}

function Money({ value, d = 2 }) {
  return <>{peso(useCountUp(value), d)}</>;
}

// I = P × (R/100) × N      M = (P + I) / (number of payments)
// Monthly = N payments, Bi-monthly (twice a month) = 2N payments
const FREQ = {
  monthly: { perMonth: 1, short: 'Monthly', label: 'Indicative monthly repayment', sub: 'once a month' },
  bimonthly: { perMonth: 2, short: 'Bi-monthly', label: 'Indicative bi-monthly repayment', sub: 'twice a month' }
};

function simulate(amount, ratePct, term, perMonth) {
  const interest = amount * (ratePct / 100) * term;
  const count = term * perMonth;
  const pmt = (amount + interest) / count;
  const principalPer = amount / count;
  const interestPer = interest / count;
  const rows = [];
  for (let k = 1; k <= count; k++) {
    rows.push({ k, month: Math.ceil(k / perMonth), payment: pmt, principal: principalPer, interest: interestPer, balance: k === count ? 0 : amount - principalPer * k });
  }
  return { pmt, count, total: amount + interest, interest, rows };
}

export default function LoanCalculatorPage() {
  const [amount, setAmount] = useState(DEFAULTS.amount);
  const [amountText, setAmountText] = useState(DEFAULTS.amount.toLocaleString('en-PH'));
  const [rate, setRate] = useState(DEFAULTS.rate);
  const [term, setTerm] = useState(DEFAULTS.term);
  const [freq, setFreq] = useState('monthly');
  const [hover, setHover] = useState(null);

  const res = useMemo(() => simulate(amount, rate, term, FREQ[freq].perMonth), [amount, rate, term, freq]);

  const setAmt = (n) => {
    const v = clamp(Math.round(n), MIN_AMOUNT, MAX_AMOUNT);
    setAmount(v);
    setAmountText(v.toLocaleString('en-PH'));
  };
  const onAmountType = (e) => {
    const digits = e.target.value.replace(/\D/g, '');
    setAmountText(digits ? Number(digits).toLocaleString('en-PH') : '');
    const n = Number(digits);
    if (n >= MIN_AMOUNT && n <= MAX_AMOUNT) setAmount(n);
  };
  const onAmountBlur = () => setAmt(Number(amountText.replace(/\D/g, '')) || MIN_AMOUNT);
  const reset = () => { setAmt(DEFAULTS.amount); setRate(DEFAULTS.rate); setTerm(DEFAULTS.term); setFreq('monthly'); };

  const R = 56;
  const C = 2 * Math.PI * R;
  const principalShare = amount / res.total;
  const maxBar = res.pmt;

  return <div className="lc">
    <section className="lc-hero">
      <div className="lc-hero-orb" aria-hidden="true" />
      <div className="lc-wrap">
        <div className="lc-eyebrow"><Calculator size={13} strokeWidth={2.4}/> LOAN CALCULATOR</div>
        <h1>Plan your <span>repayment</span><br/>before you borrow.</h1>
        <p>Move the sliders to simulate a business loan. See your indicative monthly repayment, the total you will repay and how much of it is interest.</p>
      </div>
    </section>

    <section className="lc-wrap lc-main">
      <div className="lc-card lc-controls">
        <div className="lc-card-head">
          <h2><Sparkles size={16}/> Simulation inputs</h2>
          <button type="button" className="lc-reset" onClick={reset}><RotateCcw size={14}/> Reset</button>
        </div>

        <div className="lc-field">
          <div className="lc-label"><span><Banknote size={15}/> Loan amount</span><em>₱1M – ₱15M</em></div>
          <div className="lc-money"><b>₱</b><input inputMode="numeric" value={amountText} onChange={onAmountType} onBlur={onAmountBlur} aria-label="Loan amount in pesos"/></div>
          <input className="lc-range" type="range" min={MIN_AMOUNT} max={MAX_AMOUNT} step={100000} value={amount} onChange={(e) => setAmt(+e.target.value)} style={{ '--p': pct(amount, MIN_AMOUNT, MAX_AMOUNT) }} aria-label="Loan amount slider"/>
          <div className="lc-ticks"><span>₱1M</span><span>₱5M</span><span>₱10M</span><span>₱15M</span></div>
          <div className="lc-chips">
            {QUICK_AMOUNTS.map(q => <button key={q} type="button" className={amount === q ? 'on' : ''} onClick={() => setAmt(q)}>₱{compact(q)}</button>)}
          </div>
        </div>

        <div className="lc-field">
          <div className="lc-label"><span><Percent size={15}/> Monthly Interest Rate (%)</span><em>2% – 5% per month</em></div>
          <div className="lc-readout"><strong>{rate.toFixed(1)}%</strong><small>per month</small></div>
          <input className="lc-range" type="range" min={MIN_RATE} max={MAX_RATE} step={0.1} value={rate} onChange={(e) => setRate(+(+e.target.value).toFixed(1))} style={{ '--p': pct(rate, MIN_RATE, MAX_RATE) }} aria-label="Monthly interest rate percent slider"/>
          <div className="lc-ticks"><span>2%</span><span>3%</span><span>4%</span><span>5%</span></div>
        </div>

        <div className="lc-field">
          <div className="lc-label"><span><CalendarDays size={15}/> Loan term</span><em>1 – 6 months</em></div>
          <div className="lc-readout"><strong>{term}</strong><small>{term === 1 ? 'month' : 'months'}</small></div>
          <input className="lc-range" type="range" min={MIN_TERM} max={MAX_TERM} step={1} value={term} onChange={(e) => setTerm(+e.target.value)} style={{ '--p': pct(term, MIN_TERM, MAX_TERM) }} aria-label="Loan term slider"/>
          <div className="lc-ticks lc-ticks-6">{[1, 2, 3, 4, 5, 6].map(n => <span key={n}>{n}</span>)}</div>
        </div>

        <div className="lc-field">
          <div className="lc-label"><span><Repeat size={15}/> Payment frequency</span><em>{res.count} {res.count === 1 ? 'payment' : 'payments'}</em></div>
          <div className="lc-seg-ctl" role="radiogroup" aria-label="Payment frequency" data-pos={freq}>
            <span className="lc-seg-thumb" aria-hidden="true" />
            {Object.entries(FREQ).map(([key, f]) => (
              <button key={key} type="button" role="radio" aria-checked={freq === key} className={freq === key ? 'on' : ''} onClick={() => setFreq(key)}>
                <strong>{f.short}</strong><small>{key === 'monthly' ? '1 payment a month' : '2 payments a month'}</small>
              </button>
            ))}
          </div>
          <p className="lc-freq-hint">{freq === 'monthly' ? `You pay once a month, ${term} ${term === 1 ? 'time' : 'times'} in ${term} ${term === 1 ? 'month' : 'months'}.` : `You pay twice a month, ${res.count} times in ${term} ${term === 1 ? 'month' : 'months'}.`}</p>
        </div>
      </div>

      <div className="lc-side">
        <div className="lc-card lc-result">
          <span className="lc-result-glow" aria-hidden="true" />
          <div className="lc-result-label">{FREQ[freq].label}</div>
          <div className="lc-result-big"><Money value={res.pmt}/></div>
          <div className="lc-result-sub">{res.count} {res.count === 1 ? 'payment' : 'payments'}, {FREQ[freq].sub} • {term} {term === 1 ? 'month' : 'months'} at {rate.toFixed(1)}% monthly</div>
          <div className="lc-result-grid">
            <div><small>Loan amount</small><strong>{peso(amount, 0)}</strong></div>
            <div><small>Total repayable</small><strong><Money value={res.total}/></strong></div>
            <div><small>Total interest</small><strong><Money value={res.interest}/></strong></div>
          </div>
        </div>

        <div className="lc-card lc-donut-card">
          <div className="lc-donut">
            <svg viewBox="0 0 140 140" role="img" aria-label={`Principal ${Math.round(principalShare * 100)} percent, interest ${Math.round((1 - principalShare) * 100)} percent`}>
              <circle className="lc-ring-bg" cx="70" cy="70" r={R}/>
              <circle className="lc-ring-int" cx="70" cy="70" r={R}/>
              <circle className="lc-ring-pr" cx="70" cy="70" r={R} strokeDasharray={`${principalShare * C} ${C}`}/>
            </svg>
            <div className="lc-donut-mid"><strong>{((1 - principalShare) * 100).toFixed(1)}%</strong><small>is interest</small></div>
          </div>
          <ul className="lc-legend">
            <li><i className="pr"/><span>Principal</span><b>{peso(amount, 0)}</b></li>
            <li><i className="int"/><span>Interest</span><b>{peso(res.interest, 0)}</b></li>
            <li className="tot"><span>Total repayable</span><b>{peso(res.total, 0)}</b></li>
          </ul>
        </div>
      </div>
    </section>

    <section className="lc-wrap lc-lower">
      <div className="lc-card lc-chart">
        <div className="lc-card-head">
          <h2>Where each payment goes <small className="lc-h-sub">{res.count} {res.count === 1 ? 'payment' : 'payments'}</small></h2>
          <div className="lc-key"><span><i className="pr"/>Principal</span><span><i className="int"/>Interest</span></div>
        </div>
        <div className={`lc-bars ${res.count > 6 ? 'many' : ''}`} style={{ '--n': res.count }}>
          <div className="lc-grid" aria-hidden="true"><span>{peso(maxBar, 0)}</span><span/><span>{peso(maxBar / 2, 0)}</span><span/><span>₱0</span></div>
          {res.rows.map((row) => (
            <div key={row.k} className={`lc-col ${hover === row.k ? 'on' : ''}`} onMouseEnter={() => setHover(row.k)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(row.k)} onBlur={() => setHover(null)} tabIndex={0}>
              <div className="lc-tip"><b>Payment {row.k} • Month {row.month}</b><span>Principal {peso(row.principal, 0)}</span><span>Interest {peso(row.interest, 0)}</span></div>
              <div className="lc-stack">
                <div className="lc-seg int" style={{ height: `${(row.interest / maxBar) * 100}%` }}/>
                <div className="lc-seg pr" style={{ height: `${(row.principal / maxBar) * 100}%` }}/>
              </div>
              <span className="lc-x">{res.count > 6 ? row.k : `Pay ${row.k}`}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="lc-card lc-table-card">
        <div className="lc-card-head"><h2>Repayment schedule</h2></div>
        <div className="lc-table-scroll">
          <table className="lc-table">
            <thead><tr><th>Payment #</th><th>Month</th><th>Payment</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead>
            <tbody>
              {res.rows.map(r => <tr key={r.k}><td>{r.k}</td><td>{r.month}</td><td>{peso(r.payment)}</td><td>{peso(r.principal)}</td><td>{peso(r.interest)}</td><td>{peso(r.balance)}</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>

      <div className="lc-note">
        <Info size={18}/>
        <p>This calculator is for simulation purposes only. Figures are indicative, are computed as total interest = loan amount × monthly interest rate × number of months, with equal payments (monthly, or twice a month for bi-monthly), and do not include fees or charges. They are not an offer or approval of credit. Loan applications are handled face-to-face at our Makati office only.</p>
        <a className="lc-cta" href="#/contact">Talk to us <ArrowRight size={15}/></a>
      </div>
    </section>
  </div>;
}