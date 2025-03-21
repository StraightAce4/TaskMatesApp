import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

// Main App Component
export default function App() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [tasks, setTasks] = useState({
    School: [],
    Home: [],
    Work: [],
    Other: [],
  });
  const [completedTasks, setCompletedTasks] = useState({
    School: 0,
    Home: 0,
    Work: 0,
    Other: 0,
  });
  const [userName, setUserName] = useState('');
  const [activeTab, setActiveTab] = useState('Overview');
  const [newTask, setNewTask] = useState('');

  const handleSignIn = () => setIsSignedIn(true);
  const handleSignOut = () => setIsSignedIn(false);

  const handleAddTask = (category) => {
    if (newTask.trim() === '') return;
    setTasks((prevTasks) => ({
      ...prevTasks,
      [category]: [...prevTasks[category], { text: newTask, checked: false }],
    }));
    setNewTask('');
  };

  const handleToggleTask = (category, index) => {
    const updatedTasks = tasks[category].map((task, i) =>
      i === index ? { ...task, checked: !task.checked } : task
    );
    setTasks((prevTasks) => ({
      ...prevTasks,
      [category]: updatedTasks,
    }));

    const completed = updatedTasks.filter((task) => task.checked).length;
    setCompletedTasks((prev) => ({
      ...prev,
      [category]: completed,
    }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const calculateTaskProgress = () => {
    const totalTasks = Object.values(tasks).flat().length;
    const completed = Object.values(tasks)
      .flat()
      .filter((task) => task.checked).length;
    return totalTasks === 0 ? 0 : (completed / totalTasks) * 100;
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        {isSignedIn ? (
          <HomeScreen
            onSignOut={handleSignOut}
            tasks={tasks}
            completedTasks={completedTasks}
            newTask={newTask}
            setNewTask={setNewTask}
            handleAddTask={handleAddTask}
            handleToggleTask={handleToggleTask}
            handleTabChange={handleTabChange}
            activeTab={activeTab}
            calculateTaskProgress={calculateTaskProgress}
            userName={userName}
            setUserName={setUserName}
          />
        ) : (
          <SignInScreen onSignIn={handleSignIn} setUserName={setUserName} />
        )}
      </View>
    </SafeAreaView>
  );
}

// SignIn Screen Component
function SignInScreen({ onSignIn, setUserName }) {
  return (
    <View style={styles.container}>
      <Text style={styles.appName}>TASKMATES</Text>
      <Text style={styles.tagline}>ORGANIZE TASKS WITH EASE</Text>
      <Text style={styles.description}>The only productivity app you need</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Full Name"
        onChangeText={setUserName}
      />
      <TouchableOpacity style={styles.button} onPress={onSignIn}>
        <Text style={styles.buttonText}>Sign in with Email</Text>
      </TouchableOpacity>
    </View>
  );
}

// Home Screen Component
function HomeScreen({
  onSignOut,
  tasks,
  completedTasks,
  newTask,
  setNewTask,
  handleAddTask,
  handleToggleTask,
  handleTabChange,
  activeTab,
  calculateTaskProgress,
  userName,
}) {
  return (
    <View style={styles.homeContainer}>
      <Text style={styles.greeting}>Hello, {userName || 'User'}</Text>
      <View style={styles.tabContainer}>
        <TouchableOpacity onPress={() => handleTabChange('Overview')}>
          <Text style={[styles.tabText, activeTab === 'Overview' && styles.activeTab]}>Overview</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleTabChange('Productivity')}>
          <Text style={[styles.tabText, activeTab === 'Productivity' && styles.activeTab]}>Productivity</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'Overview' && (
        <ScrollView>
          {Object.keys(tasks).map((category) => (
            <CategoryBox
              key={category}
              title={category}
              tasks={tasks[category]}
              completed={completedTasks[category]}
              progress={calculateTaskProgress()}
              handleAddTask={handleAddTask}
              handleToggleTask={handleToggleTask}
              category={category}
              newTask={newTask}
              setNewTask={setNewTask}
            />
          ))}
        </ScrollView>
      )}

      {activeTab === 'Productivity' && (
        <View style={styles.productivityContainer}>
          <Text style={styles.productivityTitle}>Productivity Stats</Text>
          <Text style={styles.statText}>Tasks Added: {Object.values(tasks).flat().length}</Text>
          <Text style={styles.statText}>Tasks Completed: {Object.values(completedTasks).reduce((a, b) => a + b, 0)}</Text>
          <Text style={styles.statText}>Progress: {calculateTaskProgress().toFixed(2)}%</Text>

          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View
              style={[
                styles.progressBar,
                { width: `${calculateTaskProgress()}%`, backgroundColor: '#1E90FF' },
              ]}
            />
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.backButton} onPress={onSignOut}>
        <Text style={styles.backButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

// CategoryBox Component for task display
function CategoryBox({
  title,
  tasks,
  completed,
  progress,
  handleAddTask,
  handleToggleTask,
  category,
  newTask,
  setNewTask,
}) {
  return (
    <View style={styles.categoryBox}>
      <Text style={styles.categoryTitle}>{title}</Text>
      <Text style={styles.categoryProgress}>Progress: {Math.round(progress)}%</Text>
      <View style={styles.taskList}>
        {tasks.map((task, index) => (
          <TouchableOpacity key={index} onPress={() => handleToggleTask(category, index)}>
            <Text style={task.checked ? styles.checkedTask : styles.uncheckedTask}>{task.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TextInput
        style={styles.input}
        placeholder="Add new task"
        value={newTask}
        onChangeText={setNewTask}
      />
      <TouchableOpacity style={styles.button} onPress={() => handleAddTask(category)}>
        <Text style={styles.buttonText}>Add Task</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
  },
  appName: {
    fontSize: 38,
    fontWeight: 'bold',
    color: '#D3D3D3',
    marginBottom: 12,
  },
  tagline: {
    fontSize: 19,
    color: '#B0C4DE',
    marginBottom: 22,
  },
  description: {
    fontSize: 17,
    color: '#B0C4DE',
    marginBottom: 22,
  },
  button: {
    backgroundColor: '#1E90FF',
    padding: 18,
    borderRadius: 9,
    marginVertical: 12,
    width: '82%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#D3D3D3',
    fontSize: 17,
  },
  input: {
    borderColor: '#B0C4DE',
    borderWidth: 1,
    borderRadius: 9,
    padding: 10,
    width: '82%',
    marginVertical: 10,
    color: '#D3D3D3',
  },
  homeContainer: {
    flex: 1,
    padding: 22,
    backgroundColor: '#000',
    width: '100%',
  },
  greeting: {
    fontSize: 25,
    color: '#D3D3D3',
    marginBottom: 22,
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 22,
  },
  tabText: {
    fontSize: 17,
    color: '#B0C4DE',
  },
  activeTab: {
    color: '#1E90FF',
  },
  categoryBox: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 9,
    backgroundColor: '#2F4F4F',
  },
  categoryTitle: {
    fontSize: 20,
    color: '#D3D3D3',
  },
  categoryProgress: {
    fontSize: 15,
    color: '#B0C4DE',
  },
  taskList: {
    marginVertical: 10,
  },
  uncheckedTask: {
    color: '#B0C4DE',
  },
  checkedTask: {
    color: '#2E8B57',
    textDecorationLine: 'line-through',
  },
  backButton: {
    backgroundColor: '#2F4F4F',
    padding: 14,
    borderRadius: 9,
    marginVertical: 22,
    width: '100%',
    alignItems: 'center',
  },
  backButtonText: {
    color: '#D3D3D3',
    fontSize: 17,
  },
  productivityContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  productivityTitle: {
    fontSize: 20,
    color: '#D3D3D3',
    marginBottom: 10,
  },
  statText: {
    fontSize: 16,
    color: '#B0C4DE',
    marginBottom: 10,
  },
  progressBarContainer: {
    height: 20,
    width: '80%',
    backgroundColor: '#B0C4DE',
    borderRadius: 10,
    marginTop: 20,
  },
  progressBar: {
    height: '100%',
    borderRadius: 10,
  },
});

