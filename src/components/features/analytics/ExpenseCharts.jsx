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
  Label,
} from "recharts";

const COLORS = [
  "#22d3ee", // cyan
  "#f87171", // red/orange
  "#a855f7", // purple
  "#fbbf24", // yellow
  "#34d399", // emerald
];

export const CategoryPieChart = ({ data, currencyFormatter }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-slate-500">
        No data to display
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
            <Label
              value={`Total`}
              position="centerTop"
              dy={-10}
              style={{ fontSize: "14px", fill: "#94a3b8", fontWeight: 500 }}
            />
            <Label
              value={
                currencyFormatter
                  ? currencyFormatter(total).replace(/\.00$/, "")
                  : total
              }
              position="centerBottom"
              dy={10}
              style={{ fontSize: "22px", fill: "#f8fafc", fontWeight: 700 }}
            />
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#0f172a",
              borderColor: "#1e293b",
              color: "#f8fafc",
              borderRadius: "12px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            }}
            itemStyle={{ color: "#f8fafc" }}
            formatter={(value) =>
              currencyFormatter ? currencyFormatter(value) : value
            }
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export const DailySpendingBar = ({ data, currencyFormatter }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-slate-500">
        No data to display
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#1e293b"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="#64748b"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) =>
              currencyFormatter
                ? currencyFormatter(value).replace(/\D+00(?=\D*$)/, "")
                : value
            }
          />
          <Tooltip
            cursor={{ fill: "#1e293b", opacity: 0.4 }}
            contentStyle={{
              backgroundColor: "#0f172a",
              borderColor: "#1e293b",
              color: "#f8fafc",
              borderRadius: "12px",
            }}
            formatter={(value) => [
              currencyFormatter ? currencyFormatter(value) : value,
              "Amount",
            ]}
          />
          <Bar
            dataKey="amount"
            fill="#22d3ee"
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
