import { ArrowLeft } from "lucide-react";
import { Link } from "@/lib/router-compat";
import { SEOHead } from "@/components/seo/SEOHead";
import BackToTop from "@/components/BackToTop";
import NavBar from "@/components/NavBar";
import ProjectCover from "@/components/ProjectCover";

function Stat({
  value,
  label,
  source,
  href,
}: {
  value: string;
  label: string;
  source: string;
  href: string;
}) {
  return (
    <div className="article-stat">
      <p className="article-stat-value">{value}</p>
      <p className="article-stat-label">{label}</p>
      <p className="sheet-label">
        Source:{" "}
        <a href={href} target="_blank" rel="noopener noreferrer">
          {source}
        </a>
      </p>
    </div>
  );
}

const BOE_FCA =
  "https://www.bankofengland.co.uk/report/2024/artificial-intelligence-in-uk-financial-services-2024";
const BOE_2026 =
  "https://www.bankofengland.co.uk/report/2026/artificial-intelligence-in-uk-financial-services-2026";
const CRS_GENIUS = "https://www.congress.gov/crs-product/R49351";
const RWA_XYZ = "https://app.rwa.xyz/";
const ACI = "https://www.aciworldwide.com/real-time-payments-report";
const FTC_2025 =
  "https://www.finextra.com/newsarticle/47497/us-ftc-consumers-lost-159bn-to-fraud-in-2025";
const DELOITTE =
  "https://www.deloitte.com/us/en/insights/industry/financial-services/deepfake-banking-fraud-risk-on-the-rise.html";

const sources = [
  {
    title: "Artificial intelligence in UK financial services, 2026",
    publisher: "Bank of England",
    href: BOE_2026,
  },
  {
    title: "Artificial intelligence in UK financial services, 2024",
    publisher: "Bank of England and FCA",
    href: BOE_FCA,
  },
  {
    title: "GENIUS Act (P.L. 119-27): Creating a Regulatory Framework for Stablecoins",
    publisher: "Congressional Research Service",
    href: CRS_GENIUS,
  },
  { title: "Tokenized real-world assets dashboard", publisher: "rwa.xyz", href: RWA_XYZ },
  {
    title: 'Relevance of on-chain asset tokenization in "crypto winter"',
    publisher: "BCG and ADDX (2022)",
    href: "https://addx.co/files/bcg_ADDX_report_Asset_tokenization_trillion_opportunity_by_2030_de2aaa41a4.pdf",
  },
  { title: "Prime Time for Real-Time 2024", publisher: "ACI Worldwide and GlobalData", href: ACI },
  {
    title: "Smaller institutions embrace faster payments with FedNow",
    publisher: "Federal Reserve Bank of Richmond",
    href: "https://www.richmondfed.org/publications/research/economic_brief/2026/eb_26-28",
  },
  {
    title: "New FTC data show a big jump in reported losses to fraud to $12.5 billion in 2024",
    publisher: "Federal Trade Commission",
    href: "https://www.ftc.gov/news-events/news/press-releases/2025/03/new-ftc-data-show-big-jump-reported-losses-fraud-125-billion-2024",
  },
  {
    title: "US FTC: Consumers lost $15.9bn to fraud in 2025",
    publisher: "Finextra",
    href: FTC_2025,
  },
  {
    title: "Generative AI is expected to magnify the risk of deepfakes and other fraud in banking",
    publisher: "Deloitte Center for Financial Services",
    href: DELOITTE,
  },
];

