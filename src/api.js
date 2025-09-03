const BASE_URL = "https://energy-forecast-backend.onrender.com/"; 

export async function getPrediction(values, horizon = 6) {
  const res = await fetch(`${BASE_URL}/predict/${horizon}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ values }),
  });
  const data = await res.json();
  return data.forecast;
}

