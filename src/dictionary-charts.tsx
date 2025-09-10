import { Copy } from "lucide-react";
import {
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Bar,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { css } from "~styled-system/css";

const DictionaryCharts = () => {
  const sourceData = [
    { source: "Wiktionary", definitions: 572727 },
    { source: "Universalis", definitions: 47811 },
    { source: "Cordial", definitions: 39545 },
    { source: "Larousse", definitions: 990992 },
    { source: "LeDictionary", definitions: 339440 },
    { source: "Robert", definitions: 108488 },
  ];

  const generalStats = [
    { metric: "Total Definitions", value: 2099003 },
    { metric: "Words with Definition", value: 461244 },
    {
      metric: "Avg Definitions/Word",
      value: (2099003 / 461244).toFixed(1),
    },
  ];

  const endpoints = [
    { method: "GET", path: "/words/{word}/count", desc: "Definition count" },
    { method: "GET", path: "/words/{word}/definition?source={src}", desc: "Definition by source" },
    { method: "GET", path: "/words/{word}/definitions", desc: "All definitions" },
    { method: "GET", path: "/definitions/contains?word={word}", desc: "Search containing word" },
    { method: "GET", path: "/definitions/length?min={x}&max={y}", desc: "Filter by length" },
    { method: "GET", path: "/definitions/source/{source}/random", desc: "Random by source" },
    { method: "GET", path: "/stats", desc: "General statistics" },
    { method: "GET", path: "/stats/sources", desc: "Source comparison" },
  ];

  const formatNumber = (value) =>
    typeof value === "number"
      ? new Intl.NumberFormat("en-US").format(value)
      : value;

  return (
    <div
      className={css({
        bg: "radial-gradient(circle at top, #111 0%, #000 100%)",
        color: "#f1f5f9",
        minH: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        py: "10",
        px: "6",
      })}
    >
      <div
        className={css({
          bg: "#0a0a0a",
          borderRadius: "2xl",
          p: "8",
          shadow: "2xl",
          border: "1px solid #222",
          w: "100%",
          maxW: "1200px",
          display: "flex",
          flexDirection: "column",
          gap: "10",
        })}
      >
        {/* Titre */}
        <h2
          className={css({
            fontSize: "3xl",
            fontWeight: "bold",
            textAlign: "center",
            color: "#e5e7eb",
          })}
        >
          Definition API
        </h2>

        <div
          className={css({
            display: "flex",
            gap: "6",
            justifyContent: "center",
            flexWrap: "wrap",
          })}
        >
          {generalStats.map((stat) => (
            <div
              key={stat.metric}
              className={css({
                bg: "#1a1a1a",
                border: "1px solid #2a2a2a",
                px: "6",
                py: "4",
                borderRadius: "lg",
                textAlign: "center",
                minW: "200px",
              })}
            >
              <span
                className={css({
                  fontSize: "sm",
                  color: "#9ca3af",
                  display: "block",
                })}
              >
                {stat.metric}
              </span>
              <span
                className={css({
                  fontSize: "xl",
                  fontWeight: "bold",
                  fontFamily: "mono",
                })}
              >
                {formatNumber(stat.value)}
              </span>
            </div>
          ))}
        </div>

        {/* Graph */}
        <div className={css({ h: "320px", w: "full" })}>
          <ResponsiveContainer>
            <BarChart
              data={sourceData.sort((a, b) => b.definitions - a.definitions)}
              margin={{ top: 20, right: 20, left: 10, bottom: 20 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#2a2a2a"
                vertical={false}
              />
              <XAxis
                dataKey="source"
                tick={{ fontSize: 12, fill: "#d1d5db" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#d1d5db" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(255,255,255,0.05)" }}
                contentStyle={{
                  backgroundColor: "#111",
                  border: "1px solid #333",
                  borderRadius: "0.5rem",
                  color: "#f9fafb",
                }}
              />
              <Bar
                dataKey="definitions"
                fill="url(#barGradient)"
                radius={[4, 4, 0, 0]}
              />
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9ca3af" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="#111" stopOpacity={0.7} />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* API Endpoints */}
        <div className={css({ display: "grid", gap: "3" })}>
          <h3
            className={css({
              fontSize: "xl",
              fontWeight: "600",
              mb: "2",
              textAlign: "center",
              color: "#e5e7eb",
            })}
          >
            API Endpoints
          </h3>
          {endpoints.map((endpoint, index) => (
            <div
              key={index}
              className={css({
                display: "flex",
                flexDirection: { base: "column", md: "row" },
                alignItems: { base: "flex-start", md: "center" },
                gap: "3",
                bg: "#111",
                p: "3",
                borderRadius: "md",
                border: "1px solid #1f1f1f",
                _hover: { bg: "#151515" },
                transition: "background 0.2s",
                cursor: "pointer",
              })}
              onClick={() => navigator.clipboard.writeText(endpoint.path)}
              title="Click to copy"
            >
              <span
                className={css({
                  bg: "#333",
                  color: "#e5e7eb",
                  px: "2",
                  py: "1",
                  borderRadius: "md",
                  fontSize: "xs",
                  fontWeight: "bold",
                  minW: "12",
                })}
              >
                {endpoint.method}
              </span>
              <code
                className={css({
                  fontFamily: "mono",
                  color: "#f1f5f9",
                  fontSize: { base: "xs", md: "sm" },
                  flex: "1",
                })}
              >
                {endpoint.path}
              </code>
              <span
                className={css({
                  color: "#9ca3af",
                  fontSize: { base: "xs", md: "sm" },
                })}
              >
                {endpoint.desc}
              </span>
              <Copy
                className={css({
                  w: "4",
                  h: "4",
                  color: "#6b7280",
                  _hover: { color: "#9ca3af" },
                })}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DictionaryCharts;
