import {
  ArrowLeft,
  Target,
  CalendarDays,
  Wallet,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";


function formatCurrency(value) {
  return `₹${Number(
    value || 0
  ).toLocaleString(
    "en-IN",
    {
      maximumFractionDigits: 0,
    }
  )}`;
}


/* =========================================
   MONTHLY FINANCIAL DATA
========================================= */

function calculateMonthlyFinancials(
  transactions = []
) {
  const months = {};

  transactions.forEach((transaction) => {
    const date = String(
      transaction.date || ""
    );

    if (!date) {
      return;
    }

    const month = date.slice(0, 7);

    if (!months[month]) {
      months[month] = {
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
      months[month].income += amount;
    }

    if (type === "expense") {
      months[month].expenses += amount;
    }
  });

  return Object.values(months);
}


/* =========================================
   GOAL CALCULATION
========================================= */

function calculatePlan(
  goal,
  transactions,
  summary
) {
  const monthly =
    calculateMonthlyFinancials(
      transactions
    );


  /*
   * Calculate average monthly income
   * and expenses from imported data.
   */

  const averageIncome =
    monthly.length > 0
      ? monthly.reduce(
          (total, month) =>
            total + month.income,
          0
        ) / monthly.length
      : Number(
          summary?.total_income
        ) || 0;


  const averageExpenses =
    monthly.length > 0
      ? monthly.reduce(
          (total, month) =>
            total + month.expenses,
          0
        ) / monthly.length
      : Number(
          summary?.total_expenses
        ) || 0;


  /* =================================
     CURRENT SAVINGS
  ================================= */

  const currentMonthlySavings =
    averageIncome -
    averageExpenses;


  /* =================================
     GOAL AMOUNTS
  ================================= */

  const currentAmount =
    Number(
      goal.currentAmount
    ) || 0;

  const targetAmount =
    Number(
      goal.targetAmount
    ) || 0;


  const remainingAmount =
    Math.max(
      0,
      targetAmount -
        currentAmount
    );


  /* =================================
     TARGET DATE
  ================================= */

  const today =
    new Date();

  const targetDate =
    new Date(
      `${goal.targetDate}T00:00:00`
    );


  /*
   * Calculate the number of months
   * between today and the goal date.
   */

  const monthsRemaining =
    Math.max(
      1,
      (
        (targetDate.getFullYear() -
          today.getFullYear()) *
          12
      ) +
        (
          targetDate.getMonth() -
          today.getMonth()
        )
    );


  /* =================================
     REQUIRED MONTHLY SAVING
  ================================= */

  const monthlyRequired =
    remainingAmount /
    monthsRemaining;


  /* =================================
     SAVINGS DIFFERENCE
  ================================= */

  const monthlyDifference =
    currentMonthlySavings -
    monthlyRequired;


  /* =================================
     SAVINGS RATES
  ================================= */

  const currentSavingsRate =
    averageIncome > 0
      ? (
          currentMonthlySavings /
          averageIncome
        ) * 100
      : 0;


  const requiredSavingsRate =
    averageIncome > 0
      ? (
          monthlyRequired /
          averageIncome
        ) * 100
      : 0;


  /* =================================
     GOAL SPENDING IMPACT
  ================================= */

  /*
   * How much of the user's current
   * monthly savings capacity would
   * be used to fund this goal.
   */

  const goalSavingsImpact =
    currentMonthlySavings > 0
      ? (
          monthlyRequired /
          currentMonthlySavings
        ) * 100
      : 0;


  /*
   * Savings remaining after the
   * required goal contribution.
   */

  const savingsAfterGoal =
    currentMonthlySavings -
    monthlyRequired;


  /*
   * Positive value means the goal
   * requires more than the current
   * monthly savings capacity.
   */

  const monthlyShortfall =
    Math.max(
      0,
      monthlyRequired -
        currentMonthlySavings
    );


  /*
   * Amount of current monthly savings
   * that can remain after funding goal.
   */

  const remainingSavingsCapacity =
    Math.max(
      0,
      currentMonthlySavings -
        monthlyRequired
    );


  /* =================================
     GOAL STATUS
  ================================= */

  let status =
    "needs-adjustment";


  if (
    remainingAmount <= 0
  ) {
    status = "completed";
  } else if (
    currentMonthlySavings >=
    monthlyRequired
  ) {
    status = "on-track";
  }


  return {
    averageIncome,

    averageExpenses,

    currentMonthlySavings,

    remainingAmount,

    monthsRemaining,

    monthlyRequired,

    monthlyDifference,

    currentSavingsRate,

    requiredSavingsRate,

    goalSavingsImpact,

    savingsAfterGoal,

    monthlyShortfall,

    remainingSavingsCapacity,

    status,
  };
}


/* =========================================
   GOAL PLAN PAGE
========================================= */

function GoalPlan({
  goal,
  transactions = [],
  summary = {},
  onBack,
  onSimulator,
}) {

  /* =================================
     NO GOAL
  ================================= */

  if (!goal) {
    return (
      <section className="goal-plan-page">

        <div className="goal-plan-empty">

          <Target size={32} />

          <h2>
            No goal selected.
          </h2>

          <button
            onClick={onBack}
            className="goal-submit-button"
          >
            Back to goals
          </button>

        </div>

      </section>
    );
  }


  /* =================================
     CALCULATE PLAN
  ================================= */

  const plan =
    calculatePlan(
      goal,
      transactions,
      summary
    );


  /* =================================
     FORMAT TARGET DATE
  ================================= */

  const formattedDate =
    new Date(
      `${goal.targetDate}T00:00:00`
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );


  /* =================================
     STATUS CONTENT
  ================================= */

  const statusCopy = {
    completed: {
      title:
        "You've already reached this goal.",

      description:
        "Your current amount covers the target.",
    },

    "on-track": {
      title:
        "This goal fits your current savings capacity.",

      description:
        "Your current monthly savings are enough to stay on track.",
    },

    "needs-adjustment": {
      title:
        "This goal needs a little adjustment.",

      description:
        "The required monthly saving is higher than your current savings capacity.",
    },
  };


  const currentStatus =
    statusCopy[plan.status];


  /* =================================
     PROGRESS PERCENTAGE
  ================================= */

  const progressPercentage =
    plan.monthlyRequired > 0
      ? Math.min(
          100,
          (
            plan.currentMonthlySavings /
            plan.monthlyRequired
          ) * 100
        )
      : 100;


  /* =================================
     GOAL IMPACT PERCENTAGE
  ================================= */

  const impactPercentage =
    Math.max(
      0,
      Math.round(
        plan.goalSavingsImpact
      )
    );


  return (
    <section className="goal-plan-page">

      {/* =================================
          BACK
      ================================= */}

      <button
        className="back-button"
        onClick={onBack}
      >
        <ArrowLeft size={18} />
        Back to goals
      </button>


      {/* =================================
          HEADER
      ================================= */}

      <div className="goal-plan-header">

        <div>

          <span className="eyebrow">
            GOAL PLAN
          </span>

          <h1>
            {goal.name}
          </h1>

          <p>
            A projection based on your
            imported financial history.
          </p>

        </div>


        <div
          className={`goal-status ${plan.status}`}
        >

          {plan.status ===
            "completed" ? (
            <CheckCircle2 size={18} />
          ) : plan.status ===
            "on-track" ? (
            <TrendingUp size={18} />
          ) : (
            <AlertCircle size={18} />
          )}

          <span>
            {plan.status ===
              "completed"
              ? "Completed"
              : plan.status ===
                "on-track"
              ? "On track"
              : "Needs adjustment"}
          </span>

        </div>

      </div>


      {/* =================================
          TARGET SUMMARY
      ================================= */}

      <div className="goal-target-card">

        <div className="goal-target-icon">
          <Target size={24} />
        </div>


        <div>

          <span>
            Target amount
          </span>

          <strong>
            {formatCurrency(
              goal.targetAmount
            )}
          </strong>

        </div>


        <div className="goal-target-divider" />


        <div>

          <span>
            Already saved
          </span>

          <strong>
            {formatCurrency(
              goal.currentAmount
            )}
          </strong>

        </div>


        <div className="goal-target-divider" />


        <div>

          <span>
            Target date
          </span>

          <strong>
            {formattedDate}
          </strong>

        </div>

      </div>


      {/* =================================
          STATUS MESSAGE
      ================================= */}

      <div
        className={`goal-plan-status ${plan.status}`}
      >

        {plan.status ===
          "completed" ? (
          <CheckCircle2 size={22} />
        ) : plan.status ===
          "on-track" ? (
          <TrendingUp size={22} />
        ) : (
          <AlertCircle size={22} />
        )}


        <div>

          <strong>
            {currentStatus.title}
          </strong>

          <p>
            {currentStatus.description}
          </p>

        </div>

      </div>


      {/* =================================
          CORE NUMBERS
      ================================= */}

      <div className="goal-plan-grid">

        {/* AMOUNT REMAINING */}

        <div className="goal-plan-card">

          <div className="goal-plan-card-icon">
            <Wallet size={19} />
          </div>

          <span>
            Amount remaining
          </span>

          <strong>
            {formatCurrency(
              plan.remainingAmount
            )}
          </strong>

        </div>


        {/* MONTHS REMAINING */}

        <div className="goal-plan-card">

          <div className="goal-plan-card-icon">
            <CalendarDays size={19} />
          </div>

          <span>
            Months remaining
          </span>

          <strong>
            {plan.monthsRemaining}
          </strong>

        </div>


        {/* REQUIRED SAVINGS */}

        <div className="goal-plan-card highlight">

          <div className="goal-plan-card-icon">
            <Target size={19} />
          </div>

          <span>
            Required monthly saving
          </span>

          <strong>
            {formatCurrency(
              plan.monthlyRequired
            )}
          </strong>

        </div>


        {/* CURRENT SAVINGS */}

        <div className="goal-plan-card">

          <div className="goal-plan-card-icon">
            <TrendingUp size={19} />
          </div>

          <span>
            Current monthly saving
          </span>

          <strong>
            {formatCurrency(
              plan.currentMonthlySavings
            )}
          </strong>

        </div>

      </div>


      {/* =================================
          SAVINGS CAPACITY COMPARISON
      ================================= */}

      <section className="goal-comparison">

        <div>

          <span className="eyebrow">
            SAVINGS CAPACITY
          </span>

          <h2>
            Required vs current.
          </h2>

          <p>
            This comparison shows whether your
            current financial behavior can support
            the goal within the selected timeline.
          </p>

        </div>


        <div className="goal-comparison-values">

          <div>

            <span>
              Current savings
            </span>

            <strong>
              {formatCurrency(
                plan.currentMonthlySavings
              )}

              <small>
                / month
              </small>
            </strong>

          </div>


          <div className="goal-comparison-arrow">
            →
          </div>


          <div>

            <span>
              Required savings
            </span>

            <strong>
              {formatCurrency(
                plan.monthlyRequired
              )}

              <small>
                / month
              </small>
            </strong>

          </div>

        </div>


        {/* PROGRESS BAR */}

        <div className="goal-comparison-bar">

          <div
            className="goal-comparison-progress"
            style={{
              width: `${progressPercentage}%`,
            }}
          />

        </div>


        {/* SHORTFALL */}

        {plan.status ===
          "needs-adjustment" && (

          <div className="goal-shortfall">

            <AlertCircle size={18} />

            <span>

              You need approximately{" "}

              <strong>
                {formatCurrency(
                  Math.abs(
                    plan.monthlyDifference
                  )
                )}
              </strong>{" "}

              more savings each month
              to reach this goal on time.

            </span>

          </div>

        )}

      </section>


      {/* =================================
          GOAL SPENDING IMPACT
      ================================= */}

      <section className="goal-impact-section">

        <div className="goal-impact-header">

          <div>

            <span className="eyebrow">
              GOAL IMPACT
            </span>

            <h2>
              What this goal means for your monthly finances.
            </h2>

            <p>
              FinPilot compares the amount needed for
              this goal with your current monthly savings
              capacity.
            </p>

          </div>

          <div className="goal-impact-percentage">

            <strong>
              {impactPercentage}%
            </strong>

            <span>
              of current savings
            </span>

          </div>

        </div>


        <div className="goal-impact-grid">

          {/* REQUIRED CONTRIBUTION */}

          <div className="goal-impact-card">

            <span>
              Goal contribution
            </span>

            <strong>
              {formatCurrency(
                plan.monthlyRequired
              )}
            </strong>

            <small>
              required each month
            </small>

          </div>


          {/* CURRENT CAPACITY */}

          <div className="goal-impact-card">

            <span>
              Current savings capacity
            </span>

            <strong>
              {formatCurrency(
                plan.currentMonthlySavings
              )}
            </strong>

            <small>
              available each month
            </small>

          </div>


          {/* REMAINING */}

          <div className="goal-impact-card">

            <span>
              Savings after goal
            </span>

            <strong>
              {formatCurrency(
                plan.savingsAfterGoal
              )}
            </strong>

            <small>
              monthly capacity remaining
            </small>

          </div>

        </div>


        {/* IMPACT BAR */}

        <div className="goal-impact-bar-wrapper">

          <div className="goal-impact-bar-labels">

            <span>
              Current savings capacity
            </span>

            <span>
              {formatCurrency(
                plan.currentMonthlySavings
              )}
            </span>

          </div>


          <div className="goal-impact-bar">

            <div
              className="goal-impact-progress"
              style={{
                width: `${Math.min(
                  100,
                  impactPercentage
                )}%`,
              }}
            />

          </div>


          <div className="goal-impact-bar-labels">

            <span>
              Goal contribution
            </span>

            <span>
              {formatCurrency(
                plan.monthlyRequired
              )}
            </span>

          </div>

        </div>


        {/* IMPACT EXPLANATION */}

        {plan.status ===
          "completed" ? (

          <div className="goal-impact-message positive">

            <CheckCircle2 size={19} />

            <div>

              <strong>
                Your goal is already funded.
              </strong>

              <p>
                You currently have enough saved to
                cover the target amount.
              </p>

            </div>

          </div>

        ) : plan.status ===
          "on-track" ? (

          <div className="goal-impact-message positive">

            <CheckCircle2 size={19} />

            <div>

              <strong>
                This goal fits within your current savings capacity.
              </strong>

              <p>
                After setting aside approximately{" "}
                <strong>
                  {formatCurrency(
                    plan.monthlyRequired
                  )}
                </strong>{" "}
                each month, you would have approximately{" "}
                <strong>
                  {formatCurrency(
                    plan.remainingSavingsCapacity
                  )}
                </strong>{" "}
                of monthly savings capacity left.
              </p>

            </div>

          </div>

        ) : (

          <div className="goal-impact-message warning">

            <AlertCircle size={19} />

            <div>

              <strong>
                This goal currently exceeds your savings capacity.
              </strong>

              <p>
                You would need approximately{" "}
                <strong>
                  {formatCurrency(
                    plan.monthlyShortfall
                  )}
                </strong>{" "}
                more each month to fund this goal
                within the selected timeline.
              </p>

            </div>

          </div>

        )}

      </section>


      {/* =================================
          FINANCIAL CONTEXT
      ================================= */}

      <section className="goal-financial-context">

        <div>

          <span className="eyebrow">
            FINANCIAL CONTEXT
          </span>

          <h2>
            Your current position.
          </h2>

        </div>


        <div className="goal-context-grid">

          {/* INCOME */}

          <div>

            <span>
              Average monthly income
            </span>

            <strong>
              {formatCurrency(
                plan.averageIncome
              )}
            </strong>

          </div>


          {/* EXPENSES */}

          <div>

            <span>
              Average monthly expenses
            </span>

            <strong>
              {formatCurrency(
                plan.averageExpenses
              )}
            </strong>

          </div>


          {/* CURRENT RATE */}

          <div>

            <span>
              Current savings rate
            </span>

            <strong>
              {plan.currentSavingsRate.toFixed(
                1
              )}
              %
            </strong>

          </div>


          {/* REQUIRED RATE */}

          <div>

            <span>
              Required savings rate
            </span>

            <strong>
              {plan.requiredSavingsRate.toFixed(
                1
              )}
              %
            </strong>

          </div>

        </div>

      </section>


      {/* =================================
          NEXT STEP
      ================================= */}

      <section className="goal-plan-next">

        <div>

          <span className="eyebrow">
            NEXT STEP
          </span>

          <h2>
            Want to explore different paths?
          </h2>

          <p>
            Use the FinPilot Simulator to test
            changes such as reducing a spending
            category, increasing income, or making
            a large purchase and see how the goal
            projection changes.
          </p>

        </div>


        <button
          className="goal-arrow-button"
          onClick={onSimulator}
        >
          Open simulator
          <ArrowRight size={18} />
        </button>

      </section>

    </section>
  );
}


export default GoalPlan;