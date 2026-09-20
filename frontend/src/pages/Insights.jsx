import {
  Sparkles,
  TrendingUp,
  Repeat,
  AlertTriangle,
  PiggyBank,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  ArrowDownRight,
  ArrowUpRight as ArrowIncrease,
  Info,
} from "lucide-react";


const iconMap = {
  spending_pattern: TrendingUp,
  recurring: Repeat,
  anomaly: AlertTriangle,
  savings_opportunity: PiggyBank,
};


const actionIconMap = {
  savings: PiggyBank,
  spending: TrendingUp,
  recurring: Repeat,
  anomaly: AlertTriangle,
  opportunity: Sparkles,
};


function formatCurrency(value) {
  return `₹${Number(
    value || 0
  ).toLocaleString(
    "en-IN"
  )}`;
}


function getRecurringLabel(item) {
  if (item.count >= 3) {
    return "Regular commitment";
  }

  return "Recurring payment";
}


function getPriorityLabel(priority) {
  if (priority === "high") {
    return "Priority";
  }

  if (priority === "medium") {
    return "Review";
  }

  return "Monitor";
}


function formatMonth(month) {
  if (!month) {
    return "";
  }

  const date = new Date(
    `${month}-01T00:00:00`
  );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return month;
  }

  return date.toLocaleDateString(
    "en-IN",
    {
      month: "long",
      year: "numeric",
    }
  );
}


function getChangeLabel(value) {
  if (
    value === null ||
    value === undefined
  ) {
    return null;
  }

  if (value > 0) {
    return `+${Number(value).toFixed(1)}%`;
  }

  return `${Number(value).toFixed(1)}%`;
}


/* =================================================
   EXPLAINABILITY HELPERS
================================================= */

function getInsightEvidence(insight) {
  if (
    insight.type ===
    "anomaly"
  ) {
    const firstItem =
      insight.items?.[0];

    if (firstItem) {
      return `FinPilot identified ${firstItem.description} at ${formatCurrency(
        firstItem.amount
      )} as an unusual transaction based on the spending pattern in your data.`;
    }

    return "FinPilot identified spending that differs significantly from the observed spending pattern.";
  }


  if (
    insight.type ===
    "savings_opportunity"
  ) {
    if (
      insight.potential_savings
    ) {
      return `This opportunity is based on the spending category analyzed by FinPilot. The estimated reduction represents approximately ${formatCurrency(
        insight.potential_savings
      )} in potential savings.`;
    }

    return "FinPilot found a category where reducing spending could improve your available savings.";
  }


  if (
    insight.type ===
    "recurring"
  ) {
    const count =
      insight.items?.length || 0;

    if (count > 0) {
      return `FinPilot detected repeated payment activity across ${count} recurring commitment${
        count === 1
          ? ""
          : "s"
      }.`;
    }

    return "FinPilot detected repeated transactions that may represent ongoing financial commitments.";
  }


  if (
    insight.type ===
    "spending_pattern"
  ) {
    return "This insight is based on the spending patterns identified across the transactions FinPilot analyzed.";
  }


  return "This insight is based on the financial transactions and patterns analyzed by FinPilot.";
}


function getInsightAction(insight) {
  if (
    insight.type ===
    "anomaly"
  ) {
    return "Review the transaction and confirm whether it was expected.";
  }


  if (
    insight.type ===
    "savings_opportunity"
  ) {
    return "Consider whether this spending category can be reduced without affecting essential expenses.";
  }


  if (
    insight.type ===
    "recurring"
  ) {
    return "Review these recurring commitments and decide whether each one is still necessary.";
  }


  if (
    insight.type ===
    "spending_pattern"
  ) {
    return "Compare this pattern with your normal monthly spending and adjust where appropriate.";
  }


  return "Review this insight alongside your recent financial activity.";
}


/* =================================================
   COMPONENT
================================================= */

