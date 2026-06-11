import { useEffect, useState } from 'react';
import { computeIncomeTax, formatInr } from './incomeTax.js';
import { submitWeb3Form } from './web3forms.js';

const API = '';

const SERVICES = [
  { icon: '📋', title: 'Audit & Assurance', desc: 'Comprehensive internal and statutory audits ensuring complete transparency and regulatory compliance for your business.', tags: ['Internal Audit', 'Financial Audit', 'Risk Assessment'] },
  { icon: '📊', title: 'Income Tax Filing', desc: 'Expert ITR filing for individuals and businesses. Tax planning and optimization under all applicable sections including 80C, 80D and more.', tags: ['ITR Filing', 'Tax Planning', '80C Savings'] },
  { icon: '🧾', title: 'GST Compliance', desc: 'End-to-end GST services including registration, return filing, reconciliation and advisory for businesses of all sizes in Bangalore.', tags: ['GST Registration', 'Return Filing', 'GST Advisory'] },
  { icon: '📚', title: 'Accounting Services', desc: 'Professional bookkeeping, financial statement preparation, ledger maintenance and comprehensive business financial reporting.', tags: ['Bookkeeping', 'P&L Statements', 'Ledger Mgmt'] },
  { icon: '🏛️', title: 'Registrations & Licensing', desc: 'Seamless business registration services including Proprietorship, Partnership, MSME, Startup India and all statutory licenses.', tags: ['MSME', 'Proprietorship', 'Startup Advisory'] },
  { icon: '💼', title: 'Financial Advisory', desc: 'Strategic financial planning, business advisory, tax optimization guidance and compliance consulting for sustainable growth.', tags: ['Financial Planning', 'Business Advisory', 'Tax Optimization'] },
];

const BLOG = [
  { date: 'March 2026 · Income Tax', title: 'New Income Tax Rules 2026 – What Changes for You', excerpt: 'The Union Budget 2026 brought significant changes to tax slabs under the new regime. Here is a complete breakdown of what is new and how it affects your tax planning.' },
  { date: 'February 2026 · Tax Saving', title: 'How to Maximize Tax Savings under Section 80C', excerpt: 'Section 80C allows deductions up to ₹1.5 lakh. Discover the best investment instruments – PPF, ELSS, NSC, and more – to reduce your taxable income this year.' },
  { date: 'January 2026 · GST', title: 'GST Filing Guide for Small Businesses in Bangalore', excerpt: 'A step-by-step guide to GSTR-1, GSTR-3B and annual return filing for small business owners. Avoid penalties with timely compliance.' },
  { date: 'December 2025 · Business', title: 'MSME Registration Benefits – Why Every Small Business Should Register', excerpt: 'MSME registration opens doors to government subsidies, priority lending, and protection under the MSMED Act. Here is everything you need to know.' },
  { date: 'November 2025 · Compliance', title: 'Top 7 Common Tax Filing Mistakes and How to Avoid Them', excerpt: 'From mismatching Form 26AS to missing investment declarations, these common errors can cost you money and attract IT scrutiny. Learn how to file clean.' },
  { date: 'October 2025 · Planning', title: 'Business Tax Planning Tips for FY 2025-26', excerpt: 'Smart tax planning is not just about saving money – it is about building a sustainable financial structure. These strategies help businesses in Bangalore minimize their tax burden legally.' },
];

