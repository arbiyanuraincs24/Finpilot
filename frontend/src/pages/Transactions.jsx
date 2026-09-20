import { useMemo, useState } from "react";
import {
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  Filter,
} from "lucide-react";

function Transactions({ transactions = [] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const description = String(
        transaction.description || ""
      ).toLowerCase();

      const matchesSearch = description.includes(
        search.toLowerCase()
      );

      const matchesFilter =
        filter === "All" ||
        (filter === "Income" &&
          transaction.transaction_type === "income") ||
        (filter === "Expenses" &&
          transaction.transaction_type !== "income");

      return matchesSearch && matchesFilter;
    });
  }, [transactions, search, filter]);

  return (
    <section className="page-section">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            MONEY ACTIVITY
          </span>

          <h1>Transactions</h1>

          <p>
            Every transaction, organized and
            categorized automatically.
          </p>
        </div>
      </div>

      <div className="transaction-toolbar">
        <div className="search-box">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className="filter-group">
          <Filter size={17} />

          {["All", "Income", "Expenses"].map(
            (option) => (
              <button
                key={option}
                className={
                  filter === option
                    ? "filter-button active"
                    : "filter-button"
                }
                onClick={() =>
                  setFilter(option)
                }
              >
                {option}
              </button>
            )
          )}
        </div>
      </div>

      <div className="transactions-table-card">
        <div className="table-header">
          <span>Date</span>
          <span>Description</span>
          <span>Category</span>
          <span>Type</span>
          <span>Amount</span>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="empty-state">
            No transactions found.
          </div>
        ) : (
          filteredTransactions.map(
            (transaction, index) => {
              const isIncome =
                transaction.transaction_type ===
                "income";

              return (
                <div
                  className="table-row"
                  key={`${transaction.date}-${transaction.description}-${index}`}
                >
                  <span>
                    {transaction.date}
                  </span>

                  <strong>
                    {transaction.description}
                  </strong>

                  <span className="category-pill">
                    {transaction.category}
                  </span>

                  <span
                    className={
                      isIncome
                        ? "type-income"
                        : "type-expense"
                    }
                  >
                    {isIncome ? (
                      <ArrowDownLeft size={15} />
                    ) : (
                      <ArrowUpRight size={15} />
                    )}

                    {isIncome
                      ? "Income"
                      : "Expense"}
                  </span>

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
    </section>
  );
}

export default Transactions;
