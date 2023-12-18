import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import * as Pedometer from 'expo-sensors';

const StepsWidget = () => {
  const [steps, setSteps] = useState(0);

  useEffect(() => {
    // Subscribe to pedometer updates
    const subscription = Pedometer.watchStepCount(result => {
      setSteps(result.steps);
    });

    return () => {
      // Unsubscribe to pedometer updates
      subscription.remove();
    };
  }, []);

  return (
    <View style={{ padding: 20, borderRadius: 10, backgroundColor: 'white' }}>
      <Text>{`Steps: ${steps}`}</Text>
    </View>
  );
};

export default StepsWidget;
