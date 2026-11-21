const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Configuracion para que el servidor entienda datos JSON y sirva tu carpeta public
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Conexion a la base de datos PostgreSQL de Render
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necesario para conexiones en la nube
  }
});

// Crear la tabla automaticamente si no existe
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS games (
    id SERIAL PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    anio INTEGER,
    categoria VARCHAR(50),
    imagen_url TEXT
  );
`;
pool.query(createTableQuery)
  .then(() => console.log('Tabla games lista en la base de datos'))
  .catch(err => console.error('Error creando tabla:', err));

// Ruta de prueba para ver si el servidor responde
app.get('/api/test', (req, res) => {
  res.json({ mensaje: '¡El servidor y la base de datos están conectados!' });
});

// Ruta principal que carga tu index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en el puerto ${port}`);
});
