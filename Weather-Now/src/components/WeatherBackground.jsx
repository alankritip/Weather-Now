import React from 'react';

import Thunderstorm from '../assets/Thunderstorm.gif';
import Rain from '../assets/Rain.gif';
import SnowDay from '../assets/Snow.gif';
import ClearDay from '../assets/ClearDay.gif';
import ClearNight from '../assets/ClearNight.gif';
import CloudsDay from '../assets/CloudsDay.gif';
import CloudsNight from '../assets/CloudsNight.gif';
import Haze from '../assets/Haze.gif';
import fallbackVideo from '../assets/video1.mp4';

const WeatherBackground = ({ condition }) => {
  const assets = {
    Thunderstorm: Thunderstorm,
    Drizzle: Rain,
    Rain: Rain,
    Snow: SnowDay,
    Clear: { day: ClearDay, night: ClearNight },
    Clouds: { day: CloudsDay, night: CloudsNight },
    Mist: Haze,
    Smoke: Haze,
    Haze: Haze,
    Fog: Haze,
    default: fallbackVideo
  };

  const getBackground = () => {
    if (!condition || !condition.main) return assets.default;
    const asset = assets[condition.main] || assets.default;

    if (asset && typeof asset === 'object') {
      return condition.isDay ? asset.day : asset.night;
    }
    return asset;
  };

  const background = getBackground();

  const isVideo = background === fallbackVideo;

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      {isVideo ? (
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover opacity-100 pointer-events-none animate-fade-in"
        >
          <source src={fallbackVideo} type="video/mp4" />
        </video>
      ) : (
        <img
          src={background}
          alt="weather background"
          className="w-full h-full object-cover opacity-20 pointer-events-none animate-fade-in"
        />
      )}
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
};

export default WeatherBackground;
