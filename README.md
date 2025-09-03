# Energy Forecasting Dashboard

Welcome to a project built with purpose — a full-stack energy forecasting dashboard designed to turn raw data into real insights. Whether you're a data enthusiast, energy analyst, or just curious about how AI can power smarter decisions, this app is here to show you what's possible.

## What It Does

This dashboard visualizes time-series energy data and forecasts future consumption using LSTM neural networks. It’s fast, responsive, and built to work seamlessly across devices — from desktops to mobile.

- Real-time forecasting with AI/ML (LSTM)
- Backend API powered by Flask
- Frontend built in React with a clean, intuitive UI
- Deployed on Render (backend) and Netlify (frontend)
- Live integration — no localhost dependencies

## Tech Stack

| Layer      | Tech Used         |
|------------|-------------------|
| Frontend   | React, Axios, Netlify |
| Backend    | Flask, Gunicorn, Render |
| AI/ML      | LSTM (Keras/TensorFlow) |
| Deployment | GitHub, CI/CD, Environment Variables |

## Getting Started

Clone the repo and run locally:

git clone https://github.com/keerthikaa27/Energy-Forecast.git

## Frontend Setup

cd frontend
npm install
npm start

# Backend Setup

My backend repo - https://github.com/keerthikaa27/energy-forecast-backend.git

cd backend
pip install -r requirements.txt
python app.py
Note: For production, use gunicorn app:app and set environment variables for seamless deployment.

## Live Demo

Check out the live version here: https://energyforecast.netlify.app/

## Contributing

Pull requests are welcome! If you spot a bug, have a feature idea, or want to improve the UX — jump in.
Fork the repo
Create your feature branch 
Commit your changes (git commit -m 'Add something')
Push to the branch (git push origin main)
Open a pull request

## License
This project is licensed under the MIT License — feel free to use, modify, and share.






