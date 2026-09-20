import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#06b6d4",
  "#14b8a6",
  "#f59e0b",
  "#ec4899",
  "#f43f5e",
];

function SpendingChart({ categoryTotals = {} }) {
  const data = Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value: Number(value),
    }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="chart-card">
      <div className="card-heading">
        <div>
          <span className="eyebrow">
            WHERE IT GOES
          </span>

          <h3>Spending breakdown</h3>
        </div>

        <button className="text-button">
          View details
        </button>
      </div>

      <div className="chart-content">
        <div className="donut">
          <ResponsiveContainer
            width="100%"
            height="100%"
          >
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={72}
                outerRadius={105}
                paddingAngle={3}
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={
                      COLORS[
                        index % COLORS.length
                      ]
                    }
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) =>
                  `₹${Number(
                    value
                  ).toLocaleString("en-IN")}`
                }
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="donut-center">
            <span>Total</span>

            <strong>
              ₹{total.toLocaleString("en-IN")}
            </strong>
          </div>
        </div>

        <div className="legend">
          {data.map((item, index) => (
            <div
              className="legend-row"
              key={item.name}
            >
              <div className="legend-name">
                <span
                  className="legend-dot"
                  style={{
                    background:
                      COLORS[
                        index % COLORS.length
                      ],
                  }}
                />

                {item.name}
              </div>

              <strong>
                ₹{item.value.toLocaleString(
                  "en-IN"
                )}
              </strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default SpendingChart;

