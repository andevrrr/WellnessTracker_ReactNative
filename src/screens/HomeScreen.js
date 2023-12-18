import React from 'react';
import { View, ScrollView } from 'react-native';
import WeatherWidget from '../components/WeatherWidget';
import StepsWidget from '../components/StepsWidget';
// import ScheduleWidget from '../components/ScheduleWidget';
// import TasksWidget from '../components/TasksWidget';

const HomeScreen = () => (
  <ScrollView style={{ flex: 1 }}>
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 30 }}>
      <WeatherWidget />
      <StepsWidget />
    </View>
  </ScrollView>
);

export default HomeScreen;

