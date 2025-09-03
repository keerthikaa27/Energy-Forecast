export const getPrediction = async (values) => {
  const response = await fetch("https://energy-forecast-backend.onrender.com/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ values }),
  });

  if (!response.ok) throw new Error("Prediction failed");
  const data = await response.json();
  return data.prediction;
};
