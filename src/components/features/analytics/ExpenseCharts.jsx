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
              position="center"
              dy={-20}
              style={{
                fontSize: "12px",
                fill: "hsl(var(--muted-foreground))",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                transition: "fill 0.3s ease",
              }}
            />
            <Label
              value={
                currencyFormatter
                  ? currencyFormatter(total).replace(/\.00$/, "")
                  : total
              }
              position="center"
              dy={15}
              style={{
                fontSize: "24px",
                fill: "hsl(var(--foreground))",
                fontWeight: 800,
                transition: "fill 0.3s ease",
              }}
            />
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
              color: "hsl(var(--foreground))",
              borderRadius: "12px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              borderWidth: "1px",
            }}
            itemStyle={{ color: "hsl(var(--foreground))" }}
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
            stroke="hsl(var(--border))"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            stroke="hsl(var(--muted-foreground))"
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
            cursor={{ fill: "hsl(var(--muted))", opacity: 0.15 }}
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              borderColor: "hsl(var(--border))",
              color: "hsl(var(--foreground))",
              borderRadius: "12px",
              borderWidth: "1px",
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
