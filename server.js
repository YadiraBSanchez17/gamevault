const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Borrar tabla vieja y crear la nueva limpia
const createTableQuery = `
  DROP TABLE IF EXISTS games;
  CREATE TABLE games (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    genero VARCHAR(50),
    plataforma VARCHAR(50),
    estado VARCHAR(50),
    imagen_url TEXT
  );
`;
pool.query(createTableQuery)
  .then(() => console.log('Tabla reseteada y creada con éxito'))
  .catch(err => console.error(err));

app.get('/api/games', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM games ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) { res.status(500).send(err.message); }
});

app.post('/api/games', async (req, res) => {
  const { titulo, genero, plataforma, estado, imagen_url } = req.body;
  try {
    await pool.query(
      'INSERT INTO games (titulo, genero, plataforma, estado, imagen_url) VALUES ($1, $2, $3, $4, $5)', 
      [titulo, genero, plataforma, estado, imagen_url]
    );
    res.json({ message: 'Guardado' });
  } catch (err) { res.status(500).send(err.message); }
});

app.put('/api/games/:id', async (req, res) => {
  const { titulo, genero, plataforma, estado, imagen_url } = req.body;
  try {
    await pool.query(
      'UPDATE games SET titulo=$1, genero=$2, plataforma=$3, estado=$4, imagen_url=$5 WHERE id=$6',
      [titulo, genero, plataforma, estado, imagen_url, req.params.id]
    );
    res.json({ message: 'Actualizado' });
  } catch (err) { res.status(500).send(err.message); }
});

app.delete('/api/games/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM games WHERE id = $1', [req.params.id]);
    res.json({ message: 'Eliminado' });
  } catch (err) { res.status(500).send(err.message); }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));