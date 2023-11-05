const express = require("express");
const mariadb = require("mariadb");

const pool = mariadb.createPool({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "todo",
  connectionLimit: 5,
});

const app = express();
const port = 3000;

app.use(express.json());

// Ruta para obtener todas las tareas
app.get("/todo", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const result = await conn.query('SELECT * FROM todo');
    conn.release();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Se rompió el servidor" });
  } finally {
    if (conn) conn.release(); // Liberar la conexión al pool
  }
});

// Ruta para obtener una tarea por su ID
app.get("/todo/:id", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(
      "SELECT id, name, description, created_at, updated_at, status FROM todo WHERE id=?",
      [req.params.id]
    );

    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ message: "Se rompió el servidor" });
  } finally {
    if (conn) conn.release(); // Liberar la conexión al pool
  }
});

// Ruta para crear una nueva tarea
app.post("/todo", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const response = await conn.query(
      `INSERT INTO todo (name, description, created_at, updated_at, status) VALUES (?, ?, ?, ?, ?)`,
      [req.body.name, req.body.description, req.body.created_at, req.body.updated_at, req.body.status]
    );

    res.json({ id: parseInt(response.insertId), ...req.body });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Se rompió el servidor" });
  } finally {
    if (conn) conn.release(); // Liberar la conexión al pool
  }
});

// Ruta para actualizar una tarea por su ID
app.put("/todo/:id", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const response = await conn.query(
      `UPDATE todo SET name=?, description=?, created_at=?, updated_at=?, status=? WHERE id=?`,
      [req.body.name, req.body.description, req.body.created_at, req.body.updated_at, req.body.status, req.params.id]
    );

    res.json({ id: req.params.id, ...req.body });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Se rompió el servidor" });
  } finally {
    if (conn) conn.release(); // Liberar la conexión al pool
  }
});

// Ruta para eliminar una tarea por su ID
app.delete("/todo/:id", async (req, res) => {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query("DELETE FROM todo WHERE id=?", [req.params.id]);
    res.json({ message: "Elemento eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ message: "Se rompió el servidor" });
  } finally {
    if (conn) conn.release(); // Liberar la conexión al pool
  }
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
