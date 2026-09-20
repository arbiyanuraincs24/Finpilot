import {
  TrendingUp,
  Wallet,
  CreditCard,
  PiggyBank,
  CalendarDays,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";


function formatCurrency(value) {
  return `₹${Number(value || 0).toLocaleString(
    "en-IN"
  )}`;
}


function formatMonth(month) {
  const [year, monthNumber] = month.split("-");

  const date = new Date(
    Number(year),
    Number(monthNumber) - 1
  );

  return date.toLocaleDateString(
    "en-IN",
    {
      month: "short",
      year: "numeric",
    }
  );
}


function Forecast({
  forecastData,
  transactions = [],
}) {
  const forecast =
    forecastData?.forecast || {};

  const monthlyHistory =
    forecastData?.monthly_history || {};

  const historyEntries =
    Object.entries(monthlyHistory);


  const chartData = historyEntries.map(
    ([month, values]) => ({
      month: formatMonth(month),
      income: Number(values.income || 0),
      expenses: Number(values.expenses || 0),
      savings:
        Number(values.income || 0) -
        Number(values.expenses || 0),
    })
  );


  return (
    <section className="page-section forecast-page">

      <div className="page-header">

        <div>
          <span className="eyebrow">
            FINPILOT PREDICTIONS
          </span>

          <h1>
            Financial forecast
          </h1>

          <p>
            Understand your average monthly finances
            and anticipate what comes next.
          </p>
        </div>


        <div className="insights-badge">
          <TrendingUp size={17} />
          <span>
            Historical projection
          </span>
        </div>

      </div>


      {transactions.length === 0 ? (

        <div className="empty-state">
          Upload a financial statement to generate
          your forecast.
        </div>

      ) : (

        <>

          {/* =========================================
              FORECAST SUMMARY
          ========================================= */}

          <div className="insights-summary">

            <div className="insight-summary-card">

              <Wallet size={19} />

              <span>
                Average monthly income
              </span>

              <strong>
                {formatCurrency(
                  forecast.average_income
                )}
              </strong>

            </div>


            <div className="insight-summary-card">

              <CreditCard size={19} />

              <span>
                Average monthly expenses
              </span>

              <strong>
                {formatCurrency(
                  forecast.average_expenses
                )}
              </strong>

            </div>


            <div className="insight-summary-card">

              <PiggyBank size={19} />

              <span>
                Projected monthly savings
              </span>

              <strong>
                {formatCurrency(
                  forecast.projected_savings
                )}
              </strong>

            </div>

          </div>


          {/* =========================================
              INTERACTIVE FORECAST CHART
          ========================================= */}

          <div className="forecast-chart-card">

            <div className="card-heading">

              <div>
                <span className="eyebrow">
                  FINANCIAL TREND
                </span>

                <h3>
                  Monthly cash flow
                </h3>

                <p className="chart-subtitle">
                  Track how your income, expenses and
                  savings have changed over time.
                </p>
              </div>

              <div className="forecast-chart-icon">
                <TrendingUp size={19} />
              </div>

            </div>


            <div className="forecast-chart">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <LineChart
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 10,
                    bottom: 5,
                  }}
                >

                  <CartesianGrid
                    stroke="rgba(255,255,255,0.06)"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#858b9d",
                      fontSize: 11,
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#858b9d",
                      fontSize: 11,
                    }}
                    tickFormatter={(value) =>
                      `₹${(
                        value / 1000
                      ).toFixed(0)}k`
                    }
                  />

                  <Tooltip
                    contentStyle={{
                      background:
                        "#171a24",
                      border:
                        "1px solid rgba(255,255,255,0.08)",
                      borderRadius:
                        "12px",
                      boxShadow:
                        "0 12px 30px rgba(0,0,0,0.35)",
                    }}
                    labelStyle={{
                      color: "#f4f4f6",
                      marginBottom: "6px",
                    }}
                    formatter={(value) =>
                      formatCurrency(value)
                    }
                  />

                  <Legend
                    wrapperStyle={{
                      paddingTop: "14px",
                      fontSize: "11px",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="income"
                    name="Income"
                    stroke="#5ee0b0"
                    strokeWidth={2.5}
                    dot={{
                      r: 4,
                      fill: "#5ee0b0",
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="expenses"
                    name="Expenses"
                    stroke="#f59aab"
                    strokeWidth={2.5}
                    dot={{
                      r: 4,
                      fill: "#f59aab",
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="savings"
                    name="Savings"
                    stroke="#a5b4fc"
                    strokeWidth={2.5}
                    strokeDasharray="5 5"
                    dot={{
                      r: 4,
                      fill: "#a5b4fc",
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

          </div>


          {/* =========================================
              MONTHLY HISTORY
          ========================================= */}

          <div className="forecast-history-card">

            <div className="card-heading">

              <div>
                <span className="eyebrow">
                  MONTHLY HISTORY
                </span>

                <h3>
                  Income and expenses
                </h3>
              </div>

              <CalendarDays size={20} />

            </div>


            <div className="forecast-table">

              <div className="forecast-row forecast-header">
                <span>Month</span>
                <span>Income</span>
                <span>Expenses</span>
              </div>


              {historyEntries.map(
                ([month, values]) => (

                  <div
                    className="forecast-row"
                    key={month}
                  >

                    <span>
                      {formatMonth(month)}
                    </span>

                    <strong className="income-amount">
                      {formatCurrency(
                        values.income
                      )}
                    </strong>

                    <strong className="expense-amount">
                      {formatCurrency(
                        values.expenses
                      )}
                    </strong>

                  </div>

                )
              )}

            </div>

          </div>

        </>

      )}

    </section>
  );
}


export default Forecast;