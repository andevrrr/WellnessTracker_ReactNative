import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import CalendarView from '../components/CalendarView';

const ScheduleScreen = () => {
    const [selectedView, setSelectedView] = useState('Calendar');

    const renderView = () => {
      if (selectedView === 'Calendar') {
        return <CalendarView />;
      } else {
        return <Text>Tasks View</Text>;
      }
    };

    return (
      <View style={{ flex: 1 }}>
        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={selectedView === 'Calendar' ? styles.activeSegment : styles.inactiveSegment}
            onPress={() => setSelectedView('Calendar')}
          >
            <Text>Calendar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={selectedView === 'Tasks' ? styles.activeSegment : styles.inactiveSegment}
            onPress={() => setSelectedView('Tasks')}
          >
            <Text>Tasks</Text>
          </TouchableOpacity>
        </View>
        {renderView()}
      </View>
    );
  };

  const styles = StyleSheet.create({
    segmentedControl: {
      flexDirection: 'row',
      justifyContent: 'center',
      padding: 10,
      marginTop: 40,
    },
    activeSegment: {
      margin: 5,
      padding: 10,
      backgroundColor: 'blue',
      borderRadius: 5,
    },
    inactiveSegment: {
      margin: 5,
      padding: 10,
      backgroundColor: 'gray',
      borderRadius: 5,
    },
  });



export default ScheduleScreen;
