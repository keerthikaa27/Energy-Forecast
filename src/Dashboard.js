import React, { useState, useEffect } from "react";
import { getPrediction } from "./api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import Loader from "./Loader";

const ArrowOverlay = ({ points }) => {
  return points.map((point, i) => {
    const next = points[i + 1];
    if (!next) return null;

    const direction = next.y > point.y ? "↓" : "↑";
    const color = direction === "↑" ? "limegreen" : "tomato";

    return (
      <text
        key={i}
        x={point.x}
        y={point.y - 10}
        fill={color}
        fontSize={16}
        style={{ animation: "pulse 1s infinite" }}
      >
        {direction}
      </text>
    );
  });
};

const DEFAULT_LEN = 24;
const MIN_VAL = 0;
const MAX_VAL = 100000;

export default function Dashboard({ onBack }) {
  const [mode, setMode] = useState("textarea");
  const [raw, setRaw] = useState("");
  const [errors, setErrors] = useState([]);
  const [values, setValues] = useState(Array(DEFAULT_LEN).fill(1));
  const [yesterday, setYesterday] = useState(Array(DEFAULT_LEN).fill(0));
  const [prediction, setPrediction] = useState([]);
  const [loading, setLoading] = useState(false);
  const [horizon, setHorizon] = useState(6);

  const timestamp = new Date().toISOString();

  const classifyDemand = (avg) => {
    if (avg < 25000) return "low";
    if (avg < 60000) return "moderate";
    if (avg < 90000) return "high";
    return "critical";
  };

  const generateInsight = (avg, peak, timestamp) => {
    if (!avg) return "Awaiting prediction...";
    const demandLevel = classifyDemand(avg);
    const hour = new Date(timestamp).getHours();
    const timeContext =
      hour >= 18 && hour <= 21 ? "during peak hours" : "in off-peak hours";

    const insights = {
      low: `🔋 Low demand expected ${timeContext}. Ideal for battery charging or equipment maintenance.`,
      moderate: `📊 Stable usage forecasted ${timeContext}. Operations can proceed normally.`,
      high: `⚠️ High consumption expected ${timeContext}. Consider load balancing or shifting flexible loads.`,
      critical: `🚨 Critical demand spike forecasted ${timeContext}. Prepare for grid stress or tariff surges.`,
    };

    return insights[demandLevel];
  };

  const generateTip = (avg, peak) => {
    if (!avg) return "";
    if (peak > 95000)
      return "💡 Tip: Peak usage may trigger penalties. Review your energy contract.";
    if (avg < 20000)
      return "💡 Tip: Schedule flexible loads now to take advantage of low tariffs.";
    if (avg < 50000)
      return "💡 Tip: Use predictive insights to optimize HVAC and lighting.";
    if (avg < 80000)
      return "💡 Tip: Consider activating battery storage or demand response programs.";
    return "💡 Tip: Alert your operations team and prepare for emergency load shedding if needed.";
  };

  const handlePredict = async () => {
    setLoading(true);
    setPrediction([]);
    try {
      const updateTrendArrow = (arrow, curvature) => {
        const arrowEl = document.getElementById("trend-arrow");
        const curvatureEl = document.getElementById("trend-curvature");

        if (!arrowEl || !curvatureEl) return;

        arrowEl.textContent = arrow === "up" ? "⬆️" : "⬇️";
        arrowEl.style.color = arrow === "up" ? "green" : "red";

        curvatureEl.textContent =
          curvature === "accelerating" ? "Accelerating trend" : "Steady trend";
      };

      const response = await getPrediction(values, horizon);
      console.log("Prediction response:", response);

      let forecast = [];
      let arrow = null;
      let curvature = null;

      if (Array.isArray(response)) {
        forecast = response;
      } else if (response && Array.isArray(response.forecast)) {
        forecast = response.forecast;
        arrow = response.arrow;
        <ArrowOverlay arrow={arrow} curvature={curvature} />

        curvature = response.curvature;
      }

      setPrediction(forecast || []);
      if (arrow && curvature) {
        updateTrendArrow(arrow, curvature);
      }

      setErrors([]);
    } catch (err) {
      console.error(err);
      setErrors(["Prediction failed. Please check your backend."]);
    }
    setLoading(false);
  };

  useEffect(() => {
    const sampleValues = Array.from(
      { length: DEFAULT_LEN },
      (_, i) => 45000 + i * 500
    );
    const testPrediction = async () => {
      try {
        const response = await getPrediction(sampleValues, horizon);

        let forecast = [];
        if (Array.isArray(response)) {
          forecast = response;
        } else if (response && Array.isArray(response.forecast)) {
          forecast = response.forecast;
        }

        setPrediction(forecast || []);
        setValues(sampleValues);
      } catch (err) {
        console.error("Test prediction error:", err);
        setErrors(["Test prediction failed."]);
      }
    };
    testPrediction();
  }, [horizon]);

  useEffect(() => {
    if (values && values.length > 0) {
      setYesterday(values.map((v) => +(v * 0.9).toFixed(2)));
    }
  }, [values]);

  const handleRawChange = (e) => {
    const text = e.target.value;
    setRaw(text);
    const arr = text
      .split(/[\s,]+/)
      .filter((t) => t !== "")
      .map((t) => parseFloat(t));

    if (arr.length !== DEFAULT_LEN) {
      setErrors([`Enter exactly ${DEFAULT_LEN} values.`]);
      return;
    }
    if (arr.some((v) => isNaN(v) || v < MIN_VAL || v > MAX_VAL)) {
      setErrors([`Values must be numbers between ${MIN_VAL} and ${MAX_VAL}.`]);
      return;
    }

    setErrors([]);
    setValues(arr);
  };

  const handleSliderChange = (idx, val) => {
    const copy = [...values];
    copy[idx] = val;
    setValues(copy);
  };

  const chartData = (values || []).map((v, i) => ({
    step: i + 1,
    actual: v,
    yesterday: yesterday[i] ?? 0,
  }));

  if (prediction && prediction.length > 0) {
    prediction.forEach((p, i) => {
      chartData.push({
        step: DEFAULT_LEN + i + 1,
        predicted: p,
      });
    });
  }

  const avgPred =
    prediction && prediction.length > 0
      ? Math.round(
          prediction.reduce((sum, v) => sum + v, 0) / prediction.length
        )
      : null;

  const peakPred =
    prediction && prediction.length > 0 ? Math.max(...prediction) : null;

  return (
    <div
      className="min-h-screen flex flex-col items-center text-gray-100"
      style={{ backgroundColor: "#4e121b" }}
    >
      {/* Back Button */}
      <button
        onClick={onBack}
        className="self-start ml-6 mt-4 px-4 py-2 rounded-xl font-semibold"
        style={{
          backgroundColor: "#4e121b",
          color: "#fcd5d9",
          boxShadow: "0 0 8px #4e121b",
        }}
        onMouseEnter={(e) => (e.target.style.boxShadow = "0 0 16px #ff4e79")}
        onMouseLeave={(e) => (e.target.style.boxShadow = "0 0 8px #4e121b")}
      >
        ← Back to Home
      </button>

      {/* Header */}
      <header
        className="w-full py-4 shadow-lg"
        style={{ backgroundColor: "#030303ff" }}
      >
        <h1 className="text-2xl md:text-3xl font-bold text-center text-white">
          Energy Forecasting Dashboard
        </h1>
      </header>

      {/* Input Section */}
      <section
        className="w-full max-w-4xl mt-8 p-6 rounded-xl shadow-xl"
        style={{ backgroundColor: "#000000" }}
      >
        <p className="mb-4 font-medium text-gray-200">
          Enter the last 24 hours of energy consumption:
        </p>

        {/* Horizon Selector */}
        <div className="mb-4">
          <label className="text-gray-200 mr-2">Forecast Horizon:</label>
          <select
            value={horizon}
            onChange={(e) => setHorizon(Number(e.target.value))}
            className="bg-black text-fuchsia-200 border border-fuchsia-900 rounded px-2 py-1"
          >
            {[1, 6, 12, 24].map((h) => (
              <option key={h} value={h}>
                Next {h} hours
              </option>
            ))}
          </select>
        </div>

        {/* Mode Toggle */}
        <div className="mb-4 flex space-x-4">
          <button
            onClick={() => setMode("textarea")}
            className={`px-4 py-2 rounded ${
              mode === "textarea"
                ? "bg-#4e121b text-white"
                : "bg-gray-700 text-gray-200"
            }`}
          >
            Bulk‐paste / CSV
          </button>
          <button
            onClick={() => setMode("sliders")}
            className={`px-4 py-2 rounded ${
              mode === "sliders"
                ? "bg-#4e121b text-white"
                : "bg-gray-700 text-gray-200"
            }`}
          >
            Sliders
          </button>
        </div>

        {/* Textarea Input */}
        {mode === "textarea" && (
          <textarea
            rows={3}
            className="w-full mb-4 p-2 bg-black border border-fuchsia-900 text-fuchsia-200 rounded"
            placeholder="Paste 24 values (comma or space separated)"
            value={raw}
            onChange={handleRawChange}
          />
        )}

        {/* Sliders */}
        {mode === "sliders" && (
          <div className="grid grid-cols-6 gap-4 mb-4">
            {(values || []).map((v, i) => (
              <div key={i} className="flex flex-col items-center">
                <label className="text-sm text-gray-300">{i + 1}:00</label>
                <input
                  type="range"
                  min={MIN_VAL}
                  max={MAX_VAL}
                  step="1"
                  value={v}
                  onChange={(e) => handleSliderChange(i, Number(e.target.value))}
                  className="w-full"
                />
                <span className="text-fuchsia-200 mt-1">{v}</span>
              </div>
            ))}
          </div>
        )}

        {/* Errors */}
        {errors.length > 0 && (
          <ul className="text-red-500 mb-4 list-disc list-inside">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        )}

        {/* Predict Button */}
        <button
          onClick={handlePredict}
          disabled={loading}
          className="w-full py-2 rounded-xl font-bold"
          style={{
            backgroundColor: "#4e121b",
            color: "#fcd5d9",
            boxShadow: "0 0 8px #4e121b",
          }}
          onMouseEnter={(e) => (e.target.style.boxShadow = "0 0 20px #ff4e79")}
          onMouseLeave={(e) => (e.target.style.boxShadow = "0 0 8px #4e121b")}
        >
          {loading
            ? "Predicting..."
            : `Predict Next ${horizon} Hour${horizon > 1 ? "s" : ""}`}
        </button>
        {loading && <Loader />}
      </section>

      {/* KPI Cards */}
      <div className="w-full max-w-4xl mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Last Hour Usage", value: values?.[23] ?? "-" },
          {
            title: `Predicted Avg (${horizon}h)`,
            value: avgPred ?? "-",
          },
          {
            title: `Predicted Peak (${horizon}h)`,
            value: peakPred ?? "-",
          },
          {
            title: "Current Avg Consumption",
            value:
              values && values.length > 0
                ? Math.round(values.reduce((s, v) => s + v, 0) / values.length)
                : "-",
          },
        ].map((card, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl shadow-lg flex flex-col items-center justify-center transform transition-transform duration-200 cursor-pointer"
            style={{ backgroundColor: "#0c0c0cff", color: "#fcd5d9" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.transform = "scale(1)")
            }
          >
            <h3 className="text-sm font-semibold mb-2">{card.title}</h3>
            <p className="text-xl font-bold">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Insights & Tips */}
      {prediction.length > 0 && !loading && (
        <section
          className="w-full max-w-4xl mt-6 p-6 rounded-xl shadow-xl"
          style={{ backgroundColor: "#000000" }}
        >
          <h2 className="text-xl font-semibold mb-2 text-fuchsia-200">
            Forecast Insights
          </h2>
          <p className="text-lg mb-2 text-yellow-300">
            {generateInsight(avgPred, peakPred, timestamp)}
          </p>
          <p className="text-md text-fuchsia-400 italic">
            {generateTip(avgPred, peakPred)}
          </p>
        </section>
      )}

      {/* Prediction Chart */}
      {prediction.length > 0 && !loading && (
        <section
          className="w-full max-w-4xl mt-6 p-6 rounded-xl shadow-xl"
          style={{ backgroundColor: "#000000" }}

        >
          <h2 className="text-xl font-semibold mb-4 text-fuchsia-200">
            Forecast Chart: Next {horizon} Hour
            {horizon > 1 ? "s" : ""}
          </h2>

          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData} margin={{ right: 30, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4e121b" />
              <XAxis dataKey="step" stroke="#fcd5d9" />
              <YAxis stroke="#fcd5d9" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#000000",
                  border: "none",
                  color: "#fcd5d9",
                }}
                itemStyle={{ color: "#fcd5d9" }}
              />
              <Legend wrapperStyle={{ color: "#fcd5d9" }} />
            <Line
             type="monotone"
dataKey="actual"
stroke="#f28b82"
dot={false}
name="Actual Usage"
/>
<Line
type="monotone"
dataKey="yesterday"
stroke="#ff7300"
strokeDasharray="4 2"
dot={false}
name="Yesterday"
/>
<Line
type="monotone"
dataKey="predicted"
stroke="#ffd700"
strokeDasharray="5 5"
dot={{ r: 4 }}
name="Forecast"
isAnimationActive={false}
/>
</LineChart>
</ResponsiveContainer>
</section>
)}
</div>
);
}