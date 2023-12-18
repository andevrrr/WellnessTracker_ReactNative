import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import * as FileSystem from "expo-file-system";

const ScheduleWidget = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const tasksFilePath = FileSystem.documentDirectory + "tasks.json";

    const loadTasksFromFile = async () => {
      try {
        const tasksJson = await FileSystem.readAsStringAsync(tasksFilePath);
        const loadedTasks = JSON.parse(tasksJson);
        loadedTasks.forEach((task) => {
          if (task.dueDate) {
            task.dueDate = new Date(task.dueDate);
          }
        });
        setTasks(loadedTasks);
      } catch (error) {
        console.error("Failed to read tasks:", error);
        setTasks([]);
      }
    };

    loadTasksFromFile();
  }, []);
  const getUpcomingTasks = () => {
    return tasks
      .filter((task) => new Date(task.dueDate) >= new Date())
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 4);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const upcomingTasks = getUpcomingTasks();

  return (
    <View style={styles.widgetContainer}>
      <View style={styles.textContainer}>
        {upcomingTasks.length > 0 ? (
          upcomingTasks.map((task, index) => (
            <View key={index}>
              <Text style={styles.taskTextDate}>
                {formatDate(task.dueDate)}
              </Text>
              <Text style={styles.taskText}>{task.title}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.taskText}>No upcoming tasks</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  widgetContainer: {
    padding: 20,
    borderRadius: 40,
    backgroundColor: "white",
    width: "100%",
    shadowColor: "#7F5DF0",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    justifyContent: "center",
  },
  textContainer: {
    padding: 10,
    width: "100%",
  },
  taskText: {
    fontSize: 16,
    color: "black",
    marginBottom: 5,
    fontWeight: "bold",
  },
  taskTextDate: {
    fontSize: 10,
    marginBottom: 5,
  },
});

export default ScheduleWidget;
