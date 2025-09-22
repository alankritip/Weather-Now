# 🌦️ Weather Now
A clean React + Tailwind app to search for city weather using the Open-Meteo API.

* ![React](https://img.shields.io/badge/React-18-blue)

* ![Tailwind](https://img.shields.io/badge/TailwindCSS-4.0-green)

* ![License](https://img.shields.io/badge/license-MIT-yellow)

## 📑 Table of Contents
### Demo
<!-- - Live App: <LIVE_DEMO_URL>
- AI Collaboration Log: <CHAT_LOG_URL> -->

### Project Structure

```code
weather-app/
├── public/                     # Static assets (favicons, demo video/gif if needed)
├── src/
│   ├── App.jsx                 # Main app logic:
│   │                           # - City search
│   │                           # - Geocoding + weather fetch
│   │                           # - Unit toggle (°C/°F)
│   │                           # - Rendering card & metrics
│   │
│   ├── components/
│   │   ├── WeatherBackground.jsx  # Chooses background GIF/MP4 based on { main, isDay }
│   │   ├── Icons.jsx              # Small reusable SVG components:
│   │   │                          #   - Wind
│   │   │                          #   - Humidity
│   │   │                          #   - Sunrise
│   │   │                          #   - Sunset
│   │
│   ├── index.css                # Tailwind directives + global styles
│   ├── main.jsx                 # Vite + React entry point
│
├── package.json
├── tailwind.config.js
└── vite.config.js

```
### Features
- City search with debounced suggestions using Open‑Meteo Geocoding API.
- Current weather: temperature, humidity, wind speed, and condition mapping from WMO codes.
- Day/night adaptive backgrounds (GIF/MP4) via WeatherBackground.
- Sunrise/Sunset times for the selected location (timezone auto).
- One‑click unit toggle: °C/km/h ↔ °F/mph.
- No API key required.
### Tech Stack
- React 18 + Vite
- Tailwind CSS
- Open‑Meteo Forecast + Geocoding APIs
- Local media assets (GIF/MP4) and PNG icons

### Installation

#### Clone the repository:
 ```code
 git clone https://github.com/alankritip/Weather-Now
 cd Weather-Now
```
#### Install dependencies:
```code
npm install
```
#### Start the dev server:
```code 
npm run dev
```

### Usage

- Type at least 3 characters in the search box to get city suggestions and select one.

- The app fetches current weather with units based on toggle state.

- Displayed:

  - Temperature: current.temperature_2m

  - Humidity: current.relative_humidity_2m

  - Wind: current.wind_speed_10m

  - Background: derived from current.weather_code + current.is_day

  - Sunrise/Sunset: daily.sunrise, daily.sunset

  - Toggle °C/°F to refetch with temperature_unit and windspeed_unit.

### Tests

Manual test checklist

  - Search debounces and shows up to 5 suggestions.

  - Selecting a suggestion loads current weather without errors.

  - Unit toggle updates values and labels correctly.

  - Loading and error states don’t break layout.

  - Background switches between day/night appropriately.

[License](https://choosealicense.com/licenses/mit/)


