import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const CustomTooltip = ({
  active,
  payload,
  label,
}) => {
  if (
    active &&
    payload &&
    payload.length
  ) {
    return (
      <div className="custom-tooltip">
        <p>
          <strong>Date:</strong> {label}
        </p>

        <p>
          <strong>Score:</strong>{" "}
          {payload[0].value}
        </p>
      </div>
    );
  }

  return null;
};

const PerformanceChart = ({
  interviews,
}) => {
  const chartData = interviews
    .filter(
      (interview) =>
        interview.status ===
        "completed"
    )
    .sort(
      (a, b) =>
        new Date(a.createdAt) -
        new Date(b.createdAt)
    )
    .map((interview) => ({
      interview: new Date(
        interview.createdAt
      ).toLocaleDateString(),
      score: interview.score || 0,
    }));

  if (chartData.length === 0) {
    return (
      <div className="chart-empty">
        Complete interviews to view
        performance analytics.
      </div>
    );
  }

  return (
    <div className="chart-container">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart
          data={chartData}
          margin={{
            top: 10,
            right: 20,
            left: 0,
            bottom: 10,
          }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
          />

          <XAxis
            dataKey="interview"
          />

          <YAxis
            domain={[0, 100]}
          />

          <Tooltip
            content={
              <CustomTooltip />
            }
          />

          <Line
            type="monotone"
            dataKey="score"
            stroke="#2563eb"
            strokeWidth={3}
            dot={{ r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;