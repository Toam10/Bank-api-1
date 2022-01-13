const express = require("express");
const { addUser, getUser, getDataFromDatabase, deposit, updateCredit, withdraw, transfer } = require("./users");

const app = express();

app.use(express.json());

// CRUD actions are all defined in POST

app.post("/users", (req, res) => {
  try {
    const data = req.body;
    const user = addUser(data);
    return res.status(200).send(user);
  } catch (err) {
    res.status(err.code).send({ message: err.message });
  }
});

app.put("/actions/:action/:id", (req, res) => {
  try {
    const action = req.params.action;
    const id = req.params.id;
    const data = req.body;
    switch (action) {
      case "deposit":
        deposit(id, data.amount);
        return res.status(200).send({ message: `${data.amount} added to ${id} deposit` });
      case "updatecredit":
        updateCredit(id, data.amount);
        return res.status(200).send({ message: `${id} credit is now ${data.amount}` });
      case "withdraw":
        withdraw(id, data.amount);
        return res.status(200).send({ message: `${id} has successfully withdraw ${data.amount}` });
      case "transfer":
        transfer(id, data.id, data.amount);
        return res.status(200).send(`${id} has successfully transferred ${data.amount} to ${data.id}`);
      default:
        const error = new Error("Action does not exists");
        error.code(404);
        throw error;
    }
  } catch (err) {
    res.status(err.code).send({ message: err.message });
  }
});

// Get actions are defined in GET

app.get("/users/:id", (req, res) => {
  try {
    const id = req.params.id;
    const user = getUser(id);
    return res.status(200).send(user);
  } catch (err) {
    res.status(err.code).send({ message: err.message });
  }
});

app.get("/users", (req, res) => {
  try {
    const data = getDataFromDatabase();
    return res.status(200).send(data);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server is up at port 3000");
});
