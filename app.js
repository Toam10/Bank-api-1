const express = require("express");
const { addUser, getUser } = require("./users");

const app = express();

app.use(express.json());

// CRUD actions are all defined in POST

app.post("/users", (req, res) => {
  const action = req.query.action;
  const data = req.body;
  switch (action) {
    case "addUser":
      const message = addUser(data);
      return res.send(message);
    default:
      return res.send("Action does not exist!");
  }
});

// Get actions are defined in GET

app.get("/users", (req, res) => {
  const action = req.query.action;
  const data = req.body;
  switch (action) {
    case "getUser":
      const user = getUser(data.id);
      return res.send(user);
    default:
      return res.send("Action does not exist!");
  }
});

app.listen(3000, () => {
  console.log("Server is up at port 3000");
});
