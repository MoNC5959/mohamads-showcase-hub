import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowUp,
  Building2,
  Check,
  CreditCard,
  Cpu,
  Landmark,
  Lock,
  Network,
  Nfc,
  Share2,
  Store,
  User,
  Wallet,
} from "lucide-react";
import { Link } from "@/lib/router-compat";
import "./few-seconds.css";

const sections = [
  { id: "the-players", label: "The players" },
  { id: "how-it-works", label: "How it works" },
  { id: "the-history", label: "History" },
  { id: "whats-next", label: "What's next" },
];

const players = [
  {
    icon: User,
    title: "You, the cardholder",
    role: "Your relationship is with the issuing bank",
    body: "Your card was issued by your bank: Chase, Bank of America, Capital One, or whoever. That institution is called the issuing bank. They gave you the card, extended your credit line (or hold your debit funds), and they're ultimately the ones who say yes or no to any purchase.",
    examples: "Chase, Bank of America, Capital One",
  },
  {
    icon: Store,
    title: "The merchant",
    role: "Its relationship is with the acquiring bank",
    body: "The store, restaurant, or website you're buying from. They have their own bank too, called the acquiring bank, which accepts card payments on the merchant's behalf. Big US acquirers include banks such as JPMorgan Chase and Wells Fargo, along with specialist firms like Fiserv and Worldpay.",
    examples: "Fiserv, Worldpay, Global Payments",
  },
  {
    icon: Network,
    title: "The payment network",
    role: "Connects the two banks",
    body: "The highway that connects the issuer and the acquirer. Visa and Mastercard are the big two: in 2024 they carried about 87% of US card purchase volume across credit, debit, and prepaid cards. American Express and Discover work differently, but every network does the same basic job of routing transaction data and setting the rules.",
    examples: "Visa, Mastercard, American Express, Discover",
  },
  {
    icon: Cpu,
    title: "The processors",
    role: "Run the technology in between",
    body: "Companies like Stripe, Adyen, Square, and older players like Fiserv run the technology in between: payment terminals, the software checkout pages connect to, fraud screening, and data routing.",
    examples: "Stripe, Adyen, Square",
  },
];

const route = [
  { icon: CreditCard, label: "Your card", sub: "Tap or swipe" },
  { icon: Nfc, label: "Terminal", sub: "Reads the chip" },
  { icon: Share2, label: "Processor", sub: "Stripe, Adyen" },
  { icon: Landmark, label: "Acquirer", sub: "Merchant's bank" },
  { icon: Network, label: "Network", sub: "Visa, Mastercard" },
  { icon: Wallet, label: "Issuer", sub: "Your bank" },
];

const history = [
  {
    year: "1950",
    title: "The Diners Club card",
    body: "Frank McNamara forgot his wallet at dinner, and the story goes that the embarrassment led to Diners Club, the first general-purpose charge card. It launched at a couple of dozen New York restaurants (most accounts say 27), and members paid the full balance each month.",
  },
  {
    year: "1958",
    title: "American Express goes plastic",
    body: "Amex launched in 1958 and introduced the first plastic card the following year. Banks followed through the 1960s, eventually consolidating into what became Visa (originally BankAmericard) and Mastercard (originally Interbank).",
  },
  {
    year: "1960s",
    title: "The magnetic stripe",
    body: "IBM engineer Forrest Parry developed the magnetic stripe, which let card data be read electronically and sent over a network. By the 1980s, POS terminals replaced manual imprinters and authorization moved from phone calls to electronic networks.",
  },
  {
    year: "2015",
    title: "The EMV chip deadline",
    body: "Chips generate a unique code for every transaction, which makes a copied card far less useful than a copied magnetic stripe. The US committed to the switch in October 2015, when the card networks shifted fraud liability to merchants who hadn't upgraded their terminals.",
  },
  {
    year: "2020",
    title: "COVID speeds up contactless",
    body: "Contactless cards appeared in the US in the mid-2000s but caught on slowly. During the pandemic, people avoided touching shared keypads, and banks rushed to mail out tap-enabled cards. Adoption that might have taken a decade happened in about two years.",
  },
];

