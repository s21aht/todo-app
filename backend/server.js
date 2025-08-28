// server.js
const express = require("express");
const cors = require("cors");
const { query, init } = require("./db");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => res.json({ status: "ok", env: process.env.NODE_ENV || "dev" }));

// List all todos
app.get("/todos", async (req, res) => {
  try {
    const result = await query("SELECT * FROM todos ORDER BY created_at DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch todos" });
  }
});

// Get single todo
app.get("/todos/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await query("SELECT * FROM todos WHERE id = $1", [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch todo" });
  }
});

// Create
app.post("/todos", async (req, res) => {
  const { title, description } = req.body;
  if (!title || title.trim() === "") return res.status(400).json({ error: "title is required" });
  try {
    const result = await query(
      "INSERT INTO todos (title, description) VALUES ($1, $2) RETURNING *",
      [title, description || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// Update (partial allowed)
app.put("/todos/:id", async (req, res) => {
  const id = req.params.id;
  const { title, description, completed } = req.body;

  // Build dynamic update
  const fields = [];
  const values = [];
  let idx = 1;
  if (title !== undefined) { fields.push(`title = $${idx++}`); values.push(title); }
  if (description !== undefined) { fields.push(`description = $${idx++}`); values.push(description); }
  if (completed !== undefined) { fields.push(`completed = $${idx++}`); values.push(completed); }

  if (fields.length === 0) return res.status(400).json({ error: "No fields to update" });

  const sql = `UPDATE todos SET ${fields.join(", ")} WHERE id = $${idx} RETURNING *`;
  values.push(id);

  try {
    const result = await query(sql, values);
    if (result.rowCount === 0) return res.status(404).json({ error: "Not found" });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update" });
  }
});

// Delete
app.delete("/todos/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const result = await query("DELETE FROM todos WHERE id = $1 RETURNING *", [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: "Not found" });
    res.json({ deleted: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete" });
  }
});

// Start server after DB init
async function start() {
  try {
    await init();
    app.listen(PORT, () => {
      console.log(`Todo API listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start();
