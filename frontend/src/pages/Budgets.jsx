import { useState } from "react";
import {
  Plus,
  Wallet,
  Trash2,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";

function formatCurrency(value) {
  return `Rs. ${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

function Budgets({ transactions = [] }) {
  const [budgets, setBudgets] = useState(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("finpilotBudgets") || "[]"
      );

      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });

  const [category, setCategory] = useState("");
  const [limit, setLimit] = useState("");
  const [error, setError] = useState("");

  const getActualSpending = (budgetCategory) => {
    return transactions
      .filter((transaction) => {
        const type = String(
          transaction.transaction_type || ""
        ).toLowerCase();

        const transactionCategory = String(
          transaction.category || ""
        ).toLowerCase();

        return (
          type === "expense" &&
          transactionCategory ===
            budgetCategory.toLowerCase()
        );
      })
      .reduce(
        (total, transaction) =>
          total + (Number(transaction.amount) || 0),
        0
      );
  };

  const getBudgetStatus = (actual, limit) => {
    if (actual > limit) {
      return "danger";
    }

    const percentage =
      limit > 0 ? (actual / limit) * 100 : 0;

    if (percentage >= 80) {
      return "warning";
    }

    return "safe";
  };

  const handleAddBudget = (event) => {
    event.preventDefault();

    const trimmedCategory = category.trim();
    const numericLimit = Number(limit);

    if (!trimmedCategory) {
      setError("Please enter a category.");
      return;
    }

    if (!numericLimit || numericLimit <= 0) {
      setError("Please enter a valid monthly limit.");
      return;
    }

    const alreadyExists = budgets.some(
      (budget) =>
        String(budget.category).toLowerCase() ===
        trimmedCategory.toLowerCase()
    );

    if (alreadyExists) {
      setError(
        "A budget for this category already exists."
      );
      return;
    }

    const newBudget = {
      id: Date.now(),
      category: trimmedCategory,
      limit: numericLimit,
    };

    const updatedBudgets = [
      newBudget,
      ...budgets,
    ];

    setBudgets(updatedBudgets);

    localStorage.setItem(
      "finpilotBudgets",
      JSON.stringify(updatedBudgets)
    );

    setCategory("");
    setLimit("");
    setError("");
  };

  const handleDeleteBudget = (budgetId) => {
    const updatedBudgets = budgets.filter(
      (budget) => budget.id !== budgetId
    );

    setBudgets(updatedBudgets);

    localStorage.setItem(
      "finpilotBudgets",
      JSON.stringify(updatedBudgets)
    );
  };

  const totalBudget = budgets.reduce(
    (total, budget) =>
      total + (Number(budget.limit) || 0),
    0
  );

  const totalSpent = budgets.reduce(
    (total, budget) =>
      total + getActualSpending(budget.category),
    0
  );

  const totalRemaining = totalBudget - totalSpent;

  return (
    <div className="budgets-page">
      {/* HEADER */}
      <div className="budgets-header">
        <div>
          <span className="eyebrow">
            SPENDING CONTROL
          </span>

          <h1>Budgets</h1>

          <p>
            Set monthly spending limits and track
            your progress across categories.
          </p>
        </div>

        <div className="page-header-icon">
          <Wallet size={26} />
        </div>
      </div>

      {/* SUMMARY */}
      <div className="budget-summary-grid">
        <div className="budget-summary-card">
          <span>Total budget</span>

          <strong>
            {formatCurrency(totalBudget)}
          </strong>
        </div>

        <div className="budget-summary-card">
          <span>Total spent</span>

          <strong>
            {formatCurrency(totalSpent)}
          </strong>
        </div>

        <div className="budget-summary-card">
          <span>Total remaining</span>

          <strong>
            {formatCurrency(totalRemaining)}
          </strong>
        </div>
      </div>

      {/* CREATE BUDGET */}
      <div className="budget-form-card">
        <div className="section-heading">
          <h2>Create a budget</h2>

          <p>
            Define a monthly spending limit for a
            category.
          </p>
        </div>

        <form
          onSubmit={handleAddBudget}
          className="budget-form"
        >
          <div className="budget-field">
            <label htmlFor="budget-category">
              Category
            </label>

            <input
              id="budget-category"
              type="text"
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              placeholder="Food, Shopping, Transport..."
            />
          </div>

          <div className="budget-field">
            <label htmlFor="budget-limit">
              Monthly limit
            </label>

            <input
              id="budget-limit"
              type="number"
              min="1"
              value={limit}
              onChange={(event) =>
                setLimit(event.target.value)
              }
              placeholder="5000"
            />
          </div>

          <button
            type="submit"
            className="budget-add-button"
          >
            <Plus size={17} />
            Add budget
          </button>
        </form>

        {error && (
          <p className="budget-error">
            {error}
          </p>
        )}
      </div>

      {/* BUDGETS */}
      <div className="budgets-section">
        <div className="budgets-section-header">
          <div>
            <h2>Your budgets</h2>

            <p>
              Monitor how much you're spending in
              each category.
            </p>
          </div>
        </div>

        {budgets.length === 0 ? (
          <div className="budgets-empty">
            <div className="budgets-empty-icon">
              <Wallet size={30} />
            </div>

            <h2>No budgets yet</h2>

            <p>
              Add your first budget to start tracking
              your monthly spending.
            </p>
          </div>
        ) : (
          <div className="budget-list">
            {budgets.map((budget) => {
              const actual =
                getActualSpending(
                  budget.category
                );

              const budgetLimit =
                Number(budget.limit) || 0;

              const remaining =
                budgetLimit - actual;

              const rawPercentage =
                budgetLimit > 0
                  ? (actual / budgetLimit) * 100
                  : 0;

              const percentage = Math.min(
                rawPercentage,
                100
              );

              const status =
                getBudgetStatus(
                  actual,
                  budgetLimit
                );

              const isOverBudget =
                actual > budgetLimit;

              return (
                <div
                  className="budget-card"
                  key={budget.id}
                >
                  {/* CARD HEADER */}
                  <div className="budget-card-header">
                    <div className="budget-card-title">
                      <div className="budget-category-icon">
                        <Wallet size={19} />
                      </div>

                      <div>
                        <h3>
                          {budget.category}
                        </h3>

                        <span>
                          Monthly budget
                        </span>
                      </div>
                    </div>

                    <div className="budget-amount">
                      <strong>
                        {formatCurrency(
                          budgetLimit
                        )}
                      </strong>

                      <span>
                        limit
                      </span>
                    </div>
                  </div>

                  {/* AMOUNT */}
                  <div className="budget-card-footer">
                    <span>
                      Spent
                    </span>

                    <strong>
                      {formatCurrency(actual)}
                    </strong>
                  </div>

                  {/* PROGRESS */}
                  <div className="budget-progress">
                    <div
                      className="budget-progress-fill"
                      style={{
                        width: `${percentage}%`,
                      }}
                    />
                  </div>

                  {/* FOOTER */}
                  <div className="budget-card-footer">
                    <span>
                      {isOverBudget
                        ? `Over by ${formatCurrency(
                            Math.abs(remaining)
                          )}`
                        : `${formatCurrency(
                            remaining
                          )} remaining`}
                    </span>

                    <strong>
                      {Math.round(
                        rawPercentage
                      )}
                      %
                    </strong>
                  </div>

                  {/* STATUS */}
                  <div className="budget-card-footer">
                    <div
                      className={`budget-status ${status}`}
                    >
                      {status === "danger" ? (
                        <>
                          <AlertCircle
                            size={14}
                          />
                          <span>
                            Over budget
                          </span>
                        </>
                      ) : status === "warning" ? (
                        <>
                          <AlertCircle
                            size={14}
                          />
                          <span>
                            Near limit
                          </span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2
                            size={14}
                          />
                          <span>
                            Within budget
                          </span>
                        </>
                      )}
                    </div>

                    <button
                      type="button"
                      className="saved-goal-delete"
                      onClick={() =>
                        handleDeleteBudget(
                          budget.id
                        )
                      }
                      aria-label={`Delete ${budget.category} budget`}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* INSIGHT */}
      {budgets.length > 0 && (
        <div className="budget-insight">
          <div className="budget-insight-icon">
            <TrendingUp size={18} />
          </div>

          <div>
            <strong>
              Budget overview
            </strong>

            <span>
              {totalRemaining >= 0
                ? `${formatCurrency(
                    totalRemaining
                  )} remains across your budgets.`
                : `${formatCurrency(
                    Math.abs(totalRemaining)
                  )} over your combined budget.`}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Budgets;