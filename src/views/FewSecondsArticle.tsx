// @ts-nocheck -- imported code written for looser TypeScript settings
import { useEffect, useState, useRef } from 'react';
import { Link } from '@/lib/router-compat';
import './few-seconds.css';

const gridBg = {
  backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 39px,#86d7ac 39px,#86d7ac 40px),repeating-linear-gradient(90deg,transparent,transparent 39px,#86d7ac 39px,#86d7ac 40px)',
};
const dotBg = {
  backgroundImage: 'radial-gradient(circle at 50% 50%, #86d7ac 1px, transparent 1px)',
  backgroundSize: '28px 28px',
};
const diagBg = {
  backgroundImage: 'repeating-linear-gradient(45deg,#e9c176 0,#e9c176 1px,transparent 0,transparent 50%)',
  backgroundSize: '10px 10px',
};
const fvFill0     = { fontVariationSettings: "'FILL' 0" };
const fvFill1     = { fontVariationSettings: "'FILL' 1" };
const fvFill0w200 = { fontVariationSettings: "'FILL' 0,'wght' 200" };

export default function FewSecondsArticle() {
  const [activeSection, setActiveSection] = useState('');
  const scrollBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const btn = scrollBtnRef.current;
    const onScroll = () => {
      if (!btn) return;
      if (window.scrollY > 400) {
        btn.style.opacity = '1';
        btn.style.transform = 'translateY(0)';
      } else {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(1rem)';
      }
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const counters = document.querySelectorAll('.few-seconds-article [data-count]');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target as HTMLElement;
        const target = parseFloat(el.dataset.count || '0');
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const decimals = parseInt(el.dataset.decimals || '0');
        let startTime: number | null = null;
        const duration = 1600;
        const ease = (t: number) => 1 - Math.pow(1 - t, 3);
        const step = (ts: number) => {
          if (!startTime) startTime = ts;
          const p = Math.min((ts - startTime) / duration, 1);
          el.textContent = prefix + (ease(p) * target).toFixed(decimals) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    }, { threshold: 0.6 });
    counters.forEach(c => obs.observe(c));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll('.few-seconds-article .counter-animate');
    const fadeObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          fadeObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    els.forEach(el => fadeObs.observe(el));
    return () => fadeObs.disconnect();
  }, []);

  useEffect(() => {
    const ids = ['the-players', 'how-it-works', 'the-history', 'whats-next'];
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    const spyObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
    sections.forEach(s => spyObs.observe(s));
    return () => spyObs.disconnect();
  }, []);

  const navItems = [
    { id: 'the-players',  label: 'The Players' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'the-history',  label: 'The History' },
    { id: 'whats-next',   label: "What's Next" },
  ];

  return (
    <div className="few-seconds-article">

      {/* Section scroll nav */}
      <div className="sticky top-0 z-40 w-full bg-[#101414]/80 backdrop-blur-[20px] border-b border-[#3d4947]/20">
        <div className="max-w-screen-2xl mx-auto px-8 py-3 flex items-center justify-between gap-8">
          <Link
            to="/"
            className="text-[#bec9c7]/80 hover:text-[#86d7ac] transition-colors text-sm font-medium tracking-widest uppercase shrink-0"
          >
            Mohamad Noor-Chowdhury
          </Link>
          <div className="hidden md:flex items-center gap-8 font-label tracking-tight text-sm">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                className={`transition-all duration-300 cursor-pointer bg-transparent border-none ${
                  activeSection === item.id
                    ? 'text-[#86d7ac] font-bold border-b-2 border-[#86d7ac] pb-1'
                    : 'text-[#bec9c7]/60 hover:text-[#bec9c7]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="w-16 shrink-0" />
        </div>
      </div>

      <main className="pt-16 pb-32">

        {/* Market Ticker */}
        <div className="w-full bg-surface-container-lowest py-2 border-y border-outline-variant/10 mb-12">
          <div className="max-w-screen-2xl mx-auto px-8 overflow-hidden">
            <div className="flex gap-12 font-label text-[10px] uppercase tracking-[0.2em] text-on-surface-variant/60">
              <span>VISA-NET 500M+ daily txns</span>
              <span>V+MC market share 87%</span>
              <span>CONTACTLESS 67% in-person</span>
              <span>SETTLE-T1 ACTIVE</span>
              <span className="hidden md:block">WALLET-USERS 4.3B 2024</span>
              <span className="hidden md:block">CAP1-DISC $35.3B closed</span>
            </div>
          </div>
        </div>

        {/* Hero */}
        <header className="max-w-screen-xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-end mb-24">
          <div className="lg:col-span-8">
            <p className="font-label text-secondary font-bold tracking-[0.3em] uppercase mb-4 text-sm">Case Study</p>
            <h1 className="serif-display text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black leading-[0.95] tracking-tighter text-on-surface">
              The Few Seconds That <span className="italic text-primary">Move Your Money</span>
            </h1>
            <p className="mt-6 md:mt-8 font-body text-base sm:text-lg md:text-xl text-on-surface-variant max-w-2xl leading-relaxed">
              Every day, billions of people tap a card without thinking twice about what happens next. A small financial miracle unfolds across a web of banks, networks, and technology companies, all silently agreeing to move your money before you've even picked up your receipt.
            </p>
          </div>
          <div className="lg:col-span-4 hidden lg:block pb-4 text-right">
            <div className="text-on-surface-variant font-label text-xs uppercase tracking-widest leading-loose">
              Published Apr 2026<br />
              10 Minute Read
            </div>
          </div>
        </header>

        {/* Featured Image — card tap animation */}
        <section className="max-w-screen-2xl mx-auto px-4 mb-24">
          <div className="relative h-[440px] sm:h-[560px] md:h-[680px] lg:h-[780px] rounded-xl overflow-hidden shadow-2xl group bg-surface-container-low flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-surface-container-lowest via-surface-container to-primary/5"></div>
            <div className="absolute inset-0 opacity-[0.04]" style={gridBg}></div>
            <div className="relative flex flex-col items-center justify-center gap-6 sm:gap-8 md:gap-10 select-none scale-[0.7] sm:scale-90 md:scale-110 lg:scale-[1.65]" style={{ transformOrigin: 'center center', position: 'absolute', top: '50%', left: '50%', translate: '-50% -50%', zIndex: 10 }}>
              <p className="font-headline text-xl md:text-2xl lg:text-3xl text-primary/40 tracking-widest uppercase">Money in Motion</p>
              <div className="relative flex items-center gap-0" style={{ height: '260px' }}>
                {/* Credit card */}
                <div className="tap-scene relative z-10" style={{ width: '210px', height: '132px' }}>
                  <div className="w-full h-full rounded-2xl border border-primary/30 bg-gradient-to-br from-surface-container-high to-surface-container-low shadow-[0_12px_48px_rgba(134,215,172,0.14)] flex flex-col justify-between p-4 overflow-hidden">
                    <div className="absolute inset-0 rounded-2xl" style={{ background: 'linear-gradient(125deg,rgba(134,215,172,0.04) 0%,rgba(134,215,172,0.12) 40%,rgba(134,215,172,0.02) 100%)' }}></div>
                    <div className="w-12 h-7 rounded-md self-start border border-secondary/20" style={{ background: 'linear-gradient(135deg,#e9c17650,#e9c17625)' }}></div>
                    <div className="self-end">
                      <span className="material-symbols-outlined text-primary/50 text-[28px]" style={fvFill0w200}>contactless</span>
                    </div>
                    <div className="absolute bottom-4 left-4 flex gap-1.5">
                      {[...Array(8)].map((_, i) => (
                        <span key={i} className={`w-2 h-2 rounded-full bg-on-surface-variant/20 inline-block${i === 4 ? ' ml-1' : ''}`}></span>
                      ))}
                    </div>
                  </div>
                </div>
                {/* Ripple rings */}
                <div className="absolute" style={{ left: '282px', top: '50%', transform: 'translateY(-50%)' }}>
                  <div className="tap-ripple-1 absolute rounded-full border-2 border-primary/60" style={{ width: '92px', height: '92px', top: '-46px', left: '-46px' }}></div>
                  <div className="tap-ripple-2 absolute rounded-full border-2 border-primary/40" style={{ width: '92px', height: '92px', top: '-46px', left: '-46px' }}></div>
                  <div className="tap-ripple-3 absolute rounded-full border border-primary/25" style={{ width: '92px', height: '92px', top: '-46px', left: '-46px' }}></div>
                </div>
                {/* POS terminal */}
                <div className="relative ml-28 z-10" style={{ width: '112px' }}>
                  <div className="relative mx-auto rounded-2xl border border-outline-variant/30 bg-surface-container-highest shadow-[0_12px_36px_rgba(0,0,0,0.5)] overflow-hidden" style={{ width: '104px', height: '156px' }}>
                    <div className="relative mx-auto mt-3 rounded-lg bg-surface-container-lowest border border-outline-variant/20 overflow-hidden" style={{ width: '78px', height: '64px' }}>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="material-symbols-outlined text-on-surface-variant/20 text-[36px]" style={fvFill0w200}>credit_card</span>
                      </div>
                      <div className="pos-flash absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-[30px]" style={fvFill1}>check_circle</span>
                      </div>
                    </div>
                    <div className="mt-3 px-3 grid grid-cols-3 gap-1.5">
                      {['bg-outline-variant/30','bg-outline-variant/30','bg-outline-variant/30','bg-outline-variant/30','bg-outline-variant/30','bg-outline-variant/30','bg-outline-variant/20','bg-primary/30','bg-outline-variant/20'].map((c, i) => (
                        <span key={i} className={`w-3 h-3 rounded-sm ${c} block`}></span>
                      ))}
                    </div>
                    <div className="absolute bottom-0 inset-x-0 h-2 bg-surface-dim border-t border-outline-variant/20"></div>
                  </div>
                  <div className="mx-auto rounded-b-xl bg-surface-container-high border border-outline-variant/20 border-t-0" style={{ width: '116px', height: '12px' }}></div>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#101414] via-transparent to-transparent opacity-60"></div>
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8 lg:bottom-12 lg:left-12 lg:right-12 flex flex-col sm:flex-row items-start sm:items-end gap-3 sm:gap-6">
              <div className="max-w-md p-4 sm:p-6 lg:p-8 glass-panel rounded-xl border border-outline-variant/10">
                <h3 className="serif-display text-lg sm:text-xl lg:text-2xl text-primary mb-2">The Invisible Transfer</h3>
                <p className="text-on-surface-variant text-xs sm:text-sm">Behind every payment confirmation lies a sequence of handoffs invisible to the sender, yet precise down to the millisecond.</p>
              </div>
              <div className="tap-approved px-4 py-2 sm:px-8 sm:py-2.5 rounded-full border border-primary/30 shrink-0" style={{ background: 'rgba(134,215,172,0.06)' }}>
                <span className="font-label text-xs sm:text-sm uppercase tracking-[0.3em] text-primary font-bold">Approved</span>
              </div>
            </div>
          </div>
        </section>

        {/* The Hook */}
        <section className="max-w-screen-xl mx-auto px-8 mb-32">
          <div className="relative border border-outline-variant/10 rounded-3xl overflow-hidden bg-surface-container-lowest">
            <div className="absolute inset-0 opacity-[0.03]" style={gridBg}></div>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-primary to-transparent"></div>
            <div className="relative p-12 lg:p-24 text-center">
              <div className="inline-flex items-center gap-3 mb-10 px-5 py-2 rounded-full border border-primary/20 bg-primary/5">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block"></span>
                <span className="font-label text-[10px] uppercase tracking-[0.3em] text-primary">Transaction Initiated</span>
              </div>
              <h2 className="serif-display text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-on-surface mb-4 leading-[0.95] tracking-tight">
                Swipe. Tap. <span className="italic text-primary">Approved.</span>
              </h2>
              <p className="font-label text-on-surface-variant/50 uppercase tracking-[0.3em] text-sm mb-12">But what actually just happened?</p>
              <div className="max-w-3xl mx-auto text-left">
                <p className="font-body text-lg leading-loose text-on-surface-variant first-letter:text-7xl first-letter:font-headline first-letter:mr-4 first-letter:float-left first-letter:text-primary first-letter:leading-none">
                  Have you ever wondered what happens when you swipe your card at a store? How does your $12.99 transaction get approved within seconds of a tap? Every day, billions of people tap a card, wave a phone, or click "buy now" without thinking twice about what happens next. In the span of a few seconds, a small financial miracle unfolds across a web of banks, networks, and technology companies, all silently agreeing to move your money before you've even picked up your receipt. Here's the story of how it actually works, who's involved, and where it's all heading.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Players */}
        <section id="the-players" className="max-w-screen-xl mx-auto px-8 mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-16">
            <div className="lg:col-span-4 relative">
              <div className="w-12 h-1 bg-secondary mb-6"></div>
              <p className="font-label text-secondary font-bold tracking-[0.3em] uppercase mb-3 text-sm">The Players</p>
              <h2 className="serif-display text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface leading-tight">A Cast of Characters You've Never Met</h2>
              <span className="font-label text-primary font-black text-6xl opacity-10 absolute -top-8 -left-4">01</span>
            </div>
            <div className="lg:col-span-8 lg:pt-12">
              <p className="font-body text-lg leading-loose text-on-surface-variant">
                To understand a card payment, you first need to meet the players. There are four core parties in almost every transaction, and understanding their roles makes the whole machine click into place.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1 */}
            <div className="group relative bg-surface-container-low border border-outline-variant/10 rounded-2xl p-8 hover:border-primary/30 hover:bg-surface-container transition-all duration-300 overflow-hidden cursor-default">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-20 translate-x-20 group-hover:bg-primary/10 transition-all duration-500"></div>
              <div className="flex items-start gap-5 mb-6">
                <div className="w-14 h-14 rounded-xl bg-surface-container-lowest border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:border-primary/50 group-hover:shadow-[0_0_16px_rgba(134,215,172,0.15)] transition-all duration-300">
                  <span className="material-symbols-outlined text-primary text-2xl" style={fvFill1}>person</span>
                </div>
                <div>
                  <p className="font-label text-primary text-[10px] uppercase tracking-widest mb-1">Player 01</p>
                  <h3 className="serif-display text-xl font-bold text-on-surface">You, the Cardholder</h3>
                  <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">Issuing Bank Relationship</p>
                </div>
              </div>
              <p className="font-body text-on-surface-variant leading-relaxed text-base mb-6">
                Your card was issued by your bank: Chase, Bank of America, Capital One, or whoever. That institution is called the issuing bank. They gave you the card, extended your credit line (or hold your debit funds), and they're ultimately the ones who say yes or no to any purchase.
              </p>
              <div className="pt-5 border-t border-outline-variant/10 flex flex-wrap gap-2">
                {['Chase', 'Bank of America', 'Capital One'].map(t => (
                  <span key={t} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-label uppercase tracking-wider">{t}</span>
                ))}
              </div>
            </div>
            {/* Card 2 */}
            <div className="group relative bg-surface-container-low border border-outline-variant/10 rounded-2xl p-8 hover:border-secondary/30 hover:bg-surface-container transition-all duration-300 overflow-hidden cursor-default">
              <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/5 rounded-full -translate-y-20 translate-x-20 group-hover:bg-secondary/10 transition-all duration-500"></div>
              <div className="flex items-start gap-5 mb-6">
                <div className="w-14 h-14 rounded-xl bg-surface-container-lowest border border-secondary/20 flex items-center justify-center flex-shrink-0 group-hover:border-secondary/50 group-hover:shadow-[0_0_16px_rgba(233,193,118,0.15)] transition-all duration-300">
                  <span className="material-symbols-outlined text-secondary text-2xl" style={fvFill1}>storefront</span>
                </div>
                <div>
                  <p className="font-label text-secondary text-[10px] uppercase tracking-widest mb-1">Player 02</p>
                  <h3 className="serif-display text-xl font-bold text-on-surface">The Merchant</h3>
                  <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">Acquiring Bank Relationship</p>
                </div>
              </div>
              <p className="font-body text-on-surface-variant leading-relaxed text-base mb-6">
                The store, restaurant, or website you're buying from. They have their own bank too: the acquiring bank. Think of them as the merchant's financial representative at the negotiating table. Major acquirers include JPMorgan Chase, Wells Fargo, and Bank of America on the banking side.
              </p>
              <div className="pt-5 border-t border-outline-variant/10 flex flex-wrap gap-2">
                {['Fiserv', 'Worldpay', 'Global Payments'].map(t => (
                  <span key={t} className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-label uppercase tracking-wider">{t}</span>
                ))}
              </div>
            </div>
            {/* Card 3 */}
            <div className="group relative bg-surface-container-low border border-outline-variant/10 rounded-2xl p-8 hover:border-primary/30 hover:bg-surface-container transition-all duration-300 overflow-hidden cursor-default">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 rounded-full -translate-y-20 translate-x-20 group-hover:bg-primary/10 transition-all duration-500"></div>
              <div className="flex items-start gap-5 mb-6">
                <div className="w-14 h-14 rounded-xl bg-surface-container-lowest border border-primary/20 flex items-center justify-center flex-shrink-0 group-hover:border-primary/50 group-hover:shadow-[0_0_16px_rgba(134,215,172,0.15)] transition-all duration-300">
                  <span className="material-symbols-outlined text-primary text-2xl" style={fvFill0}>hub</span>
                </div>
                <div>
                  <p className="font-label text-primary text-[10px] uppercase tracking-widest mb-1">Player 03</p>
                  <h3 className="serif-display text-xl font-bold text-on-surface">The Payment Network</h3>
                  <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">The Connector</p>
                </div>
              </div>
              <p className="font-body text-on-surface-variant leading-relaxed text-base mb-6">
                The highway that connects the issuer and the acquirer. Visa and Mastercard are the big two, together controlling roughly 87% of the global credit card market. American Express and Discover operate slightly differently, but all networks serve the same purpose: routing transaction data and setting the rules of the road.
              </p>
              <div className="pt-5 border-t border-outline-variant/10 flex flex-wrap gap-2">
                {['Visa', 'Mastercard', 'Amex', 'Discover'].map(t => (
                  <span key={t} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-label uppercase tracking-wider">{t}</span>
                ))}
              </div>
            </div>
            {/* Card 4 */}
            <div className="group relative bg-surface-container-low border border-outline-variant/10 rounded-2xl p-8 hover:border-secondary/30 hover:bg-surface-container transition-all duration-300 overflow-hidden cursor-default">
              <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/5 rounded-full -translate-y-20 translate-x-20 group-hover:bg-secondary/10 transition-all duration-500"></div>
              <div className="flex items-start gap-5 mb-6">
                <div className="w-14 h-14 rounded-xl bg-surface-container-lowest border border-secondary/20 flex items-center justify-center flex-shrink-0 group-hover:border-secondary/50 group-hover:shadow-[0_0_16px_rgba(233,193,118,0.15)] transition-all duration-300">
                  <span className="material-symbols-outlined text-secondary text-2xl" style={fvFill0}>developer_board</span>
                </div>
                <div>
                  <p className="font-label text-secondary text-[10px] uppercase tracking-widest mb-1">Player 04</p>
                  <h3 className="serif-display text-xl font-bold text-on-surface">The Processors</h3>
                  <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-wider mt-1">Often Invisible, Always Essential</p>
                </div>
              </div>
              <p className="font-body text-on-surface-variant leading-relaxed text-base mb-6">
                Companies like Stripe, Adyen, Square, and older players like Fiserv handle the actual technology: the payment terminals, the APIs, the fraud checks, the data routing. They're the plumbers making sure everything flows.
              </p>
              <div className="pt-5 border-t border-outline-variant/10 flex flex-wrap gap-2">
                {['Stripe', 'Adyen', 'Square'].map(t => (
                  <span key={t} className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[10px] font-label uppercase tracking-wider">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* How It Works — Two-Act Play */}
        <section id="how-it-works" className="max-w-screen-2xl mx-auto px-4 mb-32">
          <div className="bg-surface-container-lowest rounded-3xl overflow-hidden border border-outline-variant/5 shadow-[inset_0_2px_40px_rgba(0,0,0,0.8)]">
            <div className="p-12 lg:p-16 text-center border-b border-outline-variant/10">
              <p className="font-label text-secondary font-bold tracking-[0.3em] uppercase mb-3 text-sm">How It Actually Works</p>
              <h2 className="serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-on-surface">The Two-Act Play</h2>
              <p className="mt-4 text-on-surface-variant font-body max-w-2xl mx-auto">A card payment happens in two distinct stages. Most people don't realize there's a gap between them.</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-outline-variant/10">
              {/* Act 1 */}
              <div className="p-10 lg:p-16">
                <div className="flex items-center gap-4 mb-8 flex-wrap">
                  <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                    <span className="font-label font-black text-primary">I</span>
                  </div>
                  <div>
                    <p className="font-label text-[10px] uppercase tracking-widest text-primary">Act One</p>
                    <h3 className="serif-display text-2xl font-bold text-on-surface">Authorization</h3>
                  </div>
                  <div className="ml-auto px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
                    <span className="font-label text-primary text-[10px] uppercase tracking-widest">Under 2 Seconds</span>
                  </div>
                </div>
                <p className="font-body text-on-surface-variant leading-relaxed mb-6 text-base">
                  The moment you tap your card, a cascade of events fires off almost simultaneously. Your card's data, masked and encrypted, is captured by the merchant's payment terminal. That information travels to the payment processor, which passes it to the acquirer. The acquirer then sends it racing across the card network to your issuer.
                </p>
                <p className="font-body text-on-surface-variant leading-relaxed mb-8 text-base">
                  Your issuing bank now has to make a decision in under two seconds. It's checking: Is this account real and active? Are there enough funds or available credit? Does this transaction look like fraud? If everything checks out, the issuer sends back an authorization code through the same chain in reverse. The merchant's terminal lights up green. You grab your coffee.
                </p>
                <div className="bg-surface-container p-5 rounded-xl border border-outline-variant/10">
                  <p className="text-[10px] font-label uppercase tracking-widest text-primary mb-2">Vault Note</p>
                  <p className="text-sm italic text-on-surface/80 leading-relaxed">"Authorization is just a promise. The money hasn't moved yet. That comes later."</p>
                </div>
              </div>
              {/* Act 2 */}
              <div className="p-10 lg:p-16">
                <div className="flex items-center gap-4 mb-8 flex-wrap">
                  <div className="w-12 h-12 rounded-full bg-secondary/10 border border-secondary/30 flex items-center justify-center flex-shrink-0">
                    <span className="font-label font-black text-secondary">II</span>
                  </div>
                  <div>
                    <p className="font-label text-[10px] uppercase tracking-widest text-secondary">Act Two</p>
                    <h3 className="serif-display text-2xl font-bold text-on-surface">Settlement</h3>
                  </div>
                  <div className="ml-auto px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20">
                    <span className="font-label text-secondary text-[10px] uppercase tracking-widest">T+1 to T+3</span>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant/80 italic mb-6">
                  Note: "T+1 to T+3" means the merchant receives the actual funds 1 to 3 business days after the purchase.
                </p>
                <p className="font-body text-on-surface-variant leading-relaxed mb-6 text-base">
                  Here's the part that might surprise you: the money didn't actually move when you paid. At the end of the business day, the merchant's processor sends all of the day's authorized transactions to the acquirer. The acquirer submits them to the card networks, which coordinate the actual transfer of funds from issuing banks to the acquiring bank.
                </p>
                <p className="font-body text-on-surface-variant leading-relaxed mb-8 text-base">
                  The merchant typically receives the money one to three business days later, minus fees. Those fees are split: the largest slice is the interchange fee, going to the issuing bank as compensation for fraud risk and the credit they extended. A smaller assessment fee goes to the card network. The acquirer and processor take their own cut too.
                </p>
                <div className="bg-surface-container p-5 rounded-xl border border-secondary/10">
                  <p className="text-[10px] font-label uppercase tracking-widest text-secondary mb-1">Vault Metric</p>
                  <p className="font-headline text-2xl font-bold text-on-surface">1.5% to 3.5% <span className="text-sm font-body text-on-surface-variant font-normal">per transaction</span></p>
                  <p className="text-xs text-on-surface-variant mt-1">Total merchant fee, divided across all four parties</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Authorization Flow */}
        <section className="max-w-screen-xl mx-auto px-8 mb-32">
          <div className="text-center mb-16">
            <p className="font-label text-primary font-bold tracking-[0.3em] uppercase mb-3 text-sm">The Round Trip</p>
            <h2 className="serif-display text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface">Faster Than a Blink</h2>
            <p className="mt-4 text-on-surface-variant font-body max-w-2xl mx-auto">This entire round trip, from your tap to the green light, happens in under 300 milliseconds. Every handoff, mapped.</p>
          </div>
          {/* Forward Flow */}
          <div className="mb-2">
            <p className="font-label text-[10px] uppercase tracking-widest text-primary/60 mb-6 text-center">Request travels forward</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 relative">
              <div className="flow-line-fwd hidden md:block absolute h-px bg-gradient-to-r from-primary/30 to-primary/5 z-0" style={{ top: '40px', left: 'calc(8.33% + 40px)', right: 'calc(8.33% + 40px)' }}></div>
              {[
                { icon: 'credit_card',           fill: fvFill1, label: 'Your Card',      sub: 'Tap / Swipe',     active: true  },
                { icon: 'point_of_sale',          fill: fvFill0, label: 'Terminal',       sub: 'POI · EMV',       active: false },
                { icon: 'router',                 fill: fvFill0, label: 'Processor',      sub: 'Stripe · Adyen',  active: false },
                { icon: 'account_balance',        fill: fvFill0, label: 'Acquirer',       sub: "Merchant's Bank", active: false },
                { icon: 'hub',                    fill: fvFill0, label: 'Network',        sub: 'Visa · MC',       active: false },
                { icon: 'account_balance_wallet', fill: fvFill1, label: 'Issuer',         sub: 'Your Bank',       active: false },
              ].map((node, i) => (
                <div key={i} className="relative z-10 flex flex-col items-center text-center">
                  <div className={`${node.active ? 'node-glow w-20 h-20 rounded-2xl bg-primary/20 border border-primary/50' : 'w-20 h-20 rounded-2xl bg-surface-container-high border border-outline-variant/20'} flex items-center justify-center mb-3`}>
                    <span className={`material-symbols-outlined ${node.active ? 'text-primary' : 'text-on-surface-variant'} text-3xl`} style={node.fill}>{node.icon}</span>
                  </div>
                  <p className="font-label text-xs text-on-surface font-bold">{node.label}</p>
                  <p className="font-label text-[9px] text-on-surface-variant uppercase tracking-wider mt-1">{node.sub}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Decision divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-outline-variant/15"></div>
            <div className="px-5 py-2 rounded-full bg-surface-container border border-outline-variant/20 flex items-center gap-2 whitespace-nowrap">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse inline-block"></span>
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">Issuer decides in under 2 seconds, response returns in reverse</span>
            </div>
            <div className="flex-1 h-px bg-outline-variant/15"></div>
          </div>
          {/* Return Flow */}
          <div className="mb-10">
            <p className="font-label text-[10px] uppercase tracking-widest text-secondary/60 mb-6 text-center">Approval travels back</p>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 relative">
              <div className="flow-line-rev hidden md:block absolute h-px bg-gradient-to-l from-secondary/30 to-secondary/5 z-0" style={{ top: '40px', left: 'calc(8.33% + 40px)', right: 'calc(8.33% + 40px)' }}></div>
              {[
                { icon: 'check_circle',           fill: fvFill1, label: 'Approved',  sub: 'Green Light', active: true  },
                { icon: 'point_of_sale',          fill: fvFill0, label: 'Terminal',  sub: '',            active: false },
                { icon: 'router',                 fill: fvFill0, label: 'Processor', sub: '',            active: false },
                { icon: 'account_balance',        fill: fvFill0, label: 'Acquirer',  sub: '',            active: false },
                { icon: 'hub',                    fill: fvFill0, label: 'Network',   sub: '',            active: false },
                { icon: 'account_balance_wallet', fill: fvFill1, label: 'Issuer',    sub: '',            active: false },
              ].map((node, i) => (
                <div key={i} className={`relative z-10 flex flex-col items-center text-center${i > 0 ? ' opacity-50' : ''}`}>
                  <div className={`${node.active ? 'node-glow w-20 h-20 rounded-2xl bg-primary/20 border border-primary/50' : 'w-20 h-20 rounded-2xl bg-surface-container border border-outline-variant/10'} flex items-center justify-center mb-3`}>
                    <span className={`material-symbols-outlined ${node.active ? 'text-primary' : 'text-on-surface-variant'} text-3xl`} style={node.fill}>{node.icon}</span>
                  </div>
                  <p className={`font-label text-xs font-bold ${node.active ? 'text-primary' : 'text-on-surface-variant'}`}>{node.label}</p>
                  {node.active && <p className="font-label text-[9px] text-primary/70 uppercase tracking-wider mt-1">{node.sub}</p>}
                </div>
              ))}
            </div>
          </div>
          {/* Latency callout */}
          <div className="text-center">
            <div className="inline-block p-8 bg-surface-container-lowest border border-outline-variant/10 rounded-2xl">
              <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60 mb-3">Total round-trip time</p>
              <p className="serif-display text-4xl sm:text-5xl md:text-6xl font-black text-primary tabular-nums">&lt;300<span className="text-xl sm:text-2xl ml-2 text-on-surface-variant font-body font-normal">ms</span></p>
              <p className="text-xs text-on-surface-variant mt-3">The average human blink is 400ms. Your money moves faster.</p>
            </div>
          </div>
        </section>

        {/* Open vs Closed Networks */}
        <section className="max-w-screen-xl mx-auto px-8 mb-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5 relative">
              <div className="w-12 h-1 bg-primary mb-6"></div>
              <p className="font-label text-primary font-bold tracking-[0.3em] uppercase mb-3 text-sm">Network Architecture</p>
              <h2 className="serif-display text-2xl sm:text-3xl md:text-4xl font-bold text-on-surface leading-tight">Open vs. Closed: The Amex Difference</h2>
              <p className="font-body text-on-surface-variant mt-6 leading-relaxed text-base">
                Not all networks are built the same. Visa and Mastercard operate as open networks. American Express and Discover play by fundamentally different rules, and it shapes everything from which merchants accept them to the fees they can charge.
              </p>
              <span className="font-label text-primary font-black text-6xl opacity-10 absolute -top-8 -right-4">03</span>
            </div>
            <div className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-surface-container-low border border-primary/20 rounded-2xl p-7">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/30 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-primary text-xl" style={fvFill0}>open_in_full</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-label uppercase tracking-widest text-primary">Structure</p>
                      <h4 className="font-headline text-lg text-on-surface">Open Network</h4>
                    </div>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-5">They license their brand and infrastructure to thousands of banks, which then issue cards and acquire merchants independently. The network itself just connects them.</p>
                  <div className="flex flex-wrap gap-2">
                    {['Visa', 'Mastercard'].map(t => (
                      <span key={t} className="px-3 py-1 rounded-full border border-primary/20 text-primary text-[10px] font-label uppercase tracking-wider">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="bg-surface-container-low border border-secondary/20 rounded-2xl p-7">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 border border-secondary/30 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined text-secondary text-xl" style={fvFill1}>lock</span>
                    </div>
                    <div>
                      <p className="text-[10px] font-label uppercase tracking-widest text-secondary">Structure</p>
                      <h4 className="font-headline text-lg text-on-surface">Closed Network</h4>
                    </div>
                  </div>
                  <p className="text-sm text-on-surface-variant leading-relaxed mb-5">They act as both the issuer and the network, sometimes even the acquirer. More control over the experience, but historically fewer accepting merchants and higher fees.</p>
                  <div className="flex flex-wrap gap-2">
                    {['American Express', 'Discover'].map(t => (
                      <span key={t} className="px-3 py-1 rounded-full border border-secondary/20 text-secondary text-[10px] font-label uppercase tracking-wider">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 70-Year Timeline */}
        <section id="the-history" className="max-w-screen-2xl mx-auto px-4 mb-32">
          <div className="bg-surface-container-lowest rounded-3xl p-12 lg:p-20 border border-outline-variant/5 shadow-[inset_0_2px_40px_rgba(0,0,0,0.8)]">
            <div className="text-center max-w-3xl mx-auto mb-20">
              <p className="font-label text-secondary font-bold tracking-[0.3em] uppercase mb-3 text-sm">A Brief History</p>
              <h2 className="serif-display text-3xl sm:text-4xl md:text-5xl font-bold">70 Years in 5 Minutes</h2>
              <p className="mt-4 text-on-surface-variant font-body">From a forgotten wallet at a New York restaurant in 1950 to a tap of your watch in 2025.</p>
            </div>
            <div className="relative max-w-4xl mx-auto space-y-16">
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-outline-variant/20 to-transparent -translate-x-1/2 pointer-events-none"></div>
              {[
                { year: '1950', color: 'primary',   side: 'left',  title: 'The Diners Club Card',         body: "Frank McNamara forgot his wallet at dinner. Out of that embarrassment came the world's first charge card, accepted at 27 New York restaurants and settled at the end of each month. It was crude, but the idea was revolutionary.",                                                                                                                                                                                                                                                                                                                                  glow: true  },
                { year: '1958', color: 'secondary', side: 'right', title: 'American Express Goes Plastic', body: 'Amex launched in 1958 and introduced the first plastic card the following year. Banks followed through the 1960s, eventually consolidating into what became Visa (originally BankAmericard) and Mastercard (originally Interbank).',                                                                                                                                                                                                                                                                                                                              glow: false },
                { year: '1969', color: 'primary',   side: 'left',  title: 'The Magnetic Stripe',           body: 'An IBM engineer changed everything: card data could now be read electronically and transmitted. By the 1980s, POS terminals replaced manual imprinters and authorization moved from phone calls to electronic networks.',                                                                                                                                                                                                                                                                                                                                      glow: false },
                { year: '2015', color: 'secondary', side: 'right', title: 'The EMV Chip Mandate',          body: "Chips generate a unique code for every transaction, making card-present fraud dramatically harder than a magnetic stripe. The US finally committed to the switch in 2015 when card networks shifted fraud liability to merchants who hadn't upgraded their terminals.",                                                                                                                                                                                                                                                                                        glow: false },
                { year: '2020', color: 'primary',   side: 'left',  title: 'COVID Turbocharges Contactless', body: 'Contactless payments arrived in the US around 2004 but were slow to catch on. Then the pandemic hit. As people avoided touching shared surfaces, what might have taken a decade happened in two years.',                                                                                                                                                                                                                                                                                                                                                     glow: true  },
              ].map((item, i) => (
                <div key={i} className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
                  {item.side === 'left' ? (
                    <>
                      <div className="md:text-right md:pr-14">
                        <div className={`inline-block px-4 py-1.5 rounded-full bg-${item.color}/10 border border-${item.color}/20 mb-3`}>
                          <span className={`font-label text-${item.color} font-black text-sm tracking-widest`}>{item.year}</span>
                        </div>
                        <h4 className="font-headline text-xl text-on-surface mb-2">{item.title}</h4>
                        <p className="text-sm text-on-surface-variant leading-relaxed">{item.body}</p>
                      </div>
                      <div className="hidden md:block"></div>
                    </>
                  ) : (
                    <>
                      <div className="hidden md:block"></div>
                      <div className="md:pl-14">
                        <div className={`inline-block px-4 py-1.5 rounded-full bg-${item.color}/10 border border-${item.color}/20 mb-3`}>
                          <span className={`font-label text-${item.color} font-black text-sm tracking-widest`}>{item.year}</span>
                        </div>
                        <h4 className="font-headline text-xl text-on-surface mb-2">{item.title}</h4>
                        <p className="text-sm text-on-surface-variant leading-relaxed">{item.body}</p>
                      </div>
                    </>
                  )}
                  <div className={`hidden md:block absolute left-1/2 top-5 w-4 h-4 rounded-full bg-${item.color} border-2 border-[#0b0f0f] -translate-x-1/2${item.glow ? ' shadow-[0_0_16px_rgba(134,215,172,0.7)]' : ''}`}></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Future Trends */}
        <section id="whats-next" className="max-w-screen-xl mx-auto px-8 mb-32">
          <div className="mb-16 relative">
            <div className="w-12 h-1 bg-secondary mb-6"></div>
            <p className="font-label text-secondary font-bold tracking-[0.3em] uppercase mb-3 text-sm">What's Next</p>
            <h2 className="serif-display text-3xl sm:text-4xl md:text-5xl font-bold text-on-surface">Where It's All Going</h2>
            <p className="mt-4 text-on-surface-variant font-body max-w-2xl">The infrastructure has been stable for decades. Several forces are now pushing the industry into new territory.</p>
            <span className="font-label text-primary font-black text-6xl opacity-10 absolute top-0 right-0">05</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-8 hover:border-primary/25 transition-all duration-300 group">
              <span className="material-symbols-outlined text-primary mb-5 block text-3xl" style={fvFill0}>contactless</span>
              <p className="serif-display text-5xl font-black text-primary mb-2 tabular-nums counter-animate" data-count="67" data-suffix="%">67%</p>
              <h4 className="font-headline text-lg text-on-surface mb-3">Contactless Is the Default</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">As of 2025, more than two out of every three in-person transactions on the Mastercard network globally are contactless. 86% of global consumers now use contactless methods. The tap is winning.</p>
            </div>
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-8 hover:border-primary/25 transition-all duration-300 group">
              <span className="material-symbols-outlined text-primary mb-5 block text-3xl" style={fvFill0}>wallet</span>
              <p className="serif-display text-5xl font-black text-primary mb-2 tabular-nums counter-animate" data-count="5.8" data-suffix="B" data-decimals="1">5.8B</p>
              <h4 className="font-headline text-lg text-on-surface mb-3">Digital Wallets Are Eating the Card</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">Projected wallet users by 2029, up from 4.3 billion in 2024. Apple Pay, Google Pay, and Samsung Pay replace your card number with a one-time digital token. Digital wallets already account for 38% of all in-store sales in 2025.</p>
            </div>
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-8 hover:border-secondary/25 transition-all duration-300 group">
              <span className="material-symbols-outlined text-secondary mb-5 block text-3xl" style={fvFill1}>encrypted</span>
              <p className="serif-display text-5xl font-black text-secondary mb-2 tabular-nums counter-animate" data-count="34" data-suffix="%">34%</p>
              <h4 className="font-headline text-lg text-on-surface mb-3">Tokenization Slashes Fraud</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">Tokenization has reduced fraud rates by 34% for NFC tap-to-pay transactions. Instead of transmitting your actual card number, modern systems generate unique, transaction-specific tokens. If intercepted, the data is useless to anyone.</p>
            </div>
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-8 hover:border-primary/25 transition-all duration-300 group">
              <span className="material-symbols-outlined text-primary mb-5 block text-3xl" style={fvFill0}>fingerprint</span>
              <p className="serif-display text-5xl font-black text-primary mb-2 tabular-nums counter-animate" data-count="72" data-suffix="%">72%</p>
              <h4 className="font-headline text-lg text-on-surface mb-3">Biometrics Are Replacing PINs</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">Fingerprint scanners and facial recognition are now integrated into 72% of mobile wallets globally. Your face or fingerprint is becoming your authentication method, with no PIN or signature required.</p>
            </div>
            <div className="bg-surface-container-low border border-outline-variant/10 rounded-2xl p-8 hover:border-primary/25 transition-all duration-300 group">
              <span className="material-symbols-outlined text-primary mb-5 block text-3xl" style={fvFill0}>corporate_fare</span>
              <p className="serif-display text-5xl font-black text-primary mb-2 tabular-nums counter-animate" data-prefix="$" data-count="22.7" data-suffix="B" data-decimals="1">$22.7B</p>
              <h4 className="font-headline text-lg text-on-surface mb-3">The Industry Is Consolidating</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">Global Payments announced a $22.7 billion deal to acquire Worldpay, which would make it the world's largest merchant processor. Fewer, larger players control more of the infrastructure every year. Real-time rails like FedNow add even more pressure.</p>
            </div>
            {/* Great Disruptor */}
            <div className="md:col-span-2 lg:col-span-3 relative rounded-2xl overflow-hidden border border-secondary/30 bg-surface-container-lowest">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/8 via-transparent to-primary/5 pointer-events-none"></div>
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/60 to-transparent"></div>
              <div className="absolute inset-0 opacity-[0.025]" style={diagBg}></div>
              <div className="relative p-10 lg:p-14 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-7">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-secondary/15 border border-secondary/30 flex items-center justify-center">
                      <span className="material-symbols-outlined text-secondary text-xl" style={fvFill1}>bolt</span>
                    </div>
                    <span className="font-label text-[10px] uppercase tracking-[0.3em] text-secondary">The Great Disruptor</span>
                  </div>
                  <h3 className="serif-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-on-surface leading-tight mb-6">
                    Capital One Bought the <span className="italic text-secondary">Highway Itself</span>
                  </h3>
                  <p className="font-body text-on-surface-variant leading-relaxed mb-6">
                    Here's what most people miss: every time a card transaction happens, it runs through a payment network, like Visa or Mastercard. For that privilege, the issuing bank pays the network a fee for using its rails. It's a small percentage per transaction, but across hundreds of millions of swipes, it adds up to billions of dollars a year flowing quietly from banks to networks.
                  </p>
                  <p className="font-body text-on-surface-variant leading-relaxed mb-6">
                    Capital One was on the paying end of that equation for every swipe its customers made. Its $35.3 billion acquisition of Discover changed that entirely. Discover isn't just a card brand, it's one of the few payment networks in the world. By acquiring it, Capital One now has a network of its own. When its customers transact on the Discover network, that fee no longer leaves the building. One company now controls the card, the credit, and the rails.
                  </p>
                  <p className="font-body text-on-surface-variant leading-relaxed mb-6">
                    This also positions Capital One to become a closed-loop network, joining American Express as the only standalone players that own both the card and the rails. But, as mentioned earlier, getting there will take time. Capital One first needs to fully integrate Discover before it can operate as a true closed network.
                  </p>
                  <p className="font-body text-on-surface-variant leading-relaxed mb-6">
                    That's the moat. But it comes with a mountain to climb. Before Capital One can even think about taking on the broader network landscape, it faces a massive internal challenge: integration. Folding Discover into Capital One means merging two entirely separate ecosystems, millions of customer accounts, card portfolios, credit infrastructure, data systems, and operational frameworks built over decades. That kind of integration doesn't happen cleanly or quickly. It is one of the most complex undertakings in modern banking.
                  </p>
                  <p className="font-body text-on-surface-variant leading-relaxed mb-8">
                    And once that work is done, the external challenge is even steeper. Visa and Mastercard don't just lead the market, they have a vicegrip on it. Their combined 87% share of global card network transactions reflects decades of entrenched merchant relationships, bank partnerships, and consumer habits built around two brands. Discover's network has always lived in their shadow. Capital One now owns that shadow. Turning it into something that genuinely competes with the duopoly will require convincing merchants to route more volume through Discover, signing new issuing partnerships, and shifting consumer behavior at scale. The acquisition was the easy part.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
                      <span className="font-label text-[10px] uppercase tracking-widest text-secondary">Largest US Card Issuer</span>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-secondary/10 border border-secondary/20">
                      <span className="font-label text-[10px] uppercase tracking-widest text-secondary">$1.2B Network Synergies by 2027</span>
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-5 grid grid-cols-2 gap-4">
                  <div className="col-span-2 bg-surface-container border border-secondary/20 rounded-xl p-6 text-center">
                    <p className="text-[10px] font-label uppercase tracking-widest text-secondary/70 mb-2">Acquisition Price</p>
                    <p className="serif-display text-5xl font-black text-secondary tabular-nums counter-animate" data-prefix="$" data-count="35.3" data-suffix="B" data-decimals="1">$35.3B</p>
                  </div>
                  <div className="bg-surface-container border border-outline-variant/10 rounded-xl p-5 text-center">
                    <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60 mb-2">Network Synergies</p>
                    <p className="serif-display text-2xl font-black text-primary tabular-nums">$1.2B</p>
                    <p className="text-[9px] text-on-surface-variant mt-1">Projected by 2027</p>
                  </div>
                  <div className="bg-surface-container border border-outline-variant/10 rounded-xl p-5 text-center">
                    <p className="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/60 mb-2">Closed</p>
                    <p className="serif-display text-2xl font-black text-primary">May</p>
                    <p className="text-[9px] text-on-surface-variant mt-1">2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Invisible Machine */}
        <section className="max-w-screen-xl mx-auto px-8 mb-32">
          <div className="relative border border-outline-variant/10 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-surface-container-lowest to-secondary/5"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/20 to-transparent"></div>
            <div className="absolute inset-0 opacity-[0.02]" style={dotBg}></div>
            <div className="relative p-12 lg:p-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                <div className="lg:col-span-7">
                  <p className="font-label text-primary font-bold tracking-[0.3em] uppercase mb-4 text-sm">The Conclusion</p>
                  <h2 className="serif-display text-5xl font-bold text-on-surface mb-8 leading-tight">The Invisible Machine</h2>
                  <p className="font-body text-lg leading-loose text-on-surface-variant mb-6">
                    The next time you tap your card and hear that satisfying beep, you'll know what just happened: a silent conversation between your bank, the merchant's bank, a global network, and several layers of technology, all completed before you've moved your hand away.
                  </p>
                  <p className="font-body text-lg leading-loose text-on-surface-variant mb-8">
                    It's one of the most sophisticated financial systems ever built, and most of us interact with it dozens of times a week without a second thought. The technology is getting faster, smarter, and more secure. The players are shifting. But the core choreography of cardholder, merchant, network, and issuer remains the backbone of how the world pays for things.
                  </p>
                  <p className="font-body text-xl font-semibold text-on-surface serif-display italic">At least for now.</p>
                </div>
                <div className="lg:col-span-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-5 text-center">
                      <p className="serif-display text-3xl font-black text-primary tabular-nums">500M+</p>
                      <p className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant mt-2">Daily Visa transactions</p>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-5 text-center">
                      <p className="serif-display text-3xl font-black text-primary tabular-nums">87%</p>
                      <p className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant mt-2">Visa + MC global market share</p>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-xl p-5 text-center">
                      <p className="serif-display text-3xl font-black text-secondary tabular-nums">&lt;2s</p>
                      <p className="font-label text-[9px] uppercase tracking-widest text-on-surface-variant mt-2">Issuer authorization window</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Sources */}
      <section className="max-w-screen-xl mx-auto px-8 mb-24">
        <div className="border border-outline-variant/10 rounded-3xl overflow-hidden bg-surface-container-lowest">
          <div className="px-10 py-8 border-b border-outline-variant/10 flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="material-symbols-outlined text-primary text-base" style={fvFill0}>library_books</span>
            </div>
            <div>
              <p className="font-label text-[10px] uppercase tracking-[0.3em] text-on-surface-variant/50">End Notes</p>
              <h3 className="font-headline text-lg text-on-surface">Sources &amp; Further Reading</h3>
            </div>
            <div className="ml-auto px-3 py-1 rounded-full bg-surface-container border border-outline-variant/10">
              <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/60">9 References</span>
            </div>
          </div>
          <ol className="divide-y divide-outline-variant/5">
            {[
              { num: '01', href: 'https://stripe.com/resources/more/acquirer-vs-issuer',                                                                    title: 'Acquirer vs. Issuer: How Card Payments Work',                              domain: 'stripe.com',                 gold: false },
              { num: '02', href: 'https://www.clearlypayments.com/blog/the-payments-ecosystem-in-2025-processors-acquirers-isos-fraud-solutions-merchant-services/', title: 'The Payments Ecosystem in 2025',                                            domain: 'clearlypayments.com',        gold: false },
              { num: '03', href: 'https://quartr.com/insights/edge/visa-and-mastercard-the-global-payment-duopoly',                                          title: 'Visa and Mastercard: The Global Payment Duopoly',                          domain: 'quartr.com',                 gold: false },
              { num: '04', href: 'https://wallethub.com/edu/cc/credit-card-history/25894',                                                                   title: 'The Complete History of Credit Cards',                                     domain: 'wallethub.com',              gold: false },
              { num: '05', href: 'https://www.worldpay.com/en/insights/articles/the-evolution-of-credit-cards',                                              title: 'The Evolution of Credit Cards',                                            domain: 'worldpay.com',               gold: false },
              { num: '06', href: 'https://www.mastercard.com/us/en/news-and-trends/stories/2025/contactless-payments-2025.html',                             title: 'Contactless Payments in 2025: The State of Tap-to-Pay',                    domain: 'mastercard.com',             gold: false },
              { num: '07', href: 'https://corporate.visa.com/en/sites/visa-perspectives/trends-insights/2026-predictions.html',                              title: 'Visa 2026 Payments Predictions',                                           domain: 'corporate.visa.com',         gold: false },
              { num: '08', href: 'https://investor.capitalone.com/news-releases/news-release-details/capital-one-completes-acquisition-discover',            title: 'Capital One Completes Acquisition of Discover Financial Services',         domain: 'investor.capitalone.com',    gold: true  },
              { num: '09', href: 'https://cmspi.com/capital-ones-discover-acquisition-a-payments-industry-game-changer/',                                    title: "Capital One's Discover Acquisition: A Payments Industry Game-Changer",    domain: 'cmspi.com',                  gold: true  },
            ].map(src => (
              <li key={src.num}>
                <a href={src.href} target="_blank" rel="noopener noreferrer"
                  className="group flex items-center gap-6 px-10 py-5 hover:bg-surface-container transition-all duration-200 cursor-pointer">
                  <span className={`font-label text-[10px] tabular-nums text-on-surface-variant/30 w-6 flex-shrink-0 ${src.gold ? 'group-hover:text-secondary' : 'group-hover:text-primary'} transition-colors`}>{src.num}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`font-body text-sm text-on-surface ${src.gold ? 'group-hover:text-secondary' : 'group-hover:text-primary'} transition-colors leading-snug`}>{src.title}</p>
                    <p className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/40 mt-1">{src.domain}</p>
                  </div>
                  <span className={`material-symbols-outlined text-on-surface-variant/20 ${src.gold ? 'group-hover:text-secondary/60' : 'group-hover:text-primary/60'} transition-colors text-base flex-shrink-0`} style={fvFill0}>open_in_new</span>
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Scroll to Top */}
      <button
        ref={scrollBtnRef}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
        className="fixed bottom-8 right-8 z-50 w-12 h-12 rounded-full bg-surface-container-high border border-outline-variant/20 flex items-center justify-center shadow-xl opacity-0 translate-y-4 transition-all duration-300 hover:bg-primary/10 hover:border-primary/40 hover:shadow-[0_0_20px_rgba(134,215,172,0.15)] active:scale-95 cursor-pointer"
      >
        <span className="material-symbols-outlined text-primary text-xl" style={fvFill0}>arrow_upward</span>
      </button>

    </div>
  );
}
