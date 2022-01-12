const fs = require("fs");

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

// Users manipulation

const getUser = (id) => {
  const data = getDataFromDatabase();
  const user = data.find((user) => user.id === id);
  return user ? user : "User does not exist";
};

const addUser = ({ id, cash = 0, credit = 0 } = {}) => {
  const data = getDataFromDatabase();
  if (checkForDuplicates(data, id)) {
    return "User already in database";
  }
  credit = credit < 0 ? 0 : credit;
  console.log(data);
  const user = { id, cash, credit };
  data.push(user);
  writeToDatabase(data);
  return id + " added";
};

module.exports = { addUser, getUser };
