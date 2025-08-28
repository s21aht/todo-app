import React from "react";

export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div className="todo-item">
      <span
        style={{
          textDecoration: todo.completed ? "line-through" : "none",
          cursor: "pointer"
        }}
        onClick={() => onToggle(todo.id, !todo.completed)}
      >
        {todo.title}
      </span>
      <button onClick={() => onDelete(todo.id)}>❌</button>
    </div>
  );
}
