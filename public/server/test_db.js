const sql = require("mssql");

const config = {
  server: "NOOH8030\\SQLEXPRESS,1433",
  database: "nokia_fire",
  user: "sa",
  password: "afeef1318",
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

async function testConnection() {
  try {
    console.log("⏳ Trying to connect...");
    await sql.connect(config);
    console.log("✅ Successfully connected to SQL Server!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Connection failed:", err);
    process.exit(1);
  }
}

testConnection();
