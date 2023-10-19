import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import axios from 'axios'; // axios 패키지 추가

export default function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [userStatus, setUserStatus] = useState('');
  const [weather, setWeather] = useState(null); // 날씨 정보 상태 추가

  useEffect(() => {
    // OpenWeatherMap API에서 날씨 정보 가져오기
    async function fetchWeather() {
      try {
        const response = await axios.get(
          'https://api.openweathermap.org/data/2.5/weather?q=YOUR_CITY&appid=YOUR_API_KEY'
        );
        setWeather(response.data.weather[0].description);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    }
    fetchWeather();
  }, []); // 빈 배열을 사용하여 한 번만 호출되도록 설정

  const addTodo = () => {
    if (text) {
      setTodos([...todos, { text, id: Date.now(), date: selectedDate, status: userStatus }]);
      setText('');
      setUserStatus('');
    }
  };

  const removeTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>ToDo List</Text>
      <TextInput
        style={styles.input}
        placeholder="Add a new todo"
        value={text}
        onChangeText={(text) => setText(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Select a date (YYYY-MM-DD)"
        value={selectedDate}
        onChangeText={(date) => setSelectedDate(date)}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your status"
        value={userStatus}
        onChangeText={(status) => setUserStatus(status)}
      />
      <Button title="Add" onPress={addTodo} />

      <Text style={styles.weatherInfo}>
        {weather ? `Today's Weather: ${weather}` : 'Loading weather...'}
      </Text>

      <Agenda
        items={todos.reduce((acc, todo) => {
          if (!acc[todo.date]) {
            acc[todo.date] = [];
          }
          acc[todo.date].push({ name: todo.text, status: todo.status });
          return acc;
        }, {})}
        renderItem={(item) => (
          <View style={styles.todoItem}>
            <Text>{item.name}</Text>
            <Text style={styles.status}>Status: {item.status}</Text>
            <Button
              title="Remove"
              onPress={() => removeTodo(item.id)}
              color="red"
            />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  todoItem: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  status: {
    color: 'gray',
  },
  weatherInfo: {
    fontSize: 16,
    marginBottom: 16,
  },
});
