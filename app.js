const express = require("express"); 
const mariadb = require("mariadb");
const pool = mariadb.createPool({ host: 'localhost', user: 'root', password: "1234", database: "planing", connectionLimit: 5 });
const app = express(); // Crea una instancia de ExpressJS

const port = 3000;

app.use(express.json()); 

const people = require("./json/people.json"); // Importa los datos iniciales (generados en https://www.mockaroo.com/)

app.get("/planing", async (req, res) => {
  let conn;
 try {

     conn = await pool.getConnection();
     const rows = await conn.query("SELECT id, NAME,DESCRIPTION,create_at,update_at,STATUS FROM todo");
     res.json(rows);
 } catch {
     res.status(500).json({ mensaje: "Se rompió el servidor" });
 } finally {
     if (conn) conn.release();
 } 
});

app.get("/planing/:id", async (req, res) => {
 
 let conn;
 try {
     conn = await pool.getConnection();
     const rows = await conn.query("SELECT id, NAME,DESCRIPTION,create_at,update_at,STATUS FROM todo WHERE id=?", [req.params.id]);
     res.json(rows[0]);
 } catch {
     res.status(500).json({ mensaje: "Se rompió el servidor" });
 } finally {
     if (conn) conn.release();
 }
});

app.post("/planing", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const response = await conn.query('INSERT INTO todo (name, description, created_at, updated_at, status) VALUES (?, ?, ?, ?, ?)', [req.body.name, req.body.description, req.body.created_at, req.body.updated_at, req.body.status]);
        res.json({ id: parseInt(response.insertId), ...req.body });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Se rompió el servidor" });
    } finally {
        if (conn) conn.release();
    } 
   });
   
   app.put("/planing/:id", async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const response = await conn.query('UPDATE todo SET name=?, description=?, created_at=?, updated_at=?, status=? WHERE id=?', [req.body.name, req.body.description, req.body.created_at, req.body.updated_at, req.body.status, req.params.id]);
        res.json({ id: parseInt(req.params.id), ...req.body });
    } catch (error) {
        console.log(error);
        res.status(500).json({ mensaje: "Se rompió el servidor" });
    } finally {
        if (conn) conn.release();
    }
   });
   

app.delete("/planing/:id", async (req, res) => {
 let conn;
 try {
     conn = await pool.getConnection();
     const response = await conn.query("DELETE FROM todo WHERE id=?", [req.params.id]);
     res.json({ estado: "Se eliminó el dato", id: parseInt(response.insertId), ...req.body });
 } catch {
     res.status(500).json({ mensaje: "Se rompió el servidor" });
 } finally {
     if (conn) conn.release();
 }
}); 

// Esta línea inicia el servidor para que escuche peticiones en el puerto indicado
app.listen(port, () => {
 console.log(`Servidor corriendo en http://localhost:${port}`);
});