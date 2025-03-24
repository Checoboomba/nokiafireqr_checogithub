require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sql = require('mssql');

const app = express();
app.use(cors());

// DB Config
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

// Connection
const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

poolConnect.then(() => {
  console.log('✅ Connected to SQL Server');
}).catch(err => {
  console.error('❌ Database Connection Failed:', err);
});

// Test root route
app.get('/', (req, res) => {
  res.send('Server is up and running!');
});

// SQL data route
app.get('/api/data', async (req, res) => {
  try {
    await poolConnect;
    const result = await pool.request().query('SELECT TOP 10 * FROM YourTable');
    res.json(result.recordset);
  } catch (err) {
    console.error(err); // Log the error
    res.status(500).send(err.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
