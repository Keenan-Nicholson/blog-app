const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
const MemoryStore = require("memorystore")(session);

const app = express();
const port = 3001;

const corsOptions = {
  origin: "http://127.0.0.1:5173",
  optionsSuccessStatus: 200,
  credentials: true,
};

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  password: "password",
  port: 5432,
});

app.use(cors(corsOptions));
app.use(express.json());
app.use(
  session({
    store: new MemoryStore({
      checkPeriod: 86400000,
    }),
    secret: "temporary-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
    },
  })
);

async function createTableIfNotExists() {
  const createPostTableQuery = `
    CREATE TABLE IF NOT EXISTS posts (
        post_id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        edited_at TIMESTAMP
    );
    
    `;
  const createLoginTableQuery = `
    CREATE TABLE IF NOT EXISTS login (
        login_id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
      `;

  try {
    await pool.query(createPostTableQuery);
    console.log("Post table created or already exists");
    await pool.query(createLoginTableQuery);
    console.log("Login table created or already exists");
  } catch (error) {
    console.error("Error creating table", error);
  }
}

createTableIfNotExists();

app.post("/posts", async (req, res) => {
  const { title, content, author } = req.body;
  const createPostQuery = `
    INSERT INTO posts (title, content, author)
    VALUES ($1, $2, $3)
    RETURNING *
    `;
  try {
    const result = await pool.query(createPostQuery, [title, content, author]);
    res.json({ success: true, post: result.rows[0] });
  } catch (error) {
    console.error("Error executing create post query", error);
    res.status(500).json({ success: false, message: "Error creating post" });
  }
});

app.get("/posts", async (req, res) => {
  const getPostsQuery = `
    SELECT * FROM posts
    ORDER BY created_at DESC;
  `;
  try {
    const result = await pool.query(getPostsQuery);
    res.json({ success: true, posts: result.rows });
  } catch (error) {
    console.error("Error executing get posts query", error);
    res.status(500).json({ success: false, message: "Error fetching posts" });
  }
});

const registerAccount = async (username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const createLoginQuery = `
    INSERT INTO login (username, password)
    VALUES ($1, $2)
    RETURNING *
    `;
  try {
    const result = await pool.query(createLoginQuery, [
      username,
      hashedPassword,
    ]);
    const login = result.rows[0];
    return login;
  } catch (error) {
    console.error("Error executing create login query", error);
    return null;
  }
};

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const getLoginQuery = `
    SELECT * FROM login
    WHERE username = $1
    `;
  try {
    const result = await pool.query(getLoginQuery, [username]);
    if (result.rows.length === 0) {
      res.status(401).json({ success: false, message: "Invalid username" });
    } else {
      const login = result.rows[0];
      const isPasswordCorrect = await bcrypt.compare(password, login.password);
      if (isPasswordCorrect) {
        req.session.user = {
          id: login.login_id,
          username: login.username,
        };
        res.json({ success: true, login });
      } else {
        res.status(401).json({ success: false, message: "Invalid password" });
      }
    }
  } catch (error) {
    console.error("Error executing get login query", error);
    res.status(500).json({ success: false, message: "Error logging in" });
  }
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  const login = await registerAccount(username, password);
  if (login) {
    req.session.user = {
      id: login.login_id,
      username: login.username,
    };
    res.json({ success: true, login });
  } else {
    res.status(500).json({ success: false, message: "Error registering" });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error logging out");
    } else {
      res.sendStatus(200);
    }
  });
});

app.post("/delete-post", async (req, res) => {
  const { post_id } = req.body;
  const deletePostQuery = `
    DELETE FROM posts
    WHERE post_id = $1
    `;
  try {
    const result = await pool.query(deletePostQuery, [post_id]);
    res.json({ success: true, post: result.rows[0] });
  } catch (error) {
    console.error("Error executing delete post query", error);
    res.status(500).json({ success: false, message: "Error deleting post" });
  }
});

app.post("/edit-post", async (req, res) => {
  const { post_id, title, content } = req.body;
  const editPostQuery = `
    UPDATE posts
    SET title = $1, content = $2, edited_at = CURRENT_TIMESTAMP
    WHERE post_id = $3
    RETURNING *
    `;
  try {
    const result = await pool.query(editPostQuery, [title, content, post_id]);
    res.json({ success: true, post: result.rows[0] });
  } catch (error) {
    console.error("Error executing edit post query", error);
    res.status(500).json({ success: false, message: "Error editing post" });
  }
});

app.get("/whoami", (req, res) => {
  if (req.session && req.session.user) {
    res.json({ success: true, user: req.session.user });
  } else {
    res.status(401).json({ success: false, message: "User not authenticated" });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