export default function FintechArticle() {
  return (
    <>
      <SEOHead
        title="The Future of FinTech"
        description="A plain-English breakdown of the biggest shifts in financial technology and why they'll affect your wallet, your bank, and your job."
        type="article"
      />

      <div className="sheet sheet--original">
        <NavBar />
        <main className="sheet-main">
          <article>
            <header>
              <h1 className="article-title sheet-title">The Future of FinTech</h1>
              <p className="article-standfirst">Money is getting a software update.</p>
              <p className="sheet-label article-kicker-line">
                2026 · Analysis · Updated November 2026
              </p>
            </header>

            <div className="article-cover sheet--accent blueprint">
              <i className="corner tl" />
              <i className="corner tr" />
              <i className="corner bl" />
              <i className="corner br" />
              <ProjectCover
                slug="fintech"
                title="A bank vault door projected down into the screen of a phone"
              />
            </div>

            <div className="article-section">
              <div />
              <p className="article-lede">
                Your phone changed how you shop, talk to people, and get around. Banking, lending,
                insurance, and investing are going through a similar change now, and the umbrella
                term for it is fintech, short for "financial technology." Here are five shifts worth
                knowing about, with the numbers behind them.
              </p>
            </div>

            <section className="article-section">
              <h2 className="article-heading">
                <span>1</span> AI Is Inside the Bank
              </h2>
              <div className="article-copy">
                <p>
                  Most financial firms already use artificial intelligence somewhere in the
                  business. In the Bank of England's latest survey of UK banks, insurers, payments
                  companies, and investment firms, published in October 2026, 86% said they use AI,
                  up from 75% in 2024 and 58% in 2022. Generative AI, the kind behind chatbots, made
                  up 56% of the AI systems firms reported.
                </p>
                <p>
                  In practice, AI is the reason your bank can flag a strange charge on your card
                  within seconds, or approve a small loan application overnight. It sorts
                  transactions, scores credit risk, and answers routine customer questions.
                </p>
                <p>
                  Firms are still careful about letting AI act alone. Most of the AI agents they run
                  recommend an action and leave a person to approve it, and only 2% of firms said
                  they had deployed agents with broad autonomy. Understanding is another weak spot:
                  in the 2024 edition of the survey, 46% of firms said they only partly understood
                  the AI they rely on, mostly tools bought from outside vendors. Keep that in mind
                  the next time an automated system turns down your application and nobody at the
                  branch can tell you why.
                </p>
              </div>
            </section>
            <div className="article-stats">
              <Stat
                value="86%"
                label="UK financial firms using AI (2026)"
                source="Bank of England"
                href={BOE_2026}
              />
              <Stat
                value="2%"
                label="Firms running AI agents with broad autonomy"
                source="Bank of England"
                href={BOE_2026}
              />
            </div>

            <section className="article-section">
              <h2 className="article-heading">
                <span>2</span> Your Favorite Apps Are Becoming Your Bank
              </h2>
              <div className="article-copy">
                <p>
                  More of your money now moves through apps that aren't banks. The term for this is{" "}
                  <strong>embedded finance</strong>: loans, payments, and insurance built directly
                  into software you already use.
                </p>
                <p>
                  You see it when an online store offers a payment plan at checkout, so you never
                  visit a bank, or when your employer's payroll app lets you draw part of your
                  paycheck early. A licensed bank usually still sits behind the button, but the app
                  owns the relationship with you.
                </p>
                <p>Expect to see it in more apps every year.</p>
              </div>
            </section>
            <blockquote className="article-pull">
              Your next loan may come from an app you opened to buy shoes.
            </blockquote>

            <section className="article-section">
              <h2 className="article-heading">
                <span>3</span> Digital Dollars Get Rules
              </h2>
              <div className="article-copy">
                <p>
                  You've probably heard of Bitcoin, whose price can swing by double digits in a
                  week. <strong>Stablecoins</strong> are built to avoid that. Each token is meant to
                  be worth one US dollar, backed by cash and short-term government debt the issuer
                  holds.
                </p>
                <p>
                  In July 2025 the US passed the GENIUS Act, its first federal law for stablecoins.
                  It sets reserve and disclosure rules for issuers and lets banks issue their own.
                  By spring 2026 roughly $300 billion worth of stablecoins were in circulation, most
                  of it from two issuers, Tether (USDT) and Circle (USDC). A year after the law
                  passed, regulators were still writing the detailed rules.
                </p>
                <p>
                  A related idea is <strong>tokenization</strong>: recording ownership of a real
                  asset, such as a Treasury bond, a fund share, or a building, as a digital token
                  that can be traded and settled online. As of November 2026, the tracker rwa.xyz
                  counted about $39 billion in tokenized real-world assets on public blockchains,
                  not counting stablecoins. Tokenized US Treasury funds were the largest category,
                  at around $14 billion. That is tiny next to the bond market. A widely cited 2022
                  forecast from BCG and ADDX put tokenized assets at $16 trillion by 2030, and the
                  market is still nowhere near that path.
                </p>
              </div>
            </section>
            <div className="article-stats">
              <Stat
                value="~$300B"
                label="Stablecoins in circulation (spring 2026)"
                source="Congressional Research Service"
                href={CRS_GENIUS}
              />
              <Stat
                value="$39B"
                label="Tokenized real-world assets, excluding stablecoins (Nov 2026)"
                source="rwa.xyz"
                href={RWA_XYZ}
              />
            </div>

            <section className="article-section">
              <h2 className="article-heading">
                <span>4</span> Instant Payments Are Becoming Normal
              </h2>
              <div className="article-copy">
                <p>
                  Waiting two or three business days for a bank transfer to clear is becoming less
                  common. ACI Worldwide counted 266 billion real-time payments worldwide in 2023, up
                  42% in a year and about one in five electronic payments. India's UPI system
                  handled almost half of them. ACI expects the global total to pass 575 billion by
                  2028.
                </p>
                <p>
                  The US was late. The Federal Reserve launched its instant payment service, FedNow,
                  in July 2023, and by early 2026 about 1,725 banks and credit unions had joined,
                  roughly one in five US institutions.
                </p>
                <p>
                  For a small business waiting on cash, that matters a lot. Getting paid the moment
                  a job is done, or splitting a dinner bill with friends on the spot, is becoming
                  routine. If you have ever waited on a payment promised in "three to five business
                  days," you will notice the difference.
                </p>
              </div>
            </section>
            <div className="article-stats article-stats--single">
              <Stat
                value="266B"
                label="Real-time payments worldwide in 2023"
                source="ACI Worldwide"
                href={ACI}
              />
            </div>

            <section className="article-section">
              <h2 className="article-heading">
                <span>5</span> Fraud Is Getting More Expensive
              </h2>
              <div className="article-copy">
                <p>
                  Better tools help scammers too. Americans reported losing $15.9 billion to fraud
                  in 2025, according to the Federal Trade Commission, up from $12.5 billion in 2024.
                  Investment scams made up about half of it. The FTC counts only the losses people
                  report, so the real total is higher.
                </p>
                <p>
                  Deloitte expects generative AI to make this worse. Cloned voices, deepfake video
                  calls, and convincing fake emails make old scams cheaper to run at scale. Its
                  analysts estimate that US fraud losses enabled by generative AI could reach $40
                  billion a year by 2027, up from $12.3 billion in 2023.
                </p>
                <p>
                  Banks and fintechs are answering with the same technology: models that watch for
                  unusual account behavior in real time, and stronger identity checks when you sign
                  up or move money. The firms that catch fraud before it reaches your account will
                  keep their customers.
                </p>
              </div>
            </section>
            <div className="article-stats article-stats--alarm">
              <Stat
                value="$15.9B"
                label="US fraud losses reported to the FTC in 2025"
                source="FTC, via Finextra"
                href={FTC_2025}
              />
              <Stat
                value="$40B"
                label="Projected US losses from AI-enabled fraud by 2027"
                source="Deloitte"
                href={DELOITTE}
              />
            </div>

            <section className="article-section">
              <h2 className="article-heading">The Bottom Line</h2>
              <div className="article-copy">
                <p>
                  You don't need to understand the technology behind these shifts to feel them. A
                  faster transfer, a fraud alert that arrives before the charge clears, a loan
                  offered inside an app you already use: each comes from one of the changes above.
                </p>
                <p className="article-closer">
                  Some of them will save you time and money. Others, like AI-driven scams, are a
                  reason to stay careful.
                </p>
              </div>
            </section>

            <section className="article-section article-sources">
              <h2 className="article-heading">Sources</h2>
              <ol>
                {sources.map((src) => (
                  <li key={src.href}>
                    <a href={src.href} target="_blank" rel="noopener noreferrer">
                      {src.title}
                    </a>
                    <span className="sheet-label">{src.publisher}</span>
                  </li>
                ))}
              </ol>
            </section>

            <footer className="sheet-foot">
              <Link
                to="/portfolio"
                className="btn btn-ghost"
                style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
              >
                <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
                Back to Portfolio
              </Link>
            </footer>
          </article>
        </main>
        <BackToTop />
      </div>
    </>
  );
}
