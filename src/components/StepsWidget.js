import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Pedometer } from 'expo-sensors';

const StepsWidget = () => {
  const [steps, setSteps] = useState(0);
  const screenWidth = Dimensions.get("window").width;
  const widgetSize = screenWidth / 2 - 40;

  const styles = StyleSheet.create({
    widgetContainer: {
      padding: 20,
      borderRadius: 40,
      backgroundColor: "white",
      width: widgetSize,
      height: widgetSize,
      marginLeft: 10,
      marginTop: 50,
      shadowColor: "#7F5DF0",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.25,
      shadowRadius: 3.5,
      elevation: 5,
      fontSize: 20,
      fontWeight: "bold",
      color: "black",
      justifyContent: "center",
    },
    stepsText: {
      fontSize: 20,
      fontWeight: "bold",
      color: "black",
    },
    steps: {
        fontSize: 50,
      fontWeight: "bold",
      color: "black",
    }
  });

  useEffect(() => {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    Pedometer.isAvailableAsync().then(
      available => {
        if (available) {
          Pedometer.getStepCountAsync(startOfDay, endOfDay).then(
            result => {
              setSteps(result.steps);
            },
            error => {
              console.error(error);
            }
          );
        }
      },
      error => {
        console.error(error);
      }
    );
  }, []);

  return (
    <View style={styles.widgetContainer}>
      <Text>Today</Text>
      <Text style={styles.stepsText}>Steps</Text>
      <Text style={styles.steps}>{steps}</Text>
    </View>
  );
};

export default StepsWidget;
