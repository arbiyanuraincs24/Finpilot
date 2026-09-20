
import {
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  PiggyBank,
  CreditCard,
  TrendingUp,
} from "lucide-react";

function StatCard({
  title,
  value,
  change,
  changeType,
  icon,
  description,
}) {
  const icons = {
    income: Wallet,
    expense: CreditCard,
    savings: PiggyBank,
    rate: TrendingUp,
  };

  const Icon = icons[icon] || Wallet;

  return (
    <div className="stat-card">
      <div className="stat-top">
        <div className="stat-icon">
          <Icon size={19} />
        </div>

        {change && (
          <div className={`change ${changeType}`}>
            {changeType === "positive" ? (
              <ArrowUpRight size={14} />
            ) : (
              <ArrowDownRight size={14} />
            )}

            {change}
          </div>
        )}
      </div>

      <p>{title}</p>

      <h3>{value}</h3>

      <span className="stat-description">
        {description}
      </span>
    </div>
  );
}

export default StatCard;

