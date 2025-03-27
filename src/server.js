import express from 'express';
import cors from 'cors';
import sql from 'mssql';

const app = express();
app.use(cors());
app.use(express.json()); // Allow JSON data in requests


const config = {
  server: 'NOOH8030\SQLEXPRESS',  
  database: 'nokia_fire',           
  user: 'sa',                      
  password: 'afeef1318',           
  options: {
    encrypt: false,                
    trustServerCertificate: false   
  }
};

// ✅ Function to connect to SQL Server
async function connectToDB() {
  try {
    console.log("⏳ Connecting to SQL Server...");
    const pool = await sql.connect(config);
    console.log('✅ Connected to SQL Server');
    return pool;
  } catch (err) {
    console.error('❌ Database Connection Failed:', err);
    process.exit(1); // Exit process on failure
  }
}

connectToDB();

app.get('/', (req, res) => {
  res.send('🔥 Server is running successfully!');
});


const PORT = 5000; 
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
