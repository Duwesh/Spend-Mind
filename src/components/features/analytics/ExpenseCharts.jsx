import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

const COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
  "#6366f1",
];

export const CategoryPieChart = ({ data, currencyFormatter }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500">
        No data to display
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={5}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
                stroke="rgba(0,0,0,0)"
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value) =>
              currencyFormatter ? currencyFormatter(value) : value
            }
            contentStyle={{
              backgroundColor: "#1f2937", // bg-gray-800
              borderColor: "#374151", // border-gray-700
              color: "#f3f4f6", // text-gray-100
              borderRadius: "0.5rem",
            }}
            itemStyle={{ color: "#e5e7eb" }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const DailySpendingBar = ({ data, currencyFormatter }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-slate-500">
        No data to display
      </div>
    );
  }

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#374151"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="#9ca3af"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) =>
              currencyFormatter
                ? currencyFormatter(value).replace(/\D+00(?=\D*$)/, "")
                : value
            } // Compact formatting
          />
          <Tooltip
            cursor={{ fill: "#374151", opacity: 0.4 }}
            contentStyle={{
              backgroundColor: "#1f2937",
              borderColor: "#374151",
              color: "#f3f4f6",
              borderRadius: "0.5rem",
            }}
            formatter={(value) => [
              currencyFormatter ? currencyFormatter(value) : value,
              "Amount",
            ]}
          />
          <Bar
            dataKey="amount"
            fill="#3b82f6"
            radius={[4, 4, 0, 0]}
            maxBarSize={50}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