function Insights({
  insights = [],
  actionItems = [],
  monthlySummary = [],
  monthlyChanges = [],
  summary = {},
}) {

  const income =
    summary.total_income || 0;

  const expenses =
    summary.total_expenses || 0;

  const savings =
    summary.savings || 0;

  const savingsRate =
    summary.savings_rate || 0;


  /*
   * Use monthlyChanges when available.
   * Older backend responses may only contain
   * monthlySummary, so the fallback keeps
   * the page compatible.
   */

  const monthlyData =
    monthlyChanges.length > 0
      ? monthlyChanges
      : monthlySummary;


  const latestMonth =
    monthlyData.length > 0
      ? monthlyData[
          monthlyData.length - 1
        ]
      : null;


  return (
    <section className="page-section insights-page">


      {/* =================================================
          HEADER
      ================================================= */}

      <div className="page-header">

        <div>

          <span className="eyebrow">
            FINPILOT INTELLIGENCE
          </span>

          <h1>
            Insights
          </h1>

          <p>
            Understand what your financial activity is
            telling you — beyond the numbers.
          </p>

        </div>


        <div className="insights-badge">

          <Sparkles size={17} />

          <span>
            Financial analysis
          </span>

        </div>

      </div>


      {/* =================================================
          FINANCIAL SUMMARY
      ================================================= */}

      <div className="insights-summary">

        <div className="insight-summary-card">

          <span>
            Total income
          </span>

          <strong>
            {formatCurrency(
              income
            )}
          </strong>

        </div>


        <div className="insight-summary-card">

          <span>
            Total spending
          </span>

          <strong>
            {formatCurrency(
              expenses
            )}
          </strong>

        </div>


        <div className="insight-summary-card">

          <span>
            Net savings
          </span>

          <strong>
            {formatCurrency(
              savings
            )}
          </strong>

        </div>


        <div className="insight-summary-card">

          <span>
            Savings rate
          </span>

          <strong>
            {Number(
              savingsRate
            ).toFixed(1)}
            %
          </strong>

        </div>

      </div>


      {/* =================================================
          ACTION ITEMS
      ================================================= */}

      {actionItems.length > 0 && (

        <section className="insights-actions-section">

          <div className="insights-actions-header">

            <div>

              <span className="eyebrow">
                ACTION ITEMS
              </span>

              <h2>
                What you can review next.
              </h2>

              <p>
                FinPilot turned the patterns in your
                financial data into practical review points.
              </p>

            </div>


            <div className="insights-actions-count">

              <strong>
                {actionItems.length}
              </strong>

              <span>
                actions
              </span>

            </div>

          </div>


          <div className="insights-actions-list">

            {actionItems.map(
              (action, index) => {

                const Icon =
                  actionIconMap[
                    action.type
                  ] ||
                  Sparkles;

                return (
                  <div
                    className={`insight-action-card ${
                      action.priority ||
                      "medium"
                    }`}
                    key={`${action.type}-${index}`}
                  >

                    <div className="insight-action-icon">

                      <Icon size={18} />

                    </div>


                    <div className="insight-action-content">

                      <div className="insight-action-top">

                        <span className="insight-action-priority">

                          {getPriorityLabel(
                            action.priority
                          )}

                        </span>

                      </div>


                      <h3>
                        {action.title}
                      </h3>


                      <p>
                        {action.description}
                      </p>

                    </div>

                  </div>
                );
              }
            )}

          </div>

        </section>
      )}


      {/* =================================================
          MONTHLY FINANCIAL REVIEW
      ================================================= */}

      {monthlyData.length > 0 && (

        <section className="monthly-review-section">

          <div className="monthly-review-header">

            <div>

              <span className="eyebrow">
                MONTHLY REVIEW
              </span>

              <h2>
                Your monthly financial picture.
              </h2>

              <p>
                Track how income, spending and savings
                changed across the selected period.
              </p>

            </div>

          </div>


          {/* LATEST MONTH HIGHLIGHT */}

          {latestMonth && (

            <div className="monthly-latest-card">

              <div className="monthly-latest-header">

                <div>

                  <span>
                    Latest recorded month
                  </span>

                  <h3>
                    {formatMonth(
                      latestMonth.month
                    )}
                  </h3>

                </div>


                {latestMonth.expense_change_percent !==
                  null &&
                  latestMonth.expense_change_percent !==
                    undefined && (

                    <div className="monthly-change-badge">

                      {latestMonth.expense_change_percent >
                      0 ? (
                        <ArrowIncrease size={16} />
                      ) : (
                        <ArrowDownRight size={16} />
                      )}

                      <span>

                        {getChangeLabel(
                          latestMonth.expense_change_percent
                        )}

                        {" vs previous month"}

                      </span>

                    </div>

                  )}

              </div>


              <div className="monthly-latest-grid">

                <div>

                  <span>
                    Income
                  </span>

                  <strong>
                    {formatCurrency(
                      latestMonth.income
                    )}
                  </strong>

                </div>


                <div>

                  <span>
                    Spending
                  </span>

                  <strong>
                    {formatCurrency(
                      latestMonth.expenses
                    )}
                  </strong>

                </div>


                <div>

                  <span>
                    Net savings
                  </span>

                  <strong>
                    {formatCurrency(
                      latestMonth.savings
                    )}
                  </strong>

                </div>


                <div>

                  <span>
                    Savings rate
                  </span>

                  <strong>
                    {Number(
                      latestMonth.savings_rate || 0
                    ).toFixed(1)}
                    %
                  </strong>

                </div>

              </div>

            </div>

          )}


          {/* ALL MONTHS */}

          <div className="monthly-review-grid">

            {monthlyData.map(
              (month, index) => (

                <article
                  className="monthly-review-card"
                  key={month.month}
                >

                  <div className="monthly-review-card-header">

                    <div>

                      <span>
                        {formatMonth(
                          month.month
                        )}
                      </span>

                    </div>


                    <span className="monthly-review-number">

                      #{index + 1}

                    </span>

                  </div>


                  <div className="monthly-review-values">

                    <div>

                      <span>
                        Income
                      </span>

                      <strong>
                        {formatCurrency(
                          month.income
                        )}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Spending
                      </span>

                      <strong>
                        {formatCurrency(
                          month.expenses
                        )}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Net savings
                      </span>

                      <strong>
                        {formatCurrency(
                          month.savings
                        )}
                      </strong>

                    </div>


                    <div>

                      <span>
                        Savings rate
                      </span>

                      <strong>
                        {Number(
                          month.savings_rate || 0
                        ).toFixed(1)}
                        %
                      </strong>

                    </div>

                  </div>


                  {/* MONTH-OVER-MONTH CHANGES */}

                  {month.previous_month && (

                    <div className="monthly-comparison">

                      <span>
                        Compared with{" "}
                        {formatMonth(
                          month.previous_month
                        )}
                      </span>


                      <div className="monthly-comparison-values">

                        {month.expense_change_percent !==
                          null &&
                          month.expense_change_percent !==
                            undefined && (

                            <span>

                              Spending{" "}

                              {month.expense_change_percent >
                              0 ? (
                                <ArrowIncrease
                                  size={14}
                                />
                              ) : (
                                <ArrowDownRight
                                  size={14}
                                />
                              )}

                              {getChangeLabel(
                                month.expense_change_percent
                              )}

                            </span>

                          )}


                        {month.savings_change !==
                          null &&
                          month.savings_change !==
                            undefined && (

                            <span>

                              Savings{" "}

                              {formatCurrency(
                                Math.abs(
                                  month.savings_change
                                )
                              )}

                              {month.savings_change >=
                              0
                                ? " higher"
                                : " lower"}

                            </span>

                          )}

                      </div>

                    </div>

                  )}

                </article>

              )
            )}

          </div>

        </section>

      )}


      {/* =================================================
          INSIGHTS
      ================================================= */}

      <div className="insights-grid">

        {insights.length === 0 ? (

          <div className="empty-state">

            Upload a financial statement to generate
            personalized insights.

          </div>

        ) : (

          insights.map(
            (insight, index) => {

              const Icon =
                iconMap[
                  insight.type
                ] ||
                Sparkles;


              const isRecurring =
                insight.type ===
                "recurring";


              const evidence =
                getInsightEvidence(
                  insight
                );


              const recommendedAction =
                getInsightAction(
                  insight
                );


              return (
                <article
                  className={`ai-insight-card ${
                    insight.severity ||
                    "info"
                  } ${
                    isRecurring
                      ? "recurring-insight"
                      : ""
                  }`}
                  key={`${insight.type}-${index}`}
                >


                  {/* =================================================
                      INSIGHT HEADER
                  ================================================= */}

                  <div className="ai-insight-top">

                    <div className="ai-insight-icon">

                      <Icon size={19} />

                    </div>


                    <span>

                      {insight.type
                        .replace(
                          /_/g,
                          " "
                        )
                        .toUpperCase()}

                    </span>

                  </div>


                  <h3>
                    {insight.title}
                  </h3>


                  <p>
                    {insight.description}
                  </p>


                  {/* =================================================
                      WHY THIS INSIGHT
                  ================================================= */}

                  <div className="insight-explanation">

                    <div className="insight-explanation-header">

                      <Info size={16} />

                      <span>
                        WHY FINPILOT FLAGGED THIS
                      </span>

                    </div>


                    <p>
                      {evidence}
                    </p>

                  </div>


                  {/* =================================================
                      RECURRING PAYMENT LIST
                  ================================================= */}

                  {isRecurring &&
                    insight.items &&
                    insight.items.length > 0 && (

                      <div className="recurring-list">

                        {insight.items.map(
                          (
                            item,
                            itemIndex
                          ) => (

                            <div
                              className="recurring-item"
                              key={`${item.description}-${itemIndex}`}
                            >

                              <div className="recurring-item-icon">

                                <CalendarClock
                                  size={17}
                                />

                              </div>


                              <div className="recurring-item-main">

                                <strong>
                                  {item.description}
                                </strong>

                                <span>

                                  {getRecurringLabel(
                                    item
                                  )}

                                  {" · "}

                                  {item.count}

                                  {" "}

                                  payments detected

                                </span>

                              </div>


                              <div className="recurring-item-amount">

                                <strong>
                                  {formatCurrency(
                                    item.amount
                                  )}
                                </strong>

                                <span>
                                  latest payment
                                </span>

                              </div>

                            </div>

                          )
                        )}

                      </div>

                    )}


                  {/* =================================================
                      SAVINGS OPPORTUNITY
                  ================================================= */}

                  {insight.potential_savings && (

                    <div className="insight-highlight">

                      <strong>
                        {formatCurrency(
                          insight.potential_savings
                        )}
                      </strong>

                      <span>
                        potential savings
                      </span>

                    </div>

                  )}


                  {/* =================================================
                      ANOMALIES / INSIGHT ITEMS
                  ================================================= */}

                  {!isRecurring &&
                    insight.items &&
                    insight.items.length > 0 && (

                      <div className="insight-items">

                        {insight.items.map(
                          (
                            item,
                            itemIndex
                          ) => (

                            <div
                              className="insight-item"
                              key={`${item.description}-${itemIndex}`}
                            >

                              <span>
                                {item.description}
                              </span>

                              {item.amount && (

                                <strong>
                                  {formatCurrency(
                                    item.amount
                                  )}
                                </strong>

                              )}

                            </div>

                          )
                        )}

                      </div>

                    )}


                  {/* =================================================
                      RECOMMENDED ACTION
                  ================================================= */}

                  <div className="insight-recommended-action">

                    <div className="insight-recommended-icon">

                      <CheckCircle2
                        size={16}
                      />

                    </div>


                    <div>

                      <span>
                        RECOMMENDED NEXT STEP
                      </span>

                      <p>
                        {recommendedAction}
                      </p>

                    </div>

                  </div>


                  <button
                    className="insight-link"
                    type="button"
                  >

                    Explore insight

                    <ArrowUpRight
                      size={16}
                    />

                  </button>

                </article>
              );
            }
          )

        )}

      </div>


      {/* =================================================
          MONTHLY ACTION SUMMARY
      ================================================= */}

      {(actionItems.length > 0 ||
        monthlyData.length > 0) && (

        <div className="insights-action-summary">

          <div className="insights-action-summary-icon">

            <CheckCircle2
              size={21}
            />

          </div>


          <div>

            <span className="eyebrow">
              MONTHLY REVIEW
            </span>


            <h3>
              Your financial review is ready.
            </h3>


            <p>
              Review the monthly figures above alongside
              your spending patterns, recurring
              commitments and unusual transactions.
              These results are based on the financial
              data FinPilot analyzed.
            </p>

          </div>

        </div>

      )}


      {/* =================================================
          FOOTER
      ================================================= */}

      <div className="insights-footer-card">

        <div className="insights-footer-icon">

          <Sparkles
            size={21}
          />

        </div>


        <div>

          <span className="eyebrow">
            FINPILOT INTELLIGENCE
          </span>


          <h3>
            Your financial data is becoming
            actionable intelligence.
          </h3>


          <p>
            FinPilot analyzes spending patterns,
            recurring commitments, unusual
            transactions and savings opportunities
            to help you make better financial
            decisions.
          </p>

        </div>

      </div>


    </section>
  );
}


export default Insights;