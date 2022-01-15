const fs = require("fs");
const validator = require("validator");
const { customError } = require("./utils");

// Database actions

const getDataFromDatabase = () => {
  try {
    const buffer = fs.readFileSync("users-db.json");
    return JSON.parse(buffer.toString());
  } catch (err) {
    return [];
  }
};

const writeToDatabase = (data) => {
  fs.writeFileSync("users-db.json", JSON.stringify(data));
};

// utils

const checkForDuplicates = (data, id) => {
  return Boolean(data.find((user) => user.id === id));
};

const findUserById = (data, id) => {
  const user = data.find((user) => user.id === id);
  if (!user) {
    const error = new Error("User not found");
    error.code = 404;
    throw error;
  }
  return user;
};

// Users manipulation

const getUser = (id) => {
  const data = getDataFromDatabase();
  return findUserById(data, id);
};

const addUser = ({ id, cash = 0, credit = 0 } = {}) => {
  const data = getDataFromDatabase();
  if (checkForDuplicates(data, id)) {
    const err = new Error("User already exists !");
    err.code = 400;
    throw err;
  }
  credit = credit < 0 ? 0 : credit;
  const user = { id, cash, credit };
  data.push(user);
  writeToDatabase(data);
  return id + " added";
};

const deposit = (id, amount) => {
  if (!validator.isNumeric(amount.toString())) {
    const err = new Error("Invalid amount");
    err.code = 400;
    throw err;
  }
  const data = getDataFromDatabase();
  const user = findUserById(data, id);
  user.cash += +amount;
  data.splice(data.indexOf(user), 1, user);
  writeToDatabase(data);
};

const updateCredit = (id, amount) => {
  if (!validator.isNumeric(amount.toString()) || +amount < 0) {
    const err = new Error("Invalid amount");
    err.code = 400;
    throw err;
  }
  const data = getDataFromDatabase();
  const user = findUserById(data, id);
  user.credit = +amount;
  data.splice(data.indexOf(user), 1, user);
  writeToDatabase(data);
};

const withdraw = (id, amount) => {
  if (!validator.isNumeric(amount.toString()) || +amount < 0) {
    const err = new Error("Invalid amount");
    err.code = 400;
    throw err;
  }
  const data = getDataFromDatabase();
  const user = findUserById(data, id);
  const totalBalance = user.cash + user.credit;
  if (amount > totalBalance) {
    const err = new Error("Not enough cash or credit");
    err.code = 406;
    throw err;
  }
  user.cash -= +amount;
  data.splice(data.indexOf(user), 1, user);
  writeToDatabase(data);
};

const transfer = (giverId, receiverId, amount) => {
  if (!validator.isNumeric(amount.toString()) || +amount < 0) {
    const err = new Error("Invalid amount");
    err.code = 400;
    throw err;
  }
  const data = getDataFromDatabase();
  const giver = findUserById(data, giverId);
  const receiver = findUserById(data, receiverId);
  const giverTotalBalance = giver.cash + giver.credit;
  if (amount > giverTotalBalance) {
    const err = new Error("Not enough cash or credit");
    err.code = 406;
    throw err;
  }
  giver.cash -= +amount;
  receiver.cash += +amount;
  data.splice(data.indexOf(giver), 1, giver);
  data.splice(data.indexOf(receiver), 1, receiver);
  writeToDatabase(data);
};

const filterByAmount = (amount) => {
  if (!validator.isNumeric(amount.toString()) || +amount < 0) {
    const err = new Error("Invalid amount");
    err.code = 400;
    throw err;
  }
  const data = getDataFromDatabase();
  return data.filter((user) => user.cash >= +amount);
};

module.exports = { addUser, getUser, getDataFromDatabase, deposit, updateCredit, withdraw, transfer, filterByAmount };
