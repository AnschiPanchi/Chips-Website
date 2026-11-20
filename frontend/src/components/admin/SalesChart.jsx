import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Deterministic demo series so the dashboard renders identically on every load.
const series = [
  { day: "Nov 9", revenue: 8420, orders: 26 },
  { day: "Nov 10", revenue: 10250, orders: 31 },
  { day: "Nov 11", revenue: 9480, orders: 29 },
  { day: "Nov 12", revenue: 12640, orders: 38 },
  { day: "Nov 13", revenue: 11180, orders: 34 },
  { day: "Nov 14", revenue: 15320, orders: 45 },
  { day: "Nov 15", revenue: 16890, orders: 49 },
  { day: "Nov 16", revenue: 13420, orders: 40 },
  { day: "Nov 17", revenue: 14760, orders: 43 },
  { day: "Nov 18", revenue: 17240, orders: 51 },
  { day: "Nov 19", revenue: 18960, orders: 56 },
  { day: "Nov 20", revenue: 16120, orders: 47 },
];

const tooltipStyle = {
  borderRadius: 8,
  border: "1px solid rgba(23,63,50,0.12)",
  fontSize: 12,
  fontFamily: "Inter, sans-serif",
};

export default function SalesChart() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
      <div className="rounded-xl border border-brand-forest/12 bg-brand-paper p-5">
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-brand-forest/45">
              Revenue
            </p>
            <p className="mt-1 font-heading text-xl font-extrabold text-brand-forest">₹1,68,680</p>
          </div>
          <span className="text-[11px] text-brand-forest/45">Last 12 days</span>
        </div>
        <div className="mt-5 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={series} margin={{ left: -18, right: 4, top: 4 }}>
              <defs>
                <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#173F32" stopOpacity={0.24} />
                  <stop offset="100%" stopColor="#173F32" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(23,63,50,0.08)" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "rgba(23,63,50,0.45)" }}
                axisLine={false}
                tickLine={false}
                interval={2}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "rgba(23,63,50,0.45)" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v / 1000}k`}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={(value) => [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#173F32"
                strokeWidth={2}
                fill="url(#revenueFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-brand-forest/12 bg-brand-paper p-5">
        <div className="flex items-baseline justify-between">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-brand-forest/45">
            Orders per day
          </p>
          <span className="text-[11px] text-brand-forest/45">489 total</span>
        </div>
        <div className="mt-5 h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series} margin={{ left: -24, right: 4, top: 4 }}>
              <CartesianGrid stroke="rgba(23,63,50,0.08)" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "rgba(23,63,50,0.45)" }}
                axisLine={false}
                tickLine={false}
                interval={3}
              />
              <YAxis
                tick={{ fontSize: 10, fill: "rgba(23,63,50,0.45)" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="orders" fill="#E87536" radius={[3, 3, 0, 0]} maxBarSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}