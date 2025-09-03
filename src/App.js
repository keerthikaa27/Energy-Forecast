import React, { useState } from "react";
import LandingPage from "./LandingPage";
import Dashboard from "./Dashboard";

function App() {
  const [showDashboard, setShowDashboard] = useState(false);

  return showDashboard ? (
    <Dashboard onBack={() => setShowDashboard(false)} />
  ) : (
    <LandingPage onStart={() => setShowDashboard(true)} />
  );
}

export default App;






