const express = require("express");
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,      // "db": nombre del servicio, no una IP
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 5432,
});

const app = express();
app.use(express.json());

app.get("/health", (_req, res) => res.send("ok"));

app.get("/contactos", async (_req, res) => {
  try {
    const r = await pool.query("SELECT id, nombre, telefono FROM contactos ORDER BY id");
    res.json(r.rows);
  } catch (e) { console.error(e); res.status(500).json({ error: "db" }); }
});

app.post("/contactos", async (req, res) => {
  const { nombre, telefono } = req.body;
  if (!nombre || !telefono) return res.status(400).json({ error: "faltan datos" });
  try {
    const r = await pool.query(
      "INSERT INTO contactos (nombre, telefono) VALUES ($1, $2) RETURNING *",
      [nombre, telefono]);
    res.status(201).json(r.rows[0]);
  } catch (e) { console.error(e); res.status(500).json({ error: "db" }); }
});

app.listen(3000, () => console.log("API escuchando en :3000"));
