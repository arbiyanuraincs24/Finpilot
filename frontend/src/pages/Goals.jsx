import {
  Target,
  Plus,
  ArrowRight,
  Wallet,
  TrendingUp,
  Sparkles,
  Trash2,
  ChevronRight,
} from "lucide-react";

/* =========================================================
   HELPERS
========================================================= */

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

function calculateMonthlyData(transactions = []) {
  const months = {};

  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);

    if (Number.isNaN(date.getTime())) {
      return;
    }

    const key = `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;

    if (!months[key]) {
      months[key] = {
        income: 0,
        expenses: 0,
      };
    }

    const amount =
      Number(transaction.amount) || 0;

    const type = String(
      transaction.transaction_type || ""
    ).toLowerCase();

    if (type === "income") {
      months[key].income += amount;
    } else {
      months[key].expenses += amount;
    }
  });

  return Object.values(months);
}

function calculateFinancialCapacity(
  transactions,
  summary
) {
  const monthly =
    calculateMonthlyData(transactions);

  const averageIncome =
    monthly.length > 0
      ? monthly.reduce(
          (total, month) =>
            total + month.income,
          0
        ) / monthly.length
      : Number(summary?.total_income) || 0;

  const averageExpenses =
    monthly.length > 0
      ? monthly.reduce(
          (total, month) =>
            total + month.expenses,
          0
        ) / monthly.length
      : Number(summary?.total_expenses) || 0;

  const monthlySavings =
    averageIncome - averageExpenses;

  const savingsRate =
    averageIncome > 0
      ? (monthlySavings / averageIncome) * 100
      : 0;

  return {
    averageIncome,
    averageExpenses,
    monthlySavings,
    savingsRate,
  };
}

/* =========================================================
   GOALS
========================================================= */

function Goals({
  transactions = [],
  summary = {},
  savedGoals = [],
  onCreateGoal,
  onSelectGoal,
  onDeleteGoal,
  onOpenSavedGoals,
}) {
  const capacity =
    calculateFinancialCapacity(
      transactions,
      summary
    );

  const hasFinancialData =
    transactions.length > 0 ||
    Number(summary?.total_income) > 0 ||
    Number(summary?.total_expenses) > 0;

  return (
    <div className="goals-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="goals-header">

        <div>
          <span className="eyebrow">
            FINANCIAL GOALS
          </span>

          <h1>
            Turn your plans into goals.
          </h1>

          <p>
            Create measurable financial goals and use
            FinPilot to understand how your current
            finances can support them.
          </p>
        </div>

        <div className="goals-header-actions">

          {savedGoals.length > 0 && (
            <button
              className="goal-view-saved-button"
              type="button"
              onClick={onOpenSavedGoals}
            >
              View saved goals
              <ChevronRight size={16} />
            </button>
          )}

          <button
            className="goal-create-button"
            type="button"
            onClick={onCreateGoal}
          >
            <Plus size={17} />
            Create goal
          </button>

        </div>

      </div>

      {/* =================================================
          NO FINANCIAL DATA
      ================================================= */}

      {!hasFinancialData && (
        <div className="goals-empty-state">

          <div className="goals-empty-icon">
            <Target size={30} />
          </div>

          <h2>
            Import your financial data first
          </h2>

          <p>
            FinPilot uses your real transaction history
            to estimate how much you may be able to put
            toward a goal.
          </p>

          <div className="goals-empty-features">

            <div>
              <Wallet size={18} />

              <strong>
                Understand capacity
              </strong>

              <span>
                See your average income, expenses and
                savings.
              </span>
            </div>

            <div>
              <TrendingUp size={18} />

              <strong>
                Build a realistic plan
              </strong>

              <span>
                Compare your current savings with the
                amount needed.
              </span>
            </div>

            <div>
              <Sparkles size={18} />

              <strong>
                Simulate decisions
              </strong>

              <span>
                Test changes before committing to them.
              </span>
            </div>

          </div>

          {/* SAVED GOALS CAN STILL BE OPENED */}

          {savedGoals.length > 0 && (
            <button
              className="goal-view-saved-empty-button"
              type="button"
              onClick={onOpenSavedGoals}
            >
              View your saved goals
              <ArrowRight size={17} />
            </button>
          )}

        </div>
      )}

      {/* =================================================
          FINANCIAL CAPACITY
      ================================================= */}

      {hasFinancialData && (
        <>

          <section className="goal-capacity-section">

            <div className="goal-section-heading">

              <div>
                <h2>
                  Your financial capacity
                </h2>

                <p>
                  Calculated from your imported transaction
                  history.
                </p>
              </div>

              {savedGoals.length > 0 && (
                <button
                  className="goal-section-link"
                  type="button"
                  onClick={onOpenSavedGoals}
                >
                  View all goals
                  <ArrowRight size={15} />
                </button>
              )}

            </div>

            <div className="goal-capacity-grid">

              <div className="goal-capacity-card">

                <span>
                  Average monthly income
                </span>

                <strong>
                  {formatCurrency(
                    capacity.averageIncome
                  )}
                </strong>

              </div>

              <div className="goal-capacity-card">

                <span>
                  Average monthly expenses
                </span>

                <strong>
                  {formatCurrency(
                    capacity.averageExpenses
                  )}
                </strong>

              </div>

              <div className="goal-capacity-card">

                <span>
                  Average monthly savings
                </span>

                <strong>
                  {formatCurrency(
                    capacity.monthlySavings
                  )}
                </strong>

              </div>

              <div className="goal-capacity-card">

                <span>
                  Current savings rate
                </span>

                <strong>
                  {capacity.savingsRate.toFixed(1)}%
                </strong>

              </div>

            </div>

          </section>

          {/* =================================================
              CREATE CARD
          ================================================= */}

          <div
            className="goal-create-card"
            onClick={onCreateGoal}
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" ||
                event.key === " "
              ) {
                event.preventDefault();
                onCreateGoal();
              }
            }}
          >

            <div className="goal-create-icon">
              <Plus size={23} />
            </div>

            <div className="goal-create-content">

              <h3>
                Create a new financial goal
              </h3>

              <p>
                Define what you want to achieve and
                when you want to achieve it.
              </p>

            </div>

            <div className="goal-arrow-button">
              <ArrowRight size={18} />
            </div>

          </div>

        </>
      )}

      {/* =================================================
          SAVED GOALS PREVIEW
      ================================================= */}

      {savedGoals.length > 0 && (
        <section className="saved-goals-section">

          <div className="goal-section-heading">

            <div>
              <h2>
                Your saved goals
              </h2>

              <p>
                Select a goal to view its plan or run a
                simulation.
              </p>
            </div>

            <button
              className="goal-section-link"
              type="button"
              onClick={onOpenSavedGoals}
            >
              View all
              <ArrowRight size={15} />
            </button>

          </div>

          <div className="saved-goals-grid">

            {savedGoals
              .slice(0, 3)
              .map((goal) => {

                const targetAmount =
                  Number(
                    goal.targetAmount
                  ) || 0;

                const currentAmount =
                  Number(
                    goal.currentAmount
                  ) || 0;

                const remainingAmount =
                  Math.max(
                    targetAmount -
                      currentAmount,
                    0
                  );

                const progress =
                  targetAmount > 0
                    ? Math.min(
                        (currentAmount /
                          targetAmount) *
                          100,
                        100
                      )
                    : 0;

                return (
                  <div
                    className="saved-goal-card"
                    key={goal.id}
                  >

                    <button
                      className="saved-goal-main"
                      type="button"
                      onClick={() =>
                        onSelectGoal(goal)
                      }
                    >

                      <div className="saved-goal-top">

                        <div className="saved-goal-icon">
                          <Target size={20} />
                        </div>

                        <ArrowRight size={17} />

                      </div>

                      <div className="saved-goal-name">
                        {goal.name}
                      </div>

                      <div className="saved-goal-amount">

                        <strong>
                          {formatCurrency(
                            currentAmount
                          )}
                        </strong>

                        <span>
                          of{" "}
                          {formatCurrency(
                            targetAmount
                          )}
                        </span>

                      </div>

                      <div className="saved-goal-progress">

                        <div
                          style={{
                            width: `${progress}%`,
                          }}
                        />

                      </div>

                      <div className="saved-goal-footer">

                        <span>
                          {Math.round(
                            progress
                          )}
                          % complete
                        </span>

                        <span>
                          {remainingAmount > 0
                            ? `${formatCurrency(
                                remainingAmount
                              )} remaining`
                            : "Completed"}
                        </span>

                      </div>

                      <div className="saved-goal-date">
                        Target:{" "}
                        {goal.targetDate}
                      </div>

                    </button>

                    {onDeleteGoal && (
                      <button
                        className="saved-goal-delete"
                        type="button"
                        title="Delete goal"
                        aria-label={`Delete ${goal.name}`}
                        onClick={(event) => {
                          event.stopPropagation();

                          onDeleteGoal(
                            goal.id
                          );
                        }}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}

                  </div>
                );
              })}

          </div>

          {/* MORE THAN 3 GOALS */}

          {savedGoals.length > 3 && (
            <button
              className="saved-goals-more-button"
              type="button"
              onClick={onOpenSavedGoals}
            >
              View all {savedGoals.length} saved goals
              <ArrowRight size={16} />
            </button>
          )}

        </section>
      )}

      {/* =================================================
          HOW FINPILOT WORKS
      ================================================= */}

      <section className="goals-how-section">

        <div className="goal-section-heading">

          <h2>
            How FinPilot works
          </h2>

          <p>
            Your goals are connected to your actual
            financial data.
          </p>

        </div>

        <div className="goals-how-grid">

          <div className="goals-how-card">

            <span>
              01
            </span>

            <h3>
              Create a goal
            </h3>

            <p>
              Set a target amount, current amount and
              target date.
            </p>

          </div>

          <div className="goals-how-card">

            <span>
              02
            </span>

            <h3>
              Build a plan
            </h3>

            <p>
              FinPilot compares your goal with your
              actual financial capacity.
            </p>

          </div>

          <div className="goals-how-card">

            <span>
              03
            </span>

            <h3>
              Simulate decisions
            </h3>

            <p>
              Change savings, income or expenses and
              see how the goal could change.
            </p>

          </div>

        </div>

      </section>

    </div>
  );
}

export default Goals;