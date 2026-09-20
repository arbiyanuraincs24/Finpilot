import {
  Utensils,
  ShoppingBag,
  Play,
  Home,
  Wallet,
  Car,
  CircleDollarSign,
} from "lucide-react";

const iconMap = {
  Food: Utensils,
  Shopping: ShoppingBag,
  Subscription: Play,
  Housing: Home,
  Transport: Car,
  Income: Wallet,
  Other: CircleDollarSign,
};

function RecentTransactions({
  transactions = [],
}) {
  const recentTransactions =
    transactions.slice(-5).reverse();

  return (
    <div className="transactions-card">
      <div className="card-heading">
        <div>
          <span className="eyebrow">
            ACTIVITY
          </span>

          <h3>Recent transactions</h3>
        </div>

        <button className="text-button">
          See all
        </button>
      </div>

      <div className="transaction-list">
        {recentTransactions.length === 0 ? (
          <div className="empty-state">
            Upload a statement to see your
            transactions.
          </div>
        ) : (
          recentTransactions.map(
            (transaction, index) => {
              const Icon =
                iconMap[transaction.category] ||
                CircleDollarSign;

              const isIncome =
                transaction.transaction_type ===
                "income";

              return (
                <div
                  className="transaction-row"
                  key={`${transaction.date}-${transaction.description}-${index}`}
                >
                  <div className="transaction-icon">
                    <Icon size={17} />
                  </div>

                  <div className="transaction-main">
                    <strong>
                      {transaction.description}
                    </strong>

                    <span>
                      {transaction.category} ·{" "}
                      {transaction.date}
                    </span>
                  </div>

                  <strong
                    className={
                      isIncome
                        ? "income-amount"
                        : "expense-amount"
                    }
                  >
                    {isIncome ? "+" : "-"}₹
                    {Number(
                      transaction.amount
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>
              );
            }
          )
        )}
      </div>
    </div>
  );
}

export default RecentTransactions;

