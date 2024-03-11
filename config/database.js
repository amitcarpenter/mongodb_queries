const mongoose = require("mongoose");

const DbConnect = mongoose
  .connect("mongodb://127.0.0.1:27017/", {
    dbName: "mongodb_queries",
  })
  .then(() => {
    console.log(`Mongodb Data base Connected`);
  })
  .catch((error) => {
    console.log(error);
  });

module.exports = DbConnect;
