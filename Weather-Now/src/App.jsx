import React, { useEffect, useMemo, useState } from 'react';
import WeatherBackground from './components/WeatherBackground';
import { WindIcon, HumidityIcon, SunriseIcon, SunsetIcon } from './components/Icons.jsx';

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

// WMO code -> broad condition for background assets
const WEATHER_CODE_MAP = {
  0: 'Clear',
  1: 'Clear', 2: 'Clouds', 3: 'Clouds',
  45: 'Haze', 48: 'Haze',
  51: 'Drizzle', 53: 'Drizzle', 55: 'Drizzle',
  56: 'Drizzle', 57: 'Drizzle',
  61: 'Rain', 63: 'Rain', 65: 'Rain',
  66: 'Rain', 67: 'Rain',
  71: 'Snow', 73: 'Snow', 75: 'Snow',
  77: 'Snow',
  80: 'Rain', 81: 'Rain', 82: 'Rain',
  85: 'Snow', 86: 'Snow',
  95: 'Thunderstorm',
  96: 'Thunderstorm', 99: 'Thunderstorm'
};

const App = () => {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [unit, setUnit] = useState('C'); // 'C' or 'F'
  const [loading, setLoading] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);

  // Debounced geocoding lookup
  useEffect(() => {
    const q = city.trim();
    if (q.length < 3) {
      setSuggestions([]);
      return;
    }
    const controller = new AbortController();
    const t = setTimeout(async () => {
      try {
        const params = new URLSearchParams({ name: q, count: '5', language: 'en' });
        const res = await fetch(`${GEO_URL}?${params.toString()}`, { signal: controller.signal });
        if (!res.ok) throw new Error('Geocoding failed');
        const data = await res.json();
        setSuggestions(data.results || []);
      } catch (e) {
        if (e.name !== 'AbortError') setSuggestions([]);
      }
    }, 300);
    return () => {
      clearTimeout(t);
      controller.abort();
    };
  }, [city]);

  const fetchWeatherData = async (place) => {
    if (!place) return;
    setLoading(true);
    setSelectedPlace(place);
    try {
      const params = new URLSearchParams({
        latitude: String(place.latitude),
        longitude: String(place.longitude),
        current: ['temperature_2m', 'relative_humidity_2m', 'wind_speed_10m', 'weather_code', 'is_day'].join(','),
        daily: ['sunrise', 'sunset'].join(','),
        timezone: 'auto',
        temperature_unit: unit === 'C' ? 'celsius' : 'fahrenheit',
        windspeed_unit: unit === 'C' ? 'kmh' : 'mph'
      });
      const res = await fetch(`${FORECAST_URL}?${params.toString()}`);
      if (!res.ok) throw new Error('Forecast fetch failed');
      const data = await res.json();
      setWeather(data);
    } catch (_e) {
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPlace) {
      fetchWeatherData(selectedPlace);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unit]);

  const conditionObj = useMemo(() => {
    if (!weather || !weather.current) return null;
    const code = weather.current.weather_code;
    const main = WEATHER_CODE_MAP[code] || 'Clear';
    const isDay = Boolean(weather.current.is_day);
    return { main, isDay };
  }, [weather]);

  const handleSuggestionClick = (s) => {
    setCity(`${s.name}, ${s.country}${s.admin1 ? `, ${s.admin1}` : ''}`);
    setSuggestions([]);
    fetchWeatherData(s);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length > 0) handleSuggestionClick(suggestions[0]);
  };

  const toggleUnit = () => setUnit((u) => (u === 'C' ? 'F' : 'C'));

  // Derive sunrise/sunset strings
  const sunrise = weather?.daily?.sunrise?.[0] || '—';
  const sunset = weather?.daily?.sunset?.[0] || '—';

  return (
    <div className="min-h-screen relative">
      <WeatherBackground condition={conditionObj} />

      <div className="flex items-center justify-center p-8 min-h-screen relative z-10">
        <div className="bg-transparent backdrop-filter backdrop-blur-md rounded-xl shadow-2xl p-8 max-w-md text-yellow-500 w-full border border-blue/30">
          <h1 className="text-4xl font-extrabold text-center mb-6">Weather Now</h1>

          {/* Search */}
          <form onSubmit={handleSubmit} className="flex flex-col relative">
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city"
              className="mb-4 p-3 border border-white/60 bg-transparent text-white placeholder-white focus:outline-none focus:border-blue-300 transition duration-300"
            />
            {suggestions.length > 0 && (
              <div className="absolute top-12 left-0 right-0 bg-black/40 shadow-md rounded z-10 max-h-60 overflow-auto">
                {suggestions.map((s) => (
                  <button
                    type="button"
                    key={`${s.latitude}-${s.longitude}-${s.id || s.name}`}
                    onClick={() => handleSuggestionClick(s)}
                    className="block hover:bg-blue-700/60 bg-transparent px-4 py-2 text-sm text-left w-full transition-colors text-white"
                  >
                    {s.name}, {s.country}{s.admin1 ? `, ${s.admin1}` : ''}
                  </button>
                ))}
              </div>
            )}
            <button
              type="submit"
              disabled={loading || city.trim().length < 3}
              className="bg-purple-700 disabled:bg-purple-700/50 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors"
            >
              {loading ? 'Loading…' : 'Get Weather'}
            </button>
          </form>

          {/* Weather display */}
          {weather?.current && (
            <div className="mt-6 text-center transition-opacity duration-500">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-bold">
                  {selectedPlace ? `${selectedPlace.name}, ${selectedPlace.country}${selectedPlace.admin1 ? `, ${selectedPlace.admin1}` : ''}` : '—'}
                </h2>
                <button
                  onClick={toggleUnit}
                  className="bg-blue-700 hover:bg-blue-800 text-white font-semibold py-1 px-3 rounded transition-colors"
                >
                  &deg;{unit}
                </button>
              </div>

              <div className="text-6xl font-extrabold text-white">
                {Math.round(weather.current.temperature_2m)}&deg;{unit}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-white/90">
                <div className="flex items-center gap-2 justify-center">
                  <WindIcon />
                  <span>{Math.round(weather.current.wind_speed_10m)} {unit === 'C' ? 'km/h' : 'mph'}</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <HumidityIcon />
                  <span>{Math.round(weather.current.relative_humidity_2m)}%</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <SunriseIcon />
                  <span>{sunrise}</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <SunsetIcon />
                  <span>{sunset}</span>
                </div>
              </div>

              <button
                onClick={() => { setWeather(null); setSelectedPlace(null); setCity(''); setSuggestions([]); }}
                className="mt-6 bg-purple-900 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded transition-colors"
              >
                New Search
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
