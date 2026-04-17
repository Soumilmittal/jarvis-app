import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform
} from "react-native";
import { useState } from "react";
import * as Speech from "expo-speech";

export default function HomeScreen() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [tasks, setTasks] = useState<string[]>([]);

  // 🔊 Cross-platform Speak
  const speak = (text: string) => {
    if (Platform.OS === "web") {
      const msg = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(msg);
    } else {
      Speech.speak(text);
    }
  };

  // 🧠 JARVIS LOGIC
  const handleCommand = (cmd: string) => {
    let response = "I didn't understand that.";

    // Greetings
    if (cmd.includes("hello") || cmd.includes("hi")) {
      response = name
        ? `Hello ${name}, how can I assist you today?`
        : "Hello sir, what should I call you?";
    }

    // Save Name
    else if (cmd.startsWith("my name is")) {
      const newName = cmd.replace("my name is", "").trim();
      setName(newName);
      response = `Nice to meet you, ${newName}.`;
    }

    // Time
    else if (cmd.includes("time")) {
      response = `The time is ${new Date().toLocaleTimeString()}`;
    }

    // Date
    else if (cmd.includes("date")) {
      response = `Today is ${new Date().toDateString()}`;
    }

    // Motivation
    else if (cmd.includes("motivate")) {
      const quotes = [
        "Success comes from consistency.",
        "Discipline beats motivation.",
        "Start now, not tomorrow.",
        "You are stronger than you think."
      ];
      response = quotes[Math.floor(Math.random() * quotes.length)];
    }

    // Joke
    else if (cmd.includes("joke")) {
      const jokes = [
        "Why do programmers hate nature? Too many bugs.",
        "I told my code a joke, it didn’t compile.",
        "Debugging is like being a detective."
      ];
      response = jokes[Math.floor(Math.random() * jokes.length)];
    }

    // Add Task
    else if (cmd.startsWith("add task")) {
      const task = cmd.replace("add task", "").trim();
      if (task) {
        const updatedTasks = [...tasks, task];
        setTasks(updatedTasks);
        response = `Task added: ${task}`;
      } else {
        response = "Please specify a task.";
      }
    }

    // Show Tasks
    else if (cmd.includes("show tasks")) {
      if (tasks.length === 0) {
        response = "You have no tasks.";
      } else {
        response = "Your tasks are: " + tasks.join(", ");
      }
    }

    // Clear Tasks
    else if (cmd.includes("clear tasks")) {
      setTasks([]);
      response = "All tasks cleared.";
    }

    // Identity
    else if (cmd.includes("who are you")) {
      response = "I am Jarvis, your personal assistant.";
    }

    // Default
    else {
      response = "I am still learning. Try something else.";
    }

    speak(response);

    setMessages(prev => [
      ...prev,
      { user: cmd, bot: response }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>JARVIS 🤖</Text>

      <ScrollView style={styles.chat}>
        {messages.map((m, i) => (
          <View key={i}>
            <Text style={styles.user}>You: {m.user}</Text>
            <Text style={styles.bot}>Jarvis: {m.bot}</Text>
          </View>
        ))}
      </ScrollView>

      <TextInput
        value={input}
        onChangeText={setInput}
        placeholder="Type a command..."
        placeholderTextColor="#aaa"
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          if (!input.trim()) return;
          handleCommand(input.toLowerCase());
          setInput("");
        }}
      >
        <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
      </TouchableOpacity>
    </View>
  );
}

// 🎨 STYLES
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f111a",
    padding: 20,
  },
  title: {
    color: "white",
    fontSize: 28,
    marginBottom: 10,
    fontWeight: "bold",
  },
  chat: {
    flex: 1,
    marginBottom: 10,
  },
  user: {
    color: "#10b981",
    marginTop: 5,
  },
  bot: {
    color: "#6366f1",
    marginBottom: 10,
  },
  input: {
    backgroundColor: "#1c1f2e",
    color: "white",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#6366f1",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
  },
});