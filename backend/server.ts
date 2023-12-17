const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
const port = 8000;

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "password",
  port: 5432,
});

app.use(cors(corsOptions));
app.use(express.json());

async function createTableIfNotExists() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS posts (
        post_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        edited_at TIMESTAMP
    );
    
    `;
  try {
    await pool.query(createTableQuery);
    console.log("Table created or already exists");
  } catch (error) {
    console.error("Error creating table", error);
  }
}

createTableIfNotExists();

app.get("/testdb", async (req, res) => {
  try {
    const result = await pool.query("SELECT 1");
    res.json({ success: true, message: "Database connection is working!" });
  } catch (error) {
    console.error("Error executing test query", error);
    res
      .status(500)
      .json({ success: false, message: "Error connecting to the database" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