type Trend = {
  count: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  gold?: boolean;
  title: string;
  body: string;
};

const trends: Trend[] = [
  {
    count: 77,
    suffix: "%",
    title: "Contactless is the default",
    body: "In the last quarter of 2025, 77% of in-person purchases on Mastercard's network worldwide were contactless, up five points in a year. The US was one of the last big markets to switch, and it is catching up.",
  },
  {
    count: 5.8,
    suffix: "B",
    decimals: 1,
    title: "Phones are replacing plastic",
    body: "Projected digital wallet users by 2029, up from 4.3 billion in 2024, according to Juniper Research. Apple Pay, Google Pay, and Samsung Pay replace your card number with a digital token. Worldpay found wallets made up 33% of in-store spending worldwide in 2025, and 56% online.",
  },
  {
    count: 35,
    suffix: "%",
    gold: true,
    title: "Tokens cut online fraud",
    body: "Visa reports that online payments using tokens have a 35% lower fraud rate than payments sent with the raw card number. A token stands in for your card number and only works for one merchant or device, so a stolen copy is of little use.",
  },
  {
    count: 1725,
    title: "Instant bank payments arrive",
    body: "Banks and credit unions signed up to FedNow, the Federal Reserve's instant payment service, as of early 2026. Money sent over it settles in seconds, any day of the year, with no card network in the middle.",
  },
  {
    count: 22.7,
    prefix: "$",
    suffix: "B",
    decimals: 1,
    title: "Fewer, bigger processors",
    body: "Global Payments closed its $22.7 billion purchase of Worldpay in January 2026, selling its card-issuing business to FIS as part of the deal. The result is one of the largest merchant processors in the world, and fewer companies now handle more of the volume.",
  },
];

const sourceList = [
  {
    href: "https://stripe.com/resources/more/acquirer-vs-issuer",
    title: "Acquirer vs. Issuer: How Card Payments Work",
    domain: "stripe.com",
  },
  {
    href: "https://s29.q4cdn.com/385744025/files/doc_downloads/2025/Visa-Fiscal-2025-Annual-Report.pdf",
    title: "Visa Fiscal 2025 Annual Report (257.5B processed transactions)",
    domain: "visa.com",
  },
  {
    href: "https://www.globenewswire.com/news-release/2025/02/25/3032247/0/en/Amex-Discover-Mastercard-and-Visa-Card-Spending-Exceeded-10-Trillion-in-2024.html",
    title: "Amex, Discover, Mastercard and Visa Card Spending Exceeded $10 Trillion in 2024",
    domain: "Nilson Report, via globenewswire.com",
  },
  {
    href: "https://nilsonreport.com/articles/merchant-processing-fees-in-the-united-states-2024/",
    title: "Merchant Processing Fees in the United States, 2024",
    domain: "nilsonreport.com",
  },
  {
    href: "https://www.paymentsdive.com/news/court-approves-visa-mastercard-settlement/822440/",
    title: "Court Approves Visa-Mastercard Settlement",
    domain: "paymentsdive.com",
  },
  {
    href: "https://en.wikipedia.org/wiki/Diners_Club_International",
    title: "Diners Club International: History",
    domain: "wikipedia.org",
  },
  {
    href: "https://www.worldpay.com/en/insights/articles/the-evolution-of-credit-cards",
    title: "The Evolution of Credit Cards",
    domain: "worldpay.com",
  },
  {
    href: "https://www.pymnts.com/earnings/2026/mastercard-leans-into-agentic-commerce-stablecoins-while-card-volumes-rise/",
    title: "Mastercard Q4 2025 Results: Contactless at 77% of In-Person Purchases",
    domain: "pymnts.com",
  },
  {
    href: "https://www.biometricupdate.com/202501/juniper-5-6b-people-to-have-digital-wallets-by-2029",
    title: "Juniper Research Digital Wallet Forecast",
    domain: "biometricupdate.com",
  },
  {
    href: "https://paymentexpert.com/2026/04/01/digital-wallets-worldpay-gpr-2026/",
    title: "Worldpay Global Payments Report 2026: Digital Wallets",
    domain: "paymentexpert.com",
  },
  {
    href: "https://corporate.visa.com/en/sites/visa-perspectives/security-trust/security-at-network-scale.html",
    title: "Security at Network Scale: Protecting Digital Payments",
    domain: "corporate.visa.com",
  },
  {
    href: "https://www.richmondfed.org/publications/research/economic_brief/2026/eb_26-28",
    title: "FedNow Participation, Q1 2026",
    domain: "richmondfed.org",
  },
  {
    href: "https://www.businesswire.com/news/home/20260112224066/en",
    title: "Global Payments Completes Acquisition of Worldpay",
    domain: "businesswire.com",
  },
  {
    href: "https://investor.capitalone.com/news-releases/news-release-details/capital-one-completes-acquisition-discover",
    title: "Capital One Completes Acquisition of Discover Financial Services",
    domain: "investor.capitalone.com",
  },
  {
    href: "https://www.pymnts.com/earnings/2026/capital-one-tests-moving-credit-cards-to-discover-network/",
    title: "Capital One Tests Moving Credit Cards to Discover Network",
    domain: "pymnts.com",
  },
  {
    href: "https://cmspi.com/capital-ones-discover-acquisition-a-payments-industry-game-changer/",
    title: "Capital One's Discover Acquisition: A Payments Industry Game-Changer",
    domain: "cmspi.com",
  },
];

