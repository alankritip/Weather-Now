import React from 'react';
import windPng from '../assets/wind.png';
import humidityPng from '../assets/humidity.png';
import sunrisePng from '../assets/Sunrise.png';
import sunsetPng from '../assets/Sunset.png';

const Icon = ({ src, alt, className = '' }) => (
  <img src={src} alt={alt} className={`h-8 w-8 inline-block ${className}`} />
);

// Named, capitalized exports for JSX usage
export const WindIcon = ({ className = '' }) => (
  <Icon src={windPng} alt="wind" className={`animate-icon svg-hover ${className}`} />
);

export const HumidityIcon = ({ className = '' }) => (
  <Icon src={humidityPng} alt="humidity" className={`animate-icon svg-hover ${className}`} />
);


export const SunriseIcon = ({ className = '' }) => (
  <Icon src={sunrisePng} alt="sunrise" className={`animate-icon svg-hover ${className}`} />
);

export const SunsetIcon = ({ className = '' }) => (
  <Icon src={sunsetPng} alt="sunset" className={`animate-icon svg-hover ${className}`} />
);
