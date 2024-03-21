require("./config/database");

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const router = require("./mongodbQueries");
port = process.env.PORT;
const app = express();

app.use("/", router);

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>MongoDB Query</h1>");
});

app.get("/filter", (req, res) => {
  res.render("filter");
});

app.listen(port, () => {
  console.log(`server is running on the http://localhost:${port}`);
});
