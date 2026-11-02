import { ArrowLeft } from 'lucide-react';
import { Link } from '@/lib/router-compat';
import { SEOHead } from '@/components/seo/SEOHead';
import NavBar from '@/components/NavBar';
import ProjectCover from '@/components/ProjectCover';

function Stat({ value, label, source }: { value: string; label: string; source: string }) {
  return (
    <div className="article-stat">
      <p className="article-stat-value">{value}</p>
      <p className="article-stat-label">{label}</p>
      <p className="sheet-label">Source: {source}</p>
    </div>
  );
}

export default function FintechArticle() {
  return (
    <>
      <SEOHead
        title="The Future of FinTech"
        description="A plain-English breakdown of the biggest shifts in financial technology and why they'll affect your wallet, your bank, and your job."
        type="article"
      />

      <div className="sheet">
        <NavBar />
        <main className="sheet-main">
          <article>
            <header>
              <h1 className="article-title sheet-title">The Future of FinTech</h1>
              <p className="article-standfirst">Money is getting a software update.</p>
              <p className="sheet-label article-kicker-line">2026 · Analysis</p>
            </header>

            <div className="article-cover sheet--accent blueprint">
              <i className="corner tl" />
              <i className="corner tr" />
              <i className="corner bl" />
              <i className="corner br" />
              <ProjectCover slug="fintech" title="A bank vault door projected down into the screen of a phone" />
            </div>

            <div className="article-section">
              <div />
              <p className="article-lede">
                Think about how dramatically your phone changed the way you shop, communicate, and get around. Now imagine that same kind of transformation happening to banks, loans, insurance, and investing all at once. That's essentially what's unfolding in fintech (short for "financial technology") right now. Here are five trends worth knowing.
              </p>
            </div>

            <section className="article-section">
              <h2 className="article-heading">
                <span>1</span> AI Is Running the Bank
              </h2>
              <div className="article-copy">
                <p>
                  You've probably heard about artificial intelligence everywhere. In finance, it is now infrastructure. The global AI-in-fintech market is projected to reach $30 billion, growing at 22.6% annually, with 85% of financial institutions now using AI for core operations.
                </p>
                <p>
                  What does that mean in practice? Most banks are already using AI internally, with 43% deploying it in risk management, compliance, and fraud prevention. So when your bank flags a suspicious charge on your credit card within seconds, or auto-approves a loan application overnight, there's a good chance AI made that call.
                </p>
                <p>
                  What changed in 2026 is who makes the decision. AI used to assist; now it makes real, consequential decisions on its own. For everyday people, that means faster service, smarter alerts, and financial tools that feel like they know you.
                </p>
              </div>
            </section>
            <div className="article-stats">
              <Stat value="$30B" label="AI-in-FinTech market (projected)" source="Softjourn" />
              <Stat value="85%" label="Financial institutions using AI" source="Softjourn" />
            </div>

            <section className="article-section">
              <h2 className="article-heading">
                <span>2</span> Your Favorite Apps Are Becoming Your New Bank
              </h2>
              <div className="article-copy">
                <p>
                  More of your money now moves through apps that aren't banks. The term for this is <strong>embedded finance</strong>: financial services like loans, payments, and insurance built directly into apps and platforms you already use every day.
                </p>
                <p>
                  Think of checking out on an e-commerce site and being offered a payment plan right there, without ever visiting a bank. Or your employer's HR software offering you an advance on your paycheck at the click of a button.
                </p>
                <p>The convenience is real, and it's only going to become more common.</p>
              </div>
            </section>
            <blockquote className="article-pull">
              The financial services of the future may not come from a building with a vault. They may come from the apps already sitting on your phone.
            </blockquote>

            <section className="article-section">
              <h2 className="article-heading">
                <span>3</span> Digital Money Is Getting Serious
              </h2>
              <div className="article-copy">
                <p>
                  You've probably heard of Bitcoin. A quieter, more stable form of digital money is gaining ground: <strong>stablecoins</strong>. These are digital currencies tied to real-world assets like the US dollar, so they don't carry the wild price swings that make Bitcoin so unpredictable.
                </p>
                <p>
                  Stablecoins and other digital assets continue to attract strong investor interest, driven by improving regulatory clarity, particularly in the US, and expanding use cases from both established institutions and startups.
                </p>
                <p>
                  Alongside stablecoins, <strong>tokenization</strong> is also taking off; think of it like turning a piece of real estate, a bond, or a fine artwork into a digital token that can be bought and sold online. The total value of tokenized real-world assets reached roughly $24 billion in 2025, and the market could reach $16 trillion by 2030. That's <em>trillion</em> with a T, and it signals that digital assets are moving well beyond cryptocurrency speculation into the mainstream financial world.
                </p>
              </div>
            </section>
            <div className="article-stats">
              <Stat value="$24B" label="Tokenized real-world assets (2025)" source="Trinetix" />
              <Stat value="$16T" label="Projected tokenized assets by 2030" source="Trinetix" />
            </div>

            <section className="article-section">
              <h2 className="article-heading">
                <span>4</span> Paying Someone Is About to Feel Instant, Everywhere
              </h2>
              <div className="article-copy">
                <p>
                  Waiting two to three business days for a bank transfer to clear is becoming a thing of the past. Instant payment systems have the potential to become ubiquitous across developed economies, with $60 trillion in instant payment transactions processed in 2025 alone.
                </p>
                <p>
                  It sounds like a small convenience. For a small business waiting on cash, it isn't. Getting paid the moment work is done, splitting a dinner bill with friends in real time, or receiving payment at checkout without waiting days are all becoming normal.
                </p>
                <p>For anyone who has ever stressed about a payment arriving "in three to five business days," this trend is a welcome one.</p>
              </div>
            </section>
            <div className="article-stats article-stats--single">
              <Stat value="$60T" label="Instant payment transactions in 2025" source="Fintechmagazine" />
            </div>

            <section className="article-section">
              <h2 className="article-heading">
                <span>5</span> Fraud Fighting Has Become a Technology Arms Race
              </h2>
              <div className="article-copy">
                <p>
                  As financial technology gets smarter, so do the people trying to exploit it. The US lost $12.3 billion to fraud in 2023, and the rise of generative AI could push those losses even higher.
                </p>
                <p>
                  The encouraging news is that the same AI tools being misused by bad actors are also being deployed to stop them. Banks and fintechs are investing heavily in real-time fraud detection, behavioral analysis, and identity verification, making it significantly harder for scammers to slip through. The companies that do this well will earn enormous trust from their customers.
                </p>
              </div>
            </section>
            <div className="article-stats article-stats--single article-stats--alarm">
              <Stat value="$12.3B" label="Lost to fraud in 2023 (US)" source="Plaid" />
            </div>

            <section className="article-section">
              <h2 className="article-heading">The Bottom Line</h2>
              <div className="article-copy">
                <p>
                  You don't need to understand every piece of technology behind these trends to feel their impact. Whether it's a faster payment, a smarter fraud alert, or a loan offered inside an app you already love, finance is moving into the things you already use every day.
                </p>
                <p className="article-closer">
                  The companies behind these shifts are changing what money can do and who it works for. That will reach your wallet whether or not you follow the technology.
                </p>
              </div>
            </section>

            <footer className="sheet-foot">
              <Link to="/portfolio" className="btn btn-ghost" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                <ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" />
                Back to Portfolio
              </Link>
            </footer>
          </article>
        </main>
      </div>
    </>
  );
}