const formatCount = (value: number, decimals = 0) =>
  value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

function Counter({
  count,
  prefix = "",
  suffix = "",
  decimals = 0,
  gold = false,
}: Omit<Trend, "title" | "body">) {
  return (
    <p
      className={`fs-stat counter-animate${gold ? " fs-stat--gold" : ""}`}
      data-count={count}
      data-prefix={prefix}
      data-suffix={suffix}
      data-decimals={decimals}
    >
      {prefix}
      {formatCount(count, decimals)}
      {suffix}
    </p>
  );
}

function Section({ id, title, children }: { id?: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="fs-section">
      <h2 className="fs-h2">{title}</h2>
      {children}
    </section>
  );
}

export default function FewSecondsArticle() {
  const [activeSection, setActiveSection] = useState("");
  const topRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const btn = topRef.current;
    const onScroll = () => {
      if (!btn) return;
      const show = window.scrollY > 400;
      btn.style.opacity = show ? "1" : "0";
      btn.style.transform = show ? "none" : "translateY(12px)";
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Numbers count up once when they scroll into view; reduced motion shows the final value.
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const els = document.querySelectorAll<HTMLElement>(".few-seconds-article .counter-animate");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.classList.add("visible");
          obs.unobserve(el);
          if (reduce) return;
          const target = parseFloat(el.dataset["count"] || "0");
          const prefix = el.dataset["prefix"] || "";
          const suffix = el.dataset["suffix"] || "";
          const decimals = parseInt(el.dataset["decimals"] || "0", 10);
          let start: number | null = null;
          const step = (ts: number) => {
            if (start === null) start = ts;
            const p = Math.min((ts - start) / 1600, 1);
            el.textContent =
              prefix + formatCount((1 - Math.pow(1 - p, 3)) * target, decimals) + suffix;
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.6 },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const els = sections.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="few-seconds-article">
      <header className="fs-bar">
        <div className="fs-bar-inner">
          <Link to="/" className="fs-brand">
            Mohamad Noor-Chowdhury
          </Link>
          <nav className="fs-sections" aria-label="Sections">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                aria-current={activeSection === s.id}
                onClick={() =>
                  document
                    .getElementById(s.id)
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
              >
                {s.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="fs-main">
        <header>
          <h1 className="fs-h1">
            The Few Seconds That <span>Move Your Money</span>
          </h1>
          <p className="fs-standfirst">
            Every day, billions of people tap a card without thinking about what happens next. In
            the second or two before the terminal beeps, a chain of banks, networks, and technology
            companies agrees to move your money.
          </p>
          <p className="fs-meta">Published April 2026, updated November 2026 · 10 minute read</p>
        </header>

        <div
          className="fs-stage"
          role="img"
          aria-label="A card taps a payment terminal, which shows a check mark"
        >
          <div className="fs-scene" aria-hidden="true">
            <div className="fs-card">
              <div className="fs-chip" />
              <Nfc size={26} strokeWidth={1.5} />
              <div className="fs-card-number">
                {Array.from({ length: 8 }, (_, i) => (
                  <i key={i} />
                ))}
              </div>
            </div>
            <div className="fs-ripples">
              <i />
              <i />
              <i />
            </div>
            <div className="fs-terminal">
              <div className="fs-screen">
                <CreditCard size={30} strokeWidth={1.5} />
                <div className="fs-screen-ok">
                  <Check size={30} strokeWidth={2.5} />
                </div>
              </div>
              <div className="fs-keys">
                {Array.from({ length: 9 }, (_, i) => (
                  <i key={i} className={i === 7 ? "is-ok" : undefined} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <Section title="What happens after you tap">
          <div className="fs-prose">
            <p>
              How does a $12.99 purchase get approved a second or two after you tap your card? Your
              bank has never heard of the coffee shop, and the coffee shop has never heard of your
              bank. Yet before you pick up your receipt, both have agreed on who you are, whether
              you can pay, and who gets what cut. This is how that works, who is involved, and what
              is changing.
            </p>
          </div>
        </Section>

        <Section id="the-players" title="Four companies in every payment">
          <div className="fs-prose">
            <p>
              Almost every card payment involves four kinds of company. Once you know what each one
              does, the rest of the process is easy to follow.
            </p>
          </div>
          <div className="fs-grid fs-grid--2">
            {players.map(({ icon: Icon, title, role, body, examples }) => (
              <article key={title} className="fs-card-panel">
                <div className="fs-card-head">
                  <Icon size={22} strokeWidth={2} aria-hidden="true" />
                  <h3 className="fs-h3">{title}</h3>
                </div>
                <p className="fs-role">{role}</p>
                <p>{body}</p>
                <p className="fs-examples">
                  <strong>Examples:</strong> {examples}
                </p>
              </article>
            ))}
          </div>
        </Section>

        <Section id="how-it-works" title="Authorization, then settlement">
          <div className="fs-prose">
            <p>
              A card payment happens in two stages, and most people don't realize there's a gap
              between them.
            </p>
          </div>
          <div className="fs-grid fs-grid--2">
            <article className="fs-card-panel">
              <h3 className="fs-h3">Authorization</h3>
              <p className="fs-stage-label">Takes a second or two</p>
              <p>
                When you tap your card, the merchant's terminal reads its data, encrypted and with a
                one-time code from the chip. That information travels to the payment processor,
                which passes it to the acquirer. The acquirer then sends it across the card network
                to your issuer.
              </p>
              <p>
                Your issuing bank now has a fraction of a second to decide. It checks: Is this
                account real and active? Are there enough funds or available credit? Does this
                transaction look like fraud? If everything checks out, the issuer sends back an
                authorization code through the same chain in reverse. The merchant's terminal lights
                up green. You grab your coffee.
              </p>
              <p>An authorization is only a promise to pay. The money moves later.</p>
            </article>
            <article className="fs-card-panel fs-card-panel--gold">
              <h3 className="fs-h3">Settlement</h3>
              <p className="fs-stage-label">One to three business days later</p>
              <p>
                The money did not move when you paid. At the end of the business day, the merchant's
                processor sends all of the day's authorized transactions to the acquirer. The
                acquirer submits them to the card networks, which coordinate the actual transfer of
                funds from issuing banks to the acquiring bank.
              </p>
              <p>
                The merchant typically receives the money one to three business days later, minus
                fees. Those fees are split: the largest slice is the interchange fee, going to the
                issuing bank as compensation for fraud risk and the credit they extended. A smaller
                assessment fee goes to the card network. The acquirer and processor take their own
                cut too. Across all cards, US merchants paid $187 billion in processing fees in
                2024, about $1.57 for every $100 they took in.
              </p>
              <p>
                Those fees have been fought over in court for twenty years. In November 2025, Visa
                and Mastercard agreed to settle with US merchants: interchange rates would drop by
                0.1 percentage point for five years, and merchants would get more freedom to add
                surcharges and to refuse premium rewards cards. A federal judge gave preliminary
                approval in June 2026, and final approval was still pending in November 2026.
              </p>
              <div className="fs-figure">
                <p className="fs-figure-value">1.5% to 3.5% per transaction</p>
                <p className="fs-figure-note">
                  Typical total merchant fee, split among the parties. The US average across all
                  cards in 2024 was about 1.6%.
                </p>
              </div>
            </article>
          </div>
        </Section>

        <Section title="Done before you put your card away">
          <div className="fs-prose">
            <p>
              The round trip from your tap to the green light usually takes a second or two, and
              most of that is the terminal and the connections between companies. The request passes
              through each of these in order.
            </p>
          </div>
          <ol className="fs-route">
            {route.map(({ icon: Icon, label, sub }) => (
              <li key={label}>
                <span className="fs-route-icon">
                  <Icon size={26} strokeWidth={1.75} aria-hidden="true" />
                </span>
                {label}
                <span>{sub}</span>
              </li>
            ))}
          </ol>
          <p className="fs-route-note">
            The issuer decides, and the approval travels back along the same path.
          </p>
        </Section>

        <Section title="Open and closed networks">
          <div className="fs-prose">
            <p>
              Visa and Mastercard are open networks. American Express and Discover are built
              differently, which affects which merchants accept them and what fees they can charge.
            </p>
          </div>
          <div className="fs-grid fs-grid--2">
            <article className="fs-card-panel">
              <div className="fs-card-head">
                <Building2 size={22} strokeWidth={2} aria-hidden="true" />
                <h3 className="fs-h3">Open: Visa and Mastercard</h3>
              </div>
              <p>
                They license their brand and infrastructure to thousands of banks, which then issue
                cards and acquire merchants independently. The network itself just connects them.
              </p>
            </article>
            <article className="fs-card-panel fs-card-panel--gold">
              <div className="fs-card-head">
                <Lock size={22} strokeWidth={2} aria-hidden="true" />
                <h3 className="fs-h3">Closed: American Express and Discover</h3>
              </div>
              <p>
                They act as both the issuer and the network, sometimes even the acquirer. More
                control over the experience, but historically fewer accepting merchants and higher
                fees.
              </p>
            </article>
          </div>
        </Section>

        <Section id="the-history" title="From Diners Club to tap to pay">
          <ol className="fs-history">
            {history.map((item) => (
              <li key={item.year}>
                <span className="fs-year">{item.year}</span>
                <div>
                  <h3 className="fs-h3">{item.title}</h3>
                  <p>{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="whats-next" title="What is changing">
          <div className="fs-prose">
            <p>
              The basic setup has barely changed in decades. These are the trends changing it now.
            </p>
          </div>
          <div className="fs-grid fs-grid--3">
            {trends.map(({ title, body, ...count }) => (
              <article key={title} className="fs-card-panel">
                <Counter {...count} />
                <h3 className="fs-h3">{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </Section>

        <Section title="Capital One bought a network">
          <div className="fs-feature">
            <div className="fs-prose">
              <p>
                Every card transaction runs over a payment network such as Visa or Mastercard, and
                the issuing bank pays that network a fee for each one. The fee is a small
                percentage, but across billions of transactions it adds up to billions of dollars a
                year paid by banks to the networks.
              </p>
              <p>
                Capital One paid those fees on every purchase its customers made. In May 2025 it
                closed its $35.3 billion all-stock purchase of Discover, which is both a card brand
                and one of the few payment networks in the world. When a Capital One card runs on
                Discover's network, the network fee stays inside the company, and one firm controls
                the card, the credit, and the rails. Before this deal, only American Express and
                Discover itself worked that way in the US.
              </p>
              <p>
                Capital One started with debit. It began reissuing debit cards on Discover's network
                the month after the deal closed, and on its July 2026 earnings call it said the move
                was complete, with roughly 25 million debit cards switched over from Mastercard.
                Debit was the easy first step for a second reason: the cap on debit interchange fees
                does not apply to a card that runs on a network the issuer owns. The switch had
                rough edges, though. Some customers found their new cards declined at stores that
                don't take Discover, Costco among them. Capital One is now testing some credit cards
                on the network but has not said how much credit volume it will move.
              </p>
              <p>
                The bigger problem is outside the company. Visa and Mastercard carry about 87% of US
                card spending, built on decades of merchant contracts, bank partnerships, and habit.
                Discover's network has always been a distant fourth, with about 2% of US card
                purchase volume in 2024. To compete with the two leaders, Capital One has to get
                more merchants to accept Discover, persuade other banks to issue cards on it, and
                move its own credit card customers over without hurting their experience. Buying the
                network was the simpler part of the plan.
              </p>
            </div>
            <div className="fs-stats">
              <div>
                <Counter count={35.3} prefix="$" suffix="B" decimals={1} gold />
                <p className="fs-stat-label">Purchase price, closed May 2025</p>
              </div>
              <div>
                <p className="fs-stat">$1.2B</p>
                <p className="fs-stat-label">Network savings targeted by 2027</p>
              </div>
              <div>
                <p className="fs-stat">~25M</p>
                <p className="fs-stat-label">Debit cards moved to Discover</p>
              </div>
            </div>
          </div>
        </Section>

        <Section title="The machine behind the beep">
          <div className="fs-prose">
            <p>
              The next time your card terminal beeps, your bank, the merchant's bank, a global
              network, and a processor or two have just exchanged messages and agreed on the sale,
              all before you moved your hand away.
            </p>
            <p>
              Most of us use this system dozens of times a week without thinking about it. Tokens
              and chips have made it harder to steal from, phones are replacing plastic, and Capital
              One is testing whether a bank can own its own network. The basic arrangement of
              cardholder, merchant, network, and issuer is still how most of the world pays for
              things, at least for now.
            </p>
          </div>
          <div className="fs-stats">
            <div>
              <p className="fs-stat">700M+</p>
              <p className="fs-stat-label">Daily transactions on Visa's network (FY2025)</p>
            </div>
            <div>
              <p className="fs-stat">87%</p>
              <p className="fs-stat-label">Visa and Mastercard share of US card spending (2024)</p>
            </div>
            <div>
              <p className="fs-stat fs-stat--gold">$187B</p>
              <p className="fs-stat-label">US merchant card fees (2024)</p>
            </div>
          </div>
        </Section>

        <section className="fs-section">
          <h2 className="fs-h3">Sources</h2>
          <ol className="fs-sources">
            {sourceList.map((src) => (
              <li key={src.href}>
                <a href={src.href} target="_blank" rel="noopener noreferrer">
                  {src.title}
                </a>
                <span>{src.domain}</span>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <button
        ref={topRef}
        type="button"
        className="fs-top"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        <ArrowUp size={22} strokeWidth={2} />
      </button>
    </div>
  );
}
