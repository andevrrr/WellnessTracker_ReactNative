import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  FlatList,
  TouchableOpacity,
  Modal,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Swipeable } from "react-native-gesture-handler";
import * as FileSystem from 'expo-file-system';

const ScheduleScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: new Date(),
    completed: false,
  });
  const [taskViewModalVisible, setTaskViewModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const tasksFilePath = FileSystem.documentDirectory + 'tasks.json';

  const saveTasksToFile = async (tasks) => {
    try {
      await FileSystem.writeAsStringAsync(tasksFilePath, JSON.stringify(tasks));
    } catch (error) {
      console.error("Failed to write tasks:", error);
    }
  };

  const loadTasksFromFile = async () => {
    try {
      const tasksJson = await FileSystem.readAsStringAsync(tasksFilePath);
      const loadedTasks = JSON.parse(tasksJson);

      loadedTasks.forEach(task => {
        if (task.dueDate) {
          task.dueDate = new Date(task.dueDate);
        }
      });

      return loadedTasks;
    } catch (error) {
      console.error("Failed to read tasks:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadTasks = async () => {
      const loadedTasks = await loadTasksFromFile();
      setTasks(loadedTasks);
    };

    loadTasks();
  }, []);

  const addTask = async () => {
    const newTasks = [...tasks, { ...newTask, id: tasks.length + 1 }];
    setTasks(newTasks);
    await saveTasksToFile(newTasks);
    setNewTask({
      title: "",
      description: "",
      dueDate: new Date(),
      completed: false,
    });
    setModalVisible(false);
  };

  const toggleTaskCompletion = async (id) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, completed: !task.completed };
      }
      return task;
    });
    setTasks(updatedTasks);
    await saveTasksToFile(updatedTasks);
  };

  const deleteTask = async (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
    await saveTasksToFile(updatedTasks);
  };

  const groupTasksByDueDate = (tasks) => {
    const grouped = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    tasks
      .filter(task => new Date(task.dueDate) >= today) 
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .forEach(task => {
        const dueDate = task.dueDate.toISOString().split("T")[0];
        if (!grouped[dueDate]) {
          grouped[dueDate] = [];
        }
        grouped[dueDate].push(task);
      });

    return grouped;
  };

  const groupedTasks = groupTasksByDueDate(tasks);

  const renderTaskGroup = ({ item }) => {
    const [date, tasks] = item;
    return (
      <View>
        <Text style={styles.dateHeader}>{formatDate(date)}</Text>
        {tasks.map((task, index) => (
          <View key={index}>{renderTask(task)}</View>
        ))}
      </View>
    );
  };

  const truncateDescription = (description) => {
    if (description.length > 30) {
      return description.substring(0, 30) + "...";
    } else {
      return description;
    }
  };

  const openTaskViewModal = (task) => {
    setSelectedTask(task);
    setTaskViewModalVisible(true);
  };

  const renderTask = (task) => (
    <Swipeable
      renderRightActions={() => (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => deleteTask(task.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
    >
      <TouchableOpacity
        style={styles.taskItem}
        onPress={() => openTaskViewModal(task)}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.taskText,
              task.completed && styles.completedTaskText,
            ]}
          >
            {task.title}
          </Text>
          <Text>{truncateDescription(task.description)}</Text>
        </View>
        <Button
          title={task.completed ? "Uncheck" : "Check"}
          onPress={(e) => {
            e.stopPropagation(); // Prevents the modal from opening when the button is pressed
            toggleTaskCompletion(task.id);
          }}
        />
      </TouchableOpacity>
    </Swipeable>
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Format the date as needed, e.g., 'October 15th'
    return date.toDateString(); // Simple example, customize as needed
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Create a Task</Text>
      </TouchableOpacity>
      <FlatList
        data={Object.entries(groupedTasks)}
        renderItem={renderTaskGroup}
        keyExtractor={(item) => item[0]}
      />
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newTask.title}
              placeholderTextColor="black"
              onChangeText={(text) => setNewTask({ ...newTask, title: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={newTask.description}
              placeholderTextColor="black"
              onChangeText={(text) =>
                setNewTask({ ...newTask, description: text })
              }
            />
            <DateTimePicker
              value={newTask.dueDate}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setNewTask({
                  ...newTask,
                  dueDate: selectedDate || newTask.dueDate,
                });
              }}
            />
            <Button title="Create" onPress={addTask} />
          </View>
        </View>
      </Modal>
      <Modal
        visible={taskViewModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setTaskViewModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Task Details</Text>
            <Text style={styles.modalText}>Title: {selectedTask?.title}</Text>
            <Text style={styles.modalText}>
              Description: {selectedTask?.description}
            </Text>
            <Text style={styles.modalText}>
              Due Date: {selectedTask?.dueDate.toDateString()}
            </Text>
            <Button
              title="Close"
              onPress={() => setTaskViewModalVisible(false)}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 50,
  },
  taskItem: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    marginVertical: 10,
    shadowColor: "#7F5DF0",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  taskText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  completedTaskText: {
    textDecorationLine: "line-through",
    color: "#6e6e6e",
  },
  addButton: {
    backgroundColor: "#7F5DF0",
    borderRadius: 25,
    padding: 15,
    alignItems: "center",
    shadowColor: "#7F5DF0",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  addButtonText: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#7F5DF0",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    width: "80%",
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    padding: 10,
    marginVertical: 10,
  },
  deleteButton: {
    margin: 10,
    backgroundColor: "red",
    padding: 10,
    borderRadius: 20,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: "bold",
    paddingVertical: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default ScheduleScreen;
