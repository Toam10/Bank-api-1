const express = require("express");
const { addUser, getUser, getDataFromDatabase } = require("./users");

const app = express();

app.use(express.json());

// CRUD actions are all defined in POST

app.post("/users", (req, res) => {
  const data = req.body;
  const user = addUser(data);
  if (!user) {
    return res.status(400).send("User already exists");
  }
  return res.status(200).send(user);
});

// Get actions are defined in GET

app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  const user = getUser(id);
  if (!user) {
    return res.status(404).send("User not found");
  }
  return res.status(200).send(user);
});

app.get("/users", (req, res) => {
  const data = getDataFromDatabase();
  return res.status(200).send(data);
});

app.listen(3000, () => {
  console.log("Server is up at port 3000");
});
