import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Image, StyleSheet } from 'react-native';
import * as Location from 'expo-location';
import { Dimensions } from 'react-native';
import axios from 'axios';

const WeatherWidget = () => {
  const [weather, setWeather] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      getWeatherData(location.coords.latitude, location.coords.longitude);
    })();
  }, []);

  const getWeatherData = async (latitude, longitude) => {
    try {
      const WEATHER_API_KEY = '4dd92c06b63e4535bc893519232211';
      const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${WEATHER_API_KEY}&q=${latitude},${longitude}`);
      const { temp_c, condition } = response.data.current;
      const { name } = response.data.location;
      setWeather({
        temperature: temp_c,
        city: name,
        condition: condition.text
      });
    } catch (error) {
      setErrorMsg('Failed to load weather data');
      console.error(error);
    }
  };

  if (errorMsg) {
    return <Text>{errorMsg}</Text>;
  }

  if (!weather) {
    return <ActivityIndicator size="large" />;
  }

  const screenWidth = Dimensions.get('window').width;
  const widgetSize = (screenWidth / 2) - 20;

const styles = StyleSheet.create({
    widgetContainer: {
      padding: 20,
      borderRadius: 40,
      backgroundColor: 'white',
      width: widgetSize,
      height: widgetSize,
      marginRight: 10,
      marginTop: 50,
      shadowColor: '#7F5DF0',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.25,
      shadowRadius: 3.5,
      elevation: 5,
      justifyContent: 'center',
    },
    textContainer: {
        width: '100%',
      },
    cityText: {
      fontSize: 34,
      fontWeight: 'bold',
      color: 'black',
    },
    temperatureText: {
      fontSize: 30,
      color: 'black',
    },
    conditionImage: {
      position: 'absolute',
      top: 10,
      right: 10,
      width: 50,
      height: 50,
      borderColor: '#7F5DF0',
      borderWidth: 2,
      borderRadius: 25,
    },
  });

  return (
    <View style={styles.widgetContainer}>
      <View style={styles.textContainer}>
        <Text style={styles.cityText}>{weather.city}</Text>
        <Text style={styles.temperatureText}>{`${weather.temperature}°C`}</Text>
      </View>
      {/* <Image
        style={styles.conditionImage}
        source={{ uri: conditionImageSource }} // replace with your image source
      /> */}
    </View>
  );
};

export default WeatherWidget;

