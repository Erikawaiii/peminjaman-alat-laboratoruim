const express = require("express");
const cors = require("cors");
const app = express();
const { Pool } = require("pg");
app.use(cors());
app.use(express.json());
//penganti db.js
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "db_peminjaman_alat",
  password: "erika0109",
  port: 5432
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

app.get("/api/alat", async (req, res) => {
  try {
    const query = `
            SELECT
                p.id_alat,  
                p.id_kategori,
                p.nama_alat,
                p.kondisi,
                p.stok,
                p.lokasi,
                c.nama_kategori AS nama_kategori
            FROM alat p
            LEFT JOIN kategori_alat c ON p.id_kategori = c.id_kategori
            ORDER BY p.id_alat ASC
        `;

    const result = await pool.query(query);

    res.json(result.rows);

  } catch (err) {
    console.error(err.message);

    res.status(500).json({
      error: "Terjadi kesalahan saat memuat produk"
    });
  }
});

app.post('/api/alat', async (req, res) => {
  try {
    const { id_kategori, nama_alat, kondisi, stok, lokasi } = req.body;
    const result = await pool.query(
      "INSERT INTO alat (id_kategori, nama_alat, kondisi, stok, lokasi) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id_kategori, nama_alat, kondisi, stok, lokasi]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "gagal menambahkan alat" });
  }
});

app.put('/api/alat/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id_kategori, nama_alat, kondisi, stok, lokasi } = req.body;

    const result = await pool.query(
      "UPDATE alat SET id_kategori = $1, nama_alat = $2, kondisi = $3, stok = $4, lokasi = $5 WHERE id_alat = $6 RETURNING *",
      [id_kategori, nama_alat, kondisi, stok, lokasi, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Alat tidak ditemukan" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "gagal memperbarui alat" });
  }
}); 

app.delete('/api/alat/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM alat WHERE id_alat = $1 RETURNING *", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Alat tidak ditemukan" });
    }
    res.json({ message: "Alat berhasil dihapus" });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "gagal menghapus alat" });
  }
});

app.post('/api/peminjaman', async (req, res) => {
  try {
    const {
      id_alat,
      nama_peminjam,
      kelas,
      tanggal_pinjam,
      tanggal_kembali,
      jumlah
    } = req.body;
    //cek stok alat
    const cekstok = await pool.query(
      "SELECT stok FROM alat WHERE id_alat =$1",
      [id_alat]
    );
    if(cekstok.rows.length === 0){
      return res.status(404).json({
        error:"alat tidak ditemukan"
      });
    }
    //cek stok sekarang
    const stoksekarang=cekstok.rows[0].stok;

    if(stoksekarang <jumlah){
      return res.status(404).json({
        error:"stok alat tidak cukup"
    });
  }

    const result = await pool.query(
      "INSERT INTO peminjaman (id_alat, nama_peminjam, kelas, tanggal_pinjam, tanggal_kembali,jumlah) VALUES ($1, $2, $3, $4, $5,$6) RETURNING *",
      [id_alat, nama_peminjam, kelas, tanggal_pinjam, tanggal_kembali,jumlah]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "gagal menambahkan peminjaman" });
  }
});

app.get("/api/peminjaman", async (req, res) => {
  try {
    const query = `
            SELECT
                p.id_peminjaman,  
                p.id_alat,
                a.nama_alat,
                p.nama_peminjam,
                p.kelas,
                p.tanggal_pinjam,
                p.tanggal_kembali,
                p.jumlah
            FROM peminjaman p
            LEFT JOIN alat a ON p.id_alat = a.id_alat
            LEFT JOIN kategori_alat c ON a.id_kategori = c.id_kategori
            ORDER BY p.id_alat ASC
        `;

    const result = await pool.query(query);

    res.json(result.rows);

  } catch (err) {
    console.error(err.message);

    res.status(500).json({
      error: "Terjadi kesalahan saat memuat produk"
    });
  }
});

app.put("/api/peminjaman/:id/kembalikan",async (req,res) => {
  try{ 
    const{ id }=req.params;

    //cari data peminjaman
    const peminjaman= await pool.query(
      "SELECT id_alat,jumlah,status FROM peminjaman WHERE id_peminjaman =$1",
      [id]
    );

    if(peminjaman.rows.length === 0){
      return res.status(404).json({
        error:"data peminjaman tidak ditemukan"
      });
  }
  const data =peminjaman.rows[0];
  //mencegah pengembalian dua kali
  if(data.status === "Dikembalikan"){
    return res.status(400).json({
      error:"alat sudah dikembalikan"
    });
  }

  //ubah status peminjaman
  const result = await pool.query(
    "UPDATE peminjaman SET status ='Dikembalikan' Where id_peminjaman =$1 RETURNING *",
    [id]
  );
  res.json(result.rows[0]);
  }catch(err){
    console.error(err.message);
    res.status(500).json({
      error:"Gagal mengembalikan alat"
    });
  }
  });

  app.delete("/api/peminjaman/:id",async(req,res)=>{
    try{
      const{id} =req.params;

      const result = await pool.query(
        "DELETE FROM peminjaman WHERE id_peminjaman =$1 RETURNING *",
        [id]
      );
      if(result.rows.lenght === 0){
        return res.status(404).json({
          error:"Data peminjaman tidak ditemukan"
        });
      }
      res.json({
        message:"riwayat peminjaman berhasil dihapus"
      });
    }catch (err){
      console.error(err.message);
      res.status(500).json({
        error:"Gagal menghapus riwayat peminjaman"
      });
    }
  });

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server berhasil berjalan di http://localhost:${PORT}`);
});