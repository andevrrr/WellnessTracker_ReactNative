import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './src/navigation/TapNavigator';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const App = () => (
  <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
    <TabNavigator />
  </NavigationContainer>
  </GestureHandlerRootView>
);

export default App;
