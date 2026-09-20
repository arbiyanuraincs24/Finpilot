import { useRef, useState } from "react";

import {
  ArrowDownRight,
  ArrowUpRight,
  Wallet,
  AlertCircle,
  X,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import SpendingChart from "../components/SpendingChart";
import RecentTransactions from "../components/RecentTransactions";

import Transactions from "./Transactions";
import Insights from "./Insights";
import Forecast from "./Forecast";
import Copilot from "./Copilot";
import Goals from "./Goals";
import SavedGoals from "./SavedGoals";
import CreateGoal from "./CreateGoal";
import GoalPlan from "./GoalPlan";
import Simulator from "./Simulator";
import Budgets from "./Budgets";
import Settings from "./Settings";
import {
  uploadCSV,
  getInsights,
  getForecast,
  getExpectations,
} from "../api";

function Dashboard({
  userName,
  onNameChange,
}) {
  /* =========================================
     PAGE STATE
  ========================================= */

  const [activePage, setActivePage] =
    useState("Overview");

  /* =========================================
     FINANCIAL DATA
  ========================================= */

  const [financialData, setFinancialData] =
    useState(null);

  const [insightsData, setInsightsData] =
    useState(null);

  const [forecastData, setForecastData] =
    useState(null);

  const [expectationsData, setExpectationsData] =
    useState(null);

  /* =========================================
     BUDGET STATE

     Budgets are loaded from localStorage.
  ========================================= */

  const budgets = (() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("finpilotBudgets") || "[]"
      );

      return Array.isArray(stored) ? stored : [];
    } catch (error) {
      console.error(
        "Unable to load budgets:",
        error
      );

      return [];
    }
  })();

  /* =========================================
     GOAL STATE

     Goals are loaded once when Dashboard
     initializes and stored in localStorage.
  ========================================= */

  const [savedGoals, setSavedGoals] = useState(() => {
    try {
      const storedGoals =
        localStorage.getItem("finpilotGoals");

      if (!storedGoals) {
        return [];
      }

      const parsedGoals =
        JSON.parse(storedGoals);

      return Array.isArray(parsedGoals)
        ? parsedGoals
        : [];
    } catch (error) {
      console.error(
        "Unable to load saved goals:",
        error
      );

      return [];
    }
  });

  const [selectedGoal, setSelectedGoal] =
    useState(null);

  /* =========================================
     UPLOAD STATE
  ========================================= */

  const [uploading, setUploading] =
    useState(false);

  const [validationError, setValidationError] =
    useState(null);

  const fileInputRef =
    useRef(null);

  /* =========================================
     UPLOAD HANDLER
  ========================================= */

  const handleUploadClick = () => {
    setValidationError(null);

    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    /*
      Clear previous validation errors
      when a new file is selected.
    */
    setValidationError(null);

    try {
      setUploading(true);

      const data =
        await uploadCSV(file);

      setFinancialData(data);

      const insights =
        await getInsights(
          data.transactions,
          data.summary
        );

      setInsightsData(insights);

      const forecast =
        await getForecast(
          data.transactions
        );

      setForecastData(forecast);

      const expectations =
        await getExpectations(
          data.transactions
        );

      setExpectationsData(
        expectations
      );

      console.log(
        "FinPilot backend response:",
        data
      );

      console.log(
        "FinPilot insights:",
        insights
      );

      console.log(
        "FinPilot forecast:",
        forecast
      );

      console.log(
        "FinPilot expectations:",
        expectations
      );
    } catch (error) {
      console.error(error);

      /*
        Handle structured CSV validation
        errors from the backend.
      */
      if (
        error?.type ===
        "CSV_VALIDATION_ERROR"
      ) {
        setValidationError(
          error.validation
        );

        return;
      }

      /*
        Keep normal errors as alerts.
      */
      alert(
        error.message ||
          "Unable to process the statement."
      );
    } finally {
      setUploading(false);

      event.target.value = "";
    }
  };

  /* =========================================
     CLOSE VALIDATION ERROR
  ========================================= */

  const handleCloseValidation = () => {
    setValidationError(null);
  };

  /* =========================================
     DATE FORMATTER
  ========================================= */

  const formatExpectedDate = (date) => {
    if (!date) {
      return "";
    }

    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
      }
    );
  };

  const summary =
    financialData?.summary;

  /* =========================================
     BUDGET CALCULATIONS
  ========================================= */

  const getBudgetSpending = (
    budgetCategory
  ) => {
    return (
      financialData?.transactions || []
    )
      .filter((transaction) => {
        return (
          String(
            transaction.transaction_type || ""
          ).toLowerCase() === "expense" &&
          String(
            transaction.category || ""
          ).toLowerCase() ===
            String(
              budgetCategory || ""
            ).toLowerCase()
        );
      })
      .reduce(
        (total, transaction) =>
          total +
          (Number(transaction.amount) || 0),
        0
      );
  };

  const totalBudget = budgets.reduce(
    (total, budget) =>
      total +
      (Number(budget.limit) || 0),
    0
  );

  const totalBudgetSpent = budgets.reduce(
    (total, budget) =>
      total +
      getBudgetSpending(
        budget.category
      ),
    0
  );

  const totalBudgetRemaining =
    totalBudget - totalBudgetSpent;

  /* =========================================
     GOAL HANDLERS
  ========================================= */

  const handleCreateGoal = () => {
    setActivePage("CreateGoal");
  };

  const handleGoalCreated = (goal) => {
    const savedGoal = {
      ...goal,

      id:
        goal.id ||
        `${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}`,

      createdAt:
        goal.createdAt ||
        new Date().toISOString(),
    };

    const updatedGoals = [
      savedGoal,
      ...savedGoals,
    ];

    setSavedGoals(updatedGoals);

    setSelectedGoal(savedGoal);

    localStorage.setItem(
      "finpilotGoals",
      JSON.stringify(updatedGoals)
    );

    setActivePage("SavedGoals");
  };

  const handleSelectGoal = (goal) => {
    setSelectedGoal(goal);

    setActivePage("GoalPlan");
  };

  const handleGoalUpdated = (
    updatedGoal
  ) => {
    const updatedGoals =
      savedGoals.map((goal) =>
        goal.id === updatedGoal.id
          ? updatedGoal
          : goal
      );

    setSavedGoals(updatedGoals);

    setSelectedGoal(updatedGoal);

    localStorage.setItem(
      "finpilotGoals",
      JSON.stringify(updatedGoals)
    );
  };

  const handleDeleteGoal = (
    goalId
  ) => {
    const updatedGoals =
      savedGoals.filter(
        (goal) =>
          goal.id !== goalId
      );

    setSavedGoals(updatedGoals);

    localStorage.setItem(
      "finpilotGoals",
      JSON.stringify(updatedGoals)
    );

    if (
      selectedGoal?.id === goalId
    ) {
      setSelectedGoal(null);
    }

    setActivePage("SavedGoals");
  };

  const handleGoalBack = () => {
    setActivePage("Goals");
  };

  const handleSavedGoalsBack = () => {
    setActivePage("Goals");
  };

  const handleSimulator = () => {
    setActivePage("Simulator");
  };

  const handleSimulatorBack = () => {
    setActivePage("GoalPlan");
  };

  /* =========================================
     SHARED SIDEBAR PROPS
  ========================================= */

  const sidebarProps = {
    activePage,
    setActivePage,
    onUpload: handleUploadClick,
  };

  

  /* =========================================
     TRANSACTIONS PAGE
  ========================================= */

  if (
    activePage ===
    "Transactions"
  ) {
    return (
      <div className="app-shell">

        <Sidebar
          {...sidebarProps}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{
            display: "none",
          }}
        />

        <main className="main-content">

          <Topbar userName={userName} />

          <Transactions
            transactions={
              financialData?.transactions ||
              []
            }
          />

        </main>

      </div>
    );
  }

  /* =========================================
     BUDGETS PAGE
  ========================================= */

  if (
    activePage ===
    "Budgets"
  ) {
    return (
      <div className="app-shell">

        <Sidebar
          {...sidebarProps}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{
            display: "none",
          }}
        />

        <main className="main-content">

          <Topbar userName={userName} />

          <Budgets
            transactions={
              financialData?.transactions ||
              []
            }
          />

        </main>

      </div>
    );
  }

  /* =========================================
     INSIGHTS PAGE
  ========================================= */

  if (
    activePage ===
    "Insights"
  ) {
    return (
      <div className="app-shell">

        <Sidebar
          {...sidebarProps}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{
            display: "none",
          }}
        />

        <main className="main-content">

          <Topbar userName={userName} />

          <Insights
            insights={
              insightsData?.insights ||
              []
            }

            actionItems={
              insightsData?.action_items ||
              []
            }

            monthlySummary={
              insightsData?.monthly_summary ||
              []
            }

            monthlyChanges={
              insightsData?.monthly_changes ||
              []
            }

            summary={
              financialData?.summary ||
              {}
            }
          />

        </main>

      </div>
    );
  }

  /* =========================================
     FORECAST PAGE
  ========================================= */

  if (
    activePage ===
    "Forecast"
  ) {
    return (
      <div className="app-shell">

        <Sidebar
          {...sidebarProps}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{
            display: "none",
          }}
        />

        <main className="main-content">

          <Topbar userName={userName} />

          <Forecast
            forecastData={
              forecastData
            }

            transactions={
              financialData?.transactions ||
              []
            }
          />

        </main>

      </div>
    );
  }

  /* =========================================
     COPILOT PAGE
  ========================================= */

  if (
    activePage ===
    "Copilot"
  ) {
    return (
      <div className="app-shell">

        <Sidebar
          {...sidebarProps}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{
            display: "none",
          }}
        />

        <main className="main-content">

          <Topbar userName={userName} />

          <Copilot
            transactions={
              financialData?.transactions ||
              []
            }

            summary={
              financialData?.summary ||
              {}
            }
          />

        </main>

      </div>
    );
  }

  /* =========================================
     GOALS PAGE
  ========================================= */

  if (
    activePage ===
    "Goals"
  ) {
    return (
      <div className="app-shell">

        <Sidebar
          {...sidebarProps}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{
            display: "none",
          }}
        />

        <main className="main-content">

          <Topbar userName={userName} />

          <Goals
            transactions={
              financialData?.transactions ||
              []
            }

            summary={
              financialData?.summary ||
              {}
            }

            savedGoals={
              savedGoals
            }

            onCreateGoal={
              handleCreateGoal
            }

            onSelectGoal={
              handleSelectGoal
            }

            onDeleteGoal={
              handleDeleteGoal
            }

            onOpenSavedGoals={() =>
              setActivePage(
                "SavedGoals"
              )
            }
          />

        </main>

      </div>
    );
  }

  /* =========================================
     SAVED GOALS PAGE
  ========================================= */

  if (
    activePage ===
    "SavedGoals"
  ) {
    return (
      <div className="app-shell">

        <Sidebar
          {...sidebarProps}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{
            display: "none",
          }}
        />

        <main className="main-content">

          <Topbar userName={userName} />

          <SavedGoals
            savedGoals={
              savedGoals
            }

            onCreateGoal={
              handleCreateGoal
            }

            onSelectGoal={
              handleSelectGoal
            }

            onDeleteGoal={
              handleDeleteGoal
            }

            onBack={
              handleSavedGoalsBack
            }
          />

        </main>

      </div>
    );
  }

  /* =========================================
     CREATE GOAL PAGE
  ========================================= */

  if (
    activePage ===
    "CreateGoal"
  ) {
    return (
      <div className="app-shell">

        <Sidebar
          {...sidebarProps}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{
            display: "none",
          }}
        />

        <main className="main-content">

          <Topbar userName={userName} />

          <CreateGoal
            onBack={
              handleGoalBack
            }

            onCreate={
              handleGoalCreated
            }
          />

        </main>

      </div>
    );
  }

  /* =========================================
     GOAL PLAN PAGE
  ========================================= */

  if (
    activePage ===
    "GoalPlan"
  ) {
    return (
      <div className="app-shell">

        <Sidebar
          {...sidebarProps}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{
            display: "none",
          }}
        />

        <main className="main-content">

          <Topbar userName={userName} />

          <GoalPlan
            goal={
              selectedGoal
            }

            transactions={
              financialData?.transactions ||
              []
            }

            summary={
              financialData?.summary ||
              {}
            }

            onBack={() =>
              setActivePage(
                "SavedGoals"
              )
            }

            onSimulator={
              handleSimulator
            }

            onUpdate={
              handleGoalUpdated
            }

            onDelete={() => {
              if (
                selectedGoal
              ) {
                handleDeleteGoal(
                  selectedGoal.id
                );
              }
            }}
          />

        </main>

      </div>
    );
  }

  /* =========================================
     SIMULATOR PAGE
  ========================================= */

  if (
    activePage ===
    "Simulator"
  ) {
    return (
      <div className="app-shell">

        <Sidebar
          {...sidebarProps}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{
            display: "none",
          }}
        />

        <main className="main-content">

          <Topbar userName={userName} />

          <Simulator
            goal={selectedGoal}
            transactions={
              financialData?.transactions ||
              []
            }
            summary={
              financialData?.summary ||
              {}
            }
            onBack={
              handleSimulatorBack
            }
          />

        </main>

      </div>
    );
  }
    /* =========================================
     SETTINGS PAGE
  ========================================= */

  if (
    activePage ===
    "settings"
  ) {
    return (
      <div className="app-shell">

        <Sidebar
          {...sidebarProps}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          style={{
            display: "none",
          }}
        />

        <main className="main-content">

          <Topbar
            userName={userName}
          />

          <Settings
            userName={userName}
            onNameChange={onNameChange}
          />

        </main>

      </div>
    );
  }
  /* =========================================
     OVERVIEW PAGE
  ========================================= */

  return (
    <div className="app-shell">

      <Sidebar
        {...sidebarProps}
      />

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        style={{
          display: "none",
        }}
      />

      <main className="main-content">

        <Topbar userName={userName} />

        <section className="dashboard">

          {/* =================================
              HERO SECTION
          ================================= */}

          <div className="hero-section">

            <div>

              <span className="eyebrow">
                FINANCIAL PULSE
              </span>

              <h1>
                Your money,
                <br />
                <span>
                  in perspective.
                </span>
              </h1>

              <p>
                A clear view of where your
                money is going, what is changing,
                and what comes next.
              </p>

            </div>

            <div className="health-score">

              <div className="score-ring">

                <strong>
                  {summary
                    ? "82"
                    : "—"}
                </strong>

                {summary && (
                  <span>
                    /100
                  </span>
                )}

              </div>

              <div>

                <span>
                  Financial health
                </span>

                <strong>
                  {summary
                    ? "Looking healthy"
                    : "Import a statement"}
                </strong>

              </div>

            </div>

          </div>

          {/* =================================
              UPLOAD STATUS
          ================================= */}

          {uploading && (
            <div className="upload-status">
              Processing your financial
              statement...
            </div>
          )}

          {/* =================================
              CSV VALIDATION ERRORS
          ================================= */}

          {validationError && (
  <div className="csv-validation-panel">

    <div className="csv-validation-header">

      <div className="csv-validation-title">

       <div className="csv-validation-icon" aria-hidden="true">
  <AlertCircle size={20} />
</div>

        <div>
          <h3>CSV validation failed</h3>

          <p>
            Please correct the following
            issues and upload the file again.
          </p>
        </div>

      </div>

      <button
        type="button"
        className="csv-validation-close"
        onClick={handleCloseValidation}
        aria-label="Close validation errors"
      >
        <X size={18} />
      </button>

    </div>

    <div className="csv-validation-summary">

      <div>
        <span>Total rows</span>
        <strong>{validationError.totalRows}</strong>
      </div>

      <div>
        <span>Valid rows</span>
        <strong>{validationError.validRows}</strong>
      </div>

      <div>
        <span>Invalid rows</span>
        <strong>{validationError.invalidRows}</strong>
      </div>

      <div>
        <span>Duplicates</span>
        <strong>{validationError.duplicateRows}</strong>
      </div>

    </div>

    <div className="csv-validation-errors">

      {validationError.errors?.map((item, index) => (
        <div
          className="csv-validation-error"
          key={`${item.row}-${item.field}-${index}`}
        >

          <div className="csv-error-row">
            Row {item.row}
          </div>

          <div className="csv-error-field">
            {item.field}
          </div>

          <div className="csv-error-message">
            {item.message}
          </div>

        </div>
      ))}

    </div>

    <button
      type="button"
      className="csv-validation-upload"
      onClick={handleUploadClick}
    >
      Choose another CSV
    </button>

  </div>
)}

          {/* =================================
              FINANCIAL STATISTICS
          ================================= */}

          <div className="stats-grid">

            <StatCard
              title="Total income"
              value={
                summary
                  ? `₹${Number(
                      summary.total_income ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}`
                  : "—"
              }
              change=""
              changeType="positive"
              icon="income"
              description={
                summary
                  ? "Across the selected period"
                  : "Import a statement to see your income"
              }
            />

            <StatCard
              title="Total spending"
              value={
                summary
                  ? `₹${Number(
                      summary.total_expenses ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}`
                  : "—"
              }
              change=""
              changeType="negative"
              icon="expense"
              description={
                summary
                  ? "Across the selected period"
                  : "Import a statement to see your spending"
              }
            />

            <StatCard
              title="Net savings"
              value={
                summary
                  ? `₹${Number(
                      summary.savings ||
                        0
                    ).toLocaleString(
                      "en-IN"
                    )}`
                  : "—"
              }
              change=""
              changeType="positive"
              icon="savings"
              description={
                summary
                  ? "Money left after spending"
                  : "Import a statement to see your savings"
              }
            />

            <StatCard
              title="Savings rate"
              value={
                summary
                  ? `${Number(
                      summary.savings_rate ||
                        0
                    ).toFixed(2)}%`
                  : "—"
              }
              change=""
              changeType="positive"
              icon="rate"
              description={
                summary
                  ? "Of total income saved"
                  : "Import a statement to see your savings rate"
              }
            />

          </div>

          {/* =================================
              FINANCIAL OUTLOOK
          ================================= */}

          <section className="financial-outlook-section">

            <div className="section-header">

              <div>

                <span className="eyebrow">
                  FINANCIAL OUTLOOK
                </span>

                <h2>
                  What comes next.
                </h2>

                <p>
                  Expected income and recurring
                  commitments based on your
                  transaction history.
                </p>

              </div>

            </div>

            {/* OUTLOOK SUMMARY CARDS */}

            <div className="outlook-summary-grid">

              <div className="outlook-summary-card">

                <div className="outlook-card-top">

                  <span>
                    Expected income
                  </span>

                  <div className="outlook-icon income">
                    <ArrowUpRight size={17} />
                  </div>

                </div>

                <strong>
                  ₹
                  {Number(
                    expectationsData?.expected_income_total ||
                      0
                  ).toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </strong>

                <small>
                  Upcoming recurring income
                </small>

              </div>

              <div className="outlook-summary-card">

                <div className="outlook-card-top">

                  <span>
                    Expected commitments
                  </span>

                  <div className="outlook-icon expense">
                    <ArrowDownRight size={17} />
                  </div>

                </div>

                <strong>
                  ₹
                  {Number(
                    expectationsData?.expected_expense_total ||
                      0
                  ).toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </strong>

                <small>
                  Upcoming recurring expenses
                </small>

              </div>

              <div className="outlook-summary-card">

                <div className="outlook-card-top">

                  <span>
                    Expected remaining
                  </span>

                  <div className="outlook-icon remaining">
                    <Wallet size={17} />
                  </div>

                </div>

                <strong>
                  ₹
                  {Number(
                    (expectationsData?.expected_income_total || 0) -
                    (expectationsData?.expected_expense_total || 0)
                  ).toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </strong>

                <small>
                  Income minus commitments
                </small>

              </div>

            </div>

            {/* UPCOMING */}

            <div className="outlook-upcoming">

              {/* EXPECTED INCOME */}

              <div className="outlook-upcoming-header">

                <div>

                  <span className="eyebrow">
                    UPCOMING
                  </span>

                  <h3>
                    Expected income
                  </h3>

                </div>

              </div>

              <div className="outlook-items">

                {expectationsData?.expected_income?.length > 0 ? (
                  expectationsData.expected_income.map(
                    (item, index) => (
                      <div
                        className="outlook-item"
                        key={`income-${index}`}
                      >

                        <div className="outlook-item-icon income">
                          <ArrowUpRight size={17} />
                        </div>

                        <div className="outlook-item-content">

                          <strong>
                            {item.description}
                          </strong>

                          <span>
                            Expected{" "}
                            {formatExpectedDate(
                              item.expected_date
                            )}
                          </span>

                        </div>

                        <div className="outlook-item-amount income-text">

                          +₹
                          {Number(
                            item.amount || 0
                          ).toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}

                        </div>

                      </div>
                    )
                  )
                ) : (
                  <div className="outlook-empty">
                    No recurring income detected.
                  </div>
                )}

              </div>

              {/* EXPECTED EXPENSES */}

              <div className="outlook-upcoming-header expenses-heading">

                <div>

                  <span className="eyebrow">
                    UPCOMING
                  </span>

                  <h3>
                    Expected expenses
                  </h3>

                </div>

              </div>

              <div className="outlook-items">

                {expectationsData?.upcoming_expenses?.length > 0 ? (
                  expectationsData.upcoming_expenses.map(
                    (item, index) => (
                      <div
                        className="outlook-item"
                        key={`expense-${index}`}
                      >

                        <div className="outlook-item-icon expense">
                          <ArrowDownRight size={17} />
                        </div>

                        <div className="outlook-item-content">

                          <strong>
                            {item.description}
                          </strong>

                          <span>
                            Expected{" "}
                            {formatExpectedDate(
                              item.expected_date
                            )}
                          </span>

                        </div>

                        <div className="outlook-item-amount expense-text">

                          -₹
                          {Number(
                            item.amount || 0
                          ).toLocaleString(
                            "en-IN",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}

                        </div>

                      </div>
                    )
                  )
                ) : (
                  <div className="outlook-empty">
                    No recurring expenses detected.
                  </div>
                )}

              </div>

            </div>

          </section>

          {/* =================================
              BUDGET OVERVIEW
          ================================= */}

          {budgets.length > 0 && (
            <section className="dashboard-budget-section">

              <div className="section-header">

                <div>

                  <span className="eyebrow">
                    BUDGET CONTROL
                  </span>

                  <h2>
                    Stay within your limits.
                  </h2>

                  <p>
                    A quick view of how your spending
                    compares with your monthly budgets.
                  </p>

                </div>

              </div>

              {/* BUDGET SUMMARY */}

              <div className="dashboard-budget-summary">

                <div className="dashboard-budget-summary-card">

                  <span>
                    Total budget
                  </span>

                  <strong>
                    ₹
                    {Number(
                      totalBudget
                    ).toLocaleString(
                      "en-IN",
                      {
                        maximumFractionDigits: 0,
                      }
                    )}
                  </strong>

                </div>

                <div className="dashboard-budget-summary-card">

                  <span>
                    Spent
                  </span>

                  <strong>
                    ₹
                    {Number(
                      totalBudgetSpent
                    ).toLocaleString(
                      "en-IN",
                      {
                        maximumFractionDigits: 0,
                      }
                    )}
                  </strong>

                </div>

                <div className="dashboard-budget-summary-card">

                  <span>
                    {totalBudgetRemaining >= 0
                      ? "Remaining"
                      : "Over budget"}
                  </span>

                  <strong>
                    ₹
                    {Number(
                      Math.abs(
                        totalBudgetRemaining
                      )
                    ).toLocaleString(
                      "en-IN",
                      {
                        maximumFractionDigits: 0,
                      }
                    )}
                  </strong>

                </div>

              </div>

              {/* BUDGET CARDS */}

              <div className="dashboard-budget-list">

                {budgets.map((budget) => {

                  const actual =
                    getBudgetSpending(
                      budget.category
                    );

                  const budgetLimit =
                    Number(
                      budget.limit
                    ) || 0;

                  const percentage =
                    budgetLimit > 0
                      ? (actual /
                          budgetLimit) *
                        100
                      : 0;

                  const progressWidth =
                    Math.min(
                      percentage,
                      100
                    );

                  const isOver =
                    actual >
                    budgetLimit;

                  const isWarning =
                    !isOver &&
                    percentage >= 80;

                  return (
                    <div
                      className="dashboard-budget-card"
                      key={budget.id}
                    >

                      <div className="dashboard-budget-top">

                        <div>

                          <h3>
                            {budget.category}
                          </h3>

                          <span>
                            ₹
                            {Number(
                              actual
                            ).toLocaleString(
                              "en-IN",
                              {
                                maximumFractionDigits: 0,
                              }
                            )}
                            {" "}of{" "}
                            ₹
                            {Number(
                              budgetLimit
                            ).toLocaleString(
                              "en-IN",
                              {
                                maximumFractionDigits: 0,
                              }
                            )}
                          </span>

                        </div>

                        <strong>
                          {Math.round(
                            percentage
                          )}
                          %
                        </strong>

                      </div>

                      <div className="dashboard-budget-progress">

                        <div
                          style={{
                            width: `${progressWidth}%`,
                          }}
                        />

                      </div>

                      <div className="dashboard-budget-bottom">

                        <span>
                          {isOver
                            ? `Over by ₹${Number(
                                actual -
                                  budgetLimit
                              ).toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                }
                              )}`
                            : `₹${Number(
                                budgetLimit -
                                  actual
                              ).toLocaleString(
                                "en-IN",
                                {
                                  maximumFractionDigits: 0,
                                }
                              )} remaining`}
                        </span>

                        <span
                          className={
                            isOver
                              ? "dashboard-budget-status danger"
                              : isWarning
                              ? "dashboard-budget-status warning"
                              : "dashboard-budget-status safe"
                          }
                        >
                          {isOver
                            ? "Over budget"
                            : isWarning
                            ? "Near limit"
                            : "On track"}
                        </span>

                      </div>

                    </div>
                  );
                })}

              </div>

              {/* =================================
                  BUDGET ATTENTION
              ================================= */}

              {budgets.some((budget) => {

                const actual =
                  getBudgetSpending(
                    budget.category
                  );

                const limit =
                  Number(
                    budget.limit
                  ) || 0;

                return (
                  limit > 0 &&
                  actual >= limit * 0.8
                );
              }) && (

                <div className="dashboard-budget-attention">

                  <div className="dashboard-budget-attention-header">

                    <div>

                      <span className="eyebrow">
                        BUDGET ATTENTION
                      </span>

                      <h3>
                        Keep an eye on these budgets.
                      </h3>

                    </div>

                  </div>

                  <div className="dashboard-budget-alert-list">

                    {budgets
                      .filter((budget) => {

                        const actual =
                          getBudgetSpending(
                            budget.category
                          );

                        const limit =
                          Number(
                            budget.limit
                          ) || 0;

                        return (
                          limit > 0 &&
                          actual >=
                            limit * 0.8
                        );
                      })
                      .map((budget) => {

                        const actual =
                          getBudgetSpending(
                            budget.category
                          );

                        const limit =
                          Number(
                            budget.limit
                          ) || 0;

                        const percentage =
                          (actual /
                            limit) *
                          100;

                        const isOver =
                          actual > limit;

                        return (
                          <div
                            className={`dashboard-budget-alert ${
                              isOver
                                ? "danger"
                                : "warning"
                            }`}
                            key={budget.id}
                          >

                            <div className="dashboard-budget-alert-content">

                              <strong>
                                {budget.category}
                              </strong>

                              <span>
                                {isOver
                                  ? `₹${Number(
                                      actual -
                                        limit
                                    ).toLocaleString(
                                      "en-IN",
                                      {
                                        maximumFractionDigits: 0,
                                      }
                                    )} over your budget`
                                  : `₹${Number(
                                      limit -
                                        actual
                                    ).toLocaleString(
                                      "en-IN",
                                      {
                                        maximumFractionDigits: 0,
                                      }
                                    )} remaining`}
                              </span>

                            </div>

                            <div className="dashboard-budget-alert-percentage">
                              {Math.round(
                                percentage
                              )}
                              %
                            </div>

                          </div>
                        );
                      })}

                  </div>

                </div>

              )}

            </section>
          )}

          {/* =================================
              DATA-DEPENDENT CONTENT
          ================================= */}

          {summary && (
            <>

              <div className="main-grid">

                <SpendingChart
                  categoryTotals={
                    summary.category_totals
                  }
                />

              </div>

              <RecentTransactions
                transactions={
                  financialData?.transactions ||
                  []
                }
              />

            </>
          )}

        </section>

      </main>

    </div>
  );
}

export default Dashboard;