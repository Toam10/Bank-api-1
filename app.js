const express = require("express");
const cors = require("cors");
const {
  addUser,
  getUser,
  getDataFromDatabase,
  deposit,
  updateCredit,
  withdraw,
  transfer,
  filterByAmount,
} = require("./users");

const app = express();

const port = process.env.PORT || 8080;

app.use(express.json());
app.use(cors());

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
    if (req.query.amount) {
      const filteredData = filterByAmount(req.query.amount);
      return res.status(200).send(filteredData);
    }
    const data = getDataFromDatabase();
    return res.status(200).send(data);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

app.listen(port, () => {
  console.log("Server is up at port " + port);
});
