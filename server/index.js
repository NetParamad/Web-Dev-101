const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();

app.use(bodyParser.json());
app.use(cors())

const port = 8000;
// let users = [];
// let counter = 0;

let conn = null;

const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "web_dev_101",
    port: 3306,
  });
};

// app.get("/database", (req, res) => {
//   mysql
//     .createConnection({
//       host: "localhost",
//       user: "root",
//       password: "",
//       database: "web_dev_101",
//       port: 3306,
//     })
//     .then((conn) => {
//       conn
//         .query("SELECT * FROM users")
//         .then(([rows, fields]) => {
//           res.json(rows);
//         })
//         .catch((err) => {
//           console.log("Error fetching users: ", err.massage);
//           res.status(500).json({ error: "Error fetching users" });
//         });
//     });
// });

// app.get("/database-new", async (req, res) => {
//   try {
//     const conn = await mysql.createConnection({
//       host: "localhost",
//       user: "root",
//       password: "",
//       database: "web_dev_101",
//       port: 3306,
//     });
//     const resulte = await conn.query("SELECT * FROM users");
//     res.json(resulte[0]);
//   } catch (error) {
//     console.log("Error fetching users: ", error.massage);
//     res.status(500).json({ error: "Error fetching users" });
//   }
// });

// app.get("/users", (req, res) => {
//   const filterUser = users.map((user) => {
//     // return {
//     //   name: user.name,
//     //   nickname: user.nickname,
//     //   fullname: `${user.name} ${user.nickname}`,
//     // };
//   });
//   res.json(users);
// });

app.get("/users", async (req, res) => {
  const result = await conn.query("SELECT * FROM users");
  res.json(result[0]);
});

// app.post("/user", (req, res) => {
//   let user = req.body;
//   user.id = ++counter;
//   users.push(user);
//   res.send({
//     massage: "User Added",
//     user: user,
//   });
// });

app.post("/user", async (req, res) => {
  try {
    let user = req.body;
    const [result] = await conn.query("INSERT INTO users SET ?", user);
    user.id = result.insertId;
    res.send({
      massage: "User Added",
      user: user,
    });
  } catch (error) {
    console.log("Error adding user: ", error.massage);
    res.status(500).json({ error: "Error adding user" });
  }
});

// app.get("/user/:id", (req, res) => {
//   let id = req.params.id;
//   let selectedUser = users.find((user) => user.id == id);
//   res.json(selectedUser);
// });

app.get("/user/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const [rows] = await conn.query("SELECT * FROM users WHERE id = ?", [id]);
    if (rows.length === 0) {
      res.status(404).json({ error: "User not found" });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.log("Error fetching user: ", error.massage);
    res.status(500).json({ error: "Error fetching user" });
  }
});

// app.put("/user/:id", (req, res) => {
//   let id = req.params.id;
//   let updateUser = req.body;
//   let selectedUser = users.findIndex((user) => user.id == id);
//   users[selectedUser].name = updateUser.name || users[selectedUser].name;
//   users[selectedUser].nickname =
//     updateUser.nickname || users[selectedUser].nickname;
//   res.json({
//     massage: "User Updated",
//     data: {
//       user: updateUser,
//       indexUpdate: selectedUser,
//     },
//   });
// });

// app.put("/user/:id", async (req, res) => {
//   try {
//     let id = req.params.id;
//     let updateUser = req.body;
//     const [result] = await conn.query("UPDATE users SET ? WHERE id = ?", [
//       updateUser,
//       id,
//     ]);
//     res.json({
//       massage: "User Updated",
//       data: {
//         user: updateUser,
//         indexUpdate: id,
//       },
//     });
//   } catch (error) {
//     console.log("Error updating user: ", error.massage);
//     res.status(500).json({ error: "Error updating user" });
//   }
// })

// app.patch("/user/:id", (req, res) => {
//   let id = req.params.id;
//   let updateUser = req.body;
//   let selectedUser = users.findIndex((user) => user.id == id);
//   if (updateUser.name) {
//     users[selectedUser].name = updateUser.name;
//   }
//   if (updateUser.nickname) {
//     users[selectedUser].nickname = updateUser.nickname;
//   }
//   res.json({
//     massage: "User Updated",
//     data: {
//       user: updateUser,
//       indexUpdate: selectedUser,
//     },
//   });
// });

// app.delete("/user/:id", (req, res) => {
//   let id = req.params.id;
//   let selectedUser = users.findIndex((user) => user.id == id);
//   users.splice(selectedUser, 1);
//   res.json({
//     massage: "User Deleted",
//     data: {
//       indexDelete: selectedUser,
//     },
//   });
// });

app.delete("/user/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const [result] = await conn.query("DELETE FROM users WHERE id = ?", [id]);
    res.json({
      massage: "User Deleted",
      data: {
        indexDelete: id,
      },
    });
  } catch (error) {
    console.log("Error deleting user: ", error.massage);
    res.status(500).json({ error: "Error deleting user" });
  }
});

app.listen(port, async (req, res) => {
  await initMySQL();
  console.log("http://localhost:" + port);
});
