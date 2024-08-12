const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

let port = process.env.PORT || 8000;

app.listen(port, async () => {
  console.log(`Server started on port ${port}`);
  await connectDB();
});

let conn = null;

const connectDB = async () => {
  if (!conn) {
    conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "root",
      database: "web_dev_101",
      port: 3306,
    });
  }
};

app.get("/users", async (req, res) => {
  try {
    const [rows] = await conn.query("SELECT * FROM users");
    res.send(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "something went wrong",
    });
  }
});

app.get("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await conn.query("SELECT * FROM users WHERE id = ?", [id]);
    if(rows.length === 0) {
      throw { statusCode: 404, message: "user not found" };
    }
    res.send(rows);
  } catch (err) {
    console.log(err);
    let statusCode = err.statusCode || 500;
    res.status(statusCode).json({
      message: "something went wrong",
    });
  }
});

const validateData = (userData) => {
  let errors = [];
  if (!userData.firstname) {
    errors.push("firstname is required");
  }
  if (!userData.lastname) {
    errors.push("lastname is required");
  }
  if (!userData.age) {
    errors.push("age is required");
  }
  if (!userData.gender) {
    errors.push("gender is required");
  }
  if (!userData.interest) {
    errors.push("interest is required");
  }
  if (!userData.description) {
    errors.push("description is required");
  }
  return errors;
};

app.post("/users", async (req, res) => {
  try {
    const user = req.body;
    const errors = validateData(user);
    if (errors.length > 0) {
      throw { 
          message: "invalid data",
          errors: errors
       };
    }
    const [rows] = await conn.query('INSERT INTO users SET ?', user);
    res.json({
      message : "Inserted successfully",
      data : rows[0],
    });
  } catch (err) {
    const errorMessage = err.message || "something went wrong";
    const errors = err.errors || [];
    res.status(500).json({
      message: errorMessage,
      errors: errors
    });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateUser = req.body;

    const [rows] = await conn.query("UPDATE users SET ? WHERE id = ?",[updateUser, id]);
    res.send(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "something went wrong",
    });
  }
});

app.delete("/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await conn.query("DELETE FROM users WHERE id = ?", [id]);
    res.send(rows);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "something went wrong",
    });
  }
});

