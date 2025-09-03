export async function getPrediction(values, horizon = 6) {
  const res = await fetch(`http://localhost:10000/predict/${horizon}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ values }),
  });
  const data = await res.json();
  return data.forecast; // array of predicted values
}

