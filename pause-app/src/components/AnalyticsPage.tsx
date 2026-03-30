"use client";

import { motion } from "framer-motion";
import { User, TrendingUp } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";

const WEEKLY_DATA = [
  { day: "Mon", wins: 4 },
  { day: "Tue", wins: 6 },
  { day: "Wed", wins: 3 },
  { day: "Thu", wins: 8 },
  { day: "Fri", wins: 5 },
  { day: "Sat", wins: 7 },
  { day: "Sun", wins: 2 },
];

const CATEGORY_DATA = [
  { name: "Closed App", value: 14, color: "#4A90D9" },
  { name: "Chose Water", value: 11, color: "#10B981" },
  { name: "Worked Out", value: 8, color: "#F59E0B" },
  { name: "Cancelled Order", value: 5, color: "#EF4444" },
  { name: "Healthy Swap", value: 9, color: "#8B5CF6" },
  { name: "Resisted Craving", value: 6, color: "#EC4899" },
];

const TREND_DATA = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  wellness: Math.min(
    100,
    Math.max(30, 45 + i * 0.8 + Math.sin(i * 0.5) * 8 + Math.random() * 5)
  ),
}));

interface AnalyticsPageProps {
  archetypeColor?: string;
  currentWellness?: number;
  projectedWellness?: number;
  weekRange?: string;
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className="rounded-card bg-white p-4 shadow-sm"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-pause-muted">
        {title}
      </h3>
      {children}
    </motion.div>
  );
}

export default function AnalyticsPage({
  archetypeColor = "#F59E0B",
  currentWellness = 55,
  projectedWellness = 72,
  weekRange = "Mar 24 — Mar 30",
}: AnalyticsPageProps) {
  const bestDay = WEEKLY_DATA.reduce((prev, curr) =>
    curr.wins > prev.wins ? curr : prev
  );

  return (
    <div className="min-h-dvh bg-pause-bg pb-24 font-sans">
      <div className="mx-auto max-w-[480px] px-4 pt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-pause-primary">
            Your Insights
          </h1>
          <p className="mt-1 text-sm text-pause-muted">{weekRange}</p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Weekly activity */}
          <Card title="Weekly Activity">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_DATA} barCategoryGap="25%">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F3F4F6"
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    width={24}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #E5E7EB",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
                    }}
                  />
                  <Bar
                    dataKey="wins"
                    radius={[6, 6, 0, 0]}
                    fill="#4A90D9"
                  >
                    {WEEKLY_DATA.map((entry) => (
                      <Cell
                        key={entry.day}
                        fill={
                          entry.day === "Sun"
                            ? "#10B981"
                            : "#4A90D9"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <p className="mt-2 text-center text-xs text-pause-muted">
              Best day: <span className="font-semibold">{bestDay.day}</span> (
              {bestDay.wins} wins)
            </p>
          </Card>

          {/* Win breakdown */}
          <Card title="Win Breakdown">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={CATEGORY_DATA}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {CATEGORY_DATA.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #E5E7EB",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
              {CATEGORY_DATA.map((cat) => (
                <div key={cat.name} className="flex items-center gap-1.5">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="text-xs text-pause-muted">
                    {cat.name} ({cat.value})
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Progress comparison */}
          <Card title="Your Progress">
            <div className="flex items-center justify-around">
              <div className="flex flex-col items-center gap-2">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-2xl opacity-80"
                  style={{
                    background: `linear-gradient(135deg, ${archetypeColor}99, ${archetypeColor}66)`,
                  }}
                >
                  <User className="h-9 w-9 text-white" />
                </div>
                <p className="text-sm font-medium text-pause-primary">
                  You Today
                </p>
                <span className="text-lg font-bold text-pause-primary">
                  {currentWellness}%
                </span>
              </div>

              <TrendingUp className="h-6 w-6 text-pause-success" />

              <div className="flex flex-col items-center gap-2">
                <div
                  className="flex h-20 w-20 items-center justify-center rounded-2xl"
                  style={{
                    background: `linear-gradient(135deg, ${archetypeColor}, ${archetypeColor}CC)`,
                  }}
                >
                  <User className="h-9 w-9 text-white" />
                </div>
                <p className="text-sm font-medium text-pause-primary">
                  In 30 Days
                </p>
                <span className="text-lg font-bold text-pause-success">
                  {projectedWellness}%
                </span>
              </div>
            </div>
            <p className="mt-4 text-center text-xs text-pause-muted">
              Keep going — you're on track
            </p>
          </Card>

          {/* Wellness trend */}
          <Card title="Wellness Trend">
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={TREND_DATA}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#F3F4F6"
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#6B7280" }}
                    interval={6}
                  />
                  <YAxis
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "#6B7280" }}
                    width={30}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "1px solid #E5E7EB",
                    }}
                    formatter={(value: number) => [
                      `${value.toFixed(0)}%`,
                      "Wellness",
                    ]}
                  />
                  <defs>
                    <linearGradient id="wellnessGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="5%"
                        stopColor={archetypeColor}
                        stopOpacity={0.15}
                      />
                      <stop
                        offset="95%"
                        stopColor={archetypeColor}
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="wellness"
                    stroke={archetypeColor}
                    strokeWidth={2}
                    fill="url(#wellnessGrad)"
                    dot={{ r: 2, fill: archetypeColor }}
                    activeDot={{ r: 4, fill: archetypeColor }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
