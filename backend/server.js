const express = require("express");
const cors = require("cors");
const app = express();
const { Pool } = require("pg");
app.use(cors());
//penganti db.js
const pool= new Pool({
    user:"postgres",
    host:"localhost",
    database:"db_peminjaman_alat",
    password:"erika0109",
    port:5432
});
app.get("/api/kategori_alat", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM kategori_alat");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Terjadi kesalahan pada server" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server berhasil berjalan di http://localhost:${PORT}`);
});