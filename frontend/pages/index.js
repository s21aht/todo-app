import { useEffect, useState } from "react";
import axios from "axios";
import TodoItem from "../components/TodoItem";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  const API_URL = process.env.API_URL || "http://demo-api.ashikhassan.com";

  // Load todos
  useEffect(() => {
    axios.get(`${API_URL}/todos`).then((res) => setTodos(res.data));
  }, []);

  // Add todo
  const addTodo = async (e) => {
    e.preventDefault();
    if (!title) return;
    const res = await axios.post(`${API_URL}/todos`, { title });
    setTodos([...todos, res.data]);
    setTitle("");
  };

  // Toggle complete
  const toggleTodo = async (id, completed) => {
    const res = await axios.put(`${API_URL}/todos/${id}`, { completed });
    setTodos(todos.map((t) => (t.id === id ? res.data : t)));
  };

  // Delete todo
  const deleteTodo = async (id) => {
    await axios.delete(`${API_URL}/todos/${id}`);
    setTodos(todos.filter((t) => t.id !== id));
  };

  return (
    <div className="todo-container">
      <h1>Todo List</h1>
      <form onSubmit={addTodo} className="todo-form">
        <input type="text" placeholder="Enter new todo..." value={title} onChange={(e) => setTitle(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      ))}
    </div>
  );
}
