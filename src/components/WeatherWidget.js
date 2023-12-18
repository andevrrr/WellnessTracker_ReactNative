import React, { useState, useEffect } from 'react';
import { View, Text, Image } from 'react-native';
import { getWeatherData } from '../services/weatherService'; // You need to implement this function

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    // Assume getWeatherData is an async function that fetches weather data
    const fetchWeather = async () => {
      const data = await getWeatherData();
      setWeather(data);
    };

    fetchWeather();
  }, []);

  return (
    <View style={{ padding: 20, borderRadius: 10, backgroundColor: 'white' }}>
      {weather ? (
        <>
          <Text>{`${weather.temperature}°`}</Text>
          <Text>{weather.condition}</Text>
          <Image source={{ uri: weather.iconUrl }} style={{ width: 50, height: 50 }} />
        </>
      ) : (
        <Text>Loading...</Text>
      )}
    </View>
  );
};

export default WeatherWidget;
