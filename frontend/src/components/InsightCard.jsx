import {
  Sparkles,
  ArrowRight,
  TrendingUp,
} from "lucide-react";

function InsightCard() {
  return (
    <div className="insight-card">
      <div className="insight-glow" />

      <div className="insight-header">
        <div className="ai-icon">
          <Sparkles size={18} />
        </div>

        <span>FINPILOT INSIGHT</span>
      </div>

      <h3>
        Your shopping spending is becoming your
        biggest variable expense.
      </h3>

      <p>
        You spent ₹60,100 on shopping across the
        last four months. Amazon and Flipkart
        account for most of it.
      </p>

      <div className="insight-metric">
        <div>
          <TrendingUp size={16} />
          <span>Shopping trend</span>
        </div>

        <strong>+18.4%</strong>
      </div>

      <button className="insight-action">
        Explore this insight

        <ArrowRight size={17} />
      </button>
    </div>
  );
}

export default InsightCard;

