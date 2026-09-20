import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Calculator,
  Target,
  CheckCircle2,
  AlertCircle,
  Save,
  TrendingDown,
  Trash2,
} from "lucide-react";

function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
  })}`;
}

/* =========================================
   MONTHLY FINANCIAL DATA
========================================= */

function calculateFinancialData(
  transactions = [],
  summary = {}
) {
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
    } else if (type === "expense") {
      months[key].expenses += amount;
    }
  });

  const monthlyValues =
    Object.values(months);

  const averageIncome =
    monthlyValues.length > 0
      ? monthlyValues.reduce(
          (total, month) =>
            total + month.income,
          0
        ) / monthlyValues.length
      : Number(summary?.total_income) || 0;

  const averageExpenses =
    monthlyValues.length > 0
      ? monthlyValues.reduce(
          (total, month) =>
            total + month.expenses,
          0
        ) / monthlyValues.length
      : Number(summary?.total_expenses) || 0;

  const currentSavings =
    averageIncome - averageExpenses;

  return {
    averageIncome,
    averageExpenses,
    currentSavings,
  };
}

/* =========================================
   CATEGORY SPENDING
========================================= */

function calculateCategorySpending(
  transactions = []
) {
  const categories = {};

  transactions.forEach((transaction) => {
    const type = String(
      transaction.transaction_type || ""
    ).toLowerCase();

    if (type !== "expense") {
      return;
    }

    const category =
      String(
        transaction.category || "Other"
      ).trim() || "Other";

    const amount =
      Number(transaction.amount) || 0;

    if (amount <= 0) {
      return;
    }

    categories[category] =
      (categories[category] || 0) +
      amount;
  });

  return categories;
}

/* =========================================
   SIMULATOR
========================================= */

function Simulator({
  goal,
  transactions = [],
  summary = {},
  onBack,
}) {
  const [monthlySaving, setMonthlySaving] =
    useState("");

  const [extraExpense, setExtraExpense] =
    useState("");

  const [extraIncome, setExtraIncome] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [reductionPercentage, setReductionPercentage] =
    useState("");

  const [saved, setSaved] =
    useState(false);

  const [selectedSimulationId, setSelectedSimulationId] =
    useState(null);

  const [savedSimulations, setSavedSimulations] =
    useState(() => {
      try {
        const stored =
          localStorage.getItem(
            "finpilotSimulations"
          );

        if (!stored) {
          return [];
        }

        const parsed =
          JSON.parse(stored);

        return Array.isArray(parsed)
          ? parsed
          : [];
      } catch (error) {
        console.error(
          "Unable to load saved simulations:",
          error
        );

        return [];
      }
    });

  /* =========================================
     INPUT HANDLER
  ========================================= */

  const handleSimulationChange =
    (setter) => (event) => {
      setSaved(false);
      setSelectedSimulationId(null);
      setter(event.target.value);
    };

  /* =========================================
     FINANCIAL DATA
  ========================================= */

  const financialData = useMemo(() => {
    return calculateFinancialData(
      transactions,
      summary
    );
  }, [transactions, summary]);

  /* =========================================
     CATEGORY DATA
  ========================================= */

  const categorySpending = useMemo(() => {
    return calculateCategorySpending(
      transactions
    );
  }, [transactions]);

  const categories = useMemo(() => {
    return Object.keys(
      categorySpending
    ).sort((a, b) => {
      return (
        categorySpending[b] -
        categorySpending[a]
      );
    });
  }, [categorySpending]);

  /* =========================================
     CATEGORY REDUCTION
  ========================================= */

  const categoryReduction = useMemo(() => {
    if (!selectedCategory) {
      return {
        spending: 0,
        percentage: 0,
        savings: 0,
        monthlySavings: 0,
      };
    }

    const spending =
      Number(
        categorySpending[
          selectedCategory
        ]
      ) || 0;

    const percentage = Math.min(
      Math.max(
        Number(
          reductionPercentage
        ) || 0,
        0
      ),
      100
    );

    const savings =
      spending *
      (percentage / 100);

    const datedTransactions =
      transactions.filter(
        (transaction) =>
          transaction.date
      );

    const monthKeys =
      new Set(
        datedTransactions.map(
          (transaction) => {
            const date =
              new Date(
                transaction.date
              );

            if (
              Number.isNaN(
                date.getTime()
              )
            ) {
              return null;
            }

            return `${date.getFullYear()}-${String(
              date.getMonth() + 1
            ).padStart(2, "0")}`;
          }
        )
      );

    monthKeys.delete(null);

    const monthCount =
      Math.max(
        monthKeys.size,
        1
      );

    const monthlySavings =
      savings / monthCount;

    return {
      spending,
      percentage,
      savings,
      monthlySavings,
    };
  }, [
    selectedCategory,
    reductionPercentage,
    categorySpending,
    transactions,
  ]);

  /* =========================================
     SIMULATION
  ========================================= */

  const simulation = useMemo(() => {
    if (!goal) {
      return null;
    }

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

    const baseSaving =
      monthlySaving === ""
        ? financialData.currentSavings
        : Number(
            monthlySaving
          ) || 0;

    const additionalIncome =
      Number(
        extraIncome
      ) || 0;

    const additionalExpense =
      Number(
        extraExpense
      ) || 0;

    const categorySavings =
      Number(
        categoryReduction.monthlySavings
      ) || 0;

    const simulatedMonthlySaving =
      baseSaving +
      additionalIncome +
      categorySavings -
      additionalExpense;

    const monthsNeeded =
      simulatedMonthlySaving > 0
        ? Math.ceil(
            remainingAmount /
              simulatedMonthlySaving
          )
        : null;

    const targetDate =
      new Date(
        `${goal.targetDate}T00:00:00`
      );

    const now =
      new Date();

    let monthsAvailable = 0;

    if (
      !Number.isNaN(
        targetDate.getTime()
      )
    ) {
      monthsAvailable =
        (
          targetDate.getFullYear() -
          now.getFullYear()
        ) *
          12 +
        (
          targetDate.getMonth() -
          now.getMonth()
        );

      monthsAvailable =
        Math.max(
          monthsAvailable,
          0
        );
    }

    const requiredMonthlySaving =
      monthsAvailable > 0
        ? remainingAmount /
          monthsAvailable
        : remainingAmount;

    const projectedAmount =
      currentAmount +
      simulatedMonthlySaving *
        monthsAvailable;

    const onTrack =
      remainingAmount <= 0 ||
      (
        monthsAvailable > 0 &&
        projectedAmount >=
          targetAmount
      );

    return {
      targetAmount,
      currentAmount,
      remainingAmount,
      simulatedMonthlySaving,
      monthsNeeded,
      monthsAvailable,
      requiredMonthlySaving,
      projectedAmount,
      onTrack,
      categorySavings,
    };
  }, [
    goal,
    financialData.currentSavings,
    monthlySaving,
    extraExpense,
    extraIncome,
    categoryReduction.monthlySavings,
  ]);

  /* =========================================
     SAVE SIMULATION
  ========================================= */

  const handleSaveSimulation = () => {
    if (
      !simulation ||
      !goal
    ) {
      return;
    }

    let existing = [];

    try {
      const stored =
        localStorage.getItem(
          "finpilotSimulations"
        );

      if (stored) {
        const parsed =
          JSON.parse(stored);

        if (
          Array.isArray(parsed)
        ) {
          existing = parsed;
        }
      }
    } catch (error) {
      console.error(
        "Unable to load saved simulations:",
        error
      );
    }

    const simulationRecord = {
      id: `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`,

      goalId:
        goal.id ||
        goal.name,

      goalName:
        goal.name,

      createdAt:
        new Date().toISOString(),

      baseMonthlySaving:
        monthlySaving === ""
          ? financialData.currentSavings
          : Number(
              monthlySaving
            ) || 0,

      monthlySaving:
        simulation.simulatedMonthlySaving,

      additionalIncome:
        Number(
          extraIncome
        ) || 0,

      additionalExpense:
        Number(
          extraExpense
        ) || 0,

      selectedCategory:
        selectedCategory || null,

      reductionPercentage:
        categoryReduction.percentage,

      categoryMonthlySpending:
        categoryReduction.spending,

      categorySavings:
        categoryReduction.monthlySavings,

      targetAmount:
        simulation.targetAmount,

      currentAmount:
        simulation.currentAmount,

      remainingAmount:
        simulation.remainingAmount,

      monthsAvailable:
        simulation.monthsAvailable,

      monthsNeeded:
        simulation.monthsNeeded,

      requiredMonthlySaving:
        simulation.requiredMonthlySaving,

      projectedAmount:
        simulation.projectedAmount,

      onTrack:
        simulation.onTrack,
    };

    const updatedSimulations = [
      simulationRecord,
      ...existing,
    ];

    try {
      localStorage.setItem(
        "finpilotSimulations",
        JSON.stringify(
          updatedSimulations
        )
      );

      setSavedSimulations(
        updatedSimulations
      );

      setSelectedSimulationId(
        simulationRecord.id
      );

      setSaved(true);
    } catch (error) {
      console.error(
        "Unable to save simulation:",
        error
      );

      alert(
        "Unable to save this simulation."
      );
    }
  };

  /* =========================================
     LOAD SAVED SIMULATION
  ========================================= */

  const handleLoadSimulation = (
    savedSimulation
  ) => {
    if (!savedSimulation) {
      return;
    }

    setSelectedSimulationId(
      savedSimulation.id
    );

    /*
     * Restore the exact assumptions
     * used when the scenario was saved.
     */

    setMonthlySaving(
      savedSimulation.baseMonthlySaving !==
        undefined
        ? String(
            savedSimulation.baseMonthlySaving
          )
        : ""
    );

    setExtraIncome(
      String(
        savedSimulation.additionalIncome ||
          0
      )
    );

    setExtraExpense(
      String(
        savedSimulation.additionalExpense ||
          0
      )
    );

    setSelectedCategory(
      savedSimulation.selectedCategory ||
        ""
    );

    setReductionPercentage(
      savedSimulation.reductionPercentage !==
        undefined
        ? String(
            savedSimulation.reductionPercentage
          )
        : ""
    );

    setSaved(true);

    /*
     * Scroll back to the simulator
     * controls so the restored assumptions
     * are immediately visible.
     */

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================
     DELETE SAVED SIMULATION
  ========================================= */

  const handleDeleteSimulation = (
    event,
    simulationId
  ) => {
    event.stopPropagation();

    const updatedSimulations =
      savedSimulations.filter(
        (simulation) =>
          simulation.id !==
          simulationId
      );

    try {
      localStorage.setItem(
        "finpilotSimulations",
        JSON.stringify(
          updatedSimulations
        )
      );

      setSavedSimulations(
        updatedSimulations
      );

      if (
        selectedSimulationId ===
        simulationId
      ) {
        setSelectedSimulationId(
          null
        );

        setSaved(false);
      }
    } catch (error) {
      console.error(
        "Unable to delete simulation:",
        error
      );
    }
  };

  /* =========================================
     CURRENT GOAL SIMULATIONS
  ========================================= */

  const currentGoalSimulations =
    useMemo(() => {
      if (!goal) {
        return [];
      }

      const goalId =
        goal.id ||
        goal.name;

      return savedSimulations.filter(
        (simulation) =>
          simulation.goalId ===
          goalId
      );
    }, [
      savedSimulations,
      goal,
    ]);

  /* =========================================
     NO GOAL
  ========================================= */

  if (!goal) {
    return (
      <div className="simulator-page">

        <button
          className="back-button"
          onClick={onBack}
          type="button"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <div className="simulator-empty">

          <Calculator size={42} />

          <h2>
            No goal selected
          </h2>

          <p>
            Create or select a goal before
            running a financial simulation.
          </p>

        </div>

      </div>
    );
  }

  /* =========================================
     PROGRESS
  ========================================= */

  const progressPercentage =
    simulation.targetAmount > 0
      ? Math.max(
          0,
          Math.min(
            (
              simulation.projectedAmount /
              simulation.targetAmount
            ) * 100,
            100
          )
        )
      : 0;

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="simulator-page">

      <button
        className="back-button"
        onClick={onBack}
        type="button"
      >
        <ArrowLeft size={16} />
        Back to goal
      </button>


      {/* =====================================
          HEADER
      ===================================== */}

      <div className="simulator-header">

        <div>

          <span className="eyebrow">
            FINANCIAL SIMULATOR
          </span>

          <h1>
            What if?
          </h1>

          <p>
            Experiment with your income and
            spending to understand how your
            goal projection could change.
          </p>

        </div>

        <div className="simulator-icon">
          <Calculator size={26} />
        </div>

      </div>


      {/* =====================================
          GOAL SUMMARY
      ===================================== */}

      <div className="simulator-goal-card">

        <div className="simulator-goal-icon">
          <Target size={24} />
        </div>

        <div>

          <span>
            Current goal
          </span>

          <strong>
            {goal.name}
          </strong>

        </div>

        <div className="simulator-goal-value">

          <span>
            Target
          </span>

          <strong>
            {formatCurrency(
              goal.targetAmount
            )}
          </strong>

        </div>

      </div>


      {/* =====================================
          CURRENT POSITION
      ===================================== */}

      <div className="simulator-section">

        <div className="simulator-section-heading">

          <h2>
            Your current position
          </h2>

          <p>
            Based on your imported transaction
            history.
          </p>

        </div>

        <div className="simulator-stat-grid">

          <div className="simulator-stat-card">

            <span>
              Average income
            </span>

            <strong>
              {formatCurrency(
                financialData.averageIncome
              )}
            </strong>

          </div>

          <div className="simulator-stat-card">

            <span>
              Average expenses
            </span>

            <strong>
              {formatCurrency(
                financialData.averageExpenses
              )}
            </strong>

          </div>

          <div className="simulator-stat-card">

            <span>
              Current monthly savings
            </span>

            <strong>
              {formatCurrency(
                financialData.currentSavings
              )}
            </strong>

          </div>

        </div>

      </div>


      {/* =====================================
          MAIN GRID
      ===================================== */}

      <div className="simulator-main-grid">

        {/* ===================================
            CONTROLS
        =================================== */}

        <div className="simulator-controls">

          <div className="simulator-section-heading">

            <h2>
              Change your assumptions
            </h2>

            <p>
              Adjust one or more values and
              see the impact on your goal.
            </p>

          </div>


          {/* MONTHLY SAVINGS */}

          <div className="simulator-field">

            <label>
              Monthly savings
            </label>

            <p>
              Leave empty to use your
              current average.
            </p>

            <div className="simulator-input">

              <span>
                ₹
              </span>

              <input
                type="number"
                min="0"
                value={
                  monthlySaving
                }
                onChange={handleSimulationChange(
                  setMonthlySaving
                )}
                placeholder={Math.round(
                  financialData.currentSavings
                )}
              />

            </div>

          </div>


          {/* CATEGORY REDUCTION */}

          <div className="simulator-category-section">

            <div className="simulator-category-heading">

              <div>

                <label>
                  Reduce spending
                </label>

                <p>
                  Model savings by reducing
                  one spending category.
                </p>

              </div>

              <TrendingDown
                size={18}
              />

            </div>


            <div className="simulator-field">

              <label>
                Spending category
              </label>

              <div className="simulator-input">

                <select
                  value={
                    selectedCategory
                  }
                  onChange={(event) => {
                    setSaved(false);
                    setSelectedSimulationId(
                      null
                    );
                    setSelectedCategory(
                      event.target.value
                    );
                    setReductionPercentage(
                      ""
                    );
                  }}
                >

                  <option value="">
                    Select a category
                  </option>

                  {categories.map(
                    (category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    )
                  )}

                </select>

              </div>

            </div>


            {selectedCategory && (
              <>

                <div className="simulator-category-info">

                  <span>
                    Recorded{" "}
                    {selectedCategory} spending
                  </span>

                  <strong>
                    {formatCurrency(
                      categoryReduction.spending
                    )}
                  </strong>

                </div>


                <div className="simulator-field">

                  <label>
                    Reduction percentage
                  </label>

                  <p>
                    Choose how much of this
                    spending you want to reduce.
                  </p>

                  <div className="simulator-input">

                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={
                        reductionPercentage
                      }
                      onChange={handleSimulationChange(
                        setReductionPercentage
                      )}
                      placeholder="15"
                    />

                    <span>
                      %
                    </span>

                  </div>

                </div>


                <div className="simulator-category-impact">

                  <span>
                    Estimated additional
                    monthly savings
                  </span>

                  <strong>
                    {formatCurrency(
                      categoryReduction.monthlySavings
                    )}
                  </strong>

                  <small>
                    Based on your uploaded
                    transaction history.
                  </small>

                </div>

              </>
            )}

          </div>


          {/* EXTRA INCOME */}

          <div className="simulator-field">

            <label>
              Additional monthly income
            </label>

            <p>
              Example: freelance work or
              part-time income.
            </p>

            <div className="simulator-input">

              <span>
                ₹
              </span>

              <input
                type="number"
                min="0"
                value={
                  extraIncome
                }
                onChange={handleSimulationChange(
                  setExtraIncome
                )}
                placeholder="0"
              />

            </div>

          </div>


          {/* EXTRA EXPENSE */}

          <div className="simulator-field">

            <label>
              Additional monthly expense
            </label>

            <p>
              Example: subscriptions,
              shopping or other planned
              spending.
            </p>

            <div className="simulator-input">

              <span>
                ₹
              </span>

              <input
                type="number"
                min="0"
                value={
                  extraExpense
                }
                onChange={handleSimulationChange(
                  setExtraExpense
                )}
                placeholder="0"
              />

            </div>

          </div>

        </div>


        {/* ===================================
            RESULT
        =================================== */}

        <div className="simulator-result">

          <div className="simulator-result-header">

            <div>

              <span>
                SIMULATION RESULT
              </span>

              <h2>
                {simulation.onTrack
                  ? "Projection reaches the target"
                  : "Projection falls short of the target"}
              </h2>

            </div>

            {simulation.onTrack ? (
              <CheckCircle2
                size={28}
              />
            ) : (
              <AlertCircle
                size={28}
              />
            )}

          </div>


          <div className="simulation-big-number">

            <span>
              Simulated monthly saving
            </span>

            <strong>
              {formatCurrency(
                simulation.simulatedMonthlySaving
              )}
            </strong>

          </div>


          {simulation.categorySavings >
            0 && (
            <div className="simulation-category-result">

              <TrendingDown
                size={17}
              />

              <span>
                Category reduction adds{" "}
                <strong>
                  {formatCurrency(
                    simulation.categorySavings
                  )}
                </strong>{" "}
                per month to your savings
                projection.
              </span>

            </div>
          )}


          <div className="simulation-result-list">

            <div>

              <span>
                Remaining amount
              </span>

              <strong>
                {formatCurrency(
                  simulation.remainingAmount
                )}
              </strong>

            </div>

            <div>

              <span>
                Months available
              </span>

              <strong>
                {simulation.monthsAvailable}
              </strong>

            </div>

            <div>

              <span>
                Months needed
              </span>

              <strong>
                {simulation.monthsNeeded ===
                null
                  ? "Not achievable"
                  : simulation.monthsNeeded}
              </strong>

            </div>

            <div>

              <span>
                Projected amount
              </span>

              <strong>
                {formatCurrency(
                  simulation.projectedAmount
                )}
              </strong>

            </div>

          </div>


          <div className="simulation-progress">

            <div
              style={{
                width: `${progressPercentage}%`,
              }}
            />

          </div>


          <p className="simulation-explanation">

            You need approximately{" "}

            <strong>
              {formatCurrency(
                simulation.requiredMonthlySaving
              )}
            </strong>{" "}

            per month to reach the target
            within the selected timeframe.

          </p>


          <button
            className="simulation-save-button"
            onClick={
              handleSaveSimulation
            }
            type="button"
          >

            <Save size={16} />

            {saved
              ? "Simulation Saved"
              : "Save Simulation"}

          </button>

        </div>

      </div>


      {/* =====================================
          SAVED SCENARIOS
      ===================================== */}

      {currentGoalSimulations.length > 0 && (
        <section className="saved-simulations-section">

          <div className="simulator-section-heading">

            <span className="eyebrow">
              SAVED SCENARIOS
            </span>

            <h2>
              Your saved simulations
            </h2>

            <p>
              Previous what-if projections
              for this goal.
            </p>

          </div>


          <div className="saved-simulations-list">

            {currentGoalSimulations.map(
              (savedSimulation) => {

                const isSelected =
                  selectedSimulationId ===
                  savedSimulation.id;

                return (
                  <div
                    className={`saved-simulation-card ${
                      isSelected
                        ? "selected"
                        : ""
                    }`}
                    key={
                      savedSimulation.id
                    }
                    onClick={() =>
                      handleLoadSimulation(
                        savedSimulation
                      )
                    }
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (
                        event.key ===
                          "Enter" ||
                        event.key ===
                          " "
                      ) {
                        event.preventDefault();

                        handleLoadSimulation(
                          savedSimulation
                        );
                      }
                    }}
                  >

                    <div className="saved-simulation-main">

                      <div className="saved-simulation-icon">

                        {savedSimulation.onTrack ? (
                          <CheckCircle2
                            size={18}
                          />
                        ) : (
                          <AlertCircle
                            size={18}
                          />
                        )}

                      </div>

                      <div>
  <strong>
    {savedSimulation.selectedCategory
      ? `${savedSimulation.selectedCategory} — ${savedSimulation.reductionPercentage}% reduction`
      : "Base projection"}
  </strong>

  <span className="saved-simulation-goal">
    Goal: {savedSimulation.goalName}
  </span>

  <span>
    Saved{" "}
    {new Date(
      savedSimulation.createdAt
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    )}
  </span>
</div>

                    </div>


                    <div className="saved-simulation-values">

                      <div>

                        <span>
                          Monthly saving
                        </span>

                        <strong>
                          {formatCurrency(
                            savedSimulation.monthlySaving
                          )}
                        </strong>

                      </div>

                      <div>

                        <span>
                          Projected amount
                        </span>

                        <strong>
                          {formatCurrency(
                            savedSimulation.projectedAmount
                          )}
                        </strong>

                      </div>

                      <div>

                        <span>
                          Months needed
                        </span>

                        <strong>
                          {savedSimulation.monthsNeeded ===
                          null
                            ? "—"
                            : savedSimulation.monthsNeeded}
                        </strong>

                      </div>

                    </div>


                    <button
                      className="saved-simulation-delete"
                      type="button"
                      onClick={(event) =>
                        handleDeleteSimulation(
                          event,
                          savedSimulation.id
                        )
                      }
                      aria-label="Delete saved simulation"
                      title="Delete simulation"
                    >

                      <Trash2
                        size={16}
                      />

                    </button>

                  </div>
                );
              }
            )}

          </div>

        </section>
      )}

    </div>
  );
}

export default Simulator;