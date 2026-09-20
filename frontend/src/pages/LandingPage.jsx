import {
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

function LandingPage({ onGetStarted }) {
  return (
    <div className="landing-page">
      {/* Background glow */}
      <div className="landing-glow landing-glow-one" />
      <div className="landing-glow landing-glow-two" />

      {/* Navigation */}
      <nav className="landing-nav">
        <div className="landing-logo">
          <div className="landing-logo-mark">
            F
          </div>

          <span>FinPilot</span>
        </div>

        <button
          className="landing-nav-button"
          type="button"
          onClick={onGetStarted}
        >
          Get started
          <ArrowRight size={16} />
        </button>
      </nav>

      {/* Hero */}
      <main className="landing-hero">
        <div className="landing-hero-content">
          <div className="landing-eyebrow">
            <span className="landing-eyebrow-dot" />
            AI-powered financial decision support
          </div>

          <h1>
            Know your money.
            <br />
            <span>Before it moves.</span>
          </h1>

          <p>
            FinPilot helps you understand your spending,
            anticipate what's coming, and make smarter
            financial decisions with confidence.
          </p>

          <button
            className="landing-primary-button"
            type="button"
            onClick={onGetStarted}
          >
            Get started
            <ArrowRight size={19} />
          </button>

          <div className="landing-trust">
            <div>
              <ShieldCheck size={16} />
              <span>Your data stays yours</span>
            </div>

            <div>
              <Sparkles size={16} />
              <span>Built for real decisions</span>
            </div>
          </div>
        </div>

        {/* Financial visual */}
        <div className="landing-visual">
          <div className="landing-orbit landing-orbit-one" />
          <div className="landing-orbit landing-orbit-two" />

          <div className="landing-dashboard-card">
            <div className="landing-card-header">
              <div>
                <span>FINANCIAL OVERVIEW</span>
                <strong>₹91,766</strong>
              </div>

              <div className="landing-card-status">
                <TrendingUp size={15} />
                12.4%
              </div>
            </div>

            <div className="landing-chart">
              <div className="landing-chart-line" />
              <div className="landing-chart-glow" />
            </div>

            <div className="landing-card-footer">
              <div>
                <span>Income</span>
                <strong>₹65,000</strong>
              </div>

              <div>
                <span>Expenses</span>
                <strong>₹42,060</strong>
              </div>

              <div>
                <span>Savings</span>
                <strong>35.3%</strong>
              </div>
            </div>
          </div>

          <div className="landing-floating-card landing-floating-one">
            <span>UPCOMING</span>
            <strong>₹18,649</strong>
            <small>Expected commitments</small>
          </div>

          <div className="landing-floating-card landing-floating-two">
            <span>GOAL PROGRESS</span>

            <div className="landing-goal-row">
              <div className="landing-goal-icon">
                <Sparkles size={14} />
              </div>

              <div>
                <strong>New laptop</strong>

                <div className="landing-mini-progress">
                  <span />
                </div>
              </div>

              <b>68%</b>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom features */}
      <section className="landing-features">
        <div>
          <span>01</span>
          <strong>Understand</strong>
          <p>See where your money actually goes.</p>
        </div>

        <div>
          <span>02</span>
          <strong>Anticipate</strong>
          <p>Know what's likely coming next.</p>
        </div>

        <div>
          <span>03</span>
          <strong>Decide</strong>
          <p>Explore choices before making them.</p>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;