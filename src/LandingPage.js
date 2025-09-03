import React from "react";
import { FaChartLine, FaLaptopCode, FaCheckCircle } from "react-icons/fa";

function LandingPage({ onStart }) {
  return (
    <div
      className="min-h-screen flex flex-col justify-start items-center text-center px-6"
      style={{ backgroundColor: "#000000", color: "#ffffff", fontFamily: "'Inter', sans-serif'" }}
    >
      {/* Hero Section */}
      <div className="max-w-3xl mt-24">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-6" style={{ lineHeight: "1.2" }}>
          Energy Forecasting
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-gray-400">
          Predict the next hour of energy consumption with precision and clarity. Make informed decisions with our intelligent dashboard.
        </p>
        <button
          onClick={onStart}
          className="px-12 py-4 text-2xl font-semibold rounded-2xl"
          style={{ backgroundColor: "#4e121b", color: "#fcd5d9", boxShadow: "0 0 10px #4e121b" }}
          onMouseEnter={(e) => (e.target.style.boxShadow = "0 0 20px #ffd700")}
          onMouseLeave={(e) => (e.target.style.boxShadow = "0 0 10px #4e121b")}
        >
          Start Predicting
        </button>
      </div>

      {/* Features Section */}
      <div className="mt-16 max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
        <div className="p-6 rounded-xl shadow-lg flex flex-col items-start" style={{ backgroundColor: "#1a1a1a" }}>
          <FaChartLine className="text-4xl mb-4" style={{ color: "#fcd5d9" }} />
          <h3 className="text-xl font-semibold mb-2" style={{ color: "#fcd5d9" }}>Accurate Predictions</h3>
          <p className="text-gray-400 text-sm">
            Predict the next hour of energy consumption with high precision using advanced ML models.
          </p>
        </div>
        <div className="p-6 rounded-xl shadow-lg flex flex-col items-start" style={{ backgroundColor: "#1a1a1a" }}>
          <FaLaptopCode className="text-4xl mb-4" style={{ color: "#fcd5d9" }} />
          <h3 className="text-xl font-semibold mb-2" style={{ color: "#fcd5d9" }}>Interactive Dashboard</h3>
          <p className="text-gray-400 text-sm">
            Explore past energy consumption data and visualize predictions with interactive charts.
          </p>
        </div>
        <div className="p-6 rounded-xl shadow-lg flex flex-col items-start" style={{ backgroundColor: "#1a1a1a" }}>
          <FaCheckCircle className="text-4xl mb-4" style={{ color: "#fcd5d9" }} />
          <h3 className="text-xl font-semibold mb-2" style={{ color: "#fcd5d9" }}>User Friendly</h3>
          <p className="text-gray-400 text-sm">
            Simple, intuitive interface designed for professionals and beginners alike.
          </p>
        </div>
      </div>

      {/* About Section */}
<section className="mt-20 max-w-4xl px-6 py-10 rounded-xl shadow-xl text-left" style={{ backgroundColor: "#4e121b", color: "#ffffff" }}>
  <h2 className="text-3xl font-bold mb-6" style={{ color: "#ffffff" }}>About This Platform</h2>

  {/* Why Use Our Predictor */}
  <div className="mb-6">
    <h3 className="text-2xl font-semibold mb-2" style={{ color: "#fcd5d9" }}>Why Use Our Predictor?</h3>
    <ul className="list-disc list-inside text-gray-300">
      <li>Get accurate hourly energy consumption predictions using state-of-the-art LSTM neural networks.</li>
      <li>Make informed decisions to optimize energy usage and reduce wastage.</li>
      <li>Simple interface for professionals, businesses, and households.</li>
    </ul>
  </div>

  {/* How This Helps */}
  <div className="mb-6">
    <h3 className="text-2xl font-semibold mb-2" style={{ color: "#fcd5d9" }}>How This Helps</h3>
    <ul className="list-disc list-inside text-gray-300">
      <li>Visualize past energy consumption and predicted trends at a glance.</li>
      <li>Plan energy distribution efficiently for homes, offices, or factories.</li>
      <li>Reduce energy costs and contribute to sustainable practices.</li>
    </ul>
  </div>

  {/* Technology Behind */}
  <div className="mb-6">
    <h3 className="text-2xl font-semibold mb-2" style={{ color: "#fcd5d9" }}>Technology Behind</h3>
    <ul className="list-disc list-inside text-gray-300">
      <li>Machine Learning: LSTM models built with Python, TensorFlow, and Keras.</li>
      <li>Frontend: React.js for interactive UI and Recharts for professional chart visualizations.</li>
      <li>Styling: Tailwind CSS for responsive and modern design.</li>
    </ul>
  </div>

  {/* Who Can Benefit */}
  <div>
    <h3 className="text-2xl font-semibold mb-2" style={{ color: "#fcd5d9" }}>Who Can Benefit</h3>
    <ul className="list-disc list-inside text-gray-300">
      <li>Energy managers and utility companies for planning and efficiency.</li>
      <li>Businesses looking to optimize operational energy costs.</li>
      <li>Individuals who want to monitor and reduce household energy consumption.</li>
    </ul>
  </div>
</section>


      {/* Footer */}
      <footer className="mt-16 py-6 text-sm text-gray-500">
        © 2025 Energy Forecasting | Built with React
      </footer>
    </div>
  );
}

export default LandingPage;
