import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Link } from '@/lib/router-compat';
import { SEOHead } from '@/components/seo/SEOHead';
import { StatCard } from '@/components/article/StatCard';
import { Separator } from '@/components/ui/separator';
import finTechImage from '@/assets/FinTech.jpg';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 },
};

export default function FintechArticle() {
  return (
    <>
      <SEOHead
        title="The Future of FinTech"
        description="A plain-English breakdown of the biggest shifts in financial technology and why they'll affect your wallet, your bank, and your job."
        image={finTechImage}
        type="article"
      />

      <div className="min-h-screen">
        {/* Hero */}
        <motion.div
          className="relative w-full h-[70vh] overflow-hidden bg-muted"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={finTechImage}
            alt="The Future of FinTech"
            className="w-full h-full object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
          
          {/* Back button */}
          <Link
            to="/portfolio"
            className="absolute top-6 left-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm border border-border shadow-md transition-colors hover:bg-background"
          >
            <ArrowLeft className="h-4 w-4 text-foreground" />
          </Link>

          {/* Hero text overlay */}
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-12 md:pb-16">
            <div className="max-w-3xl mx-auto">
              <motion.p
                className="text-sm font-medium tracking-widest uppercase text-muted-foreground mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                2026 · Analysis
              </motion.p>
              <motion.h1
                className="text-4xl md:text-5xl lg:text-6xl font-light tracking-wide text-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                The Future of FinTech
              </motion.h1>
            </div>
          </div>
        </motion.div>

        {/* Article Content */}
        <article className="max-w-3xl mx-auto px-6 lg:px-8 py-12 md:py-20">
          {/* Subtitle / Lede */}
          <motion.div {...fadeIn} className="mb-12">
            <p className="text-xl md:text-2xl font-light leading-relaxed text-foreground italic">
              Money is getting a software update.
            </p>
            <p className="mt-6 text-lg font-light leading-relaxed text-muted-foreground">
              Think about how dramatically your phone changed the way you shop, communicate, and get around. Now imagine that same kind of transformation happening to banks, loans, insurance, and investing all at once. That's essentially what's unfolding in fintech (short for "financial technology") right now. Here are the five trends leading the charge.
            </p>
          </motion.div>

          <Separator className="my-12" />

          {/* Section 1: AI */}
          <motion.section {...fadeIn} className="mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-wide text-foreground mb-6">
              1. AI Is Running the Bank
            </h2>
            <p className="text-base md:text-lg font-light leading-relaxed text-muted-foreground mb-8">
              You've probably heard about artificial intelligence everywhere. But in finance, it has gone from a talking point to actual infrastructure. The global AI-in-fintech market is projected to reach $30 billion, growing at 22.6% annually, with 85% of financial institutions now using AI for core operations.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
              <StatCard value="$30B" label="AI-in-FinTech Market (Projected)" source="Softjourn" />
              <StatCard value="85%" label="Financial Institutions Using AI" source="Softjourn" />
            </div>

            <p className="text-base md:text-lg font-light leading-relaxed text-muted-foreground mb-4">
              What does that mean in practice? Most banks are already using AI internally, with 43% deploying it in risk management, compliance, and fraud prevention. So when your bank flags a suspicious charge on your credit card within seconds, or auto-approves a loan application overnight, there's a good chance AI made that call.
            </p>
            <p className="text-base md:text-lg font-light leading-relaxed text-muted-foreground">
              The key shift in 2026 isn't that AI exists. It's that it has moved from being a helpful assistant to making real, consequential decisions on its own. For everyday people, that means faster service, smarter alerts, and financial tools that actually feel like they know you.
            </p>
          </motion.section>

          <Separator className="my-12" />

          {/* Section 2: Embedded Finance */}
          <motion.section {...fadeIn} className="mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-wide text-foreground mb-6">
              2. Your Favorite Apps Are Becoming Your New Bank
            </h2>
            <p className="text-base md:text-lg font-light leading-relaxed text-muted-foreground mb-4">
              Here's a trend that is quietly changing how you interact with money: <strong className="text-foreground">embedded finance</strong>. It sounds technical, but the idea is simple: financial services like loans, payments, and insurance are being built directly into apps and platforms you already use every day.
            </p>
            <p className="text-base md:text-lg font-light leading-relaxed text-muted-foreground mb-4">
              Think of checking out on an e-commerce site and being offered a payment plan right there, without ever visiting a bank. Or your employer's HR software offering you an advance on your paycheck at the click of a button.
            </p>

            <motion.blockquote
              className="border-l-4 border-primary pl-6 py-4 my-8 bg-muted/50 rounded-r-lg"
              {...fadeIn}
            >
              <p className="text-base md:text-lg italic text-foreground">
                The financial services of the future may not come from a building with a vault. They may come from the apps already sitting on your phone.
              </p>
            </motion.blockquote>

            <p className="text-base md:text-lg font-light leading-relaxed text-muted-foreground">
              The convenience is real, and it's only going to become more common.
            </p>
          </motion.section>

          <Separator className="my-12" />

          {/* Section 3: Digital Money */}
          <motion.section {...fadeIn} className="mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-wide text-foreground mb-6">
              3. Digital Money Is Getting Serious
            </h2>
            <p className="text-base md:text-lg font-light leading-relaxed text-muted-foreground mb-4">
              You've probably heard of Bitcoin. But a quieter, more stable form of digital money is gaining ground: <strong className="text-foreground">stablecoins</strong>. These are digital currencies tied to real-world assets like the US dollar, so they don't carry the wild price swings that make Bitcoin so unpredictable.
            </p>
            <p className="text-base md:text-lg font-light leading-relaxed text-muted-foreground mb-8">
              Stablecoins and other digital assets continue to attract strong investor interest, driven by improving regulatory clarity, particularly in the US, and expanding use cases from both established institutions and startups.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-8">
              <StatCard value="$24B" label="Tokenized Real-World Assets (2025)" source="Trinetix" />
              <StatCard value="$16T" label="Projected Tokenized Assets by 2030" source="Trinetix" />
            </div>

            <p className="text-base md:text-lg font-light leading-relaxed text-muted-foreground">
              Alongside stablecoins, <strong className="text-foreground">tokenization</strong> is also taking off; think of it like turning a piece of real estate, a bond, or a fine artwork into a digital token that can be bought and sold online. The total value of tokenized real-world assets reached roughly $24 billion in 2025, and the market could reach $16 trillion by 2030. That's <em>trillion</em> with a T, and it signals that digital assets are moving well beyond cryptocurrency speculation into the mainstream financial world.
            </p>
          </motion.section>

          <Separator className="my-12" />

          {/* Section 4: Instant Payments */}
          <motion.section {...fadeIn} className="mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-wide text-foreground mb-6">
              4. Paying Someone Is About to Feel Instant, Everywhere
            </h2>
            <p className="text-base md:text-lg font-light leading-relaxed text-muted-foreground mb-8">
              Waiting two to three business days for a bank transfer to clear is becoming a thing of the past. Instant payment systems have the potential to become ubiquitous across developed economies, with $60 trillion in instant payment transactions processed in 2025 alone.
            </p>

            <div className="max-w-sm mx-auto my-8">
              <StatCard value="$60T" label="Instant Payment Transactions in 2025" source="Fintechmagazine" />
            </div>

            <p className="text-base md:text-lg font-light leading-relaxed text-muted-foreground mb-4">
              This might sound like a small convenience, but it is a meaningful shift for businesses and everyday people alike. Getting paid the moment work is done, splitting a dinner bill with friends in real time, or a small business owner receiving payment at checkout without waiting days are all becoming the new normal.
            </p>
            <p className="text-base md:text-lg font-light leading-relaxed text-muted-foreground">
              For anyone who has ever stressed about a payment arriving "in three to five business days," this trend is a welcome one.
            </p>
          </motion.section>

          <Separator className="my-12" />

          {/* Section 5: Fraud */}
          <motion.section {...fadeIn} className="mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-wide text-foreground mb-6">
              5. Fraud Fighting Has Become a Technology Arms Race
            </h2>
            <p className="text-base md:text-lg font-light leading-relaxed text-muted-foreground mb-8">
              As financial technology gets smarter, so do the people trying to exploit it. The US lost $12.3 billion to fraud in 2023, and the rise of generative AI could push those losses even higher.
            </p>

            <div className="max-w-sm mx-auto my-8">
              <StatCard value="$12.3B" label="Lost to Fraud in 2023 (US)" source="Plaid" accent="red" />
            </div>

            <p className="text-base md:text-lg font-light leading-relaxed text-muted-foreground">
              The encouraging news is that the same AI tools being misused by bad actors are also being deployed to stop them. Banks and fintechs are investing heavily in real-time fraud detection, behavioral analysis, and identity verification, making it significantly harder for scammers to slip through. The companies that do this well will earn enormous trust from their customers.
            </p>
          </motion.section>

          <Separator className="my-12" />

          {/* Bottom Line */}
          <motion.section {...fadeIn} className="mb-16">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-wide text-foreground mb-6">
              The Bottom Line
            </h2>
            <p className="text-base md:text-lg font-light leading-relaxed text-muted-foreground mb-4">
              You don't need to understand every piece of technology behind these trends to feel their impact. Whether it's a faster payment, a smarter fraud alert, or a loan offered inside an app you already love, the future of finance is quietly weaving itself into everyday life.
            </p>
            <p className="text-base md:text-lg font-light leading-relaxed text-foreground font-medium">
              The companies and people leading this change aren't just building cooler apps. They are rethinking what money can do and who it can work for. And that's a story worth paying attention to.
            </p>
          </motion.section>

          {/* Back to portfolio */}
          <div className="pt-8 border-t border-border">
            <Link
              to="/portfolio"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Portfolio
            </Link>
          </div>
        </article>
      </div>
    </>
  );
}