export default function App() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const [navShadow, setNavShadow] = useState(false);
  const [calcTab, setCalcTab] = useState('income');

  const [itGross, setItGross] = useState('');
  const [itAge, setItAge] = useState('below60');
  const [itRegime, setItRegime] = useState('new');
  const [itSalaried, setItSalaried] = useState(true);
  const [it80c, setIt80c] = useState('');
  const [itOther, setItOther] = useState('');
  const [itResult, setItResult] = useState(null);

  const [gstAmount, setGstAmount] = useState('');
  const [gstRate, setGstRate] = useState('18');
  const [gstType, setGstType] = useState('exclusive');
  const [gstShow, setGstShow] = useState(false);
  const [gstRows, setGstRows] = useState([]);
  const [gstMain, setGstMain] = useState('₹0');

  const [hraBasic, setHraBasic] = useState('');
  const [hraRec, setHraRec] = useState('');
  const [hraRent, setHraRent] = useState('');
  const [hraCity, setHraCity] = useState('nonmetro');
  const [hraShow, setHraShow] = useState(false);
  const [hraRows, setHraRows] = useState([]);
  const [hraMain, setHraMain] = useState('₹0');

  const [emiP, setEmiP] = useState('');
  const [emiR, setEmiR] = useState('');
  const [emiY, setEmiY] = useState('');
  const [emiShow, setEmiShow] = useState(false);
  const [emiRows, setEmiRows] = useState([]);
  const [emiMain, setEmiMain] = useState('₹0');

  const [appt, setAppt] = useState({ name: '', phone: '', email: '', service: '', date: '', time: '', message: '' });
  const [apptBusy, setApptBusy] = useState(false);
  const [apptErr, setApptErr] = useState('');
  const [apptOk, setApptOk] = useState(false);

  const [contact, setContact] = useState({ name: '', phone: '', email: '', message: '' });
  const [contactBusy, setContactBusy] = useState(false);
  const [contactErr, setContactErr] = useState('');
  const [contactOk, setContactOk] = useState(false);

  const [portalName, setPortalName] = useState('');
  const [portalPhone, setPortalPhone] = useState('');
  const [portalNotes, setPortalNotes] = useState('');
  const [portalFiles, setPortalFiles] = useState([]);
  const [portalBusy, setPortalBusy] = useState(false);
  const [portalErr, setPortalErr] = useState('');
  const [portalOk, setPortalOk] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const pct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      setScrollPct(Number.isFinite(pct) ? pct : 0);
      setNavShadow(window.scrollY > 50);
    };
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll('.fade-up');
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  function calcIncome() {
    const gross = parseFloat(itGross) || 0;
    const res = computeIncomeTax({
      grossIncome: gross,
      regime: itRegime,
      ageGroup: itAge,
      isSalariedOrPensioner: itSalaried,
      deduction80C: parseFloat(it80c) || 0,
      otherChapterVIA: parseFloat(itOther) || 0,
    });
    setItResult(res);
  }

  function calcGST() {
    const amount = parseFloat(gstAmount) || 0;
    const rate = parseFloat(gstRate) / 100;
    let base;
    let gst;
    let total;
    if (gstType === 'exclusive') {
      base = amount;
      gst = amount * rate;
      total = amount + gst;
    } else {
      total = amount;
      base = amount / (1 + rate);
      gst = total - base;
    }
    const cgst = gst / 2;
    const sgst = gst / 2;
    setGstMain(formatInr(gstType === 'exclusive' ? total : gst));
    setGstRows([
      ['Base Amount', formatInr(base)],
      [`CGST @${((rate / 2) * 100).toFixed(1)}%`, formatInr(cgst)],
      [`SGST @${((rate / 2) * 100).toFixed(1)}%`, formatInr(sgst)],
      ['Total GST', formatInr(gst)],
      ['Total Amount (incl. GST)', formatInr(total)],
    ]);
    setGstShow(true);
  }

  function calcHRA() {
    const basic = parseFloat(hraBasic) || 0;
    const received = parseFloat(hraRec) || 0;
    const rent = parseFloat(hraRent) || 0;
    const pct = hraCity === 'metro' ? 0.5 : 0.4;
    const m1 = received;
    const m2 = pct * basic;
    const m3 = Math.max(0, rent - 0.1 * basic);
    const exemption = Math.min(m1, m2, m3);
    setHraMain(formatInr(exemption));
    setHraRows([
      ['HRA Received', formatInr(m1)],
      [`${pct * 100}% of Basic Salary`, formatInr(m2)],
      ['Rent Paid – 10% of Basic', formatInr(m3)],
      ['HRA Exemption (lowest of 3)', formatInr(exemption)],
      ['Taxable HRA', formatInr(received - exemption)],
    ]);
    setHraShow(true);
  }

  function calcEMI() {
    const p = parseFloat(emiP) || 0;
    const r = (parseFloat(emiR) || 0) / 12 / 100;
    const n = (parseFloat(emiY) || 0) * 12;
    if (!p || !r || !n) return;
    const emi = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPay = emi * n;
    const interest = totalPay - p;
    setEmiMain(formatInr(emi));
    setEmiRows([
      ['Principal Amount', formatInr(p)],
      ['Total Interest Payable', formatInr(interest)],
      ['Total Amount Payable', formatInr(totalPay)],
      ['Loan Tenure', `${n} months`],
      ['Monthly EMI', formatInr(emi)],
    ]);
    setEmiShow(true);
  }

  async function submitAppointment(e) {
    e.preventDefault();
    setApptErr('');
    if (!appt.name.trim() || !appt.phone.trim() || !appt.service.trim()) {
      setApptErr('Please fill in Name, Phone, and Service.');
      return;
    }
    setApptBusy(true);
    try {
      await submitWeb3Form({
        subject: 'New Appointment Request - RPK Associates Website',
        name: appt.name.trim(),
        email: appt.email.trim() || 'not provided',
        phone: appt.phone.trim(),
        service: appt.service.trim(),
        date: appt.date || 'not specified',
        preferred_time: appt.time || 'not specified',
        message: appt.message.trim() || 'none',
      });
      setAppt({ name: '', phone: '', email: '', service: '', date: '', time: '', message: '' });
      setApptOk(true);
    } catch {
      setApptErr('Something went wrong. Please try again or call us directly.');
    } finally {
      setApptBusy(false);
    }
  }

  async function submitContactForm(e) {
    e.preventDefault();
    setContactErr('');
    if (!contact.name.trim() || !contact.phone.trim() || !contact.message.trim()) {
      setContactErr('Please fill in Name, Phone, and Message.');
      return;
    }
    setContactBusy(true);
    try {
      await submitWeb3Form({
        subject: 'New Contact Form Submission - RPK Associates Website',
        name: contact.name.trim(),
        email: contact.email.trim() || 'not provided',
        phone: contact.phone.trim(),
        message: contact.message.trim(),
      });
      setContact({ name: '', phone: '', email: '', message: '' });
      setContactOk(true);
    } catch {
      setContactErr('Something went wrong. Please try again or call us directly.');
    } finally {
      setContactBusy(false);
    }
  }

  async function submitPortal(e) {
    e.preventDefault();
    setPortalErr('');
    if (!portalName.trim() || !portalPhone.trim()) {
      setPortalErr('Please enter your name and phone number.');
      return;
    }
    if (!portalFiles.length) {
      setPortalErr('Please select at least one file.');
      return;
    }
    setPortalBusy(true);
    try {
      const fd = new FormData();
      fd.append('name', portalName.trim());
      fd.append('phone', portalPhone.trim());
      fd.append('notes', portalNotes.trim());
      portalFiles.forEach((f) => fd.append('files', f));
      const res = await fetch(`${API}/api/documents`, { method: 'POST', body: fd });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setPortalOk(true);
      setPortalFiles([]);
    } catch (err) {
      setPortalErr(err.message || 'Could not upload.');
    } finally {
      setPortalBusy(false);
    }
  }

  return (
    <>
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />

      <nav id="mainNav" style={{ boxShadow: navShadow ? '0 4px 30px rgba(0,0,0,0.5)' : 'none' }}>
        <a href="#home" className="nav-logo" onClick={() => setMobileOpen(false)}>
          <div className="logo-mark">R</div>
          <div className="logo-text">
            <span className="logo-name">RPK Associates</span>
            <span className="logo-sub">Auditors & Tax Consultants</span>
          </div>
        </a>
        <ul className="nav-links">
          <li><a href="#about">About</a></li>
          <li><a href="#services">Services</a></li>
          <li><a href="#calculators">Calculators</a></li>
          <li><a href="#blog">Tax Updates</a></li>
          <li><a href="#portal">Client Portal</a></li>
          <li><a href="#contact">Contact</a></li>
          <li><a href="#appointment" className="nav-cta">Book Consultation</a></li>
        </ul>
        <button type="button" className="hamburger" aria-label="Menu" onClick={() => setMobileOpen((o) => !o)}>
          <span /><span /><span />
        </button>
      </nav>

      <div className={`mobile-nav ${mobileOpen ? 'open' : ''}`}>
        <a href="#about" onClick={() => setMobileOpen(false)}>About</a>
        <a href="#services" onClick={() => setMobileOpen(false)}>Services</a>
        <a href="#calculators" onClick={() => setMobileOpen(false)}>Calculators</a>
        <a href="#blog" onClick={() => setMobileOpen(false)}>Tax Updates</a>
        <a href="#portal" onClick={() => setMobileOpen(false)}>Client Portal</a>
        <a href="#contact" onClick={() => setMobileOpen(false)}>Contact</a>
        <a href="#appointment" onClick={() => setMobileOpen(false)} style={{ color: 'var(--gold)' }}>Book Consultation</a>
      </div>

      <section id="home">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-content fade-up">
          <div className="hero-badge">
            <div className="dot" />
            <span className="label" style={{ margin: 0 }}>Bangalore&apos;s Trusted Audit and Tax consulting Firm</span>
          </div>
          <h1 className="hero-title">
            <em>Professional</em>
            <strong>Tax & Financial</strong>
            Expertise
          </h1>
          <p className="hero-desc">
            RPK Associates delivers expert internal audit, taxation, accounting, GST compliance, and business advisory services from the heart of Mahadevapura, Bangalore. Your financial clarity starts here.
          </p>
          <div className="hero-actions">
            <a href="#appointment" className="btn-primary">Book Consultation</a>
            <a href="#services" className="btn-outline">Explore Services →</a>
          </div>
          <div className="hero-stats">
            <div className="stat-item"><div className="stat-number">200+</div><div className="stat-label">Clients Served</div></div>
            <div className="stat-item"><div className="stat-number">5+</div><div className="stat-label">Years Experience</div></div>
            <div className="stat-item"><div className="stat-number">6</div><div className="stat-label">Core Services</div></div>
            <div className="stat-item"><div className="stat-number">100%</div><div className="stat-label">Compliance Rate</div></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-circle">
            <div className="orbit-dot" />
            <div className="hero-circle-inner"><div className="hero-r">R</div></div>
          </div>
        </div>
      </section>

      <section id="services">
        <div className="section-header fade-up">
          <div className="label">Our Expertise</div>
          <h2>Comprehensive <em>Financial Services</em></h2>
          <p>From GST registration to complex audits, we handle every aspect of your financial compliance in Bangalore.</p>
        </div>
        <div className="services-grid fade-up">
          {SERVICES.map((s) => (
            <a key={s.title} href="#appointment" className="service-card">
              <div className="service-icon">{s.icon}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
              <div className="service-tags">{s.tags.map((t) => <span key={t} className="service-tag">{t}</span>)}</div>
              <span className="service-arrow">→</span>
            </a>
          ))}
        </div>
      </section>

      <section id="why-us">
        <div className="why-grid">
          <div className="why-text fade-up">
            <div className="label">Why RPK Associates</div>
            <h2>Trusted Financial <em>Guidance</em> You Can Rely On</h2>
            <p>We combine deep expertise with personalized service to help individuals and businesses navigate India&apos;s complex tax and financial regulations with confidence.</p>
            <div className="why-items">
              {[
                ['01', 'Deep Local Expertise', 'Based in Mahadevapura, Bangalore – we understand the local business environment and regulatory nuances that affect your finances.'],
                ['02', 'End-to-End Compliance', 'From GST registration to complex audits, we manage the entire compliance lifecycle so you can focus on growing your business.'],
                ['03', 'Transparent & Timely', 'We deliver work on time, every time. No surprises – just clear communication and professional delivery of all engagements.'],
                ['04', 'Client-First Approach', 'Your financial success is our priority. We tailor our advice to your specific situation, not a one-size-fits-all template.'],
              ].map(([n, h, p]) => (
                <div key={n} className="why-item">
                  <div className="why-num">{n}</div>
                  <div><h4>{h}</h4><p>{p}</p></div>
                </div>
              ))}
            </div>
          </div>
          <div className="why-visual fade-up">
            <div className="credential-card"><div className="label">Proprietor</div><h3>R. Praveen Kumar</h3><p>Audit & Tax Consultant with over a decade of experience serving businesses and individuals across Bangalore.</p></div>
            <div className="credential-card"><div className="label">Office Location</div><h3>Mahadevapura</h3><p>306, Propulsive Passion, 4th Cross, Mahadevapura, Bangalore – 560016</p></div>
            <div className="credential-card"><div className="label">Practice Areas</div><h3>AUDIT · ITR · GST</h3><p>Licensed and registered with all applicable regulatory bodies. Serving clients across IT, manufacturing, retail and service sectors.</p></div>
          </div>
        </div>
      </section>

      <section id="calculators">
        <div className="section-header fade-up">
          <div className="label">Free Tools</div>
          <h2>Tax <em>Calculators</em></h2>
          <p>Estimate your tax liability instantly. These tools are for guidance; consult us for precise filing and planning.</p>
        </div>
        <div className="calc-tabs fade-up">
          {[
            ['income', 'Income Tax'],
            ['gst', 'GST'],
            ['hra', 'HRA Exemption'],
            ['emi', 'EMI'],
          ].map(([id, label]) => (
            <button key={id} type="button" className={`calc-tab ${calcTab === id ? 'active' : ''}`} onClick={() => setCalcTab(id)}>
              {label}
            </button>
          ))}
        </div>

        <div className={`calc-panel fade-up ${calcTab === 'income' ? 'active' : ''}`} id="calc-income">
          <h3>Income Tax Calculator</h3>
          <p>
            FY 2025-26 (AY 2026-27): <strong>New regime</strong> uses revised slabs (basic exemption ₹4L), standard deduction ₹75,000 for salary/pension, and rebate u/s 87A (max ₹60,000 if taxable income ≤ ₹12L).
            <strong> Old regime</strong> uses ₹50,000 standard deduction, Chapter VI-A (e.g. 80C), and rebate u/s 87A (max ₹12,500 if taxable income ≤ ₹5L). Age affects basic exemption limits in the old regime only.
          </p>
          <div className="calc-fields">
            <div className="field-group">
              <label>Gross total income (₹)</label>
              <input type="number" value={itGross} onChange={(e) => setItGross(e.target.value)} placeholder="e.g. 1200000" />
            </div>
            <div className="field-group">
              <label>Age group</label>
              <select value={itAge} onChange={(e) => setItAge(e.target.value)}>
                <option value="below60">Below 60 years</option>
                <option value="60to80">60–80 years (Senior)</option>
                <option value="above80">Above 80 (Super Senior)</option>
              </select>
            </div>
            <div className="field-group">
              <label>Tax regime</label>
              <select value={itRegime} onChange={(e) => setItRegime(e.target.value)}>
                <option value="new">New regime (default law)</option>
                <option value="old">Old regime (with deductions)</option>
              </select>
            </div>
            <div className="field-group">
              <label>Salary / pension income?</label>
              <select value={itSalaried ? 'yes' : 'no'} onChange={(e) => setItSalaried(e.target.value === 'yes')}>
                <option value="yes">Yes – apply standard deduction</option>
                <option value="no">No – business / other income only</option>
              </select>
            </div>
            {itRegime === 'old' && (
              <>
                <div className="field-group">
                  <label>80C &amp; similar (₹)</label>
                  <input type="number" value={it80c} onChange={(e) => setIt80c(e.target.value)} placeholder="Max ₹1,50,000" />
                </div>
                <div className="field-group">
                  <label>Other Chapter VI-A (₹)</label>
                  <input type="number" value={itOther} onChange={(e) => setItOther(e.target.value)} placeholder="80D, 80CCD, etc." />
                </div>
              </>
            )}
          </div>
          <button type="button" className="calc-btn" onClick={calcIncome}>Calculate income tax →</button>
          {itResult && (
            <div className="calc-result show">
              <div className="label">Estimated total tax</div>
              <div className="result-amount">{formatInr(itResult.total)}</div>
              <div className="result-breakdown">
                {itResult.breakdown.map(([l, v]) => (
                  <div key={l} className="result-row"><span>{l}</span><span>{v}</span></div>
                ))}
              </div>
              <p className="calc-disclaimer">{itResult.disclaimer}</p>
            </div>
          )}
        </div>

        <div className={`calc-panel ${calcTab === 'gst' ? 'active' : ''}`} id="calc-gst">
          <h3>GST Calculator</h3>
          <p>Calculate GST amount for any taxable value across standard GST slabs.</p>
          <div className="calc-fields">
            <div className="field-group"><label>Amount (₹)</label><input type="number" value={gstAmount} onChange={(e) => setGstAmount(e.target.value)} placeholder="Enter amount" /></div>
            <div className="field-group">
              <label>GST Rate</label>
              <select value={gstRate} onChange={(e) => setGstRate(e.target.value)}>
                <option value="5">5% – Essential goods</option>
                <option value="12">12% – Standard goods</option>
                <option value="18">18% – Services / Standard</option>
                <option value="28">28% – Luxury / demerit</option>
              </select>
            </div>
            <div className="field-group">
              <label>Calculation Type</label>
              <select value={gstType} onChange={(e) => setGstType(e.target.value)}>
                <option value="exclusive">Add GST to amount</option>
                <option value="inclusive">Extract GST from amount</option>
              </select>
            </div>
          </div>
          <button type="button" className="calc-btn" onClick={calcGST}>Calculate GST →</button>
          <div className={`calc-result ${gstShow ? 'show' : ''}`}>
            <div className="label">GST Breakdown</div>
            <div className="result-amount">{gstMain}</div>
            <div className="result-breakdown">{gstRows.map(([l, v]) => <div key={l} className="result-row"><span>{l}</span><span>{v}</span></div>)}</div>
          </div>
        </div>

        <div className={`calc-panel ${calcTab === 'hra' ? 'active' : ''}`} id="calc-hra">
          <h3>HRA Exemption Calculator</h3>
          <p>House Rent Allowance exemption under Section 10(13A) (typically useful under the <strong>old</strong> regime).</p>
          <div className="calc-fields">
            <div className="field-group"><label>Basic Salary (Annual ₹)</label><input type="number" value={hraBasic} onChange={(e) => setHraBasic(e.target.value)} placeholder="e.g. 600000" /></div>
            <div className="field-group"><label>HRA Received (Annual ₹)</label><input type="number" value={hraRec} onChange={(e) => setHraRec(e.target.value)} placeholder="e.g. 240000" /></div>
            <div className="field-group"><label>Rent Paid (Annual ₹)</label><input type="number" value={hraRent} onChange={(e) => setHraRent(e.target.value)} placeholder="e.g. 300000" /></div>
            <div className="field-group">
              <label>City</label>
              <select value={hraCity} onChange={(e) => setHraCity(e.target.value)}>
                <option value="metro">Metro (Delhi/Mumbai/Kolkata/Chennai)</option>
                <option value="nonmetro">Non-Metro (Bangalore etc.)</option>
              </select>
            </div>
          </div>
          <button type="button" className="calc-btn" onClick={calcHRA}>Calculate HRA →</button>
          <div className={`calc-result ${hraShow ? 'show' : ''}`}>
            <div className="label">HRA Exemption</div>
            <div className="result-amount">{hraMain}</div>
            <div className="result-breakdown">{hraRows.map(([l, v]) => <div key={l} className="result-row"><span>{l}</span><span>{v}</span></div>)}</div>
          </div>
        </div>

        <div className={`calc-panel ${calcTab === 'emi' ? 'active' : ''}`} id="calc-emi">
          <h3>EMI Calculator</h3>
          <p>Monthly EMI for home loans, business loans or any fixed-rate loan.</p>
          <div className="calc-fields">
            <div className="field-group"><label>Loan Amount (₹)</label><input type="number" value={emiP} onChange={(e) => setEmiP(e.target.value)} placeholder="e.g. 5000000" /></div>
            <div className="field-group"><label>Annual Interest Rate (%)</label><input type="number" step="0.1" value={emiR} onChange={(e) => setEmiR(e.target.value)} placeholder="e.g. 8.5" /></div>
            <div className="field-group"><label>Loan Tenure (Years)</label><input type="number" value={emiY} onChange={(e) => setEmiY(e.target.value)} placeholder="e.g. 20" /></div>
          </div>
          <button type="button" className="calc-btn" onClick={calcEMI}>Calculate EMI →</button>
          <div className={`calc-result ${emiShow ? 'show' : ''}`}>
            <div className="label">Monthly EMI</div>
            <div className="result-amount">{emiMain}</div>
            <div className="result-breakdown">{emiRows.map(([l, v]) => <div key={l} className="result-row"><span>{l}</span><span>{v}</span></div>)}</div>
          </div>
        </div>
      </section>

      <section id="appointment">
        <div className="appointment-grid">
          <div className="appt-info fade-up">
            <div className="label">Book Consultation</div>
            <h2>Schedule Your <em>Free</em> Consultation</h2>
            <p>Speak with R. Praveen Kumar directly about your tax, GST, or financial needs. We offer flexible appointments at our Mahadevapura office or via phone call.</p>
            <div className="appt-steps">
              {['Select your service and preferred date', 'Fill in your contact details', 'Submit and we will confirm within 24 hours', 'Attend your consultation – in-person or on call'].map((t, i) => (
                <div key={t} className="appt-step"><div className="step-num">{i + 1}</div><p>{t}</p></div>
              ))}
            </div>
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'var(--black-card)', border: '1px solid var(--border)', borderRadius: 4 }}>
              <div className="label" style={{ marginBottom: '0.6rem' }}>Direct Contact</div>
              <p style={{ color: 'var(--white)', fontSize: '1.1rem', marginBottom: '0.4rem' }}>
                <a href="tel:+917353953396" style={{ color: 'var(--gold)', textDecoration: 'none' }}>+91 73539 53396</a>
              </p>
              <p style={{ color: 'var(--white-dim)', fontSize: '0.82rem' }}>rpkassociates07@gmail.com</p>
            </div>
          </div>
          <div className="appt-form fade-up">
            {!apptOk ? (
              <form onSubmit={submitAppointment}>
                <div className="label" style={{ marginBottom: '1rem' }}>Appointment Request</div>
                <div className="form-row">
                  <div className="form-group"><label>Full Name *</label><input value={appt.name} onChange={(e) => setAppt({ ...appt, name: e.target.value })} placeholder="Your full name" required /></div>
                  <div className="form-group"><label>Phone Number *</label><input value={appt.phone} onChange={(e) => setAppt({ ...appt, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" required /></div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Email Address</label><input type="email" value={appt.email} onChange={(e) => setAppt({ ...appt, email: e.target.value })} placeholder="you@example.com" /></div>
                  <div className="form-group">
                    <label>Service Required *</label>
                    <select value={appt.service} onChange={(e) => setAppt({ ...appt, service: e.target.value })} required>
                      <option value="">Select service...</option>
                      <option>Audit & Assurance</option>
                      <option>Income Tax / ITR Filing</option>
                      <option>GST Registration / Filing</option>
                      <option>Accounting Services</option>
                      <option>Business Registration</option>
                      <option>Financial Advisory</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group"><label>Preferred Date</label><input type="date" value={appt.date} onChange={(e) => setAppt({ ...appt, date: e.target.value })} /></div>
                  <div className="form-group">
                    <label>Preferred Time</label>
                    <select value={appt.time} onChange={(e) => setAppt({ ...appt, time: e.target.value })}>
                      <option value="">Select time...</option>
                      <option>9:00 AM – 10:00 AM</option>
                      <option>10:00 AM – 11:00 AM</option>
                      <option>11:00 AM – 12:00 PM</option>
                      <option>2:00 PM – 3:00 PM</option>
                      <option>3:00 PM – 4:00 PM</option>
                      <option>4:00 PM – 5:00 PM</option>
                    </select>
                  </div>
                </div>
                <div className="form-row single">
                  <div className="form-group"><label>Message / Description</label><textarea value={appt.message} onChange={(e) => setAppt({ ...appt, message: e.target.value })} placeholder="Briefly describe your requirement..." /></div>
                </div>
                {apptErr ? <div className="form-error">{apptErr}</div> : null}
                <button type="submit" className="form-submit" disabled={apptBusy}>{apptBusy ? 'Sending…' : 'Request Appointment →'}</button>
              </form>
            ) : (
              <div className="form-success show">
                <div className="checkmark">✅</div>
                <h3>Request Received!</h3>
                <p>Appointment request received! We&apos;ll confirm your slot within 24 hours.<br /><br />
                  For urgent queries, call <a href="tel:+917353953396" style={{ color: 'var(--gold)' }}>+91 73539 53396</a></p>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="blog">
        <div className="section-header fade-up">
          <div className="label">Tax Updates & Insights</div>
          <h2>Stay Informed on <em>Tax Laws</em></h2>
          <p>Expert articles on the latest income tax rules, GST updates, and financial planning tips for Bangalore businesses.</p>
        </div>
        <div className="blog-grid fade-up">
          {BLOG.map((b) => (
            <div key={b.title} className="blog-card">
              <div className="blog-date">{b.date}</div>
              <h3>{b.title}</h3>
              <p>{b.excerpt}</p>
              <div className="blog-read">Read Article <span>→</span></div>
            </div>
          ))}
        </div>
      </section>

      <section id="about">
        <div className="about-grid">
          <div className="about-text fade-up">
            <div className="label">About RPK Associates</div>
            <h2>A Firm Built on <em>Trust</em> and Expertise</h2>
            <p>RPK Associates is a Bangalore-based Audit and Tax consulting firm specializing in taxation, audit, GST compliance, and business advisory. Founded by R. Praveen Kumar, the firm has built its reputation on delivering accurate, timely, and personalized financial services to clients across industries.</p>
            <p>We work with startups, established businesses, salaried individuals, and NRIs to ensure they remain fully compliant while optimizing their financial position. Our approach is hands-on – we don&apos;t assign junior staff to handle complex matters; every engagement receives senior-level attention.</p>
            <p>Located in the bustling Mahadevapura business district of Bangalore, we serve clients from across the city and are well-versed in the specific compliance needs of IT sector employees, technology startups, and e-commerce businesses concentrated in this corridor.</p>
            <div className="about-mission">
              <p>&quot;Our mission is to make professional financial guidance accessible to every individual and business – not just large corporations. When you work with RPK Associates, you work with people who genuinely care about your financial wellbeing.&quot;</p>
            </div>
            <p style={{ marginTop: '1rem', fontSize: '0.82rem', color: 'var(--white-dim)' }}>— R. Praveen Kumar, Proprietor</p>
          </div>
          <div className="fade-up">
            <div className="about-card">
              <div className="about-avatar">PK</div>
              <div className="about-name">R. Praveen Kumar</div>
              <div className="about-title">Proprietor · Audit and Tax Consultant</div>
              <div className="about-desc">An accomplished Audit and Tax consultant with deep expertise in direct and indirect taxation, audit, and financial advisory. Praveen Kumar has guided hundreds of clients through complex regulatory landscapes with precision and care.</div>
              <div className="about-credentials">
                {['Tax consultant', 'Income Tax & GST Practitioner', 'Registered Auditor', 'Business Registration Expert', '5+ Years Practice in Bangalore'].map((t) => (
                  <div key={t} className="cred-item"><span>✦</span><span>{t}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="portal">
        <div className="section-header fade-up">
          <div className="label">Client Portal</div>
          <h2>Secure Document <em>Upload</em></h2>
          <p>Submit your documents securely. Files are stored on the server for your firm to process (configure access in production).</p>
        </div>
        <div className="portal-container fade-up">
          <div className="portal-header">
            <div className="portal-icon">🔐</div>
            <div><h3>RPK Associates – Client Portal</h3><p>Upload your financial documents securely for processing</p></div>
          </div>
          {!portalOk ? (
            <form className="portal-login" onSubmit={submitPortal}>
              <p>Upload your documents below. Include your name and contact number in the notes if needed so we can match files to your case.</p>
              <label className="upload-zone" style={{ display: 'block' }}>
                <input type="file" multiple onChange={(e) => setPortalFiles(Array.from(e.target.files || []))} />
                <div className="upload-icon">📁</div>
                <h4>Drop files here or click to browse</h4>
                <p>PDF, JPG, PNG, Excel – Max 10MB per file</p>
              </label>
              <div className="label" style={{ marginBottom: '0.6rem' }}>Accepted Document Types</div>
              <div className="doc-types">
                {['PAN Card', 'Aadhaar Card', 'Form 16', 'Bank Statements', 'ITR Copy', 'GST Documents', 'Invoices', 'Financial Statements', 'TDS Certificates', 'Property Documents'].map((t) => (
                  <span key={t} className="doc-type-tag">{t}</span>
                ))}
              </div>
              <div className="form-row">
                <div className="form-group"><label>Your Name *</label><input value={portalName} onChange={(e) => setPortalName(e.target.value)} placeholder="Full name" required /></div>
                <div className="form-group"><label>Phone Number *</label><input value={portalPhone} onChange={(e) => setPortalPhone(e.target.value)} placeholder="+91 XXXXX XXXXX" required /></div>
              </div>
              <div className="form-row single">
                <div className="form-group"><label>Notes / Instructions</label><textarea value={portalNotes} onChange={(e) => setPortalNotes(e.target.value)} placeholder="Describe the documents or instructions..." /></div>
              </div>
              {portalFiles.length > 0 && (
                <div className="uploaded-list">
                  <div className="label" style={{ marginBottom: '0.4rem' }}>Selected Files</div>
                  {portalFiles.map((f) => (
                    <div key={f.name + f.size} className="uploaded-item">
                      <span className="file-name">📄 {f.name}</span>
                      <span style={{ color: 'var(--gold)', fontSize: '0.75rem' }}>{(f.size / 1024).toFixed(0)} KB</span>
                    </div>
                  ))}
                </div>
              )}
              {portalErr ? <div className="form-error">{portalErr}</div> : null}
              <button type="submit" className="form-submit" disabled={portalBusy}>{portalBusy ? 'Uploading…' : 'Submit Documents →'}</button>
            </form>
          ) : (
            <div className="portal-login">
              <div className="form-success show">
                <div className="checkmark">✅</div>
                <h3>Upload complete</h3>
                <p>Thank you. Our team will contact you shortly.</p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section id="contact">
        <div className="contact-grid">
          <div className="contact-info fade-up">
            <div className="label">Get In Touch</div>
            <h2>Visit or <em>Contact</em> Us</h2>
            <p>Our office is conveniently located in Mahadevapura, Bangalore. Walk in or book an appointment for a personal consultation.</p>
            <div className="contact-items">
              <a href="tel:+917353953396" className="contact-item"><div className="contact-icon">📞</div><div className="contact-item-text"><div className="contact-label">Phone</div><p>+91 73539 53396</p><small>Mon–Sat, 9 AM – 6 PM</small></div></a>
              <a href="mailto:rpkassociates07@gmail.com" className="contact-item"><div className="contact-icon">✉️</div><div className="contact-item-text"><div className="contact-label">Email</div><p>rpkassociates07@gmail.com</p><small>We respond within 24 hours</small></div></a>
              <div className="contact-item"><div className="contact-icon">📍</div><div className="contact-item-text"><div className="contact-label">Office Address</div><p>306, Propulsive Passion</p><small>4th Cross, Mahadevapura, Bangalore – 560016</small></div></div>
            </div>
            <div className="map-container">
              <iframe title="Map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.6825!2d77.6964!3d12.9929!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1154b8000001%3A0x3bae1154b8000001!2sMahadevapura%2C%20Bengaluru%2C%20Karnataka%20560016!5e0!3m2!1sen!2sin!4v1" allowFullScreen loading="lazy" />
            </div>
          </div>
          <div className="contact-form-wrap fade-up">
            {!contactOk ? (
              <>
                <h3>Send a Message</h3>
                <p>Have a question? Fill in the form and we will get back to you promptly.</p>
                <form onSubmit={submitContactForm}>
                  <div className="form-row">
                    <div className="form-group"><label>Name *</label><input value={contact.name} onChange={(e) => setContact({ ...contact, name: e.target.value })} placeholder="Your name" required /></div>
                    <div className="form-group"><label>Phone *</label><input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="+91 XXXXX XXXXX" required /></div>
                  </div>
                  <div className="form-row single" style={{ marginBottom: '1rem' }}><div className="form-group"><label>Email</label><input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="you@example.com" /></div></div>
                  <div className="form-row single" style={{ marginBottom: '1rem' }}><div className="form-group"><label>Message *</label><textarea value={contact.message} onChange={(e) => setContact({ ...contact, message: e.target.value })} placeholder="How can we help you?" style={{ minHeight: 120 }} required /></div></div>
                  {contactErr ? <div className="form-error">{contactErr}</div> : null}
                  <button type="submit" className="form-submit" disabled={contactBusy}>{contactBusy ? 'Sending…' : 'Send Message →'}</button>
                </form>
              </>
            ) : (
              <div className="form-success show">
                <div className="checkmark">✅</div>
                <h3>Message Sent!</h3>
                <p>Thank you! We&apos;ll get back to you within 24 hours.<br /><br />
                  Urgent: <a href="tel:+917353953396" style={{ color: 'var(--gold)' }}>+91 73539 53396</a></p>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="cta-banner">
        <div className="label">Start Today</div>
        <h2>Ready to Simplify Your <em>Tax & Finance</em>?</h2>
        <p>Join hundreds of businesses and individuals who trust RPK Associates for accurate, reliable, and professional financial services in Bangalore.</p>
        <div className="cta-actions">
          <a href="#appointment" className="btn-primary">Book Free Consultation</a>
          <a href="tel:+917353953396" className="btn-outline">Call Now</a>
        </div>
      </div>

      <footer>
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="nav-logo" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
              <div className="logo-mark">R</div>
              <div className="logo-text"><span className="logo-name">RPK Associates</span><span className="logo-sub">Auditors & Tax Consultants</span></div>
            </div>
            <p>Professional Audit and Tax consultancy services in Bangalore. Expert tax, GST, audit, and financial advisory for individuals and businesses.</p>
            <div style={{ display: 'flex', gap: '0.8rem', marginTop: '1rem' }}>
              <a href="https://wa.me/917353953396" style={{ width: 36, height: 36, background: '#25D366', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: '1rem' }}>💬</a>
              <a href="mailto:rpkassociates07@gmail.com" style={{ width: 36, height: 36, background: 'var(--black-mid)', border: '1px solid var(--border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: '1rem' }}>✉️</a>
              <a href="tel:+917353953396" style={{ width: 36, height: 36, background: 'var(--black-mid)', border: '1px solid var(--border)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: '1rem' }}>📞</a>
            </div>
          </div>
          <div className="footer-col">
            <h4>Services</h4>
            <ul>
              {['Audit & Assurance', 'Income Tax Filing', 'GST Compliance', 'Accounting', 'Business Registration', 'Financial Advisory'].map((x) => (
                <li key={x}><a href="#services">{x}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              {['Home', 'About Us', 'Tax Calculators', 'Tax Updates', 'Book Appointment', 'Client Portal'].map((x) => {
                const href = x === 'Home' ? '#home' : x === 'About Us' ? '#about' : x === 'Tax Calculators' ? '#calculators' : x === 'Tax Updates' ? '#blog' : x === 'Book Appointment' ? '#appointment' : '#portal';
                return <li key={x}><a href={href}>{x}</a></li>;
              })}
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <div className="footer-contact">
              <div className="footer-contact-item"><span>📞</span><span>+91 73539 53396</span></div>
              <div className="footer-contact-item"><span>✉️</span><span>rpkassociates07@gmail.com</span></div>
              <div className="footer-contact-item"><span>📍</span><span>306, Propulsive Passion, 4th Cross, Mahadevapura, Bangalore – 560016</span></div>
              <div className="footer-contact-item"><span>🕐</span><span>Mon–Sat: 9:00 AM – 6:00 PM</span></div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 RPK Associates. All rights reserved. | Mahadevapura, Bangalore</span>
          <span>GST Consultant · Tax Advisor · Auditor Bangalore</span>
        </div>
      </footer>

      <a href="https://wa.me/917353953396?text=Hello%20RPK%20Associates%2C%20I%20would%20like%20to%20enquire%20about%20your%20services." target="_blank" rel="noreferrer" className="whatsapp-btn">
        <div className="whatsapp-tooltip">Chat on WhatsApp</div>
        💬
      </a>
    </>
  );
}
