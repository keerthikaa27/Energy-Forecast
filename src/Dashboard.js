import React, { useState, useEffect } from "react";
import SmoothTrendArrow from "./SmoothTrendArrow";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Brush,
} from "recharts";
import Loader from "./Loader";

const DEFAULT_LEN = 24;
const MIN_VAL = 0;
const MAX_VAL = 100000;

export default function Dashboard({ onBack }) {
  // Bulk‐input mode state
  const [mode, setMode] = useState("textarea");       // "textarea" or "sliders"
  const [raw, setRaw] = useState("");                 // CSV/bulk text
  const [errors, setErrors] = useState([]);           // validation errors

  // Core data & prediction
  const [values, setValues] = useState(
    Array(DEFAULT_LEN).fill(1)
  );
  const [yesterday, setYesterday] = useState(
    Array(DEFAULT_LEN).fill(0)
  );
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  // Recalc “yesterday” whenever values change
  useEffect(() => {
    setYesterday(
      values.map((v) => +(v * 0.9).toFixed(2))
    );
  }, [values]);

  // Bulk‐paste / CSV handler
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

  // Slider change handler
  const handleSliderChange = (idx, val) => {
    const copy = [...values];
    copy[idx] = val;
    setValues(copy);
  };

  // Prediction API call
  const handlePredict = async () => {
    setLoading(true);
    setPrediction(null);
    try {
      const res = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ values }),
      });
      const data = await res.json();
      setPrediction(data.prediction);
      setErrors([]);
    } catch (err) {
      console.error(err);
      setErrors(["Prediction failed. Check your backend."]);
    }
    setLoading(false);
  };

  // Prepare chart data: actual (1–24), yesterday overlay, + predicted (step 25)
  const chartData = values.map((v, i) => ({
    step: i + 1,
    actual: v,
    yesterday: yesterday[i],
  }));
  if (prediction !== null) {
    chartData.push({
      step: DEFAULT_LEN + 1,
      predicted: prediction,
    });
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center text-gray-100"
      style={{ backgroundColor: "#4e121b" }}
    >
      {/* Back to Home */}
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

        {/* Bulk‐paste textarea */}
        {mode === "textarea" && (
          <textarea
            rows={3}
            className="w-full mb-4 p-2 bg-black border border-fuchsia-900 text-fuchsia-200 rounded"
            placeholder="Paste 24 values (comma or space separated)"
            value={raw}
            onChange={handleRawChange}
          />
        )}

        {/* Slider grid */}
        {mode === "sliders" && (
          <div className="grid grid-cols-6 gap-4 mb-4">
            {values.map((v, i) => (
              <div key={i} className="flex flex-col items-center">
                <label className="text-sm text-gray-300">{i + 1}:00</label>
                <input
                  type="range"
                  min={MIN_VAL}
                  max={MAX_VAL}
                  step="1"
                  value={v}
                  onChange={(e) =>
                    handleSliderChange(i, Number(e.target.value))
                  }
                  className="w-full"
                />
                <span className="text-fuchsia-200 mt-1">{v}</span>
              </div>
            ))}
          </div>
        )}

        {/* Validation errors */}
        {errors.length > 0 && (
          <ul className="text-red-500 mb-4 list-disc list-inside">
            {errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        )}

        {/* Predict Button & Loader */}
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
          {loading ? "Predicting..." : "Predict Next Value"}
        </button>
        {loading && <Loader />}
      </section>

      {/* KPI Cards */}
      <div className="w-full max-w-4xl mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { title: "Last Hour Usage", value: values[23] },
          {
            title: "Predicted Next Hour",
            value:
              prediction !== null ? prediction.toFixed(2) : "-",
          },
          {
            title: "Average Consumption",
            value: Math.round(
              values.reduce((sum, v) => sum + v, 0) / values.length
            ),
          },
          {
            title: "Peak Consumption",
            value: Math.max(...values),
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

      {/* Prediction Chart */}
      {prediction !== null && !loading && (
        <section
          className="w-full max-w-4xl mt-6 p-6 rounded-xl shadow-xl"
          style={{ backgroundColor: "#000000" }}
        >
          <h2 className="text-xl font-semibold mb-4">
            Predicted Value:{" "}
            <span
              style={{
                color: "#ffd700",
                textShadow: "0 0 8px #ffd700",
              }}
            >
              {prediction.toFixed(4)}
            </span>
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

              {/* Actual usage */}
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#f28b82"
                dot={false}
              />

              {/* Yesterday’s overlay */}
              <Line
                type="monotone"
                dataKey="yesterday"
                stroke="#ff7300"
                strokeDasharray="4 2"
                dot={false}
              />

              {/* Predicted point */}
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#ffd700"
                strokeDasharray="5 5"
                dot={{ r: 6 }}
                data={chartData.filter((d) => d.predicted != null)}
                isAnimationActive={false}
              />

              {/* Brush (zoom/scroll) */}
              <Brush dataKey="step" height={30} stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </section>
      )}

      {/* Smooth Trend Arrow */}
      {prediction !== null && (
        <SmoothTrendArrow values={values} prediction={prediction} />
      )}

      {/* Prediction Insights & Tips */}
      {prediction !== null && (
        <section
          className="w-full max-w-4xl mt-6 p-6 rounded-xl shadow-xl"
          style={{ backgroundColor: "#1a1a1a" }}
        >
          <h2 className="text-xl font-semibold mb-4 text-yellow-400">
            Insights & Tips Based on Prediction
          </h2>
          <ul className="list-disc list-inside text-gray-300">
            {(() => {
              const tips = [];

              // Safeguards
              const pred = Number(prediction);
              const lastValue = Number(values[values.length - 1]);
              const maxVal = Math.max(...values);
              const minVal = Math.min(...values);
              const range = maxVal - minVal;

              // Decide if the series is effectively flat (near-constant history)
              const MAG = Math.max(Math.abs(maxVal), Math.abs(minVal), 1);
              const FLAT_EPS = 1e-9;
              const REL_EPS = 0.001; // 0.1% relative tolerance for flatness
              const isFlat = range < Math.max(FLAT_EPS, MAG * REL_EPS);

              // Usage categorization:
              // - If flat: base on prediction vs last hour with clear % bands.
              // - If not flat: base on percentile of prediction among the last 24h distribution.
              if (isFlat) {
                // Relative change to last value
                const absChange = pred - lastValue;
                const relChange =
                  lastValue !== 0
                    ? absChange / Math.abs(lastValue)
                    : absChange === 0
                    ? 0
                    : Math.sign(absChange) * Infinity;

                // Bands: Very Low ≤ -40%, Low (-40%, -15%], Moderate (-15%, +15%), High [+15%, +40%], Very High ≥ +40%
                if (!isFinite(relChange)) {
                  if (pred === 0) {
                    tips.push("Usage similar to last hour (within ±15%). Maintain current efficiency.");
                  } else if (pred > 0) {
                    tips.push("Very high energy consumption expected (≥40% higher than last hour). Avoid heavy loads simultaneously.");
                  } else {
                    tips.push("Very low energy usage predicted (≥40% lower than last hour). Consider scheduling heavy appliances now.");
                  }
                } else if (relChange <= -0.40) {
                  tips.push("Very low energy usage predicted vs last hour (≥40% lower). Great time to run heavy appliances.");
                } else if (relChange <= -0.15) {
                  tips.push("Low energy usage predicted (15–40% lower than last hour). You can schedule tasks comfortably.");
                } else if (relChange < 0.15) {
                  tips.push("Usage similar to last hour (within ±15%). Maintain current efficiency.");
                } else if (relChange <= 0.40) {
                  tips.push("High energy usage predicted (15–40% higher). Consider deferring non‑essential loads.");
                } else {
                  tips.push("Very high energy consumption expected (≥40% higher). Avoid running heavy loads simultaneously.");
                }

                // Trend with tolerance (2% of lastValue)
                const trendTolAbs = Math.max(Math.abs(lastValue) * 0.02, 1e-9);
                if (pred > lastValue + trendTolAbs) {
                  tips.push("Consumption is trending upward compared to last hour.");
                } else if (pred < lastValue - trendTolAbs) {
                  tips.push("Consumption is trending downward compared to last hour.");
                } else {
                  tips.push("Consumption is stable compared to last hour.");
                }
              } else {
                // Percentile-based categorization when there's variability
                const series = [...values, pred].slice().sort((a, b) => a - b);
                const n = series.length;
                // Use midrank for duplicates: average index of equal values
                const first = series.indexOf(pred);
                const last = series.lastIndexOf(pred);
                const midIndex = (first + last) / 2;
                const percentile = n > 1 ? midIndex / (n - 1) : 0.5;

                if (percentile <= 0.20) {
                  tips.push("Very low energy usage predicted relative to recent hours (bottom 20%).");
                } else if (percentile <= 0.40) {
                  tips.push("Low energy usage predicted (20–40th percentile vs recent hours).");
                } else if (percentile < 0.60) {
                  tips.push("Moderate usage predicted (around the recent median).");
                } else if (percentile <= 0.80) {
                  tips.push("High energy usage predicted (60–80th percentile).");
                } else {
                  tips.push("Very high energy usage predicted (top 20% of recent hours).");
                }

                // Trend tolerance based on both range and lastValue
                const trendTolAbs = Math.max(range * 0.05, Math.abs(lastValue) * 0.02, 1e-9);
                if (pred > lastValue + trendTolAbs) {
                  tips.push("⬆Consumption is trending upward compared to last hour.");
                } else if (pred < lastValue - trendTolAbs) {
                  tips.push("⬇Consumption is trending downward compared to last hour.");
                } else {
                  tips.push("Consumption is stable compared to last hour.");
                }
              }

              // Generic energy-saving tips
              tips.push("Track daily trends to identify patterns and save on energy costs.");
              tips.push("Use energy-efficient appliances to reduce peak-time strain and costs.");

              return tips.map((tip, idx) => <li key={idx}>{tip}</li>);
            })()}
          </ul>
        </section>
      )}

      {/* Footer */}
      <footer
        className="w-full mt-8 py-4 text-center shadow-inner"
        style={{ backgroundColor: "#3d0f17", color: "#fcd5d9" }}
      >
        © 2025 Energy Forecasting | Built with React
      </footer>
    </div>
  );
}

