import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

function SmoothTrendArrow({ values, prediction }) {
  const [arrowPos, setArrowPos] = useState(0);

  // Hooks are always called, render nothing conditionally instead
  useEffect(() => {
    if (!values || values.length < 2 || prediction === null) return;

    
    const end = Math.min(values.length, 5); // last 5 + predicted
    const interval = setInterval(() => {
      setArrowPos((prev) => {
        if (prev >= end) {
          clearInterval(interval);
          return end;
        }
        return prev + 0.05;
      });
    }, 30);
    return () => clearInterval(interval);
  }, [values, prediction]);

  if (!values || values.length < 2 || prediction === null) return null;

  const trendUp = prediction > values[values.length - 1];

  const chartData = [
    ...values.slice(-5).map((v, i) => ({ x: i + 1, y: v })),
    { x: 6, y: prediction },
  ];

  const getArrowY = (xPos) => {
    const idx = Math.floor(xPos);
    const nextIdx = Math.min(idx + 1, chartData.length - 1);
    const fraction = xPos - idx;
    return chartData[idx].y + fraction * (chartData[nextIdx].y - chartData[idx].y);
  };

  const yMin = Math.min(...chartData.map((d) => d.y));
  const yMax = Math.max(...chartData.map((d) => d.y));

  return (
    <div
      className="w-full max-w-md mx-auto mt-4 p-4 rounded-xl"
      style={{ backgroundColor: "#1a1a1a" }}
    >
      <h3 className="text-white font-semibold mb-2">⚡ Quick Trend</h3>
      <div style={{ position: "relative", height: 120 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <XAxis dataKey="x" hide />
            <YAxis hide domain={["auto", "auto"]} />
            <Line
              type="monotone"
              dataKey="y"
              stroke={trendUp ? "#ff4e79" : "#00ff99"}
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>

        <svg
          style={{
            position: "absolute",
            left: `${(arrowPos / (chartData.length - 1)) * 100}%`,
            bottom: `${((getArrowY(arrowPos) - yMin) / (yMax - yMin)) * 100}%`,
            transform: "translate(-50%, 50%)",
            width: "24px",
            height: "24px",
          }}
        >
          <polygon
            points="12,0 24,24 0,24"
            fill={trendUp ? "#ff4e79" : "#00ff99"}
          />
        </svg>
      </div>
      <p className="text-gray-300 text-sm mt-2 text-center">
        {trendUp ? "Consumption trending up" : "Consumption trending down"}
      </p>
    </div>
  );
}

export default SmoothTrendArrow;
